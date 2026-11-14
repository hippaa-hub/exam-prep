import { del, get, set } from 'idb-keyval';
import type { SessionRecord } from '../engine/plan';
import type { ProgressMap } from '../engine/progress';
import type { StudyTime } from '../engine/time';
import type { MockResult, WrittenArgument } from '../engine/writing';

/** Everything saved for one exam pack. */
export interface PackSave {
  progress: ProgressMap;
  sessions: SessionRecord[];
  points: number;
  /** The days on which she finished every task. */
  daysDone?: string[];
  /** Seconds spent answering, per day. */
  studyTime?: StudyTime;
  /** Her latest Argument Builder answer for each question. */
  writing?: Record<string, WrittenArgument>;
  /** Her latest result for each mock exam. */
  mockResults?: Record<string, MockResult>;
  /** Unfinished writing, so nothing is lost if the app is closed half-way. Keyed by question or mock id. */
  drafts?: Record<string, string[]>;
}

export interface Settings {
  name: string;
  muted: boolean;
  /** True once the Guide has been opened, so Home stops pointing at it. */
  guideSeen?: boolean;
  /** The code for the parent view, in scrambled form. */
  parentPin?: string;
  /** The private channel for notifications to a parent's phone. Unset means notifications are off. */
  notifyTopic?: string;
}

export interface Saved {
  version: 1;
  packs: Record<string, PackSave>;
  settings: Settings;
}

export interface Store {
  load(): Promise<Saved | null>;
  save(s: Saved): Promise<void>;
  /** Wipe everything on this phone (used by the ?reset link). */
  clear(): Promise<void>;
}

const KEY = 'adele-exam-prep-v1';

export function emptyPackSave(): PackSave {
  return { progress: {}, sessions: [], points: 0 };
}

export function emptySaved(): Saved {
  return { version: 1, packs: {}, settings: { name: 'Adele', muted: false } };
}

/** Progress lives in the browser's IndexedDB on this phone only. Nothing leaves the phone. */
export const idbStore: Store = {
  async load() {
    try {
      const v = await get<Saved>(KEY);
      return v && v.version === 1 ? v : null;
    } catch {
      return null;
    }
  },
  async save(s) {
    await set(KEY, s);
  },
  async clear() {
    await del(KEY);
  },
};

export function memoryStore(initial: Saved | null = null): Store & { current: Saved | null } {
  const store = {
    current: initial,
    async load() { return store.current; },
    async save(s: Saved) { store.current = s; },
    async clear() { store.current = null; },
  };
  return store;
}
