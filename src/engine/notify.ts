// Notifications for a parent's phone: one when she starts studying, and a report when she stops.
// They are off until a parent turns them on in the parent view. When on, a short text (no name in it)
// is sent to a private channel of the free ntfy service; the parent's phone listens to that channel.
import type { DateKey } from '../content/types';
import { formatShort } from './dates';
import { formatDuration } from './time';

/** One notification. `tags` are ntfy emoji names shown in front of the title. */
export interface Note {
  title: string;
  message: string;
  tags: string[];
}

/** Letters and digits that are easy to read and type (no l, i, o, 0 or 1). */
const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
export const TOPIC_PREFIX = 'prep';
const GROUPS = 3;
const GROUP_SIZE = 4;

/** How many random bytes a channel name needs. */
export const TOPIC_BYTES = GROUPS * GROUP_SIZE;

/**
 * A private channel name such as 'prep-k7m2-x9qd-4hwz', made from random bytes.
 * The name works like a password: only a phone that knows it gets the notifications.
 */
export function topicFrom(bytes: ArrayLike<number>): string {
  const groups: string[] = [];
  for (let g = 0; g < GROUPS; g++) {
    let part = '';
    for (let i = 0; i < GROUP_SIZE; i++) part += ALPHABET[(bytes[g * GROUP_SIZE + i] ?? 0) % ALPHABET.length];
    groups.push(part);
  }
  return [TOPIC_PREFIX, ...groups].join('-');
}

export function isTopic(s: unknown): s is string {
  return typeof s === 'string' && new RegExp(`^${TOPIC_PREFIX}(-[${ALPHABET}]{${GROUP_SIZE}}){${GROUPS}}$`).test(s);
}

const pad = (n: number) => String(n).padStart(2, '0');
/** '17:05' */
export function clockTime(when: Date): string {
  return `${pad(when.getHours())}:${pad(when.getMinutes())}`;
}

/** Sent when she opens a task. `what` is the task, for example 'Round 1'. */
export function startNote(when: Date, today: DateKey, what?: string): Note {
  return {
    title: 'Study started',
    message: `${formatShort(today)}, ${clockTime(when)}${what ? ` · ${what}` : ''}`,
    tags: ['books'],
  };
}

/**
 * Sent when she finishes the day's tasks ('finished') or leaves the app ('stopped').
 * `report` is the day's report, from reportMessage.
 */
export function stopNote(kind: 'finished' | 'stopped', when: Date, today: DateKey, sittingSeconds: number, report: string): Note {
  return {
    title: kind === 'finished' ? "Today's preparation finished" : 'Study stopped',
    message: `${formatShort(today)}, ${clockTime(when)} · this sitting: ${formatDuration(Math.max(0, sittingSeconds))}\n${report}`,
    tags: [kind === 'finished' ? 'white_check_mark' : 'pause_button'],
  };
}

export function testNote(when: Date): Note {
  return { title: 'Test from the exam prep app', message: `It works. Sent at ${clockTime(when)}.`, tags: ['bell'] };
}

/** Coming back to the app within this time continues the same sitting, with no new "started" notification. */
export const RESUME_MS = 3 * 60 * 1000;
