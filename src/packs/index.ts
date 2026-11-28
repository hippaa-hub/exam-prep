// Every exam pack the app knows about. To add an exam, add a folder here and list it below.
import type { Pack } from '../content/types';
import { pack as societies } from './2026-11-18-societies';
import { pack as algebra } from './2026-11-27-algebra';
import { pack as science } from './2026-12-07-science';

const all: Pack[] = [societies, algebra, science];

/** The maths app (Prep Exam Maths, --mode maths) shows only maths tests; exam-prepSCI (--mode science) only science. */
export const packs: Pack[] = import.meta.env.MODE === 'maths' ? all.filter((p) => p.subject === 'Mathematics')
  : import.meta.env.MODE === 'science' ? all.filter((p) => p.subject === 'Science') : all;
