// Every exam pack the app knows about. To add an exam, add a folder here and list it below.
import type { Pack } from '../content/types';
import { pack as societies } from './2026-11-18-societies';
import { pack as algebra } from './2026-11-27-algebra';

const all: Pack[] = [societies, algebra];

/** The maths app (Prep Exam Maths, built with --mode maths) shows only maths tests. */
export const packs: Pack[] = import.meta.env.MODE === 'maths' ? all.filter((p) => p.subject === 'Mathematics') : all;
