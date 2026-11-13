// The four boxes of an argument, and the six-point checklist she marks her own answer with.
import { ARGUMENT_BOXES, ARGUMENT_CHECKLIST } from '../content/types';
import { hasEnoughWords } from '../engine/check';
import { DictationBox } from './Dictation';

export function ArgumentBoxes({ boxes, onChange, idPrefix, voice = true }: {
  boxes: string[]; onChange: (boxes: string[]) => void; idPrefix: string;
  /** False in the mock exam: writing only. */
  voice?: boolean;
}) {
  return (
    <div className="arg-boxes">
      {ARGUMENT_BOXES.map((b, i) => (
        <div key={b.label} className="arg-box">
          <label htmlFor={`${idPrefix}-${i}`}><strong>{i + 1}. {b.label}</strong><span>{b.help}</span></label>
          <DictationBox id={`${idPrefix}-${i}`} value={boxes[i] ?? ''} rows={3} label={b.label} voice={voice}
            onChange={(text) => onChange(ARGUMENT_BOXES.map((_, j) => (j === i ? text : boxes[j] ?? '')))} />
        </div>
      ))}
    </div>
  );
}

export const emptyBoxes = () => ARGUMENT_BOXES.map(() => '');
export const boxesComplete = (boxes: string[]) => ARGUMENT_BOXES.every((_, i) => hasEnoughWords(boxes[i] ?? ''));

/** Her own words, laid out as one answer. */
export function ArgumentText({ boxes }: { boxes: string[] }) {
  return (
    <div className="yours arg-text">
      <span>Your answer</span>
      {ARGUMENT_BOXES.map((b, i) => (
        <p key={b.label}><em>{b.label}:</em> {boxes[i]?.trim() || '(nothing written)'}</p>
      ))}
    </div>
  );
}

export function Checklist({ ticks, onChange }: { ticks: boolean[]; onChange: (ticks: boolean[]) => void }) {
  return (
    <fieldset className="checklist">
      <legend>Check your own answer. Tick what it has:</legend>
      {ARGUMENT_CHECKLIST.map((label, i) => (
        <label key={label}>
          <input type="checkbox" checked={ticks[i] ?? false}
            onChange={(e) => onChange(ARGUMENT_CHECKLIST.map((_, j) => (j === i ? e.target.checked : ticks[j] ?? false)))} />
          <span>{label}</span>
        </label>
      ))}
    </fieldset>
  );
}

export const emptyTicks = () => ARGUMENT_CHECKLIST.map(() => false);
