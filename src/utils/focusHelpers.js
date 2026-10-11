// ═══════════════════════════════════════════════════════════════════
//  FOCUS STUDY SYSTEM HELPERS & CALCULATIONS
//  Pure functions for stats, ranking, time formatting & tiers
// ═══════════════════════════════════════════════════════════════════

export const TOTAL_ACADEMY_STUDENTS = 350;

/**
 * Format total seconds to HH:MM:SS string.
 * Guaranteed never to return negative values or NaN.
 */
export function formatTime(totalSec) {
  const safeSec = Math.max(0, Math.floor(Number(totalSec) || 0));
  const hrs = Math.floor(safeSec / 3600);
  const mins = Math.floor((safeSec % 3600) / 60);
  const secs = safeSec % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Calculate user rank out of TOTAL_ACADEMY_STUDENTS based on study points.
 */
export function calculateUserRank(pts) {
  const safePts = Math.max(0, Math.floor(Number(pts) || 0));
  if (safePts >= 1200) return 1;
  if (safePts >= 900) return Math.max(2, Math.round(15 - (safePts - 900) / 25));
  if (safePts >= 600) return Math.max(16, Math.round(50 - (safePts - 600) / 10));
  if (safePts >= 300) return Math.max(51, Math.round(150 - (safePts - 300) / 3));
  if (safePts > 0) return Math.max(151, Math.round(300 - safePts));
  return 320;
}

/**
 * Get the league title and tier based on points.
 */
export function getUserBadge(pts) {
  const safePts = Math.max(0, Math.floor(Number(pts) || 0));
  if (safePts >= 800) return "💎 ডায়মন্ড লিগ";
  if (safePts >= 500) return "🥇 গোল্ড লিগ";
  if (safePts >= 250) return "🥈 সিলভার লিগ";
  if (safePts > 0) return "🥉 ব্রোঞ্জ লিগ";
  return "🌱 নতুন লার্নার";
}

/**
 * Get next tier requirements and percentage progress.
 */
export function getNextTier(pts) {
  const safePts = Math.max(0, Math.floor(Number(pts) || 0));
  if (safePts < 100) {
    return {
      nextLeague: "🥉 ব্রোঞ্জ লিগ",
      needed: 100 - safePts,
      pct: Math.min(100, Math.round((safePts / 100) * 100)),
    };
  }
  if (safePts < 250) {
    return {
      nextLeague: "🥈 সিলভার লিগ",
      needed: 250 - safePts,
      pct: Math.min(100, Math.round(((safePts - 100) / 150) * 100)),
    };
  }
  if (safePts < 500) {
    return {
      nextLeague: "🥇 গোল্ড লিগ",
      needed: 500 - safePts,
      pct: Math.min(100, Math.round(((safePts - 250) / 250) * 100)),
    };
  }
  if (safePts < 800) {
    return {
      nextLeague: "💎 ডায়মন্ড লিগ",
      needed: 800 - safePts,
      pct: Math.min(100, Math.round(((safePts - 500) / 300) * 100)),
    };
  }
  return { nextLeague: "👑 সর্বোচ্চ ডায়মন্ড লিগ", needed: 0, pct: 100 };
}

/**
 * Get performance grade object based on study minutes.
 */
export function getStudyGrade(mins) {
  const safeMins = Math.max(0, Number(mins) || 0);
  const pts = Math.round(safeMins * 1.5);
  if (pts >= 600) {
    return {
      grade: "A+",
      label: "অসাধারণ নিয়মানুবর্তিতা",
      desc: "তোমার পড়ার ধারাবাহিকতা শীর্ষ স্তরের!",
      bg: "#dcfce7",
      color: "#16a34a",
      bar: "linear-gradient(90deg, #16a34a, #4ade80)",
      pct: 100,
    };
  }
  if (pts >= 400) {
    return {
      grade: "A",
      label: "চমৎকার অগ্রগতি",
      desc: "তুমি খুব নিয়মিতভাবে পড়াশোনা চালিয়ে যাচ্ছো।",
      bg: "#d1fae5",
      color: "#059669",
      bar: "linear-gradient(90deg, #059669, #6ee7b7)",
      pct: 80,
    };
  }
  if (pts >= 200) {
    return {
      grade: "B+",
      label: "ভালো চেষ্টা",
      desc: "ভালো অগ্রগতি! প্রতিদিন আরেকটু সময় দিলে A+ নিশ্চিত।",
      bg: "#dbeafe",
      color: "#2563eb",
      bar: "linear-gradient(90deg, #2563eb, #93c5fd)",
      pct: 60,
    };
  }
  if (pts > 0) {
    return {
      grade: "B",
      label: "সন্তোষজনক শুরু",
      desc: "পড়া শুরু হয়েছে! প্রতিদিন নির্ধারিত লক্ষ্য পূরণ করো।",
      bg: "#e0e7ff",
      color: "#4f46e5",
      bar: "linear-gradient(90deg, #4f46e5, #a5b4fc)",
      pct: 40,
    };
  }
  return {
    grade: "🌱 স্টার্টার",
    label: "এখনো শুরু হয়নি",
    desc: "টাইমার চালু করে তোমার প্রথম পড়ার সেশনটি শুরু করো!",
    bg: "#fee2e2",
    color: "#dc2626",
    bar: "linear-gradient(90deg, #f87171, #fca5a5)",
    pct: 10,
  };
}

/**
 * Accurately calculate elapsed study time in seconds for both stopwatch & countdown.
 */
export function calculateElapsedSeconds(timerMode, seconds, targetMinutes) {
  const safeSec = Math.max(0, Number(seconds) || 0);
  const targetSec = Math.max(0, (Number(targetMinutes) || 0) * 60);

  if (timerMode === "stopwatch") {
    return safeSec;
  }
  // For countdown: elapsed is target minus remaining seconds
  return Math.max(0, targetSec - safeSec);
}

/**
 * Filter and compute aggregate metrics safely across all sessions.
 * Never produces NaN even with corrupted or malformed records.
 */
export function calculateSessionStats(sessions) {
  if (!Array.isArray(sessions)) {
    return {
      validSessions: [],
      totalMinutes: 0,
      totalHours: "0.0",
      studyPoints: 0,
      currentUserRank: 320,
      userBadge: "🌱 নতুন লার্নার",
    };
  }

  const validSessions = sessions.filter(
    (s) =>
      s &&
      typeof s === "object" &&
      s.id &&
      String(s.id).startsWith("s_") &&
      Number(s.minutes) > 0
  );

  const totalMinutes = validSessions.reduce((acc, s) => {
    const mins = Number(s.minutes);
    return acc + (!isNaN(mins) && mins > 0 ? mins : 0);
  }, 0);

  const totalHours = (totalMinutes / 60).toFixed(1);
  const studyPoints = Math.round(totalMinutes * 1.5);
  const currentUserRank = calculateUserRank(studyPoints);
  const userBadge = getUserBadge(studyPoints);

  return {
    validSessions,
    totalMinutes,
    totalHours,
    studyPoints,
    currentUserRank,
    userBadge,
  };
}
