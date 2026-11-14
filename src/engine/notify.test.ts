import { describe, expect, it } from 'vitest';
import { clockTime, isTopic, startNote, stopNote, testNote, TOPIC_BYTES, topicFrom } from './notify';

describe('the private channel name', () => {
  it('is made of three groups of easy-to-type characters', () => {
    const t = topicFrom(Uint8Array.from({ length: TOPIC_BYTES }, (_, i) => i * 21));
    expect(t).toMatch(/^prep-[a-z2-9]{4}-[a-z2-9]{4}-[a-z2-9]{4}$/);
    expect(t).not.toMatch(/[lio01]/);
    expect(isTopic(t)).toBe(true);
  });

  it('differs when the random bytes differ', () => {
    expect(topicFrom(new Uint8Array(TOPIC_BYTES).fill(3))).not.toBe(topicFrom(new Uint8Array(TOPIC_BYTES).fill(4)));
  });

  it('rejects anything that is not a channel name', () => {
    for (const bad of [undefined, '', 'prep', 'prep-abcd-abcd', 'prep-abcd-abcd-abc1', 'PREP-abcd-abcd-abcd', 'x/../y']) {
      expect(isTopic(bad)).toBe(false);
    }
  });
});

describe('the notifications', () => {
  const at = new Date(2026, 10, 15, 17, 5);

  it('says when she started and on what, with no name in it', () => {
    const n = startNote(at, '2026-11-15', 'Round 1');
    expect(n).toEqual({ title: 'Study started', message: 'Sun 15 Nov, 17:05 · Round 1', tags: ['books'] });
    expect(startNote(at, '2026-11-15').message).toBe('Sun 15 Nov, 17:05');
  });

  it('sends the report when she finishes the day or leaves the app', () => {
    const done = stopNote('finished', at, '2026-11-15', 725, 'Studied today: 24 min');
    expect(done.title).toBe("Today's preparation finished");
    expect(done.message).toBe('Sun 15 Nov, 17:05 · this sitting: 12 min\nStudied today: 24 min');
    const left = stopNote('stopped', at, '2026-11-15', -5, 'Studied today: 0 min');
    expect(left.title).toBe('Study stopped');
    expect(left.message).toContain('this sitting: 0 min');
  });

  it('has a test message and a clock with leading zeros', () => {
    expect(testNote(new Date(2026, 10, 15, 9, 7)).message).toBe('It works. Sent at 09:07.');
    expect(clockTime(new Date(2026, 10, 15, 0, 0))).toBe('00:00');
  });
});
