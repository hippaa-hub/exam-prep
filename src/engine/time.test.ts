import { describe, expect, it } from 'vitest';
import {
  addStudyTime, creditSeconds, formatDuration, secondsOn, studyDays, totalSeconds, QUESTION_CAP_SECONDS, TABLE_CAP_SECONDS,
} from './time';

describe('study time', () => {
  it('counts the time spent on a question', () => {
    expect(creditSeconds(12_400)).toBe(12);
    expect(creditSeconds(0)).toBe(0);
    expect(creditSeconds(-5000)).toBe(0);
    expect(creditSeconds(Number.NaN)).toBe(0);
  });

  it('does not count a long pause as study', () => {
    expect(creditSeconds(20 * 60 * 1000)).toBe(QUESTION_CAP_SECONDS);
    expect(creditSeconds(4 * 60 * 1000, TABLE_CAP_SECONDS)).toBe(240); // a table takes minutes, and that is real work
    expect(creditSeconds(30 * 60 * 1000, TABLE_CAP_SECONDS)).toBe(TABLE_CAP_SECONDS);
  });

  it('adds up per day', () => {
    let time = addStudyTime(undefined, '2026-11-14', 40);
    time = addStudyTime(time, '2026-11-14', 25);
    time = addStudyTime(time, '2026-11-15', 300);
    time = addStudyTime(time, '2026-11-15', 0);
    expect(secondsOn(time, '2026-11-14')).toBe(65);
    expect(secondsOn(time, '2026-11-15')).toBe(300);
    expect(secondsOn(time, '2026-11-16')).toBe(0);
    expect(totalSeconds(time)).toBe(365);
    expect(studyDays(time).map((d) => d.day)).toEqual(['2026-11-15', '2026-11-14']);
    expect(studyDays(undefined)).toEqual([]);
  });

  it('reads well', () => {
    expect(formatDuration(0)).toBe('0 min');
    expect(formatDuration(45)).toBe('under 1 min');
    expect(formatDuration(60)).toBe('1 min');
    expect(formatDuration(18 * 60 + 20)).toBe('18 min');
    expect(formatDuration(60 * 60)).toBe('1 h');
    expect(formatDuration(65 * 60)).toBe('1 h 5 min');
  });
});
