// Reading and checking algebra answers such as "−6x³y⁴", "7x + 3y" or "2p × (−4q) × 3r".
// Every expression is turned into a polynomial (a list of terms with their coefficients), so two answers are
// the same when their polynomials are the same: 7x + 3y = 3y + 7x, pqr = rqp, "-" = "−", "^2" = "²".
// A separate check says whether an answer is written in its simplest form (no brackets, no ×, like terms collected).

/** A term's letters with their powers, in alphabetical order, for example "x^3*y^4". "" is a plain number. */
export type MonoKey = string;
export type Poly = Map<MonoKey, number>;

const SUP: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
const TO_SUP: Record<string, string> = Object.fromEntries(Object.entries(SUP).map(([s, d]) => [d, s]));

/** Plain text the parser reads: ASCII minus, ^ for powers, * for times, no spaces. */
export function normalise(src: string): string {
  return src
    .replace(/\s+/g, '')
    .replace(/[−–—]/g, '-')
    .replace(/[×·✕]/g, '*')
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => `^${[...m].map((c) => SUP[c]).join('')}`)
    .replace(/\*\*/g, '^')
    .toLowerCase();
}

type Tok = { t: 'num'; v: number } | { t: 'var'; v: string } | { t: 'op'; v: string } | { t: '(' } | { t: ')' };

function tokenize(s: string): Tok[] | null {
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    const m = s.slice(i).match(/^\d+/);
    if (m) { out.push({ t: 'num', v: Number(m[0]) }); i += m[0].length; continue; }
    if (/[a-z]/.test(c)) { out.push({ t: 'var', v: c }); i++; continue; }
    if ('+-*^'.includes(c)) { out.push({ t: 'op', v: c }); i++; continue; }
    if (c === '(') { out.push({ t: '(' }); i++; continue; }
    if (c === ')') { out.push({ t: ')' }); i++; continue; }
    return null;
  }
  return out;
}

// ---- Polynomial arithmetic --------------------------------------------------

function keyOf(powers: Record<string, number>): MonoKey {
  return Object.keys(powers).filter((v) => powers[v] !== 0).sort()
    .map((v) => (powers[v] === 1 ? v : `${v}^${powers[v]}`)).join('*');
}

export function powersOf(key: MonoKey): Record<string, number> {
  const out: Record<string, number> = {};
  if (!key) return out;
  for (const part of key.split('*')) {
    const [v, e] = part.split('^');
    out[v] = e ? Number(e) : 1;
  }
  return out;
}

function clean(p: Poly): Poly {
  const out: Poly = new Map();
  for (const [k, c] of p) if (Math.abs(c) > 1e-12) out.set(k, c);
  return out;
}

const constant = (n: number): Poly => clean(new Map([['', n]]));
const letter = (v: string): Poly => new Map([[v, 1]]);

function add(a: Poly, b: Poly, sign = 1): Poly {
  const out = new Map(a);
  for (const [k, c] of b) out.set(k, (out.get(k) ?? 0) + sign * c);
  return clean(out);
}

function mul(a: Poly, b: Poly): Poly {
  const out: Poly = new Map();
  for (const [ka, ca] of a) {
    for (const [kb, cb] of b) {
      const pa = powersOf(ka);
      for (const [v, e] of Object.entries(powersOf(kb))) pa[v] = (pa[v] ?? 0) + e;
      const k = keyOf(pa);
      out.set(k, (out.get(k) ?? 0) + ca * cb);
    }
  }
  return clean(out);
}

function pow(a: Poly, n: number): Poly {
  let out = constant(1);
  for (let i = 0; i < n; i++) out = mul(out, a);
  return out;
}

/** Reads an expression into a polynomial. Returns null when it cannot be read (an unclosed bracket, "3++x"…). */
export function parse(src: string): Poly | null {
  const toks = tokenize(normalise(src));
  if (!toks || toks.length === 0) return null;
  let pos = 0;
  const peek = () => toks[pos];
  const isOp = (t: Tok | undefined, v: string) => !!t && t.t === 'op' && t.v === v;
  const startsAtom = (t: Tok | undefined) => !!t && (t.t === 'num' || t.t === 'var' || t.t === '(');

  const expr = (): Poly | null => {
    let left: Poly | null;
    if (isOp(peek(), '+')) { pos++; left = term(); } else if (isOp(peek(), '-')) { pos++; const t = term(); left = t && mul(constant(-1), t); } else left = term();
    if (!left) return null;
    while (isOp(peek(), '+') || isOp(peek(), '-')) {
      const sign = isOp(peek(), '+') ? 1 : -1;
      pos++;
      const right = term();
      if (!right) return null;
      left = add(left, right, sign);
    }
    return left;
  };
  const term = (): Poly | null => {
    let left = factor();
    if (!left) return null;
    for (;;) {
      if (isOp(peek(), '*')) {
        pos++;
        const right = factor();
        if (!right) return null;
        left = mul(left, right);
      } else if (startsAtom(peek())) {
        const right = factor();
        if (!right) return null;
        left = mul(left, right);
      } else break;
    }
    return left;
  };
  // A minus straight after × belongs to the factor: 2 × −3.
  const factor = (): Poly | null => {
    if (isOp(peek(), '-')) { pos++; const f = factor(); return f && mul(constant(-1), f); }
    const base = atom();
    if (!base) return null;
    if (isOp(peek(), '^')) {
      pos++;
      const e = toks[pos];
      if (!e || e.t !== 'num' || e.v > 12) return null;
      pos++;
      return pow(base, e.v);
    }
    return base;
  };
  const atom = (): Poly | null => {
    const t = toks[pos];
    if (!t) return null;
    if (t.t === 'num') { pos++; return constant(t.v); }
    if (t.t === 'var') { pos++; return letter(t.v); }
    if (t.t === '(') {
      pos++;
      const v = expr();
      if (!v || toks[pos]?.t !== ')') return null;
      pos++;
      return v;
    }
    return null;
  };
  const v = expr();
  return v && pos === toks.length ? v : null;
}

