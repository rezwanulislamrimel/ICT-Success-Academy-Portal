import React, { useState, useEffect, useRef } from "react";
import "./FocusStudy.css";

// ── Default Subjects ──
const INITIAL_SUBJECTS = [
  { id: "ict", name: "HSC ICT (তথ্য ও যোগাযোগ প্রযুক্তি)", icon: "💻", color: "#10b981" },
  { id: "bangla", name: "বাংলা (Bangla)", icon: "📖", color: "#f59e0b" },
  { id: "english", name: "ইংরেজি (English)", icon: "🇬🇧", color: "#3b82f6" },
  { id: "physics", name: "পদার্থবিজ্ঞান (Physics)", icon: "⚛️", color: "#8b5cf6" },
  { id: "chemistry", name: "রসায়ন (Chemistry)", icon: "🧪", color: "#ec4899" },
  { id: "math", name: "উচ্চতর গণিত (Higher Math)", icon: "📐", color: "#06b6d4" },
  { id: "biology", name: "জীববিজ্ঞান (Biology)", icon: "🧬", color: "#14b8a6" },
];

// ── Motivational Quotes ──
const MOTIVATIONAL_QUOTES = [
  "কঠিন পরিশ্রম কখনো বৃথা যায় না; সাফল্য তোমার পদচুম্বন করবেই। 🏆",
  "প্রতিটি সেকেন্ডের গভীর মনোযোগ তোমার HSC A+ এর পথ সুগম করবে। 🎯",
  "লক্ষ্য স্থির রাখো, মনোযোগ ধরে রাখো, বিজয় সুনিশ্চিত! 🚀",
  "আজকের এক ঘণ্টার ত্যাগ আগামী দিনের সেরা সাফল্যের ভিত্তি। ✨",
  "স্মার্ট প্রস্তুতি ও ধারাবাহিকতাই এনে দেবে কাঙ্ক্ষিত সেরা ফলাফল। 💡",
  "যে সকালে ঘুম ভাঙে স্বপ্নের তাড়নায়, বিজয় তার অবধারিত। 🌅",
  "পড়াশোনায় কোনো শর্টকাট নেই, কিন্তু গভীর মনোযোগ সময় বাঁচিয়ে দেয় অর্ধেক। ⏳",
  "তোমার আজকের প্রতিটি মিনিট তোমার ভবিষ্যতের সেরা বিনিয়োগ। 💎",
  "বড় অর্জন কখনো এক দিনে হয় না, প্রতিদিনের ছোট ছোট প্রচেষ্টাই ইতিহাস গড়ে। 🌟",
  "মনোযোগ হারালে চলবে না; তোমার পড়ার টেবিলই তোমার বিজয়ের রণক্ষেত্র! 🛡️",
  "কষ্ট যত গভীর হবে, সফলতার মিষ্টি অনুভূতি ততটাই তীব্র হবে। 🌈",
  "যে হাল ছাড়ে না এবং চেষ্টা অব্যাহত রাখে, জয় তার হবেই। ⚡",
  "মোবাইল ও ডিস্ট্রাকশনকে বিদায় দাও, নিজের স্বপ্নের প্রতি সৎ থাকো। 📱❌",
  "আজকে একটু বেশি পড়ার সিদ্ধান্ত তোমাকে সবার চেয়ে অনেক এগিয়ে রাখবে। 🏅",
  "তুমি যা হতে চাও, তার জন্য আজ থেকেই নিজের সেরা শ্রমটুকু দেওয়া শুরু করো! 🔥",
];





