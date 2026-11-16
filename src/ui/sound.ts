// Short sounds for answers, finished rounds and new badges (PLAN.md section 4: "short sounds with mute").
// They are made in the browser from a few notes, so there are no sound files to download and they work offline.
// Never used in the Mock Exam, which is done like the real test.

export type Sound = 'right' | 'almost' | 'wrong' | 'done' | 'badge';

/** Each sound is a few notes: [frequency in Hz, start in seconds, length in seconds]. */
const NOTES: Record<Sound, [number, number, number][]> = {
  right: [[659, 0, 0.09], [988, 0.08, 0.16]],                       // a bright step up
  almost: [[587, 0, 0.12], [659, 0.11, 0.14]],                      // a small, gentle step
  wrong: [[330, 0, 0.14], [262, 0.12, 0.2]],                        // a soft step down, never harsh
  done: [[523, 0, 0.1], [659, 0.1, 0.1], [784, 0.2, 0.1], [1047, 0.3, 0.3]], // a little fanfare
  badge: [[784, 0, 0.1], [1047, 0.1, 0.1], [1319, 0.2, 0.1], [1568, 0.3, 0.35]],
};

const VOLUME = 0.12;

let muted = false;
let ctx: AudioContext | null = null;

export function setMuted(on: boolean): void {
  muted = on;
}

export function isMuted(): boolean {
  return muted;
}

function context(): AudioContext | null {
  if (ctx) return ctx;
  const Ctor = typeof window === 'undefined' ? undefined
    : window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
  } catch {
    ctx = null;
  }
  return ctx;
}

/** Plays a sound, unless sounds are muted or the phone cannot play them. It never throws. */
export function play(sound: Sound): void {
  if (muted) return;
  try {
    const ac = context();
    if (!ac) return;
    if (ac.state === 'suspended') void ac.resume();
    const t0 = ac.currentTime + 0.01;
    for (const [freq, start, length] of NOTES[sound]) {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      // A quick fade in and out, so the notes are soft and do not click.
      gain.gain.setValueAtTime(0, t0 + start);
      gain.gain.linearRampToValueAtTime(VOLUME, t0 + start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + start + length);
      osc.connect(gain).connect(ac.destination);
      osc.start(t0 + start);
      osc.stop(t0 + start + length + 0.02);
    }
  } catch {
    // No sound is never a reason to stop her working.
  }
}