export function samePoly(a: Poly, b: Poly): boolean {
  const ca = clean(a);
  const cb = clean(b);
  if (ca.size !== cb.size) return false;
  for (const [k, c] of ca) if (!cb.has(k) || Math.abs(cb.get(k)! - c) > 1e-9) return false;
  return true;
}

/** True when the two expressions are equal for every value of the letters. */
export function equivalent(a: string, b: string): boolean {
  const pa = parse(a);
  const pb = parse(b);
  return !!pa && !!pb && samePoly(pa, pb);
}

/** Works an expression out for given values of its letters (used by the tests as a second check). */
export function evaluate(src: string, env: Record<string, number>): number | null {
  const p = parse(src);
  if (!p) return null;
  let sum = 0;
  for (const [k, c] of p) {
    let term = c;
    for (const [v, e] of Object.entries(powersOf(k))) term *= Math.pow(env[v] ?? NaN, e);
    sum += term;
  }
  return Number.isFinite(sum) ? sum : null;
}

/**
 * True when the answer is written in its simplest form: a plain list of terms, each a number followed by
 * letters (each letter once, with its power), no brackets, no ×, no two like terms, no 1 in front of a letter.
 */
export function isSimplified(src: string): boolean {
  const s = normalise(src);
  if (s === '0') return true;
  if (!s || /[()*]/.test(s)) return false;
  const parts = s.split(/(?=[+-])/);
  const keys = new Set<string>();
  for (const part of parts) {
    const m = part.match(/^([+-]?)(\d*)((?:[a-z](?:\^\d+)?)*)$/);
    if (!m || (!m[2] && !m[3])) return false;
    const [, , digits, letters] = m;
    if (digits === '0') return false;
    if (digits === '1' && letters) return false;
    if (/^0\d/.test(digits)) return false;
    const seen = new Set<string>();
    const powers: Record<string, number> = {};
    for (const lm of letters.matchAll(/([a-z])(?:\^(\d+))?/g)) {
      if (seen.has(lm[1])) return false;
      seen.add(lm[1]);
      const e = lm[2] ? Number(lm[2]) : 1;
      if (e === 0) return false;
      powers[lm[1]] = e;
    }
    const k = keyOf(powers);
    if (keys.has(k)) return false;
    keys.add(k);
  }
  return true;
}

// ---- Showing maths properly -------------------------------------------------

/** Turns typed text into how it should look: x^2 → x², - → −, * → ×. */
export function pretty(src: string): string {
  return src
    .replace(/\^(\d+)/g, (_, d: string) => [...d].map((c) => TO_SUP[c]).join(''))
    .replace(/[*×]/g, ' × ')
    .replace(/([\w)⁰¹²³⁴⁵⁶⁷⁸⁹])\s*-\s*/g, '$1 − ')
    .replace(/-/g, '−')
    .replace(/\s*\+\s*/g, ' + ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** A polynomial written out in the usual way, highest power first, for example "−6x³y⁴". */
export function polyText(p: Poly): string {
  const entries = [...clean(p)].sort(([ka], [kb]) => degree(kb) - degree(ka) || ka.localeCompare(kb));
  if (entries.length === 0) return '0';
  return entries.map(([k, c], i) => {
    const abs = Math.abs(c);
    const num = k && abs === 1 ? '' : String(abs);
    const sign = c < 0 ? (i === 0 ? '−' : ' − ') : i === 0 ? '' : ' + ';
    return `${sign}${num}${pretty(k.replace(/\*/g, ''))}`;
  }).join('');
}

function degree(k: MonoKey): number {
  return Object.values(powersOf(k)).reduce((s, e) => s + e, 0);
}

// ---- Feedback on known slips -------------------------------------------------

/** One term with its number and its letters: 3x²y is { coef: 3, powers: { x: 2, y: 1 } }. */
export interface Mono { coef: number; powers: Record<string, number> }

export function monoOf(p: Poly | null): Mono | null {
  if (!p || p.size !== 1) return null;
  const [[k, c]] = [...p];
  return { coef: c, powers: powersOf(k) };
}

function monoPoly(m: Mono): Poly {
  return clean(new Map([[keyOf(m.powers), m.coef]]));
}

/** The factors of a product written with ×, such as "2p × (−4q) × 3r", or "(3x)(−2y)". Null if it is not one. */
export function factorsOf(prompt: string): Mono[] | null {
  const s = normalise(prompt);
  const parts: string[] = [];
  let depth = 0;
  let cur = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (depth === 0 && c === '*') { parts.push(cur); cur = ''; continue; }
    cur += c;
    // ")(" with nothing between also starts a new factor
    if (depth === 0 && c === ')' && s[i + 1] === '(') { parts.push(cur); cur = ''; }
  }
  parts.push(cur);
  const monos = parts.map((p) => monoOf(parse(p)));
  return monos.every((m): m is Mono => m !== null) && monos.length >= 2 ? monos : null;
}