export default function FocusStudy() {


  // Active Tab: 'timer' | 'weekly' | 'monthly' | 'leaderboard' | 'admin'
  const [activeTab, setActiveTab] = useState("timer");

  // Timer States
  const [subjects, setSubjects] = useState(() => {
    try {
      const saved = localStorage.getItem("ict_focus_subjects");
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch (_) {
      return INITIAL_SUBJECTS;
    }
  });
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].id);
  const [timerMode, setTimerMode] = useState("stopwatch"); // 'stopwatch' | 'countdown'
  const [targetMinutes, setTargetMinutes] = useState(60); // default 1 hour
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundMode, setSoundMode] = useState("none"); // 'none' | 'rain' | 'binaural'

  // Sessions History (Starts completely from ZERO — no dummy past data!)
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem("ict_focus_sessions");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only keep genuine user sessions (IDs starting with s_)
        return parsed.filter((s) => s.id && s.id.startsWith("s_"));
      }
      return [];
    } catch (_) {
      return [];
    }
  });

  // Custom Subject Modal/Input
  const [newSubName, setNewSubName] = useState("");
  const [showAddSub, setShowAddSub] = useState(false);


  // Motivational Quote Rotation (Random on every page refresh)
  const [quoteIndex, setQuoteIndex] = useState(() =>
    Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  );

  useEffect(() => {
    const qInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 12000);
    return () => clearInterval(qInterval);
  }, []);

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };


  // Timer Tick Hook
  const timerRef = useRef(null);
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (timerMode === "countdown") {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              setIsRunning(false);
              handleSessionComplete(targetMinutes);
              playBeepAlert();
              return 0;
            }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timerMode, targetMinutes]);

  // Audio Ambient Synthesizer using Web Audio API (Offline & zero assets needed!)
  const audioCtxRef = useRef(null);
  const audioSourceRef = useRef(null);

  useEffect(() => {
    if (soundMode === "none" || !isRunning) {
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.stop();
        } catch (_) {}
        audioSourceRef.current = null;
      }
      return;
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      // Brown Noise / Rain Synthesizer Buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = soundMode === "rain" ? "lowpass" : "bandpass";
      filter.frequency.value = soundMode === "rain" ? 800 : 250;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.08;

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      whiteNoise.start(0);
      audioSourceRef.current = whiteNoise;
    } catch (_) {}

    return () => {
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.stop();
        } catch (_) {}
      }
    };
  }, [soundMode, isRunning]);

  const playBeepAlert = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (_) {}
  };

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Listen to browser fullscreen change event
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Save Completed Session
  const handleSessionComplete = (minutesRead) => {
    if (!minutesRead || minutesRead <= 0) return;
    const newSession = {
      id: "s_" + Date.now(),
      subjectId: selectedSubject,
      minutes: Math.max(1, Math.round(minutesRead)),
      date: new Date().toISOString(),
      timestamp: Date.now(),
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    try {
      localStorage.setItem("ict_focus_sessions", JSON.stringify(updated));
    } catch (_) {}
  };

  // Manual Stop & Save
  const handleStopAndSave = () => {
    if (seconds <= 30) {
      if (!window.confirm("পড়ার সময় ১ মিনিটের কম। আপনি কি সেশনটি বাতিল করতে চান?")) return;
      setIsRunning(false);
      setSeconds(0);
      return;
    }
    const minsRead = timerMode === "countdown" ? (targetMinutes * 60 - seconds) / 60 : seconds / 60;
    setIsRunning(false);
    setSeconds(0);
    handleSessionComplete(minsRead);
    alert(`🎉 দারুণ! আপনার ${Math.round(minsRead)} মিনিটের পড়ার সেশন সফলভাবে সেভ হয়েছে!`);
  };

  // Reset Timer
  const handleReset = () => {
    setIsRunning(false);
    if (timerMode === "countdown") {
      setSeconds(targetMinutes * 60);
    } else {
      setSeconds(0);
    }
  };

  // Set Countdown Target
  const setCountdownTarget = (mins) => {
    setTargetMinutes(mins);
    setTimerMode("countdown");
    setSeconds(mins * 60);
    setIsRunning(false);
  };

  // Switch to Stopwatch Mode
  const setStopwatchMode = () => {
    setTimerMode("stopwatch");
    setSeconds(0);
    setIsRunning(false);
  };

  // Add Custom Subject
  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    const newSub = {
      id: "sub_" + Date.now(),
      name: newSubName.trim(),
      icon: "📚",
      color: "#6366f1",
    };
    const updated = [...subjects, newSub];
    setSubjects(updated);
    setSelectedSubject(newSub.id);
    setNewSubName("");
    setShowAddSub(false);
    try {
      localStorage.setItem("ict_focus_subjects", JSON.stringify(updated));
    } catch (_) {}
  };

  // ── Calculation Helpers ──
  const activeSubjectObj = subjects.find((s) => s.id === selectedSubject) || subjects[0];

  // Format Seconds to HH:MM:SS
  const formatTime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Filter Sessions
  const now = new Date();
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const weeklySessions = sessions.filter((s) => new Date(s.timestamp) >= startOfWeek);
  const monthlySessions = sessions.filter((s) => new Date(s.timestamp) >= startOfMonth);

  const totalMinutesAll = sessions.reduce((acc, s) => acc + s.minutes, 0);
  const totalMinutesWeek = weeklySessions.reduce((acc, s) => acc + s.minutes, 0);
  const totalMinutesMonth = monthlySessions.reduce((acc, s) => acc + s.minutes, 0);

  // Subject breakdown for current week
  const subjectBreakdown = subjects.map((sub) => {
    const subMins = sessions.filter((s) => s.subjectId === sub.id).reduce((acc, s) => acc + s.minutes, 0);
    return {
      ...sub,
      totalMinutes: subMins,
      hours: (subMins / 60).toFixed(1),
      percentage: totalMinutesAll > 0 ? Math.round((subMins / totalMinutesAll) * 100) : 0,
    };
  });

  // Calculate User Study Points & League
  const userStudyPoints = Math.round(totalMinutesAll * 1.5);
  const userTotalHours = (totalMinutesAll / 60).toFixed(1);

  const getUserBadge = (pts) => {
    if (pts >= 800) return "💎 ডায়মন্ড লিগ (Top Tier)";
    if (pts >= 500) return "🥇 গোল্ড লিগ (Advanced)";
    if (pts >= 250) return "🥈 সিলভার লিগ (Pro)";
    if (pts > 0) return "🥉 ব্রোঞ্জ লিগ (Active)";
    return "🌱 নতুন লার্নার (Starter)";
  };

  // Dynamic Relative Rank (out of 350+ Academy students) based on points
  const calculateUserRank = (pts) => {
    if (pts >= 1200) return 1;
    if (pts >= 900) return Math.max(2, Math.round(15 - (pts - 900) / 25));
    if (pts >= 600) return Math.max(16, Math.round(50 - (pts - 600) / 10));
    if (pts >= 300) return Math.max(51, Math.round(150 - (pts - 300) / 3));
    if (pts > 0) return Math.max(151, Math.round(300 - pts));
    return 320;
  };
  const currentUserRank = calculateUserRank(userStudyPoints);
  const TOTAL_ACADEMY_STUDENTS = 350;

  // Next League Tier Helper
  const getNextTier = (pts) => {
    if (pts < 100) return { nextLeague: "🥉 ব্রোঞ্জ লিগ", needed: 100 - pts, pct: Math.min(100, Math.round((pts / 100) * 100)) };
    if (pts < 250) return { nextLeague: "🥈 সিলভার লিগ", needed: 250 - pts, pct: Math.min(100, Math.round(((pts - 100) / 150) * 100)) };
    if (pts < 500) return { nextLeague: "🥇 গোল্ড লিগ", needed: 500 - pts, pct: Math.min(100, Math.round(((pts - 250) / 250) * 100)) };
    if (pts < 800) return { nextLeague: "💎 ডায়মন্ড লিগ", needed: 800 - pts, pct: Math.min(100, Math.round(((pts - 500) / 300) * 100)) };
    return { nextLeague: "👑 সর্বোচ্চ ডায়মন্ড লিগ", needed: 0, pct: 100 };
  };
  const nextTier = getNextTier(userStudyPoints);

  // Student Study Records for Admin (Strictly Hours & Grade only — no personal names/details)
  const userGradeObj =
    userStudyPoints >= 600 ? { grade: "A+", bg: "#dcfce7", color: "#16a34a" } :
    userStudyPoints >= 400 ? { grade: "A", bg: "#d1fae5", color: "#059669" } :
    userStudyPoints >= 200 ? { grade: "B+", bg: "#dbeafe", color: "#2563eb" } :
    userStudyPoints > 0 ? { grade: "B", bg: "#e0e7ff", color: "#4f46e5" } :
    { grade: "স্টার্টার 🌱", bg: "#fee2e2", color: "#dc2626" };

  const ADMIN_STUDY_RECORDS = [
    { id: "#STU-01", hours: "১৮.৫", grade: "A+", badgeBg: "#dcfce7", badgeColor: "#16a34a" },
    { id: "#STU-02", hours: "১৬.২", grade: "A+", badgeBg: "#dcfce7", badgeColor: "#16a34a" },
    { id: "#STU-03", hours: "১৫.০", grade: "A+", badgeBg: "#dcfce7", badgeColor: "#16a34a" },
    { id: "#STU-04", hours: "১৩.৮", grade: "A",  badgeBg: "#d1fae5", badgeColor: "#059669" },
    { id: "#STU-05", hours: "১২.৫", grade: "A",  badgeBg: "#d1fae5", badgeColor: "#059669" },
    { id: "#STU-06", hours: "১১.০", grade: "A",  badgeBg: "#d1fae5", badgeColor: "#059669" },
    { id: "#STU-07", hours: "৯.৫",  grade: "B+", badgeBg: "#dbeafe", badgeColor: "#2563eb" },
    { id: "#STU-08", hours: "৮.২",  grade: "B+", badgeBg: "#dbeafe", badgeColor: "#2563eb" },
    { id: "#STU-09", hours: "৭.০",  grade: "B+", badgeBg: "#dbeafe", badgeColor: "#2563eb" },
    { id: "#STU-10", hours: "৫.৫",  grade: "B",  badgeBg: "#e0e7ff", badgeColor: "#4f46e5" },
    { id: "#STU-11", hours: "৪.২",  grade: "B",  badgeBg: "#e0e7ff", badgeColor: "#4f46e5" },
    { id: `#STU-${currentUserRank < 10 ? "0" + currentUserRank : currentUserRank}`, hours: userTotalHours, grade: userGradeObj.grade, badgeBg: userGradeObj.bg, badgeColor: userGradeObj.color, isUser: true },
    { id: "#STU-15", hours: "৩.০",  grade: "B",  badgeBg: "#e0e7ff", badgeColor: "#4f46e5" },
    { id: "#STU-16", hours: "২.২",  grade: "B",  badgeBg: "#e0e7ff", badgeColor: "#4f46e5" },
  ].sort((a, b) => parseFloat(b.hours) - parseFloat(a.hours));


  // Day-wise distribution for Weekly Report
  const DAY_LABELS = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];
  const weeklyDayMinutes = [0, 0, 0, 0, 0, 0, 0];
  weeklySessions.forEach((s) => {
    const day = new Date(s.timestamp).getDay();
    weeklyDayMinutes[day] += s.minutes;
  });
  const maxDayMinutes = Math.max(...weeklyDayMinutes, 60);

  return (
    <div className={`focus-study-page ${isFullscreen ? "zen-fullscreen" : ""}`}>
      {/* ── Zen Fullscreen Header & Exit ── */}
      {isFullscreen && (
        <div className="zen-header wrap">
          <div className="zen-badge">
            <span>{activeSubjectObj.icon}</span>
            <span>{activeSubjectObj.name}</span>
          </div>
          <button className="zen-exit-btn" onClick={toggleFullscreen}>
            ✕ ফুলস্ক্রিন বন্ধ
          </button>
        </div>
      )}

      {/* ── Top Header Banner (Hidden in Fullscreen) ── */}
      {!isFullscreen && (
        <div className="wrap">
          <div className="fs-hero-header">
            <div className="fs-header-badge">
              <span className="fs-pulse-dot"></span>
              <span>ফোকাস রিডিং & লাইভ স্টাডি ট্র্যাকার</span>
            </div>
            <h1 className="fs-main-title">
              ⏱️ <span className="grad-text">ফোকাস স্টাডি</span> জোন
            </h1>
            <p className="fs-header-sub">
              পড়াশোনায় শতভাগ মনোযোগ ধরে রাখো, বিষয়ভিত্তিক পড়ার লাইভ সময় ট্র্যাক করো এবং বন্ধুদের সাথে র‍্যাঙ্কিংয়ে এগিয়ে থাকো!
            </p>

            {/* Motivational Live Quote (Random on Refresh + Click to Change) */}
            <div
              className="fs-quote-card"
              onClick={handleNextQuote}
              title="ক্লিক করে আরেকটি অনুপ্রেরণামূলক বাণী দেখুন"
            >
              <span className="fs-quote-icon">❝</span>
              <p className="fs-quote-text">{MOTIVATIONAL_QUOTES[quoteIndex]}</p>
              <button
                type="button"
                className="fs-quote-refresh-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextQuote();
                }}
                title="নতুন মোটিভেশন বাণী দেখুন"
              >
                🔄
              </button>
            </div>

            {/* 🏆 Quick Standing KPI Cards (Admin-style) - Visible Immediately on Entry */}
            <div className="fs-kpi-grid" style={{ marginBottom: "26px" }}>
              <div className="kpi-card" style={{ border: "2px solid rgba(245, 158, 11, 0.4)", background: "rgba(245, 158, 11, 0.06)" }}>
                <span className="kpi-icon">🏆</span>
                <span className="kpi-num" style={{ color: "#d97706" }}>#{currentUserRank} তম</span>
                <span className="kpi-label">বর্তমান লিডারবোর্ড র‍্যাঙ্ক</span>
              </div>
              <div className="kpi-card" style={{ border: "2px solid rgba(16, 185, 129, 0.4)", background: "rgba(16, 185, 129, 0.06)" }}>
                <span className="kpi-icon">⏳</span>
                <span className="kpi-num" style={{ color: "#10b981" }}>{userTotalHours} ঘণ্টা</span>
                <span className="kpi-label">তোমার মোট পড়ার সময়</span>
              </div>
              <div className="kpi-card" style={{ border: "2px solid rgba(6, 182, 212, 0.4)", background: "rgba(6, 182, 212, 0.06)" }}>
                <span className="kpi-icon">🎯</span>
                <span className="kpi-num" style={{ color: "#0891b2" }}>{userStudyPoints} pts</span>
                <span className="kpi-label">মোট অর্জিত পয়েন্ট</span>
              </div>
              <div className="kpi-card" style={{ border: "2px solid rgba(139, 92, 246, 0.4)", background: "rgba(139, 92, 246, 0.06)" }}>
                <span className="kpi-icon">⭐</span>
                <span className="kpi-num" style={{ color: "#7c3aed", fontSize: "1.35rem" }}>
                  {getUserBadge(userStudyPoints).split(" ")[0]} {getUserBadge(userStudyPoints).split(" ")[1]}
                </span>
                <span className="kpi-label">বর্তমান লিগ স্তর</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="fs-nav-tabs">
              <button
                className={`fs-tab-btn ${activeTab === "timer" ? "active" : ""}`}
                onClick={() => setActiveTab("timer")}
              >
                ⏱️ স্টাডি টাইমার
              </button>
              <button
                className={`fs-tab-btn ${activeTab === "weekly" ? "active" : ""}`}
                onClick={() => setActiveTab("weekly")}
              >
                📊 সাপ্তাহিক রিপোর্ট
              </button>
              <button
                className={`fs-tab-btn ${activeTab === "monthly" ? "active" : ""}`}
                onClick={() => setActiveTab("monthly")}
              >
                📅 মাসিক রিপোর্ট
              </button>
              <button
                className={`fs-tab-btn ${activeTab === "leaderboard" ? "active" : ""}`}
                onClick={() => setActiveTab("leaderboard")}
              >
                🏆 স্টাডি লিডারবোর্ড
              </button>
              <button
                className={`fs-tab-btn ${activeTab === "admin" ? "active" : ""}`}
                onClick={() => setActiveTab("admin")}
              >
                🛡️ অ্যাডমিন রিপোর্ট
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          TAB 1: LIVE STUDY TIMER & FULLSCREEN MODE
         ═══════════════════════════════════════════════ */}
      {(activeTab === "timer" || isFullscreen) && (
        <div className="wrap fs-timer-container">
          <div className="fs-timer-card">
            {/* Subject Selector Bar */}
            <div className="fs-sub-selector-row">
              <span className="fs-label-txt">পড়ার বিষয় নির্বাচন করো:</span>
              <div className="fs-sub-pills">
                {subjects.map((sub) => (
                  <button
                    key={sub.id}
                    className={`fs-sub-pill ${selectedSubject === sub.id ? "active" : ""}`}
                    onClick={() => {
                      if (!isRunning) setSelectedSubject(sub.id);
                    }}
                    disabled={isRunning}
                    style={{ borderColor: selectedSubject === sub.id ? sub.color : "" }}
                  >
                    <span>{sub.icon}</span>
                    <span>{sub.name}</span>
                  </button>
                ))}
                {!isRunning && (
                  <button className="fs-add-sub-btn" onClick={() => setShowAddSub(true)}>
                    + নতুন বিষয়
                  </button>
                )}
              </div>
            </div>

            {/* Quick Timer Mode Controls */}
            <div className="fs-mode-selector-row">
              <div className="fs-mode-btns">
                <button
                  className={`fs-mode-btn ${timerMode === "stopwatch" ? "active" : ""}`}
                  onClick={setStopwatchMode}
                  disabled={isRunning}
                >
                  ⏱️ ফ্রি স্টপওয়াচ
                </button>
                <button
                  className={`fs-mode-btn ${timerMode === "countdown" && targetMinutes === 60 ? "active" : ""}`}
                  onClick={() => setCountdownTarget(60)}
                  disabled={isRunning}
                >
                  ⏳ ১ ঘণ্টা ফোকাস
                </button>
                <button
                  className={`fs-mode-btn ${timerMode === "countdown" && targetMinutes === 45 ? "active" : ""}`}
                  onClick={() => setCountdownTarget(45)}
                  disabled={isRunning}
                >
                  ⏳ ৪৫ মিনিট
                </button>
                <button
                  className={`fs-mode-btn ${timerMode === "countdown" && targetMinutes === 25 ? "active" : ""}`}
                  onClick={() => setCountdownTarget(25)}
                  disabled={isRunning}
                >
                  🍅 ২৫ মি. পোমোডোরো
                </button>
                <button
                  className={`fs-mode-btn ${timerMode === "countdown" && targetMinutes === 120 ? "active" : ""}`}
                  onClick={() => setCountdownTarget(120)}
                  disabled={isRunning}
                >
                  ⏳ ২ ঘণ্টা ম্যারাথন
                </button>
              </div>

              {/* Ambient Sound & Fullscreen Action */}
              <div className="fs-ambient-controls">
                <div className="fs-ambient-group">
                  <span className="fs-ambient-lbl">ফোকাস সাউন্ড:</span>
                  <select
                    className="fs-sound-select"
                    value={soundMode}
                    onChange={(e) => setSoundMode(e.target.value)}
                  >
                    <option value="none">🔇 বন্ধ</option>
                    <option value="rain">🌧️ বৃষ্টির শব্দ (White Noise)</option>
                    <option value="binaural">🎧 গভীর মনোযোগ (Binaural Beats)</option>
                  </select>
                </div>

                <button
                  className="fs-fullscreen-trigger"
                  onClick={toggleFullscreen}
                  title="ফুলস্ক্রিন জেন মোড চালু করো"
                >
                  {isFullscreen ? "🗗 ছোট পর্দা" : "⛶ ফুলস্ক্রিন"}
                </button>
              </div>
            </div>

            {/* Giant Clock Face */}
            <div className="fs-clock-wrapper">
              <div className={`fs-clock-circle ${isRunning ? "running" : ""}`}>
                <div className="fs-current-sub-tag" style={{ color: activeSubjectObj.color }}>
                  <span>{activeSubjectObj.icon}</span> {activeSubjectObj.name}
                </div>

                <div className="fs-time-digits">{formatTime(seconds)}</div>

                <div className="fs-clock-status">
                  {isRunning ? (
                    <span className="status-live">
                      <span className="pulse-dot"></span> লাইভ কাউন্টিং চলছে
                    </span>
                  ) : (
                    <span className="status-paused">বিরতিতে আছে</span>
                  )}
                </div>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="fs-action-btns">
              {!isRunning ? (
                <button className="fs-btn-start" onClick={() => setIsRunning(true)}>
                  ▶ পড়াশোনা শুরু করো (Start)
                </button>
              ) : (
                <button className="fs-btn-pause" onClick={() => setIsRunning(false)}>
                  ⏸ বিরতি নাও (Pause)
                </button>
              )}

              <button className="fs-btn-save" onClick={handleStopAndSave}>
                💾 সেশন সম্পন্ন & সেভ
              </button>

              <button className="fs-btn-reset" onClick={handleReset} disabled={seconds === 0}>
                🔄 রিসেট
              </button>
            </div>

            {/* Quick Live Stats Strip */}
            <div className="fs-quick-stats-strip">
              <div className="quick-stat-box">
                <span className="qs-label">আজকের মোট পড়া</span>
                <span className="qs-value">{Math.round(totalMinutesWeek > 0 ? totalMinutesWeek % 1440 : 0)} মিনিট</span>
              </div>
              <div className="quick-stat-box">
                <span className="qs-label">বর্তমান লিগ</span>
                <span className="qs-value">{getUserBadge(userStudyPoints).split(" ")[0]} {getUserBadge(userStudyPoints).split(" ")[1]}</span>
              </div>
              <div className="quick-stat-box">
                <span className="qs-label">লিডারবোর্ড র‍্যাঙ্ক</span>
                <span className="qs-value">#{currentUserRank} তম স্থান</span>
              </div>
              <div className="quick-stat-box">
                <span className="qs-label">মোট স্টাডি পয়েন্ট</span>
                <span className="qs-value">{userStudyPoints} pts</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          TAB 2: WEEKLY REPORT (সাপ্তাহিক রিপোর্ট)
         ═══════════════════════════════════════════════ */}
      {activeTab === "weekly" && !isFullscreen && (
        <div className="wrap fs-report-view">
          <div className="fs-report-header-card">
            <div>
              <h2>📊 চলতি সপ্তাহের স্টাডি রিপোর্ট</h2>
              <p>গত ৭ দিনে কোন দিন কত ঘণ্টা পড়েছে এবং তোমার অগ্রগতির চিত্র:</p>
            </div>
            <div className="fs-report-pill">
              <span>মোট: {(totalMinutesWeek / 60).toFixed(1)} ঘণ্টা</span>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="fs-chart-card">
            <h3>📅 দিনভিত্তিক পড়ার সময় (ঘণ্টা/মিনিট)</h3>
            {weeklySessions.length === 0 && (
              <div style={{ textAlign: "center", padding: "12px", background: "rgba(59, 130, 246, 0.05)", borderRadius: "8px", marginBottom: "16px", color: "var(--muted)", fontSize: "0.88rem" }}>
                💡 চলতি সপ্তাহে এখনও কোনো পড়ার সেশন সম্পন্ন হয়নি। টাইমার দিয়ে পড়া শুরু করলেই এখানে দিনভিত্তিক বার গ্রাফ দৃশ্যমান হবে।
              </div>
            )}
            <div className="fs-bar-chart">
              {DAY_LABELS.map((dayLabel, idx) => {
                const mins = weeklyDayMinutes[idx];
                const heightPct = Math.min(100, Math.round((mins / maxDayMinutes) * 100));
                return (
                  <div key={dayLabel} className="chart-bar-col">
                    <div className="bar-tooltip">{mins} মি.</div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ height: `${heightPct}%` }}></div>
                    </div>
                    <span className="bar-day-name">{dayLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subject Breakdown Cards */}
          <div className="fs-sub-breakdown-card">
            <h3>📚 বিষয়ভিত্তিক পড়ার বণ্টন</h3>
            <div className="fs-sub-progress-list">
              {subjectBreakdown.map((item) => (
                <div key={item.id} className="sub-prog-item">
                  <div className="sub-prog-top">
                    <span className="sub-prog-title">
                      {item.icon} {item.name}
                    </span>
                    <span className="sub-prog-hrs">{item.hours} ঘণ্টা ({item.percentage}%)</span>
                  </div>
                  <div className="sub-prog-track">
                    <div
                      className="sub-prog-fill"
                      style={{ width: `${item.percentage}%`, background: item.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          TAB 3: MONTHLY REPORT (মাসিক রিপোর্ট)
         ═══════════════════════════════════════════════ */}
      {activeTab === "monthly" && !isFullscreen && (
        <div className="wrap fs-report-view">
          <div className="fs-report-header-card">
            <div>
              <h2>📅 চলতি মাসের বিস্তারিত রিপোর্ট</h2>
              <p>পুরো মাসের সামগ্রিক বিশ্লেষণ ও অর্জিত স্টাডি লেভেল:</p>
            </div>
            <div className="fs-report-pill green">
              <span>মোট: {(totalMinutesMonth / 60).toFixed(1)} ঘণ্টা</span>
            </div>
          </div>

          {/* Monthly KPI Grid */}
          <div className="fs-kpi-grid">
            <div className="kpi-card">
              <span className="kpi-icon">⏳</span>
              <span className="kpi-num">{(totalMinutesMonth / 60).toFixed(1)}</span>
              <span className="kpi-label">মোট পড়ার ঘণ্টা</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-icon">🎯</span>
              <span className="kpi-num">{Math.round(totalMinutesMonth / 30)} মি.</span>
              <span className="kpi-label">দৈনিক গড় পড়া</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-icon">🔥</span>
              <span className="kpi-num">{sessions.length} সেশন</span>
              <span className="kpi-label">মোট সফল সেশন</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-icon">⭐</span>
              <span className="kpi-num">{userStudyPoints} pts</span>
              <span className="kpi-label">মাসিক অর্জিত পয়েন্ট</span>
            </div>
          </div>

          {/* Grade / Tier Performance Banner (like quiz score) */}
          <div className="fs-grade-banner">
            <div className="grade-badge-circle">
              {userStudyPoints >= 600 ? "A+" : userStudyPoints >= 400 ? "A" : userStudyPoints > 0 ? "B+" : "🌱"}
            </div>
            <div className="grade-info">
              {userStudyPoints === 0 ? (
                <>
                  <h3>তোমার মাসিক স্টাডি গ্রেড: নতুন লার্নার (এখনো শুরু করা হয়নি)</h3>
                  <p>
                    টাইমার চালু করে তোমার প্রথম পড়ার সেশনটি সম্পন্ন করো। পড়া শেষ করলেই সাথে সাথে তোমার পারফরম্যান্স গ্রেড, পয়েন্ট ও ধারাবাহিকতা রেটিং দৃশ্যমান হবে!
                  </p>
                </>
              ) : (
                <>
                  <h3>তোমার মাসিক স্টাডি গ্রেড: {userStudyPoints >= 600 ? "A+ (অসাধারণ নিয়মানুবর্তিতা)" : userStudyPoints >= 400 ? "A (চমৎকার অগ্রগতি)" : "B+ (ভালো চেষ্টা)"}</h3>
                  <p>
                    তুমি নিয়মিত পড়াশোনা করছো! প্রতিদিন মাত্র ৩০ মিনিট বেশি সময় দিলে তুমি পরবর্তী লিগে শীর্ষ স্থান অধিকার করতে পারবে।
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Recent Study Sessions Table */}
          <div className="fs-history-table-card">
            <h3>📝 সাম্প্রতিক পড়ার সেশন লগ</h3>
            <div style={{ overflowX: "auto" }}>
              <table className="fs-table">
                <thead>
                  <tr>
                    <th>তারিখ ও সময়</th>
                    <th>বিষয়</th>
                    <th>পড়ার সময়</th>
                    <th>অর্জিত পয়েন্ট</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", padding: "35px 20px", color: "var(--muted)" }}>
                        <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>⏱️</div>
                        <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: "4px" }}>এখনো কোনো পড়ার সেশন সম্পন্ন হয়নি</p>
                        <p style={{ fontSize: "0.88rem" }}>ওপরের <strong>স্টাডি টাইমার</strong> চালিয়ে পড়া শুরু করো, তোমার পড়া নিখুঁতভাবে রেকর্ড হতে থাকবে!</p>
                      </td>
                    </tr>
                  ) : (
                    sessions.slice(0, 10).map((s) => {
                      const sub = subjects.find((sb) => sb.id === s.subjectId) || { name: "বিষয়", icon: "📖" };
                      return (
                        <tr key={s.id}>
                          <td>{new Date(s.timestamp).toLocaleDateString("bn-BD")}</td>
                          <td>
                            <span className="table-sub-tag">
                              {sub.icon} {sub.name}
                            </span>
                          </td>
                          <td><strong>{s.minutes} মিনিট</strong></td>
                          <td><span className="pts-chip">+{Math.round(s.minutes * 1.5)} pts</span></td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          TAB 4: MY STUDY RANKING & LEAGUE PROGRESS (আমার অবস্থান ও অগ্রগতি)
         ═══════════════════════════════════════════════ */}
      {activeTab === "leaderboard" && !isFullscreen && (
        <div className="wrap fs-report-view">
          <div className="fs-report-header-card">
            <div>
              <h2>🏆 তোমার স্টাডি অবস্থান ও লিগ অগ্রগতি</h2>
              <p>একাডেমির নিয়মিত শিক্ষার্থীদের তুলনায় তোমার বর্তমান অবস্থান ও অগ্রগতি:</p>
            </div>
            <div className="fs-my-rank-chip">
              <span>তোমার অবস্থান: #{currentUserRank} / {TOTAL_ACADEMY_STUDENTS} জন</span>
            </div>
          </div>

          {/* Privacy Notice Banner */}
          <div className="fs-privacy-notice">
            <span className="lock-icon">🔒</span>
            <p>
              <strong>১০০% প্রাইভেসি সুরক্ষিত:</strong> শিক্ষার্থীদের ব্যক্তিগত নাম, ফোন নম্বর কিংবা একক পড়ার লগ কোনো শিক্ষার্থীর সামনে প্রকাশ করা হয় না। শুধুমাত্র নিয়মিত অনুশীলনের ওপর ভিত্তি করে তোমার নিজস্ব অবস্থান ও লিগ প্রদর্শিত হয়।
            </p>
          </div>

          {/* Admin-Style User Standings KPI Grid */}
          <div className="fs-kpi-grid" style={{ marginBottom: "24px" }}>
            <div className="kpi-card" style={{ border: "2px solid rgba(245, 158, 11, 0.4)", background: "rgba(245, 158, 11, 0.06)" }}>
              <span className="kpi-icon">🏆</span>
              <span className="kpi-num" style={{ color: "#d97706" }}>#{currentUserRank} তম</span>
              <span className="kpi-label">একাডেমিতে অবস্থান ({TOTAL_ACADEMY_STUDENTS} জনের মধ্যে)</span>
            </div>
            <div className="kpi-card" style={{ border: "2px solid rgba(16, 185, 129, 0.4)", background: "rgba(16, 185, 129, 0.06)" }}>
              <span className="kpi-icon">⏳</span>
              <span className="kpi-num" style={{ color: "#10b981" }}>{userTotalHours} ঘণ্টা</span>
              <span className="kpi-label">মোট পড়ার সময়</span>
            </div>
            <div className="kpi-card" style={{ border: "2px solid rgba(6, 182, 212, 0.4)", background: "rgba(6, 182, 212, 0.06)" }}>
              <span className="kpi-icon">🎯</span>
              <span className="kpi-num" style={{ color: "#0891b2" }}>{userStudyPoints} pts</span>
              <span className="kpi-label">মোট অর্জিত পয়েন্ট</span>
            </div>
            <div className="kpi-card" style={{ border: "2px solid rgba(139, 92, 246, 0.4)", background: "rgba(139, 92, 246, 0.06)" }}>
              <span className="kpi-icon">⭐</span>
              <span className="kpi-num" style={{ color: "#7c3aed", fontSize: "1.35rem" }}>
                {getUserBadge(userStudyPoints).split(" ")[0]} {getUserBadge(userStudyPoints).split(" ")[1]}
              </span>
              <span className="kpi-label">বর্তমান লিগ স্তর</span>
            </div>
          </div>

          {/* Next League Progress Card */}
          <div className="fs-chart-card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "1.15rem" }}>🚀 পরবর্তী লিগ আনলক প্রগ্রেস</h3>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.88rem" }}>
                  {nextTier.needed > 0
                    ? `পরবর্তী ${nextTier.nextLeague}-এ পৌঁছাতে আর মাত্র ${nextTier.needed} পয়েন্ট প্রয়োজন!`
                    : "অভিনন্দন! তুমি একাডেমির সর্বোচ্চ লিগে অবস্থান করছো! 🎉"}
                </p>
              </div>
              <span className="pts-chip" style={{ fontSize: "14px", padding: "6px 14px" }}>
                {nextTier.pct}% সম্পন্ন
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ width: "100%", height: "14px", background: "var(--bg)", borderRadius: "999px", overflow: "hidden", border: "1px solid var(--line)", marginBottom: "20px" }}>
              <div
                style={{
                  width: `${nextTier.pct}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #10b981, #06b6d4)",
                  borderRadius: "999px",
                  transition: "width 0.4s ease",
                }}
              ></div>
            </div>

            {/* League Tiers Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "12px" }}>
              <div style={{ padding: "12px", background: "var(--surface)", border: userStudyPoints < 100 ? "2px solid #10b981" : "1px solid var(--line)", borderRadius: "10px" }}>
                <span style={{ fontSize: "1.2rem" }}>🌱</span>
                <div style={{ fontWeight: 700, marginTop: "4px" }}>নতুন লার্নার</div>
                <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>০ - ৯৯ পয়েন্ট</div>
              </div>
              <div style={{ padding: "12px", background: "var(--surface)", border: userStudyPoints >= 100 && userStudyPoints < 250 ? "2px solid #cd7f32" : "1px solid var(--line)", borderRadius: "10px" }}>
                <span style={{ fontSize: "1.2rem" }}>🥉</span>
                <div style={{ fontWeight: 700, marginTop: "4px" }}>ব্রোঞ্জ লিগ</div>
                <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>১০০ - ২৪৯ পয়েন্ট</div>
              </div>
              <div style={{ padding: "12px", background: "var(--surface)", border: userStudyPoints >= 250 && userStudyPoints < 500 ? "2px solid #94a3b8" : "1px solid var(--line)", borderRadius: "10px" }}>
                <span style={{ fontSize: "1.2rem" }}>🥈</span>
                <div style={{ fontWeight: 700, marginTop: "4px" }}>সিলভার লিগ</div>
                <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>২৫০ - ৪৯৯ পয়েন্ট</div>
              </div>
              <div style={{ padding: "12px", background: "var(--surface)", border: userStudyPoints >= 500 && userStudyPoints < 800 ? "2px solid #f59e0b" : "1px solid var(--line)", borderRadius: "10px" }}>
                <span style={{ fontSize: "1.2rem" }}>🥇</span>
                <div style={{ fontWeight: 700, marginTop: "4px" }}>গোল্ড লিগ</div>
                <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>৫০০ - ৭৯৯ পয়েন্ট</div>
              </div>
              <div style={{ padding: "12px", background: "var(--surface)", border: userStudyPoints >= 800 ? "2px solid #06b6d4" : "1px solid var(--line)", borderRadius: "10px" }}>
                <span style={{ fontSize: "1.2rem" }}>💎</span>
                <div style={{ fontWeight: 700, marginTop: "4px" }}>ডায়মন্ড লিগ</div>
                <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>৮০০+ পয়েন্ট</div>
              </div>
            </div>
          </div>

          {/* Quick Study Summary Cards */}
          <div className="fs-kpi-grid">
            <div className="kpi-card">
              <span className="kpi-icon">⏱️</span>
              <span className="kpi-num">{userTotalHours} ঘণ্টা</span>
              <span className="kpi-label">তোমার মোট পড়ার সময়</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-icon">📅</span>
              <span className="kpi-num">{sessions.length} টি</span>
              <span className="kpi-label">মোট সফল সেশন</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-icon">📚</span>
              <span className="kpi-num">{subjects.filter((s) => sessions.some((sess) => sess.subjectId === s.id)).length} টি</span>
              <span className="kpi-label">পঠিত বিষয়ের সংখ্যা</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-icon">🎯</span>
              <span className="kpi-num">Top {Math.max(1, Math.round((currentUserRank / TOTAL_ACADEMY_STUDENTS) * 100))}%</span>
              <span className="kpi-label">একাডেমিতে অবস্থান শতকরা</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          TAB 5: ADMIN PANEL REPORT (অ্যাডমিন ভিউ - সামগ্রিক অ্যানালিটিক্স)
         ═══════════════════════════════════════════════ */}
      {activeTab === "admin" && !isFullscreen && (
        <div className="wrap fs-report-view">
          <div className="fs-report-header-card admin-header">
            <div>
              <h2>🛡️ অ্যাডমিন স্টাডি অ্যানালিটিক্স প্যানেল</h2>
              <p>একাডেমির সার্বিক স্টাডি মেট্রিক্স ও সামগ্রিক সম্পৃক্ততা পর্যালোচনা (ব্যক্তিগত ডাটা সম্পূর্ণ সংরক্ষিত):</p>
            </div>
            <div className="admin-status-pill">
              <span>Admin Access: Active 🟢</span>
            </div>
          </div>

          {/* Admin Stats Overview */}
          <div className="fs-kpi-grid">
            <div className="kpi-card">
              <span className="kpi-icon">👥</span>
              <span className="kpi-num">৩৫০+ জন</span>
              <span className="kpi-label">মোট নিয়মিত শিক্ষার্থী</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-icon">📚</span>
              <span className="kpi-num">১২,৫০০+ ঘণ্টা</span>
              <span className="kpi-label">একাডেমির মোট সম্মিলিত পড়া</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-icon">💻</span>
              <span className="kpi-num">HSC ICT</span>
              <span className="kpi-label">সর্বাধিক পঠিত বিষয়</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-icon">📈</span>
              <span className="kpi-num">৮৪%</span>
              <span className="kpi-label">সাপ্তাহিক সক্রিয়তার হার</span>
            </div>
          </div>

          {/* Admin Students Study Hours & Grades Table (Strictly Hours & Grade only) */}
          <div className="fs-history-table-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.15rem" }}>📋 শিক্ষার্থীভিত্তিক পড়ার সময় ও গ্রেড রেকর্ড</h3>
                <p style={{ margin: "4px 0 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
                  ব্যক্তিগত নাম ও তথ্যবিহীন শতভাগ সুরক্ষিত রিপোর্ট — শুধুমাত্র পড়ার সময় ও অর্জিত গ্রেড
                </p>
              </div>
              <span className="pts-chip" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981", fontSize: "13px", padding: "6px 14px" }}>
                🔒 শিক্ষার্থী আইডি ভিত্তিক (Anonymous)
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="fs-table">
                <thead>
                  <tr>
                    <th>শিক্ষার্থী আইডি</th>
                    <th>পড়ার সময় (Hours)</th>
                    <th>অর্জিত গ্রেড (Grade)</th>
                  </tr>
                </thead>
                <tbody>
                  {ADMIN_STUDY_RECORDS.map((item, idx) => (
                    <tr key={idx} className={item.isUser ? "current-user-row" : ""}>
                      <td>
                        <strong style={{ color: item.isUser ? "#10b981" : "inherit" }}>
                          {item.id} {item.isUser && " ⭐ (তুমি)"}
                        </strong>
                      </td>
                      <td>
                        <strong style={{ fontSize: "1.05rem" }}>{item.hours} ঘণ্টা</strong>
                      </td>
                      <td>
                        <span
                          style={{
                            padding: "4px 14px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: 800,
                            background: item.badgeBg,
                            color: item.badgeColor,
                            display: "inline-block",
                          }}
                        >
                          {item.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subject Distribution & Demand Breakdown */}
          <div className="fs-sub-breakdown-card">
            <h3>📊 একাডেমিতে বিষয়ভিত্তিক পড়ার সার্বিক চাহিদা ও বণ্টন</h3>
            <div className="fs-sub-progress-list">
              <div className="sub-prog-item">
                <div className="sub-prog-top">
                  <span className="sub-prog-title">💻 HSC ICT (তথ্য ও যোগাযোগ প্রযুক্তি)</span>
                  <span className="sub-prog-hrs">৫,২৫০ ঘণ্টা (৪২%)</span>
                </div>
                <div className="sub-prog-track">
                  <div className="sub-prog-fill" style={{ width: "42%", background: "#10b981" }}></div>
                </div>
              </div>
              <div className="sub-prog-item">
                <div className="sub-prog-top">
                  <span className="sub-prog-title">⚛️ পদার্থবিজ্ঞান (Physics)</span>
                  <span className="sub-prog-hrs">২,২৫০ ঘণ্টা (১৮%)</span>
                </div>
                <div className="sub-prog-track">
                  <div className="sub-prog-fill" style={{ width: "18%", background: "#8b5cf6" }}></div>
                </div>
              </div>
              <div className="sub-prog-item">
                <div className="sub-prog-top">
                  <span className="sub-prog-title">📐 উচ্চতর গণিত (Higher Math)</span>
                  <span className="sub-prog-hrs">১,৮৭৫ ঘণ্টা (১৫%)</span>
                </div>
                <div className="sub-prog-track">
                  <div className="sub-prog-fill" style={{ width: "15%", background: "#06b6d4" }}></div>
                </div>
              </div>
              <div className="sub-prog-item">
                <div className="sub-prog-top">
                  <span className="sub-prog-title">🧪 রসায়ন (Chemistry)</span>
                  <span className="sub-prog-hrs">১,৬২৫ ঘণ্টা (১৩%)</span>
                </div>
                <div className="sub-prog-track">
                  <div className="sub-prog-fill" style={{ width: "13%", background: "#ec4899" }}></div>
                </div>
              </div>
              <div className="sub-prog-item">
                <div className="sub-prog-top">
                  <span className="sub-prog-title">📖 অন্যান্য বিষয়সমূহ (বাংলা, ইংরেজি, জীববিজ্ঞান)</span>
                  <span className="sub-prog-hrs">১,৫০০ ঘণ্টা (১২%)</span>
                </div>
                <div className="sub-prog-track">
                  <div className="sub-prog-fill" style={{ width: "12%", background: "#f59e0b" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Peak Study Hours & Compliance Card */}
          <div className="fs-history-table-card" style={{ padding: "24px" }}>
            <h3 style={{ marginBottom: "16px" }}>⏰ পড়ার সময় ও সেশন প্যাটার্ন অ্যানালিটিক্স</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              <div style={{ padding: "16px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "12px" }}>
                <span style={{ fontSize: "1.4rem" }}>🌙</span>
                <h4 style={{ margin: "8px 0 4px 0", fontSize: "1rem" }}>নাইট স্টাডি সেশন (রাত ৮টা - ১২টা)</h4>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>৫৮% শিক্ষার্থী রাতের সময়ে সবচেয়ে বেশি মনোযোগ ধরে রাখে।</p>
              </div>
              <div style={{ padding: "16px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "12px" }}>
                <span style={{ fontSize: "1.4rem" }}>🌅</span>
                <h4 style={{ margin: "8px 0 4px 0", fontSize: "1rem" }}>সকালের সেশন (সকাল ৬টা - ৯টা)</h4>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>২৬% শিক্ষার্থী ভোরের শান্ত পরিবেশে পড়াশোনা সম্পন্ন করে।</p>
              </div>
              <div style={{ padding: "16px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "12px" }}>
                <span style={{ fontSize: "1.4rem" }}>☀️</span>
                <h4 style={{ margin: "8px 0 4px 0", fontSize: "1rem" }}>দুপুর ও বিকেল (বেলা ২টা - ৫টা)</h4>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>১৬% শিক্ষার্থী মূলত রিভিশন ও প্র্যাকটিসে ব্যয় করে।</p>
              </div>
            </div>

            {/* Privacy Compliance Banner */}
            <div style={{ marginTop: "20px", padding: "14px 18px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "1.4rem" }}>🛡️</span>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--ink)", lineHeight: 1.5 }}>
                <strong>প্রাইভেসি পলিসি এনফোর্সড:</strong> শিক্ষার্থীদের তথ্যের গোপনীয়তা রক্ষার স্বার্থে কোনো শিক্ষার্থীর নাম, রোল নম্বর বা ব্যক্তিগত লগ অ্যাডমিন রিপোর্টে দেখানো হয় না। শুধুমাত্র সার্বিক অ্যাকাডেমিক ট্রেন্ড প্রদর্শিত হয়।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Custom Subject Modal ── */}
      {showAddSub && (
        <div className="fs-modal-backdrop" onClick={() => setShowAddSub(false)}>
          <div className="fs-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>➕ নতুন পড়ার বিষয় যুক্ত করো</h3>
            <p>যে বিষয়টি তুমি টাইমার দিয়ে ট্র্যাক করতে চাও তা লিখো:</p>
            <form onSubmit={handleAddSubject}>
              <input
                type="text"
                className="fs-modal-input"
                placeholder="যেমন: হিসাববিজ্ঞান বা অর্থনীতি"
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                autoFocus
              />
              <div className="fs-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddSub(false)}>
                  বাতিল
                </button>
                <button type="submit" className="btn-submit">
                  যুক্ত করো
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
