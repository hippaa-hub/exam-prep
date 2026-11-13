// Reading aloud: the phone's own voice speaks a flashcard after it is flipped.
// This runs on the phone itself; nothing is sent anywhere.

const KEY = 'exam-prep-read-aloud';

export function speechAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

/** Reading aloud is on unless she has switched it off on this phone. */
export function readAloudOn(): boolean {
  try {
    return window.localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setReadAloud(on: boolean): void {
  try {
    window.localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    // Private browsing: the choice just lasts until the app is closed.
  }
}

export function stopSpeaking(): void {
  if (speechAvailable()) window.speechSynthesis.cancel();
}

/** Just enough of a voice to choose between them. */
export interface VoiceLike {
  name: string;
  lang: string;
}

// Phones do not say whether a voice is a woman's or a man's, so the app goes by the voice's name.
const WOMEN = /female|woman|kate|serena|martha|stephanie|fiona|moira|karen|samantha|tessa|catherine|allison|ava|susan|victoria|zoe|hazel|libby|sonia|maisie|mia|emily|flo\b|shelley|sandy|nicky|x-(fis|gba|gbc|gbg)\b/i;
const MEN = /\bmale|\bman\b|daniel|arthur|oliver|gordon|malcolm|george|ryan|thomas|alex|fred|aaron|rishi|eddy|reed|rocko|grandpa|ralph|albert|bruce|junior|x-(gbb|gbd|rjs)\b/i;
const NOVELTY = /bells|boing|bubbles|cellos|whisper|zarvox|trinoids|organ|jester|superstar|wobble|bahh|bad news|good news|grandma/i;

// Apple's "Eloquence" voices sound robotic, so they are a last resort.
const ROBOTIC = /\b(eddy|flo|reed|rocko|sandy|shelley|grandma|grandpa)\b/i;
// The most natural-sounding women's voices, best first.
const FAVOURITES = ['martha', 'kate', 'serena', 'stephanie', 'google uk english female', 'libby', 'sonia', 'maisie', 'hazel', 'fiona', 'moira', 'samantha', 'karen'];

function englishVoices<V extends VoiceLike>(voices: readonly V[]): V[] {
  return voices.filter((v) => /^en([-_]|$)/i.test(v.lang) && !NOVELTY.test(v.name));
}

const plainName = (v: VoiceLike) => v.name.replace(/female/gi, '');
const isWomansVoice = (v: VoiceLike) => WOMEN.test(v.name) && !/\bmale\b/i.test(plainName(v));
const isMansVoice = (v: VoiceLike) => MEN.test(plainName(v));

// The voices the family asked for, best first. Used whenever the phone has them.
const ASKED_FOR = ['nicky', 'samantha'];

/** Lower is better: the voices asked for, then natural British women, with known men's voices last. */
function rank(v: VoiceLike): number {
  const asked = ASKED_FOR.findIndex((n) => v.name.toLowerCase().includes(n));
  if (asked >= 0) return asked - ASKED_FOR.length;
  const british = /^en[-_]gb/i.test(v.lang) ? 0 : 1;
  const robotic = ROBOTIC.test(v.name) ? 2 : 0;
  const group = isWomansVoice(v) ? 0 : isMansVoice(v) ? 8 : 4; // women first, unknown next, men last
  const favourite = FAVOURITES.findIndex((f) => v.name.toLowerCase().includes(f));
  return (group + robotic + british) * 100 + (favourite < 0 ? 99 : favourite);
}

/** The English voices on this phone, best choice first. */
export function sortVoices<V extends VoiceLike>(voices: readonly V[]): V[] {
  return englishVoices(voices)
    .map((v, i) => ({ v, i, r: rank(v) }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map((x) => x.v);
}

/**
 * The voice to read with: Nicky, then Samantha, then a natural woman's British English voice,
 * then a woman's voice in any English, and only then anything else.
 */
export function pickVoice<V extends VoiceLike>(voices: readonly V[]): V | undefined {
  return sortVoices(voices)[0];
}

// The list of voices arrives a moment after the page opens, so keep it up to date.
let voices: SpeechSynthesisVoice[] = [];
function loadVoices(): void {
  if (speechAvailable()) voices = window.speechSynthesis.getVoices();
}
if (speechAvailable()) {
  loadVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
}

/** Speaks the text in Nicky's voice, or else Samantha's or another woman's voice the phone has. */
export function speak(text: string): void {
  if (!speechAvailable()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  if (voices.length === 0) loadVoices();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-GB';
  u.rate = 0.95;
  const voice = pickVoice(voices);
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang.replace('_', '-'); // read in the voice's own accent
  }
  synth.speak(u);
}