/**
 * Why a multiplication answer is wrong, if it is one of the known slips (from the teacher's lesson):
 * the wrong sign, multiplying the powers, adding instead of multiplying, forgetting to square the number,
 * or forgetting that x × x = x². Returns null when it is none of these.
 */
export function multiplySlip(prompt: string, correct: string, answer: string): string | null {
  const want = monoOf(parse(correct));
  const got = monoOf(parse(answer));
  const gotPoly = parse(answer);
  if (!want || !gotPoly) return null;
  const wantPoly = monoPoly(want);

  // Same size, wrong sign.
  if (samePoly(gotPoly, mul(constant(-1), wantPoly))) {
    return 'Check the sign. Count the minus signs: an even number gives +, an odd number gives −.';
  }

  // (3x)²: the square was given to the letter but not to the number.
  const sq = normalise(prompt).match(/^\((.+)\)\^(\d+)$/);
  if (sq && got) {
    const inner = monoOf(parse(sq[1]));
    if (inner) {
      const n = Number(sq[2]);
      const powered = Object.fromEntries(Object.entries(inner.powers).map(([v, e]) => [v, e * n]));
      if (samePoly(gotPoly, monoPoly({ coef: inner.coef, powers: powered })) || samePoly(gotPoly, monoPoly({ coef: Math.abs(inner.coef), powers: powered }))) {
        return `The power applies to the number too: (${pretty(sq[1])})${pretty('^' + n)} means ${Array(n).fill(pretty(sq[1])).join(' × ')}.`;
      }
    }
  }

  const factors = factorsOf(prompt);
  if (factors && got) {
    const letters = new Set(factors.flatMap((f) => Object.keys(f.powers)));
    // The powers were multiplied instead of added: x³ × x² = x⁶.
    const multiplied: Record<string, number> = {};
    for (const v of letters) {
      const es = factors.map((f) => f.powers[v]).filter((e): e is number => e !== undefined);
      multiplied[v] = es.reduce((a, b) => a * b, 1);
    }
    // Only when each repeated letter has a real power in every factor (x³ × x², not x⁴ × x).
    const repeated = [...letters].filter((v) => factors.filter((f) => f.powers[v] !== undefined).length >= 2);
    const realPowers = repeated.length > 0 && repeated.every((v) => factors.every((f) => f.powers[v] === undefined || f.powers[v] > 1));
    if (realPowers
      && !samePoly(monoPoly({ coef: want.coef, powers: multiplied }), wantPoly)
      && samePoly(gotPoly, monoPoly({ coef: want.coef, powers: multiplied }))) {
      return 'You multiplied the powers. When you multiply, ADD the powers: count how many of each letter there are.';
    }
    // The numbers were added instead of multiplied: 2x × 3x = 5x.
    const sum = factors.reduce((s, f) => s + f.coef, 0);
    if (sum !== want.coef && Math.abs(got.coef) === Math.abs(sum)) {
      return `That is adding. When you multiply, multiply the numbers: ${factors.map((f) => fmtCoef(f.coef)).join(' × ')} = ${fmtCoef(want.coef)}.`;
    }
    // Right number, but a letter's power is too small: x × x written as x.
    if (got.coef === want.coef && [...letters].some((v) => (got.powers[v] ?? 0) < (want.powers[v] ?? 0))) {
      const v = [...letters].find((l) => (got.powers[l] ?? 0) < (want.powers[l] ?? 0)) ?? 'x';
      return `The number is right. Now count the letters: ${v} × ${v} = ${v}², so add up the powers of each letter.`;
    }
    if (got.coef !== want.coef && samePoly(monoPoly({ coef: want.coef, powers: got.powers }), wantPoly)) {
      return `The letters are right. Check the number: ${factors.map((f) => fmtCoef(f.coef)).join(' × ')} = ${fmtCoef(want.coef)}.`;
    }
  }
  return null;
}

function fmtCoef(n: number): string {
  return n < 0 ? `(−${Math.abs(n)})` : String(n);
}
