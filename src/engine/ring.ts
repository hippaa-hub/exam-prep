// The ring on Home: how ready she is, as one number.
// It is the average level of the things to know, with the last few percent kept for exam morning:
// the day before she can fill it to 95%, and finishing the warm-up on exam morning adds the rest (Jenia, 17 Nov).
import type { Pack } from '../content/types';
import { warmUpDone, type SessionRecord } from './plan';
import { packReadiness, type ProgressMap } from './progress';

/** The part of the ring that belongs to the exam-morning warm-up. */
export const WARM_UP_SHARE = 5;
/** The most the ring can show before the warm-up is done. */
export const RING_BEFORE_WARM_UP = 100 - WARM_UP_SHARE;

export function ringValue(readiness: number, warmedUp: boolean): number {
  return warmedUp ? Math.min(100, readiness + WARM_UP_SHARE) : Math.min(RING_BEFORE_WARM_UP, readiness);
}

export function packRing(pack: Pack, progress: ProgressMap, sessions: readonly SessionRecord[]): number {
  return ringValue(packReadiness(pack, progress), warmUpDone(pack, sessions));
}
