// Game worlds ("Biology Adventure", Jenia, 28 Nov): content types only. The mechanics live in src/ui/adventure.
// A world has three levels: 1 recognise it, 2 understand it, 3 use it in a new situation.
// Every challenge belongs to one "thing to know" (concept), so a game answer counts in the readiness ring
// exactly like a question in a round, and a miss sends that thing to Fix My Mistakes.
import type { ConceptId } from './types';

export type Stage = 1 | 2 | 3;

/** Parts the app can draw. Cell parts on the cell drawings, microscope parts on the microscope. */
export type CellPart = 'membrane' | 'cytoplasm' | 'nucleus' | 'nucleolus' | 'mitochondria' | 'ribosomes' | 'wall' | 'chloroplasts' | 'vacuole';
export type ScopePart = 'eyepiece' | 'nosepiece' | 'objectives' | 'stage' | 'clips' | 'coarse' | 'fine' | 'light';
export type Diagram = 'animal-cell' | 'plant-cell' | 'microscope';

interface Base {
  id: string;
  concept: ConceptId;
  /** What to do, in one or two short sentences. */
  prompt: string;
  /** Shown when she gets it right: why it is right, in easy words. */
  why: string;
  /** Shown after a wrong try, with "Try again": a clue, not the answer. */
  hint: string;
  /** A picture above the challenge (a file in public/img, without .webp). */
  photo?: string;
  /** A short story line above the prompt ("A patient arrives…"). */
  story?: string;
}

/** Drag each card into the right box. */
export interface SortChallenge extends Base {
  kind: 'sort';
  bins: string[];
  cards: { text: string; bin: string; why: string }[];
}

/** Put the steps in the right order (stored in the right order). */
export interface OrderChallenge extends Base { kind: 'order'; steps: string[] }

/** Join each thing on the left to its partner on the right. */
export interface MatchChallenge extends Base { kind: 'match'; pairs: [string, string][] }

/** Choose one answer (used for decisions and stories; most challenges are something else). */
export interface PickChallenge extends Base {
  kind: 'pick';
  options: string[];
  answer: string;
  /** Why each wrong option is wrong, keyed by its text. */
  whyNot: Record<string, string>;
}

/** Drag the names onto the numbered spots of a drawing. */
export interface LabelChallenge extends Base { kind: 'label'; diagram: Diagram; spots: string[] }

/** Tap the right part on a drawing. */
export interface TapChallenge extends Base {
  kind: 'tap';
  diagram: Diagram;
  answer: string;
  /** Why a wrong part is wrong. Parts not listed get their own job from the world's part list. */
  whyNot?: Record<string, string>;
}

/** Build a cell: drag parts into it. Parts that do not belong bounce out with the reason. */
export interface BuildChallenge extends Base {
  kind: 'build';
  cell: 'animal' | 'plant';
  /** The parts offered in the tray, including ones that do not belong. */
  offer: CellPart[];
  /** Why a part does not belong in this cell. */
  reject: Partial<Record<CellPart, string>>;
}

/** The membrane gate: molecules arrive one by one; let them in, send them out, or block them. */
export interface GateChallenge extends Base {
  kind: 'gate';
  /** A time to beat (seconds). Beating it gives bonus points; running out never stops the game. */
  seconds?: number;
  molecules: { name: string; look: 'small' | 'big' | 'fuel' | 'gas' | 'waste' | 'toxin' | 'fat' | 'mineral'; go: 'in' | 'out' | 'block'; why: string }[];
}

/** Turn the two dials so that eyepiece × objective = the target magnification. */
export interface DialChallenge extends Base { kind: 'dial'; target: number; eyepieces: number[]; objectives: number[] }

/** Find the wrong sentence in someone's notes, then choose the correction. */
export interface SpotChallenge extends Base {
  kind: 'spot';
  /** Whose notes these are, for the story. */
  author: string;
  lines: string[];
  wrong: number;
  fix: string;
  fixes: string[];
}

/** A mystery: clues appear one at a time. Solve it with fewer clues for more points. */
export interface CluesChallenge extends Base {
  kind: 'clues';
  clues: string[];
  options: string[];
  answer: string;
  whyNot: Record<string, string>;
}

export type Challenge =
  | SortChallenge | OrderChallenge | MatchChallenge | PickChallenge | LabelChallenge
  | TapChallenge | BuildChallenge | GateChallenge | DialChallenge | SpotChallenge | CluesChallenge;

export interface WorldLevel {
  stage: Stage;
  title: string;
  /** One or two short sentences before the level starts. */
  intro: string;
  challenges: Challenge[];
}

export interface World {
  id: string;
  title: string;
  emoji: string;
  /** Banner picture (public/img, without .webp). */
  img: string;
  /** The story, two or three short sentences. */
  story: string;
  /** The world's own colour. */
  colour: string;
  levels: WorldLevel[];
  /** The badge for finishing the world. */
  badge: string;
}

/** A part's name and its job, for labels and for explaining a wrong tap. */
export interface PartInfo { name: string; job: string }

export interface Adventure {
  worlds: World[];
  parts: Record<string, PartInfo>;
}

/** Every challenge of a world, in play order. */
export function challengesOf(world: World): Challenge[] {
  return world.levels.flatMap((l) => l.challenges);
}

/** Stars for a finished world: 3 for (almost) all right first time, 2 for most, 1 for finishing. */
export function starsFor(right: number, total: number): 1 | 2 | 3 {
  if (total === 0) return 1;
  const share = right / total;
  return share >= 0.9 ? 3 : share >= 0.7 ? 2 : 1;
}

export const playTaskId = (world: string) => `play:${world}`;
