// A backup of everything saved on this phone, as one small file (PLAN.md section 8).
// The parent saves it from the parent view, and can restore it on this phone or a new one.
import type { PackSave, Saved } from '../storage/db';
import type { DateKey } from '../content/types';

export const BACKUP_APP = 'adele-exam-prep';

interface BackupFile {
  app: typeof BACKUP_APP;
  version: 1;
  /** The day the backup was made. */
  exportedOn: DateKey;
  data: Saved;
}

export function backupFileName(day: DateKey): string {
  return `exam-prep-backup-${day}.json`;
}

export function makeBackup(saved: Saved, day: DateKey): string {
  const file: BackupFile = { app: BACKUP_APP, version: 1, exportedOn: day, data: saved };
  return JSON.stringify(file, null, 1);
}

/** What a backup holds, in numbers, so a parent can tell it is the right one before restoring it. */
export interface BackupSummary {
  sessions: number;
  points: number;
  /** How many things to know have been tried at least once. */
  tried: number;
  /** The last day with a finished session, if any. */
  lastDay?: DateKey;
}

export function summariseSaved(saved: Saved): BackupSummary {
  const packs = Object.values(saved.packs);
  const days = packs.flatMap((p) => p.sessions.map((s) => s.date)).sort();
  return {
    sessions: packs.reduce((n, p) => n + p.sessions.length, 0),
    points: packs.reduce((n, p) => n + p.points, 0),
    tried: packs.reduce((n, p) => n + Object.values(p.progress).filter((c) => c.seen > 0).length, 0),
    lastDay: days[days.length - 1],
  };
}

export type ParsedBackup =
  | { ok: true; saved: Saved; exportedOn: DateKey }
  | { ok: false; reason: string };

const isObject = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);

function isPackSave(x: unknown): x is PackSave {
  return isObject(x) && isObject(x.progress) && Array.isArray(x.sessions) && typeof x.points === 'number'
    && Object.values(x.progress).every((c) => isObject(c) && typeof c.level === 'number' && typeof c.seen === 'number' && Array.isArray(c.correctDays))
    && x.sessions.every((s) => isObject(s) && typeof s.date === 'string' && typeof s.kind === 'string');
}

/** Reads a backup file. Anything that is not one of this app's backups is refused, so a wrong file cannot wipe her progress. */
export function parseBackup(text: string): ParsedBackup {
  let file: unknown;
  try {
    file = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'This file could not be read. Choose the backup file this app saved.' };
  }
  if (!isObject(file) || file.app !== BACKUP_APP) return { ok: false, reason: 'This is not a backup from this app.' };
  if (file.version !== 1) return { ok: false, reason: 'This backup was made by a newer version of the app. Update the app first.' };
  const data = file.data;
  if (!isObject(data) || data.version !== 1 || !isObject(data.packs) || !isObject(data.settings) || typeof data.settings.name !== 'string'
    || !Object.values(data.packs).every(isPackSave)) {
    return { ok: false, reason: 'This backup is damaged, so it was not used. Nothing on this phone was changed.' };
  }
  return { ok: true, saved: data as unknown as Saved, exportedOn: typeof file.exportedOn === 'string' ? file.exportedOn : '' };
}
