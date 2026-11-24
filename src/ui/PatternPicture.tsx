// Growing patterns drawn from numbers: matchstick squares, toothpick triangles, a tile cross, dot triangles,
// dot squares and a mosaic. Each figure is counted exactly as in the teacher's lessons (packs.test.ts checks
// the counts against the rules: 3n + 1, 2n + 1, 4n + 1, n(n + 1)/2, n², 4n + 2).
import type { Picture, PictureKind } from '../content/types';

const U = 28; // one unit, in SVG pixels
const STICK = '#e08600';
const BLUE = '#1cb0f6';
const ORANGE = '#ff9600';
const DOT = '#5b5bd6';

type Shape = { w: number; h: number; body: JSX.Element[] };

/** How many sticks, tiles or dots figure n has. Used by the tests to check the drawings. */
export function countOf(kind: PictureKind, n: number): number {
  switch (kind) {
    case 'matchsticks': return 3 * n + 1;
    case 'toothpicks': return 2 * n + 1;
    case 'tile-cross': return 4 * n + 1;
    case 'dot-triangles': return (n * (n + 1)) / 2;
    case 'dot-squares': return n * n;
    case 'mosaic': return 4 * n + 2;
  }
}

const line = (key: string, x1: number, y1: number, x2: number, y2: number) => (
  <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={STICK} strokeWidth={4} strokeLinecap="round" />
);
const tile = (key: string, x: number, y: number, fill: string) => (
  <rect key={key} x={x + 1.5} y={y + 1.5} width={U - 3} height={U - 3} rx={4} fill={fill} />
);
const dot = (key: string, x: number, y: number) => <circle key={key} cx={x} cy={y} r={6} fill={DOT} />;

export function shapeOf(kind: PictureKind, n: number): Shape {
  const body: JSX.Element[] = [];
  switch (kind) {
    case 'matchsticks': {
      for (let i = 0; i <= n; i++) body.push(line(`v${i}`, i * U, 0, i * U, U));
      for (let i = 0; i < n; i++) body.push(line(`t${i}`, i * U, 0, (i + 1) * U, 0), line(`b${i}`, i * U, U, (i + 1) * U, U));
      return { w: n * U, h: U, body };
    }
    case 'toothpicks': {
      const h = U * 0.87;
      const v = (j: number) => (j % 2 === 0 ? [(j / 2) * U, h] : [((j - 1) / 2) * U + U / 2, 0]);
      for (let j = 0; j <= n; j++) { const [a, b] = v(j); const [c, d] = v(j + 1); body.push(line(`z${j}`, a, b, c, d)); }
      for (let i = 1; i <= n; i++) { const [a, b] = v(i - 1); const [c, d] = v(i + 1); body.push(line(`h${i}`, a, b, c, d)); }
      return { w: Math.ceil((n + 1) / 2) * U + (n % 2 === 0 ? U / 2 : 0), h, body };
    }
    case 'tile-cross': {
      const size = (2 * n + 1) * U;
      body.push(tile('c', n * U, n * U, ORANGE));
      for (let k = 1; k <= n; k++) {
        body.push(tile(`u${k}`, n * U, (n - k) * U, BLUE), tile(`d${k}`, n * U, (n + k) * U, BLUE));
        body.push(tile(`l${k}`, (n - k) * U, n * U, BLUE), tile(`r${k}`, (n + k) * U, n * U, BLUE));
      }
      return { w: size, h: size, body };
    }
    case 'dot-triangles': {
      const g = 18;
      for (let r = 0; r < n; r++) for (let c = 0; c <= r; c++) body.push(dot(`${r}-${c}`, 8 + (n - 1 - r) * (g / 2) + c * g, 8 + r * g));
      return { w: 16 + (n - 1) * g, h: 16 + (n - 1) * g, body };
    }
    case 'dot-squares': {
      const g = 18;
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) body.push(dot(`${r}-${c}`, 8 + c * g, 8 + r * g));
      return { w: 16 + (n - 1) * g, h: 16 + (n - 1) * g, body };
    }
    case 'mosaic': {
      body.push(tile('o1', 0, U / 2, ORANGE), tile('o2', (2 * n + 1) * U, U / 2, ORANGE));
      for (let c = 0; c < 2 * n; c++) body.push(tile(`a${c}`, (c + 1) * U, 0, BLUE), tile(`b${c}`, (c + 1) * U, U, BLUE));
      return { w: (2 * n + 2) * U, h: 2 * U, body };
    }
  }
}

const NAMES: Record<PictureKind, string> = {
  matchsticks: 'matchstick squares', toothpicks: 'toothpick triangles', 'tile-cross': 'a tile cross',
  'dot-triangles': 'dot triangles', 'dot-squares': 'dot squares', mosaic: 'a mosaic',
};

export function PatternPicture({ picture }: { picture: Picture }) {
  return (
    <figure className="pattern" aria-label={`A drawing of ${NAMES[picture.kind]}, figures ${picture.figures.join(', ')}`}>
      {picture.figures.map((n) => {
        const s = shapeOf(picture.kind, n);
        const pad = 6;
        return (
          <div key={n} className="pattern-fig">
            <svg viewBox={`${-pad} ${-pad} ${s.w + 2 * pad} ${s.h + 2 * pad}`} width={Math.min(170, (s.w + 2 * pad) * (picture.kind === "matchsticks" || picture.kind === "toothpicks" ? 1.3 : 0.85))}
              role="img" aria-label={`Figure ${n}`}>
              {s.body}
            </svg>
            <figcaption>Figure {n}</figcaption>
          </div>
        );
      })}
    </figure>
  );
}
