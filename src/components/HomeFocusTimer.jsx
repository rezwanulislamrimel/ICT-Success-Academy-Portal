import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./HomeFocusTimer.css";

// ── Default Subjects ──
const STUDY_SUBJECTS = [
  { id: "ict", name: "HSC ICT", icon: "💻", color: "#10b981" },
  { id: "bangla", name: "বাংলা", icon: "📖", color: "#f59e0b" },
  { id: "english", name: "ইংরেজি", icon: "🇬🇧", color: "#3b82f6" },
  { id: "physics", name: "পদার্থবিজ্ঞান", icon: "⚛️", color: "#8b5cf6" },
  { id: "chemistry", name: "রসায়ন", icon: "🧪", color: "#ec4899" },
  { id: "math", name: "উচ্চতর গণিত", icon: "📐", color: "#06b6d4" },
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

const TOTAL_ACADEMY_STUDENTS = 350;

export default function HomeFocusTimer() {
  // Timer States
  const [selectedSubject, setSelectedSubject] = useState(STUDY_SUBJECTS[0].id);
  const [timerMode, setTimerMode] = useState("stopwatch"); // 'stopwatch' | 'countdown-60' | 'countdown-25'
  const [targetMinutes, setTargetMinutes] = useState(60);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [soundMode, setSoundMode] = useState("none"); // 'none' | 'rain' | 'binaural'
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Motivational Quote Rotation
  const [quoteIndex, setQuoteIndex] = useState(() =>
    Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  );

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  // Sessions from localStorage (Only genuine user sessions)
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem("ict_focus_sessions");
      if (saved) {
        return JSON.parse(saved).filter((s) => s.id && s.id.startsWith("s_"));
      }
      return [];
    } catch (_) {
      return [];
    }
  });

  // Calculate User Stats
  const totalMinutesAll = sessions.reduce((acc, s) => acc + (s.minutes || 0), 0);
  const userTotalHours = (totalMinutesAll / 60).toFixed(1);
  const userStudyPoints = Math.round(totalMinutesAll * 1.5);

  const getUserBadge = (pts) => {
    if (pts >= 800) return "💎 ডায়মন্ড লিগ";
    if (pts >= 500) return "🥇 গোল্ড লিগ";
    if (pts >= 250) return "🥈 সিলভার লিগ";
    if (pts > 0) return "🥉 ব্রোঞ্জ লিগ";
    return "🌱 নতুন লার্নার";
  };

  const calculateUserRank = (pts) => {
    if (pts >= 1200) return 1;
    if (pts >= 900) return Math.max(2, Math.round(15 - (pts - 900) / 25));
    if (pts >= 600) return Math.max(16, Math.round(50 - (pts - 600) / 10));
    if (pts >= 300) return Math.max(51, Math.round(150 - (pts - 300) / 3));
    if (pts > 0) return Math.max(151, Math.round(300 - pts));
    return 320;
  };
  const currentUserRank = calculateUserRank(userStudyPoints);

  // Timer Tick Hook
  const timerRef = useRef(null);
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (timerMode !== "stopwatch") {
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

  // Audio Ambient Synthesizer using Web Audio API
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

  // Mode Switchers
  const handleSetMode = (mode) => {
    setIsRunning(false);
    setTimerMode(mode);
    if (mode === "stopwatch") {
      setSeconds(0);
    } else if (mode === "countdown-60") {
      setTargetMinutes(60);
      setSeconds(60 * 60);
    } else if (mode === "countdown-25") {
      setTargetMinutes(25);
      setSeconds(25 * 60);
    }
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

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
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

  // Stop & Save Button
  const handleStopAndSave = () => {
    if (seconds <= 30 && timerMode === "stopwatch") {
      if (!window.confirm("পড়ার সময় ১ মিনিটের কম। আপনি কি সেশনটি বাতিল করতে চান?")) return;
      setIsRunning(false);
      setSeconds(0);
      return;
    }
    const minsRead =
      timerMode !== "stopwatch"
        ? (targetMinutes * 60 - seconds) / 60
        : seconds / 60;

    setIsRunning(false);
    setSeconds(timerMode === "stopwatch" ? 0 : targetMinutes * 60);
    handleSessionComplete(minsRead);
    alert(`🎉 দারুণ! আপনার ${Math.round(minsRead)} মিনিটের পড়ার সেশন সফলভাবে সেভ হয়েছে!`);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerMode === "stopwatch") {
      setSeconds(0);
    } else {
      setSeconds(targetMinutes * 60);
    }
  };

  // Format Time Helper
  const formatTime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const activeSub = STUDY_SUBJECTS.find((s) => s.id === selectedSubject) || STUDY_SUBJECTS[0];

  return (
    <div className="hft-container">
      {/* ── Zen Fullscreen Overlay ── */}
      {isFullscreen && (
        <div className="hft-zen-fullscreen">
          <div className="hft-zen-header">
            <div className="hft-zen-badge">
              <span>{activeSub.icon}</span>
              <span>{activeSub.name} — ফোকাস স্টাডি</span>
            </div>
            <button className="hft-zen-exit" onClick={toggleFullscreen}>
              ✕ ফুলস্ক্রিন বন্ধ
            </button>
          </div>
          <div className="hft-zen-center">
            <span style={{ fontSize: "15px", color: "#10b981", fontWeight: 700, letterSpacing: "1px" }}>
              {isRunning ? "● লাইভ ফোকাস সেশন চলছে" : "○ প্রস্তুত থাকলে শুরু করো"}
            </span>
            <div className="hft-zen-clock">{formatTime(seconds)}</div>
            <div className="hft-zen-controls">
              {!isRunning ? (
                <button className="hft-btn-primary" onClick={() => setIsRunning(true)}>
                  ▶️ শুরু করো
                </button>
              ) : (
                <button className="hft-btn-primary hft-btn-pause" onClick={() => setIsRunning(false)}>
                  ⏸️ পজ
                </button>
              )}
              <button className="hft-btn-secondary" onClick={handleStopAndSave}>
                💾 সেভ করো
              </button>
            </div>
          </div>
          <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
            ❝ {MOTIVATIONAL_QUOTES[quoteIndex]} ❞
          </div>
        </div>
      )}

      {/* ── Left Column: Interactive Timer Panel ── */}
      <div className="hft-timer-panel">
        <div className="hft-top-bar">
          <div className={`hft-status-pill ${isRunning ? "" : "inactive"}`}>
            <span className={isRunning ? "hft-pulse" : ""}></span>
            <span>{isRunning ? "লাইভ স্টাডি মোড অ্যাক্টিভ" : "স্টাডি টাইমার প্রস্তুত"}</span>
          </div>

          {/* Mode Switcher */}
          <div className="hft-mode-switch">
            <button
              type="button"
              className={`hft-mode-btn ${timerMode === "stopwatch" ? "active" : ""}`}
              onClick={() => handleSetMode("stopwatch")}
            >
              ⏱️ স্টপওয়াচ
            </button>
            <button
              type="button"
              className={`hft-mode-btn ${timerMode === "countdown-60" ? "active" : ""}`}
              onClick={() => handleSetMode("countdown-60")}
            >
              ⏳ ১ ঘণ্টা
            </button>
            <button
              type="button"
              className={`hft-mode-btn ${timerMode === "countdown-25" ? "active" : ""}`}
              onClick={() => handleSetMode("countdown-25")}
            >
              🎯 ২৫ মি.
            </button>
          </div>
        </div>

        {/* Subject Chips */}
        <div className="hft-subjects-row">
          <span className="hft-lbl">পড়ার বিষয় বেছে নাও:</span>
          <div className="hft-sub-list">
            {STUDY_SUBJECTS.map((sub) => (
              <button
                key={sub.id}
                type="button"
                className={`hft-sub-chip ${selectedSubject === sub.id ? "active" : ""}`}
                onClick={() => setSelectedSubject(sub.id)}
              >
                <span>{sub.icon}</span>
                <span>{sub.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Central Glowing Digital Clock */}
        <div className={`hft-clock-wrap ${isRunning ? "running" : ""}`}>
          <div className="hft-time-text">{formatTime(seconds)}</div>
          <div className="hft-clock-sub">
            {activeSub.icon} <strong>{activeSub.name}</strong> •{" "}
            {timerMode === "stopwatch"
              ? "লাইভ স্টপওয়াচ"
              : `${targetMinutes} মিনিটের ফোকাস সেশন`}
          </div>
        </div>

        {/* Sound & Fullscreen controls */}
        <div className="hft-sound-row">
          <div className="hft-sound-pills">
            <button
              type="button"
              className={`hft-snd-btn ${soundMode === "none" ? "active" : ""}`}
              onClick={() => setSoundMode("none")}
              title="সাউন্ড বন্ধ"
            >
              🔇 নিঃশব্দ
            </button>
            <button
              type="button"
              className={`hft-snd-btn ${soundMode === "rain" ? "active" : ""}`}
              onClick={() => setSoundMode("rain")}
              title="বৃষ্টির শান্ত শব্দ"
            >
              🌧️ বৃষ্টি
            </button>
            <button
              type="button"
              className={`hft-snd-btn ${soundMode === "binaural" ? "active" : ""}`}
              onClick={() => setSoundMode("binaural")}
              title="ফোকাস বাইনোরাল টোন"
            >
              🎧 ফোকাস
            </button>
          </div>

          <button type="button" className="hft-zen-btn" onClick={toggleFullscreen}>
            ⛶ ফুলস্ক্রিন জেন
          </button>
        </div>

        {/* Action Buttons */}
        <div className="hft-actions-row">
          {!isRunning ? (
            <button type="button" className="hft-btn-primary" onClick={() => setIsRunning(true)}>
              ▶️ পড়া শুরু করো
            </button>
          ) : (
            <button
              type="button"
              className="hft-btn-primary hft-btn-pause"
              onClick={() => setIsRunning(false)}
            >
              ⏸️ সাময়িক বিরতি
            </button>
          )}

          <button
            type="button"
            className="hft-btn-secondary"
            onClick={handleStopAndSave}
            disabled={seconds === 0}
            title="বর্তমান পড়ার সময় সেভ করো"
          >
            💾 সেভ করো
          </button>

          <button
            type="button"
            className="hft-btn-secondary"
            onClick={handleReset}
            disabled={seconds === 0 && !isRunning}
            title="টাইমার রিসেট করো"
          >
            🔄
          </button>
        </div>
      </div>

      {/* ── Right Column: Motivation & Standing Panel ── */}
      <div className="hft-info-panel">
        {/* Live Motivational Quote Card */}
        <div
          className="hft-quote-card"
          onClick={handleNextQuote}
          title="ক্লিক করে আরেকটি অনুপ্রেরণামূলক বাণী দেখুন"
        >
          <span className="hft-quote-icon">❝</span>
          <div className="hft-quote-content">
            <div className="hft-quote-title">আজকের অনুপ্রেরণা (ক্লিক করুন)</div>
            <p className="hft-quote-text">{MOTIVATIONAL_QUOTES[quoteIndex]}</p>
          </div>
          <button
            type="button"
            className="hft-quote-refresh-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleNextQuote();
            }}
            title="নতুন উক্তি দেখুন"
          >
            🔄
          </button>
        </div>

        {/* 2x2 Standing Cards (Admin style) */}
        <div className="hft-kpi-grid">
          <div className="hft-kpi-card" style={{ borderColor: "rgba(245, 158, 11, 0.4)" }}>
            <div className="hft-kpi-top">
              <span>🏆</span>
              <span>একাডেমি র‍্যাঙ্ক</span>
            </div>
            <div className="hft-kpi-val" style={{ color: "#d97706" }}>
              #{currentUserRank} তম
            </div>
          </div>

          <div className="hft-kpi-card" style={{ borderColor: "rgba(16, 185, 129, 0.4)" }}>
            <div className="hft-kpi-top">
              <span>⏳</span>
              <span>মোট পড়ার সময়</span>
            </div>
            <div className="hft-kpi-val" style={{ color: "#10b981" }}>
              {userTotalHours} ঘণ্টা
            </div>
          </div>

          <div className="hft-kpi-card" style={{ borderColor: "rgba(6, 182, 212, 0.4)" }}>
            <div className="hft-kpi-top">
              <span>🎯</span>
              <span>অর্জিত পয়েন্ট</span>
            </div>
            <div className="hft-kpi-val" style={{ color: "#0891b2" }}>
              {userStudyPoints} pts
            </div>
          </div>

          <div className="hft-kpi-card" style={{ borderColor: "rgba(139, 92, 246, 0.4)" }}>
            <div className="hft-kpi-top">
              <span>⭐</span>
              <span>বর্তমান লিগ</span>
            </div>
            <div className="hft-kpi-val" style={{ color: "#7c3aed", fontSize: "15px" }}>
              {getUserBadge(userStudyPoints)}
            </div>
          </div>
        </div>

        {/* Full CTA Card to /focus-study */}
        <div className="hft-cta-card">
          <Link to="/focus-study" className="hft-btn-full">
            <span>⏱️ পূর্ণাঙ্গ স্টাডি ড্যাশবোর্ড ও লিডারবোর্ডে যান</span>
            <span>→</span>
          </Link>
          <div className="hft-privacy-tag">
            <span>🔒</span>
            <span>১০০% প্রাইভেসি সুরক্ষিত • কোনো ডামি ডাটা ছাড়া ব্যক্তিগত ট্র্যাকিং</span>
          </div>
        </div>
      </div>
    </div>
  );
}
