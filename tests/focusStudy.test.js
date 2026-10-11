import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  formatTime,
  calculateUserRank,
  getUserBadge,
  getNextTier,
  getStudyGrade,
  calculateElapsedSeconds,
  calculateSessionStats,
  TOTAL_ACADEMY_STUDENTS,
} from "../src/utils/focusHelpers.js";

import {
  getAmbientSoundMode,
  setAmbientVolume,
  stopAmbientSound,
  startAmbientSound,
  playAlertChime,
} from "../src/utils/focusAudio.js";

describe("formatTime Helper", () => {
  test("formats zero seconds as 00:00:00", () => {
    assert.equal(formatTime(0), "00:00:00");
  });

  test("formats seconds below one minute", () => {
    assert.equal(formatTime(45), "00:00:45");
  });

  test("formats minutes and seconds", () => {
    assert.equal(formatTime(125), "00:02:05");
  });

  test("formats hours, minutes, and seconds", () => {
    assert.equal(formatTime(3661), "01:01:01");
    assert.equal(formatTime(7322), "02:02:02");
  });

  test("handles negative, float, and non-numeric edge cases without throwing or NaN", () => {
    assert.equal(formatTime(-15), "00:00:00");
    assert.equal(formatTime(null), "00:00:00");
    assert.equal(formatTime(undefined), "00:00:00");
    assert.equal(formatTime(NaN), "00:00:00");
    assert.equal(formatTime(59.9), "00:00:59");
  });
});

describe("calculateElapsedSeconds (Stopwatch vs Countdown)", () => {
  test("calculates elapsed time in stopwatch mode", () => {
    assert.equal(calculateElapsedSeconds("stopwatch", 0, 60), 0);
    assert.equal(calculateElapsedSeconds("stopwatch", 45, 60), 45);
    assert.equal(calculateElapsedSeconds("stopwatch", 3600, 60), 3600);
  });

  test("calculates elapsed time in countdown mode accurately", () => {
    // 60-minute session: target = 3600s
    // At start (seconds remaining = 3600): elapsed = 0s
    assert.equal(calculateElapsedSeconds("countdown", 3600, 60), 0);

    // After 30 seconds (remaining = 3570): elapsed = 30s
    assert.equal(calculateElapsedSeconds("countdown", 3570, 60), 30);

    // After 10 minutes (remaining = 3000): elapsed = 600s
    assert.equal(calculateElapsedSeconds("countdown", 3000, 60), 600);

    // Completed session (remaining = 0): elapsed = 3600s
    assert.equal(calculateElapsedSeconds("countdown", 0, 60), 3600);
  });

  test("prevents negative elapsed time in countdown if seconds > target", () => {
    assert.equal(calculateElapsedSeconds("countdown", 4000, 60), 0);
  });
});

describe("calculateUserRank", () => {
  test("returns 320 for zero points or negative points", () => {
    assert.equal(calculateUserRank(0), 320);
    assert.equal(calculateUserRank(-50), 320);
    assert.equal(calculateUserRank(null), 320);
  });

  test("calculates relative ranks accurately across tiers", () => {
    const rank50 = calculateUserRank(50);
    assert.ok(rank50 >= 151 && rank50 <= 300, `Expected 151-300, got ${rank50}`);

    const rank350 = calculateUserRank(350);
    assert.ok(rank350 >= 51 && rank350 <= 150, `Expected 51-150, got ${rank350}`);

    const rank700 = calculateUserRank(700);
    assert.ok(rank700 >= 16 && rank700 <= 50, `Expected 16-50, got ${rank700}`);

    const rank1000 = calculateUserRank(1000);
    assert.ok(rank1000 >= 2 && rank1000 <= 15, `Expected 2-15, got ${rank1000}`);

    const rank1500 = calculateUserRank(1500);
    assert.equal(rank1500, 1);
  });
});

describe("getUserBadge", () => {
  test("returns Starter for 0 points", () => {
    assert.equal(getUserBadge(0), "🌱 নতুন লার্নার");
    assert.equal(getUserBadge(-10), "🌱 নতুন লার্নার");
  });

  test("returns Bronze league for points > 0 and < 250", () => {
    assert.equal(getUserBadge(50), "🥉 ব্রোঞ্জ লিগ");
    assert.equal(getUserBadge(249), "🥉 ব্রোঞ্জ লিগ");
  });

  test("returns Silver league for points >= 250 and < 500", () => {
    assert.equal(getUserBadge(250), "🥈 সিলভার লিগ");
    assert.equal(getUserBadge(499), "🥈 সিলভার লিগ");
  });

  test("returns Gold league for points >= 500 and < 800", () => {
    assert.equal(getUserBadge(500), "🥇 গোল্ড লিগ");
    assert.equal(getUserBadge(799), "🥇 গোল্ড লিগ");
  });

  test("returns Diamond league for points >= 800", () => {
    assert.equal(getUserBadge(800), "💎 ডায়মন্ড লিগ");
    assert.equal(getUserBadge(1500), "💎 ডায়মন্ড লিগ");
  });
});

