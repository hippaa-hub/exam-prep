// "Say your answer": a text box with a microphone button. What Adele says is typed into the box.
// It uses the phone's own speech recognition (Apple or Google), so it needs internet and the
// microphone permission. Where a phone does not offer it, the keyboard's microphone key does the same job.
import { useCallback, useEffect, useRef, useState } from 'react';

/* The browser's speech recognition, which has no standard TypeScript types. */
interface SpeechResultList { length: number; [i: number]: { isFinal: boolean; 0: { transcript: string } } }
interface SpeechRec {
  lang: string; continuous: boolean; interimResults: boolean;
  onresult: ((e: { results: SpeechResultList }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void; stop(): void; abort(): void;
}
type SpeechRecCtor = new () => SpeechRec;

function recognitionCtor(): SpeechRecCtor | undefined {
  const w = window as unknown as { SpeechRecognition?: SpeechRecCtor; webkitSpeechRecognition?: SpeechRecCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function dictationSupported(): boolean {
  return typeof window !== 'undefined' && recognitionCtor() !== undefined;
}

const ERRORS: Record<string, string> = {
  'not-allowed': 'The microphone is not allowed. Allow it in the phone settings, or type your answer.',
  'service-not-allowed': 'Speaking is not available here. Use the microphone key on the keyboard, or type.',
  network: 'Speaking needs the internet. Type your answer, or try again when you are online.',
  'no-speech': 'I did not hear anything. Tap the microphone and try again.',
  'audio-capture': 'No microphone was found. Type your answer instead.',
};

/** Joins what was already in the box with what she has just said. */
export function joinSpoken(before: string, spoken: string): string {
  const a = before.trimEnd();
  const b = spoken.trim();
  if (!b) return before;
  if (!a) return b.charAt(0).toUpperCase() + b.slice(1);
  return `${a} ${b}`;
}

interface Props {
  value: string;
  onChange: (text: string) => void;
  label: string;
  placeholder?: string;
  rows?: number;
  readOnly?: boolean;
  id?: string;
  /** False in the mock exam: no microphone there, she writes as in the real test. */
  voice?: boolean;
}

export function DictationBox({ value, onChange, label, placeholder, rows = 4, readOnly = false, id, voice = true }: Props) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');
  const rec = useRef<SpeechRec | null>(null);
  const before = useRef('');
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const supported = dictationSupported();

  const stop = useCallback(() => {
    rec.current?.stop();
  }, []);

  const start = useCallback(() => {
    const Ctor = recognitionCtor();
    if (!Ctor) return;
    setError('');
    const r = new Ctor();
    r.lang = 'en-GB';
    r.continuous = true;
    r.interimResults = true;
    before.current = value;
    r.onresult = (e) => {
      let spoken = '';
      for (let i = 0; i < e.results.length; i++) spoken += `${e.results[i][0].transcript} `;
      onChangeRef.current(joinSpoken(before.current, spoken));
      window.dispatchEvent(new Event('study-activity')); // speaking counts as studying
    };
    r.onerror = (e) => {
      if (e.error !== 'aborted') setError(ERRORS[e.error] ?? 'Speaking did not work this time. You can type your answer.');
    };
    r.onend = () => { setListening(false); rec.current = null; };
    rec.current = r;
    try {
      r.start();
      setListening(true);
    } catch {
      setError('Speaking did not start. You can type your answer.');
      rec.current = null;
    }
  }, [value]);

  // Stop listening if she leaves the question.
  useEffect(() => () => { rec.current?.abort(); }, []);
  useEffect(() => { if (readOnly) rec.current?.stop(); }, [readOnly]);

  return (
    <div className="dictation">
      <textarea id={id} rows={rows} value={value} readOnly={readOnly} aria-label={label} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} />
      {voice && !readOnly && (supported ? (
        <button type="button" className={listening ? 'mic listening' : 'mic'} aria-pressed={listening}
          onClick={listening ? stop : start}>
          <span className="mic-icon" aria-hidden="true">🎤</span>
          {listening ? 'Listening… tap when you have finished' : value.trim() ? 'Say more' : 'Say your answer'}
        </button>
      ) : (
        <p className="mic-hint">🎤 To speak your answer, tap the microphone key on your keyboard.</p>
      ))}
      {error && <p className="mic-error" role="alert">{error}</p>}
    </div>
  );
}
