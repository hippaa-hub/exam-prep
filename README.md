# Exam prep app

A phone app for one Grade 7 student, with one job: get her ready for a specific exam in the days before it.
First exam: Individuals & Societies, "How Are Societies Governed?", Wednesday 18 November 2026.

It is a web app that installs on the phone's home screen. Progress is saved on the phone only.
No login, no server, no adverts.

## What is built (Phases 1 and 2)

- **Home**: days to go, the readiness ring, and **today's tasks**. Lola (the cat from the maths app) says which
  task is next and how to do it well.
- **Today's tasks**: the Key Terms flashcards first (on the days that have them), then Round 1 of today's questions,
  the day's other activity (a table, This or That, or the Argument Builder), Round 2 (what is left, plus a review of earlier days), then Fix My Mistakes.
  The tasks open one at a time: only the next one can be started, and the ones after it are grey and locked
  until it is finished. After each task the app offers the next. When every task is ticked, **today's preparation is finished**,
  the day gets a tick in the plan, and she is told to stop. The day before the exam starts with the **Mock Exam**;
  exam morning is a three-minute warm-up and a good-luck message.
- **Say it or write it**: questions answered in full sentences, as in the test. She taps the microphone and says
  her answer (or types it). Only then does the app check it for the key ideas, say which it found and which are
  missing, and show the teacher's wording. Spelling slips are accepted and the right spelling is shown.
  If the app misheard, "The app missed something I said" lets her correct it. Flashcards work the same way.
- **Why right, why not**: after every multiple-choice or this-or-that question the app says, in short plain sentences
  for a Grade 7 reader, why her choice was not right and why the right answer is. When she is right it still says why.
  The reasons live in `src/packs/<pack>/why.ts`; a check makes sure every option has one.
- **In simple words, with examples**: wherever the teacher's definition or wording is shown (flashcards, written
  answers, the "why" after a question), the same thing is given in one plain sentence with a few short examples,
  and read aloud with it on flashcards.
  The teacher's wording is what to write in the test; the simple words are there to make it make sense.
- **First look**: the first time she meets a definition or written question and taps "I don't know yet", it is
  shown and read to her and comes back later in the round, but it is not counted as a mistake. After that,
  not knowing it counts as "Not yet" and goes to Fix My Mistakes.
- **Flashcards read themselves aloud** when flipped (the term, then the teacher's definition), with "Hear it again"
  and a switch to turn reading off. This uses the phone's own voice and works without the internet.
- **Argument Builder**: the teacher's six thinking questions. Four boxes (argument, country example, how power
  is distributed, another view), then her own six-point checklist and one possible answer, shown only after hers.
- **Mock Exam** (two papers): Part A, six written questions; Part B, two arguments. She writes every answer:
  there is no microphone and nothing is read aloud in the mock exam. No help until she hands in.
  Then marking against the teacher's wording, and a "what to fix" list; missed Part A answers go to Fix My Mistakes.
  Unfinished writing is saved, so closing the app half-way loses nothing.
- **More practice** (extra): Key Terms, This or That, Which system?, Which responsibility?, Quick Quiz,
  Say it or write it, the two tables, the Argument Builder, both mock exams, and practice by topic.
  It is not in the bottom bar (Home, Fix, Guide). Home offers it only once the day's tasks are all ticked,
  because the daily tasks already cover everything she needs for the test.
- **Fix**: only the questions she missed, until each is right twice.
- **For parents** (a small link at the bottom of Home, and in the Guide): how long she studied today and on each day,
  whether she finished each day's tasks, questions answered, mock exam results, her written arguments and exam
  answers to read, and readiness per topic. The student's own screens show no timer.
  Study time counts the time spent answering; breaks longer than 90 seconds are left out.
  It is behind a 4-digit code, chosen the first time it is opened and asked for every time after that.
- **Guide**: eight steps on how to prepare, what the ring means, the teacher's requirements for the test, and a note for a parent.
- 225 questions written only from the teacher's material, in the teacher's wording.

The look follows the maths app (Lola, outlined cards, chunky buttons, green for right, orange for "not yet").
The main colour is violet instead of green so the two apps are easy to tell apart.

Still to come (Phase 3): export/import, badges, sounds and the glossary cards.

### About the microphone

Speaking an answer uses the phone's own speech recognition (Apple or Google). It needs the internet and the
microphone permission, and the audio may be sent to that company to be turned into text. Typed answers never
leave the phone. On phones where the in-app microphone is not available, the app points to the microphone key
on the keyboard, which does the same job.

The check looks for key ideas by their key words. It does not understand meaning the way a teacher does,
which is why the teacher's wording is always shown next to it.

## How readiness works

The questions are grouped into **43 things to know** from the teacher's revision list
(each key term, each confusing pair, each responsibility, each system, each country, and so on).
Each thing has several question wordings, and she meets a different wording each time.

- Level 0 = new or wrong. Level 1 = right once. Level 2 = right on two different days. Level 3 = right on three different days.
- A wrong answer puts it back to level 0, and the question joins Fix My Mistakes. It is asked again later in the
  same session, but that repeat earns no credit: she has only just seen the answer.
- Readiness = the average level, as a percentage. A topic is "ready" at 80%.
- A round is up to 15 questions (about 10 minutes). Each day's task list has two rounds; in the built-in simulation,
  two rounds a day reaches about 70% by exam morning.
- The day's tasks are set in the pack's plan (`extras` on each plan day) and built in `src/engine/tasks.ts`.

The original plan described levels per question. With over 200 questions that could never reach 80% in five days,
so levels are counted per thing to know instead. To go back, remove the `withConcepts(...)` wrappers in the pack files.

## Running it on the Mac

```bash
npm install
npm run dev
```

Then open the address it prints. `npm test` runs the checks; `npm run build` makes the finished site in `dist/`.

To wipe all saved progress on a device, open the app address with `?reset` on the end.

**To look at another day** (for example the mock exam day), open the app address with `?today=2026-11-17` on the end.
Answers given while previewing are saved like any others, so preview on the Mac, not on the student's phone.

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
