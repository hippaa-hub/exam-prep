// "In simple words": the plain explanation shown beside the teacher's wording, with a few short examples.

interface Props {
  simple?: string;
  examples?: string[];
}

export function SimpleBox({ simple, examples }: Props) {
  if (!simple && !examples?.length) return null;
  return (
    <div className="simple">
      {simple && (
        <>
          <span>In simple words</span>
          <p>{simple}</p>
        </>
      )}
      {examples && examples.length > 0 && (
        <>
          <span>{examples.length === 1 ? 'Example' : 'Examples'}</span>
          <ul className="examples">
            {examples.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </>
      )}
    </div>
  );
}

/** The simple words and examples as one sentence, for reading aloud. */
export function spokenHelp(simple?: string, examples?: string[]): string {
  const parts: string[] = [];
  if (simple) parts.push(`In simple words: ${simple}`);
  if (examples?.length) parts.push(`For example: ${examples.join('; ')}.`);
  return parts.length ? ` ${parts.join(' ')}` : '';
}
