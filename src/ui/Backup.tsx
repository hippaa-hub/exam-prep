// Saving a backup of her progress, and restoring one. Lives in the parent view.
import { useRef, useState } from 'react';
import type { DateKey } from '../content/types';
import { backupFileName, makeBackup, parseBackup, summariseSaved, type BackupSummary } from '../engine/backup';
import { formatLong } from '../engine/dates';
import type { Saved } from '../storage/db';

interface Props {
  saved: Saved;
  today: DateKey;
  /** Replaces everything on this phone with the backup. */
  onRestore: (saved: Saved) => void;
}

const describe = (s: BackupSummary) =>
  `${s.sessions} finished round${s.sessions === 1 ? '' : 's'}, ${s.tried} thing${s.tried === 1 ? '' : 's'} tried, ${s.points} points`
  + (s.lastDay ? `, last studied on ${formatLong(s.lastDay)}` : '');

/** Reads a chosen file as text. FileReader works on older phones too, where `file.text()` does not exist. */
function readText(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => resolve('');
    reader.readAsText(file);
  });
}

export function Backup({ saved, today, onRestore }: Props) {
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<{ saved: Saved; exportedOn: string } | null>(null);
  const picker = useRef<HTMLInputElement>(null);

  const save = async () => {
    setNote(null);
    setError(null);
    const name = backupFileName(today);
    const text = makeBackup(saved, today);
    // On a phone, the share sheet can put the file in Files, or send it by email or message.
    try {
      const file = new File([text], name, { type: 'application/json' });
      if (typeof navigator.share === 'function' && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: name });
        setNote('Backup shared. Keep the file somewhere safe.');
        return;
      }
    } catch (e) {
      if ((e as { name?: string } | null)?.name === 'AbortError') return; // the share sheet was closed
    }
    // Otherwise, download it.
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNote(`Backup saved as ${name}.`);
  };

  const choose = async (file: File | undefined) => {
    setNote(null);
    setError(null);
    setPending(null);
    if (!file) return;
    const parsed = parseBackup(await readText(file));
    if (parsed.ok) setPending({ saved: parsed.saved, exportedOn: parsed.exportedOn });
    else setError(parsed.reason);
    if (picker.current) picker.current.value = ''; // so the same file can be chosen again
  };

  const restore = () => {
    if (!pending) return;
    onRestore(pending.saved);
    setPending(null);
    setNote('Backup restored. This phone now shows the progress from the backup.');
  };

  return (
    <section className="card" aria-labelledby="p-backup">
      <h2 id="p-backup">Backup</h2>
      <p className="muted">Her progress is saved on this phone only. A backup is one small file that holds all of it, in case the phone is lost or changed.</p>
      <p className="small">On this phone now: {describe(summariseSaved(saved))}.</p>
      <button type="button" className="btn ghost" onClick={save}>Save a backup</button>

      <label className="btn ghost file-btn">
        Restore from a backup
        <input ref={picker} type="file" accept=".json,application/json" className="sr-only"
          aria-label="Choose a backup file" onChange={(e) => void choose(e.target.files?.[0])} />
      </label>

      {pending && (
        <div className="restore-check" role="alertdialog" aria-labelledby="restore-h">
          <h3 id="restore-h">Replace the progress on this phone?</h3>
          <p>
            The backup{pending.exportedOn ? ` from ${formatLong(pending.exportedOn)}` : ''} holds: {describe(summariseSaved(pending.saved))}.
          </p>
          <p><strong>Everything on this phone now will be replaced by it.</strong> This cannot be undone.</p>
          <button type="button" className="btn primary" onClick={restore}>Replace with the backup</button>
          <button type="button" className="btn ghost" onClick={() => setPending(null)}>Cancel</button>
        </div>
      )}
      {note && <p className="good small center" role="status">{note}</p>}
      {error && <p className="warn small center" role="alert">{error}</p>}
    </section>
  );
}
