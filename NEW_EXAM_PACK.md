# How to add a new exam

The app prepares for one exam at a time. Each exam is an "exam pack": a folder of questions built
only from what the teacher gave. This page says how to add the next one, for any subject.

There are two parts. Part 1 is for the parent and needs no coding. Part 2 is for whoever writes the code
(Claude Code, or a developer).

## Part 1: what the parent does

### 1. Start early enough
The app counts something as fully learned once it has been right on **three different days**, so it needs
at least three study days before the exam. Five days is comfortable. Starting two days before still works,
but the last day then becomes long.

The ring has two special rules at the end. On the last day before the exam every round counts (not only one
step per day), so finishing that day's tasks can fill the ring to 95%. The last 5% comes from the three-minute
warm-up on exam morning.

### 2. Collect the teacher's material in one folder
Make a folder for the subject (for example `Downloads/Science_Grade7`) and put in it everything the teacher
gave for this exam:

- the slides or presentations
- any glossary, word list or revision sheet
- the task text that announces the test (it usually lists what to revise)
- photos of notebook pages or handouts, if the teacher taught from them

### 3. Find out what the test covers
Ask, or look in the test task:

- the **date** of the exam
- **which lessons or slides** are on it. If the teacher says "only what is in the slides", say so:
  extra material such as a long glossary then becomes optional practice, not a daily task.
- the **format**: definitions, short written answers, a table to fill, an essay or argument

### 4. Ask for the pack
Open Claude Code in this folder and say something like:

> Add a new exam pack. Subject: Science. Exam date: 9 December 2026.
> The teacher's material is in ~/Downloads/Science_Grade7.
> The test covers lessons 3 to 5 only. It will have definitions and one table to fill.
> Follow NEW_EXAM_PACK.md.

### 5. Check it before she starts
- Open the app with `?today=YYYY-MM-DD` at the end of the address to preview any day of the plan.
- Do one round yourself and read a few explanations. Are they in words she would understand?
- Ask for the coverage check in Part 2, step 6, and read the list of anything left out.

## Part 2: what the builder does

### 1. Write the notes file first
Read every file in the material folder and write `<SUBJECT>_STUDIED.md` next to `PLAN.md`
(both are private and are not published). It holds the exam date, what the teacher says is on the test,
and the content itself in the teacher's wording. Everything in the pack comes from this file.

**Never fill a gap with likely content.** If something seems to be missing, say what is missing and ask.

### 2. Create the pack folder
`src/packs/<exam-date>-<subject>/`, for example `src/packs/2026-12-09-science/`, with:

| File | What it holds |
|---|---|
| `index.ts` | The pack: id, subject, title, date, topics, and the day-by-day plan |
| one file per topic | The questions, grouped into "things to know" with `withConcepts` |
| `why.ts` | For every tap question: why each wrong option is wrong. Also the simple words and examples |
| `written.ts` | Questions answered in full sentences, with the key ideas the app looks for |
| `arguments.ts` | Only if the test has essays or arguments: the questions and the mock exams |
| `glossary.ts` | Only if there is a glossary beyond the slides: optional flashcards (Part 2 on Home) |

The existing pack `2026-11-18-societies` is the model to copy. The helpers in `src/content/build.ts`
(`term`, `choice`, `pair`, `match`, `order`, `tableRow`, `short`) keep a question from pointing at an
answer that is not among its options.

### 3. Follow the content rules
- **The teacher's wording** for every definition and model answer.
- **One plain sentence** beside it (the `simple` map), then **two to four short examples** (the `examples` map).
- **Why right, why not** for every tap question, in short sentences for a Grade 7 reader.
- **Several wordings** of each thing to know, so she meets a different question each time.
- **Things to know, not questions**, are what the ring counts. Keep them to about 40 to 50 for a five-day plan.
  Extra material goes in `glossary.ts`, outside the topics, so it does not dilute the ring.
- British spelling. No names of the school or the teacher in the code: the repository is public.

### 4. Write the plan
In `index.ts`, list the days before the exam (`day: -4` is four days before):

- Spread the topics over the first days, heaviest first.
- Give each day one extra activity that suits its topics (flashcards, a table, This or That, an argument).
- Keep the last day for the mock exam and a mixed round. The app adds two more rounds of "what is not full yet"
  by itself on that day.
- A day with no topics and no mock exam is a mixed day: one mixed round of everything, with new glossary words.
  Use it for a spare day, or when the exam moves (see below).
- Exam day is always the three-minute warm-up; it needs no entry.

**If the exam date moves:** change `date` and renumber the plan days so the study days stay on the dates she
already did them. Fill a gained day with a mixed day. Never change the pack's `id`: her progress is saved under it.

### 5. Register the pack
Add it to the list in `src/packs/index.ts`. Home shows the nearest upcoming exam by itself.

### 6. Check coverage against the source, not against the notes
This step found real gaps in the first pack. Go through the teacher's files **slide by slide** and tick each
fact against the pack's questions. Do not check against the notes file: anything dropped when the notes were
written is invisible that way. Report what is covered, what was added, and what was left out on purpose.

### 7. Run the checks
```bash
npm run typecheck
npm test
npm run build
```
`src/packs/packs.test.ts` checks every pack by itself: unique ids, an explanation in simple words for every
question, examples for every definition, short sentences, and a plan that points at real topics.
`src/engine/simulate.test.ts` plays the plan day by day and fails if a steady learner would not get ready
in time or if something would never be asked.

### 8. Publish
Commit and push to `main`. The site republishes itself in about a minute. She may need to close and reopen
the app once to get the update. Her progress on earlier packs is untouched.
