import { describe, expect, it } from 'vitest';
import type { Saved } from '../storage/db';
import { backupFileName, makeBackup, parseBackup, summariseSaved } from './backup';
import { applyAnswer } from './progress';

const saved: Saved = {
  version: 1,
  settings: { name: 'Adele', muted: false, guideSeen: true },
  packs: {
    'p1': {
      points: 40,
      progress: {
        a: applyAnswer(undefined, 'right', '2026-11-14', 'a-1'),
        b: applyAnswer(undefined, 'wrong', '2026-11-15', 'b-1'),
      },
      sessions: [
        { date: '2026-11-14', kind: 'today', topics: ['G1'], asked: 15, firstTimeRight: 12 },
        { date: '2026-11-15', kind: 'fix', topics: [], asked: 3, firstTimeRight: 3, task: 'fix' },
      ],
      daysDone: ['2026-11-14'],
    },
  },
};

describe('a backup of her progress', () => {
  it('comes back exactly as it was saved', () => {
    const parsed = parseBackup(makeBackup(saved, '2026-11-16'));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.saved).toEqual(saved);
    expect(parsed.exportedOn).toBe('2026-11-16');
  });

  it('is named after the day it was made', () => {
    expect(backupFileName('2026-11-16')).toBe('exam-prep-backup-2026-11-16.json');
  });

  it('says what it holds, so a parent can check it is the right one', () => {
    expect(summariseSaved(saved)).toEqual({ sessions: 2, points: 40, tried: 2, lastDay: '2026-11-15' });
    expect(summariseSaved({ version: 1, packs: {}, settings: { name: 'Adele', muted: false } }))
      .toEqual({ sessions: 0, points: 0, tried: 0, lastDay: undefined });
  });

  it('refuses a file that is not one of its backups', () => {
    for (const text of ['', 'hello', '[]', '{"app":"another-app","version":1,"data":{}}', JSON.stringify(saved)]) {
      const parsed = parseBackup(text);
      expect(parsed.ok, text).toBe(false);
    }
  });

  it('refuses a damaged backup instead of loading half of it', () => {
    const file = JSON.parse(makeBackup(saved, '2026-11-16'));
    file.data.packs.p1.sessions = 'none';
    expect(parseBackup(JSON.stringify(file)).ok).toBe(false);
    const noLevels = JSON.parse(makeBackup(saved, '2026-11-16'));
    delete noLevels.data.packs.p1.progress.a.level;
    expect(parseBackup(JSON.stringify(noLevels)).ok).toBe(false);
  });

  it('refuses a backup from a newer version of the app', () => {
    const file = JSON.parse(makeBackup(saved, '2026-11-16'));
    file.version = 2;
    const parsed = parseBackup(JSON.stringify(file));
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.reason).toMatch(/newer version/);
  });
});
