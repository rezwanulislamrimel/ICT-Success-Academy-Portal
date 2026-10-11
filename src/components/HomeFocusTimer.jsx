import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  startAmbientSound,
  stopAmbientSound,
  setAmbientVolume,
  playAlertChime,
} from "../utils/focusAudio.js";
import {
  formatTime,
  calculateUserRank,
  getUserBadge,
  calculateElapsedSeconds,
  calculateSessionStats,
  TOTAL_ACADEMY_STUDENTS,
} from "../utils/focusHelpers.js";
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

export default function HomeFocusTimer() {
  // Timer States
  const [selectedSubject, setSelectedSubject] = useState(STUDY_SUBJECTS[0].id);
  const [timerMode, setTimerMode] = useState("stopwatch"); // 'stopwatch' | 'countdown-60' | 'countdown-25'
  const [targetMinutes, setTargetMinutes] = useState(60);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [soundMode, setSoundMode] = useState("none"); // 'none' | 'rain' | 'binaural' | 'waves'
  const [volume, setVolume] = useState(0.6);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // In-app Notification and Confirmation Modal States
  const [toast, setToast] = useState(null); // { icon, title, message }
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelElapsed, setCancelElapsed] = useState(0);

  // Motivational Quote Rotation
  const [quoteIndex, setQuoteIndex] = useState(() =>
    Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  );

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  // Auto-dismiss in-app toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Accidental Page Leave / Navigation Warning when study session is running
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isRunning) {
        e.preventDefault();
        e.returnValue = "আপনার একটি স্টাডি সেশন চলমান রয়েছে। আপনি কি নিশ্চিত যে পেজটি ছাড়তে চান?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isRunning]);

  // Sessions from localStorage (Only genuine user sessions)
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem("ict_focus_sessions");
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (_) {
      return [];
    }
  });

  // Calculate User Stats cleanly using focusHelpers
  const sessionStats = calculateSessionStats(sessions);
  const { totalHours: userTotalHours, studyPoints: userStudyPoints, currentUserRank } = sessionStats;

  // Countdown Progress Percentage
  const totalTargetSec = targetMinutes * 60;
  const countdownProgressPct =
    timerMode !== "stopwatch" && totalTargetSec > 0
      ? Math.min(100, Math.max(0, ((totalTargetSec - seconds) / totalTargetSec) * 100))
      : 0;

  // Sync sessions across tabs and pages in real-time
  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const saved = localStorage.getItem("ict_focus_sessions");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setSessions(parsed);
        }
      } catch (_) {}
    };
    window.addEventListener("focus-sessions-updated", handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate);
    return () => {
      window.removeEventListener("focus-sessions-updated", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

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
              playAlertChime();
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

  // Ambient Sound Controller using focusAudio utility
  const handleSelectSound = (mode) => {
    if (soundMode === mode) {
      setSoundMode("none");
      stopAmbientSound();
    } else {
      setSoundMode(mode);
      if (mode === "none") {
        stopAmbientSound();
      } else {
        startAmbientSound(mode, volume);
      }
    }
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    setAmbientVolume(newVol);
  };

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

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
    const safeMins = Math.max(1, Math.round(Number(minutesRead) || 0));
    if (safeMins <= 0) return;
    const newSession = {
      id: "s_" + Date.now(),
      subjectId: selectedSubject,
      minutes: safeMins,
      date: new Date().toISOString(),
      timestamp: Date.now(),
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    try {
      localStorage.setItem("ict_focus_sessions", JSON.stringify(updated));
      window.dispatchEvent(new Event("focus-sessions-updated"));
    } catch (_) {}
  };

  // Stop & Save Button with accurate elapsed time calculation and in-app feedback
  const handleStopAndSave = () => {
    const elapsedSec = calculateElapsedSeconds(timerMode, seconds, targetMinutes);
    if (elapsedSec < 30) {
      setCancelElapsed(elapsedSec);
      setShowCancelConfirm(true);
      return;
    }
    const minsRead = elapsedSec / 60;
    const safeMins = Math.round(minsRead);
    setIsRunning(false);
    setSeconds(timerMode === "stopwatch" ? 0 : targetMinutes * 60);
    handleSessionComplete(minsRead);
    playAlertChime();
    setToast({
      icon: "🎉",
      title: "দারুণ অর্জন! সেশন সেভ হয়েছে",
      message: `${safeMins} মিনিটের নিবিড় পড়ার সেশন সফলভাবে যুক্ত হয়েছে (+${Math.round(safeMins * 1.5)} pts)`,
    });
  };

  const confirmCancelSession = () => {
    setIsRunning(false);
    setSeconds(timerMode === "stopwatch" ? 0 : targetMinutes * 60);
    setShowCancelConfirm(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerMode === "stopwatch") {
      setSeconds(0);
    } else {
      setSeconds(targetMinutes * 60);
    }
  };

  const activeSub = STUDY_SUBJECTS.find((s) => s.id === selectedSubject) || STUDY_SUBJECTS[0];

  return (
    <div className="hft-container">
      {/* ── In-App Celebratory Toast Notification ── */}
      {toast && (
        <div className="hft-toast-banner" role="alert">
          <div className="hft-toast-icon">{toast.icon || "🎉"}</div>
          <div className="hft-toast-info">
            <h4 className="hft-toast-title">{toast.title}</h4>
            <p className="hft-toast-msg">{toast.message}</p>
          </div>
          <button
            type="button"
            className="hft-toast-close"
            onClick={() => setToast(null)}
            title="বন্ধ করুন"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── In-App Under 30s Confirmation Modal ── */}
      {showCancelConfirm && (
        <div className="hft-modal-overlay">
          <div className="hft-confirm-dialog">
            <div className="hft-dialog-icon">⚠️</div>
            <h3 className="hft-dialog-title">পড়ার সময় ১ মিনিটের কম</h3>
            <p className="hft-dialog-desc">
              আপনি মাত্র {cancelElapsed} সেকেন্ড পড়েছেন। আপনি কি এই সেশনটি বাতিল করতে চান, নাকি পড়া অব্যাহত রাখবেন?
            </p>
            <div className="hft-dialog-actions">
              <button
                type="button"
                className="hft-dialog-btn-cancel"
                onClick={confirmCancelSession}
              >
                🗑️ সেশন বাতিল করো
              </button>
              <button
                type="button"
                className="hft-dialog-btn-continue"
                onClick={() => setShowCancelConfirm(false)}
              >
                ▶️ পড়া চালিয়ে যাও
              </button>
            </div>
          </div>
        </div>
      )}

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

        {/* Central Glowing Digital Clock with Circular Progress Arc */}
        <div className={`hft-clock-wrap ${isRunning ? "running" : ""} ${timerMode !== "stopwatch" ? "countdown" : ""}`}>
          {timerMode !== "stopwatch" ? (
            <div className="hft-ring-container">
              <svg className="hft-ring-svg" viewBox="0 0 180 180">
                <circle className="hft-ring-bg" cx="90" cy="90" r="78" />
                <circle
                  className="hft-ring-progress"
                  cx="90"
                  cy="90"
                  r="78"
                  style={{
                    strokeDasharray: 490.09,
                    strokeDashoffset: 490.09 * (1 - countdownProgressPct / 100),
                  }}
                />
              </svg>
              <div className="hft-ring-center">
                <div className="hft-time-text">{formatTime(seconds)}</div>
                <div className="hft-clock-sub">
                  {activeSub.icon} <strong>{activeSub.name}</strong> • {Math.round(countdownProgressPct)}% সম্পন্ন
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="hft-time-text">{formatTime(seconds)}</div>
              <div className="hft-clock-sub">
                {activeSub.icon} <strong>{activeSub.name}</strong> • লাইভ স্টপওয়াচ
              </div>
            </>
          )}
        </div>

        {/* Sound & Fullscreen controls */}
        <div className="hft-sound-row">
          <div className="hft-sound-pills">
            <button
              type="button"
              className={`hft-snd-btn ${soundMode === "none" ? "active" : ""}`}
              onClick={() => handleSelectSound("none")}
              title="সাউন্ড বন্ধ"
            >
              🔇 বন্ধ
            </button>
            <button
              type="button"
              className={`hft-snd-btn ${soundMode === "rain" ? "active" : ""}`}
              onClick={() => handleSelectSound("rain")}
              title="বৃষ্টির শান্ত শব্দ"
            >
              <span>🌧️ বৃষ্টি</span>
              {soundMode === "rain" && (
                <span className="hft-eq" aria-hidden="true">
                  <span className="hft-eq-bar"></span>
                  <span className="hft-eq-bar"></span>
                  <span className="hft-eq-bar"></span>
                </span>
              )}
            </button>
            <button
              type="button"
              className={`hft-snd-btn ${soundMode === "binaural" ? "active" : ""}`}
              onClick={() => handleSelectSound("binaural")}
              title="১০ Hz আলফা ফোকাস বাইনোরাল টোন"
            >
              <span>🎧 ফোকাস</span>
              {soundMode === "binaural" && (
                <span className="hft-eq" aria-hidden="true">
                  <span className="hft-eq-bar"></span>
                  <span className="hft-eq-bar"></span>
                  <span className="hft-eq-bar"></span>
                </span>
              )}
            </button>
            <button
              type="button"
              className={`hft-snd-btn ${soundMode === "waves" ? "active" : ""}`}
              onClick={() => handleSelectSound("waves")}
              title="শান্ত নদীর ঢেউ ও বাতাস"
            >
              <span>🌊 ঢেউ</span>
              {soundMode === "waves" && (
                <span className="hft-eq" aria-hidden="true">
                  <span className="hft-eq-bar"></span>
                  <span className="hft-eq-bar"></span>
                  <span className="hft-eq-bar"></span>
                </span>
              )}
            </button>
          </div>

          <button type="button" className="hft-zen-btn" onClick={toggleFullscreen}>
            ⛶ ফুলস্ক্রিন জেন
          </button>
        </div>

        {/* Volume Slider with smooth transition (zero-CLS) */}
        <div className={`hft-volume-bar ${soundMode !== "none" ? "visible" : ""}`}>
          <span className="hft-vol-label">🔊 সাউন্ড ভলিউম:</span>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="hft-vol-slider"
          />
          <span className="hft-vol-val">{Math.round(volume * 100)}%</span>
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
          <div className="hft-kpi-card hft-card-amber">
            <div className="hft-kpi-top">
              <span>🏆</span>
              <span>একাডেমি র‍্যাঙ্ক</span>
            </div>
            <div className="hft-kpi-val hft-val-amber">
              #{currentUserRank} তম
            </div>
          </div>

          <div className="hft-kpi-card hft-card-green">
            <div className="hft-kpi-top">
              <span>⏳</span>
              <span>মোট পড়ার সময়</span>
            </div>
            <div className="hft-kpi-val hft-val-green">
              {userTotalHours} ঘণ্টা
            </div>
          </div>

          <div className="hft-kpi-card hft-card-cyan">
            <div className="hft-kpi-top">
              <span>🎯</span>
              <span>অর্জিত পয়েন্ট</span>
            </div>
            <div className="hft-kpi-val hft-val-cyan">
              {userStudyPoints} pts
            </div>
          </div>

          <div className="hft-kpi-card hft-card-purple">
            <div className="hft-kpi-top">
              <span>⭐</span>
              <span>বর্তমান লিগ</span>
            </div>
            <div className="hft-kpi-val hft-val-purple" style={{ fontSize: "15px" }}>
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
