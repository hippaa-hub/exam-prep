# Exam prep app

A phone app for one Grade 7 student, with one job: get her ready for a specific exam in the days before it.
First exam: Individuals & Societies, "How Are Societies Governed?", Wednesday 18 November 2026.

It is a web app that installs on the phone's home screen. Progress is saved on the phone only.
No login, no server, no adverts.

## What is built (Phase 1)

- **Home**: days to go, the readiness ring, and **today's tasks**. Lola (the cat from the maths app) says which
  task is next and how to do it well.
- **Today's tasks**: Round 1 of today's questions, the day's special activity (flashcards, a table, or This or That),
  Round 2 (what is left, plus a review of earlier days), then Fix My Mistakes. After each task the app offers the next.
  When every task is ticked, **today's preparation is finished**, the day gets a tick in the plan, and she is told to stop.
- **Practise**: Key Terms (flashcards), This or That (confusing pairs), Which system?, Which responsibility?,
  Quick Quiz, the five-countries table, the three-systems table, and practice by topic. For extra practice.
- **Fix**: only the questions she missed, until each is right twice.
- **For parents** (a small link at the bottom of Home, and in the Guide): how long she studied today and on each day,
  whether she finished each day's tasks, questions answered, and readiness per topic. The student's own screens show no timer.
  Study time counts the time spent answering; breaks longer than 90 seconds are left out.
  It is behind a 4-digit code, chosen the first time it is opened and asked for every time after that.
- **Guide**: seven steps on how to prepare, what the ring means, the teacher's requirements for the test, and a note for a parent.
- 203 questions written only from the teacher's material, in the teacher's wording.

The look follows the maths app (Lola, outlined cards, chunky buttons, green for right, orange for "not yet").
The main colour is violet instead of green so the two apps are easy to tell apart.

Still to come: typed answers, Argument Builder, Mock Exam and the exam-morning warm-up screen (Phase 2);
export/import, badges, sounds and the glossary cards (Phase 3).

## How readiness works

The 203 questions are grouped into **43 things to know** from the teacher's revision list
(each key term, each confusing pair, each responsibility, each system, each country, and so on).
Each thing has several question wordings, and she meets a different wording each time.

- Level 0 = new or wrong. Level 1 = right once. Level 2 = right on two different days. Level 3 = right on three different days.
- A wrong answer puts it back to level 0, and the question joins Fix My Mistakes. It is asked again later in the
  same session, but that repeat earns no credit: she has only just seen the answer.
- Readiness = the average level, as a percentage. A topic is "ready" at 80%.
- A round is up to 15 questions (about 10 minutes). Each day's task list has two rounds; in the built-in simulation,
  two rounds a day reaches about 70% by exam morning.
- The day's tasks are set in the pack's plan (`extras` on each plan day) and built in `src/engine/tasks.ts`.

The original plan described levels per question. With 203 questions that could never reach 80% in five days,
so levels are counted per thing to know instead. To go back, remove the `withConcepts(...)` wrappers in the pack files.

## Running it on the Mac

```bash
npm install
npm run dev
```

Then open the address it prints. `npm test` runs the checks; `npm run build` makes the finished site in `dist/`.

To wipe all saved progress on a device, open the app address with `?reset` on the end.

**Forgotten the parent code?** Open the app address with `?parent-reset` on the end. That forgets the code only;
progress is kept. The next time "For parents" is opened, it asks you to choose a new code.
The code is a light lock to keep the tracker out of the student's way, not real security.

Published automatically to GitHub Pages on every push to `main`.

## Adding the next exam

Add a folder in `src/packs/` (copy `2026-11-18-societies`), write its topics, and list it in `src/packs/index.ts`.
Home always shows the nearest upcoming exam. Nothing else in the app changes.

## Where things are

- `src/packs/` — exam packs: the questions, the topics and the day-by-day plan
- `src/content/` — the question types and small helpers for writing packs
- `src/engine/` — levels, readiness, the countdown plan and session picking, with tests
- `src/ui/` — the screens
- `src/storage/` — saving progress on the phone (IndexedDB)