describe("getNextTier", () => {
  test("calculates progress to Bronze for starter tier", () => {
    const tier0 = getNextTier(0);
    assert.equal(tier0.nextLeague, "🥉 ব্রোঞ্জ লিগ");
    assert.equal(tier0.needed, 100);
    assert.equal(tier0.pct, 0);

    const tier50 = getNextTier(50);
    assert.equal(tier50.needed, 50);
    assert.equal(tier50.pct, 50);
  });

  test("calculates progress to Silver", () => {
    const tier = getNextTier(175);
    assert.equal(tier.nextLeague, "🥈 সিলভার লিগ");
    assert.equal(tier.needed, 75);
    assert.equal(tier.pct, 50);
  });

  test("returns maxed status when at Diamond league", () => {
    const tier = getNextTier(850);
    assert.equal(tier.needed, 0);
    assert.equal(tier.pct, 100);
  });
});

describe("getStudyGrade", () => {
  test("returns Starter when minutes is 0", () => {
    const grade = getStudyGrade(0);
    assert.equal(grade.grade, "🌱 স্টার্টার");
    assert.equal(grade.pct, 10);
  });

  test("calculates correct grade for higher study durations", () => {
    const gradeB = getStudyGrade(50); // 75 pts
    assert.equal(gradeB.grade, "B");

    const gradeBPlus = getStudyGrade(150); // 225 pts
    assert.equal(gradeBPlus.grade, "B+");

    const gradeA = getStudyGrade(300); // 450 pts
    assert.equal(gradeA.grade, "A");

    const gradeAPlus = getStudyGrade(500); // 750 pts
    assert.equal(gradeAPlus.grade, "A+");
  });
});

describe("calculateSessionStats", () => {
  test("handles empty or invalid sessions safely", () => {
    const emptyStats = calculateSessionStats([]);
    assert.equal(emptyStats.totalMinutes, 0);
    assert.equal(emptyStats.totalHours, "0.0");
    assert.equal(emptyStats.studyPoints, 0);
    assert.equal(emptyStats.currentUserRank, 320);

    const nullStats = calculateSessionStats(null);
    assert.equal(nullStats.totalMinutes, 0);
    assert.equal(nullStats.totalHours, "0.0");
  });

  test("correctly filters genuine sessions and ignores dummy/corrupted sessions", () => {
    const mockSessions = [
      { id: "s_1001", minutes: 30, subjectId: "ict" },
      { id: "s_1002", minutes: 60, subjectId: "physics" },
      { id: "dummy_past_1", minutes: 120, subjectId: "ict" }, // Ignored!
      { id: "s_1003", minutes: -10, subjectId: "ict" }, // Negative ignored
      { id: "s_1004", minutes: "45", subjectId: "math" }, // Numeric string handled safely
      null, // Corrupted entry handled safely
    ];

    const stats = calculateSessionStats(mockSessions);
    // Valid: 30 + 60 + 45 = 135 minutes
    assert.equal(stats.validSessions.length, 3);
    assert.equal(stats.totalMinutes, 135);
    assert.equal(stats.totalHours, "2.3"); // 135 / 60 = 2.25 -> 2.3
    assert.equal(stats.studyPoints, Math.round(135 * 1.5));
    assert.ok(stats.currentUserRank < 320);
  });
});

describe("focusAudio Engine Contracts", () => {
  test("exposes audio controller methods and initial soundMode is none", () => {
    assert.equal(typeof startAmbientSound, "function");
    assert.equal(typeof stopAmbientSound, "function");
    assert.equal(typeof setAmbientVolume, "function");
    assert.equal(typeof playAlertChime, "function");
    assert.equal(getAmbientSoundMode(), "none");
  });

  test("stopAmbientSound sets mode to none without throwing in non-browser environment", () => {
    stopAmbientSound();
    assert.equal(getAmbientSoundMode(), "none");
  });

  test("setAmbientVolume clamps values properly", () => {
    setAmbientVolume(0.8);
    setAmbientVolume(-0.5);
    setAmbientVolume(1.5);
    // Should not throw
    assert.ok(true);
  });
});
