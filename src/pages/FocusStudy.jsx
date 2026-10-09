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
  "প্রতিটি সেকেন্ডের গভীর মনোযোগ তোমার A+ এর পথ সুগম করবে। 🎯",
  "কঠিন পরিশ্রম কখনো বৃথা যায় না; সাফল্য তোমার পদচুম্বন করবেই। 🏆",
  "লক্ষ্য স্থির রাখো, মনোযোগ ধরে রাখো, বিজয় সুনিশ্চিত! 🚀",
  "আজকের এক ঘণ্টার ত্যাগ আগামী দিনের সেরা সাফল্যের ভিত্তি। ✨",
  "স্মার্ট প্রস্তুতিই এনে দেবে কাঙ্ক্ষিত সেরা ফলাফল। 💡",
];

// ── Demo Competitors on Leaderboard (Scores calculated in Study Points) ──
const DEMO_LEADERBOARD = [
  { id: "st1", name: "তানভীর হাসান", institute: "নটর ডেম কলেজ, ঢাকা", points: 960, hours: 16.0, badge: "💎 ডায়মন্ড লিগ", avatar: "👨‍🎓" },
  { id: "st2", name: "নুসরাত জাহান", institute: "ভিকারুননিসা নূন স্কুল ও কলেজ", points: 910, hours: 15.2, badge: "💎 ডায়মন্ড লিগ", avatar: "👩‍🎓" },
  { id: "st3", name: "সাকিব আল হাসান", institute: "ঢাকা রেসিডেনসিয়াল মডেল কলেজ", points: 860, hours: 14.3, badge: "💎 ডায়মন্ড লিগ", avatar: "👨‍🎓" },
  { id: "st4", name: "মেহজাবিন চৌধুরী", institute: "রাজউক উত্তরা মডেল কলেজ", points: 820, hours: 13.6, badge: "💎 ডায়মন্ড লিগ", avatar: "👩‍🎓" },
  { id: "st5", name: "মাহমুদুল হাসান সিয়াম", institute: "ঢাকা কলেজ", points: 780, hours: 13.0, badge: "💎 ডায়মন্ড লিগ", avatar: "👨‍🎓" },
  { id: "st6", name: "আফরিন সুলতানা", institute: "হলি ক্রস কলেজ, ঢাকা", points: 740, hours: 12.3, badge: "🥇 গোল্ড লিগ", avatar: "👩‍🎓" },
  { id: "st7", name: "আরিফুল ইসলাম", institute: "দিনাজপুর সরকারি কলেজ", points: 710, hours: 11.8, badge: "🥇 গোল্ড লিগ", avatar: "👨‍🎓" },
  { id: "st8", name: "ফারজানা আক্তার", institute: "চট্টগ্রাম কলেজ", points: 680, hours: 11.3, badge: "🥇 গোল্ড লিগ", avatar: "👩‍🎓" },
  { id: "st9", name: "রাকিবুল করিম", institute: "সিলেট এমসি কলেজ", points: 650, hours: 10.8, badge: "🥇 গোল্ড লিগ", avatar: "👨‍🎓" },
  { id: "st10", name: "নাফিসা তাসনিম", institute: "রাজশাহী কলেজ", points: 620, hours: 10.3, badge: "🥇 গোল্ড লিগ", avatar: "👩‍🎓" },
  { id: "st11", name: "তাহমিদ জামান", institute: "সেন্ট জোসেফ উচ্চ মাধ্যমিক বিদ্যালয়", points: 590, hours: 9.8, badge: "🥇 গোল্ড লিগ", avatar: "👨‍🎓" },
  { id: "st12", name: "সাদিয়া ইসলাম মিলি", institute: "কুমিল্লা ভিক্টোরিয়া সরকারি কলেজ", points: 560, hours: 9.3, badge: "🥇 গোল্ড লিগ", avatar: "👩‍🎓" },
  { id: "st13", name: "আব্দুল্লাহ আল নোমান", institute: "সরকারি বিজ্ঞান কলেজ, ঢাকা", points: 530, hours: 8.8, badge: "🥈 সিলভার লিগ", avatar: "👨‍🎓" },
  { id: "st14", name: "সুমাইয়া জাহান", institute: "আদমজী ক্যান্টনমেন্ট কলেজ", points: 500, hours: 8.3, badge: "🥈 সিলভার লিগ", avatar: "👩‍🎓" },
  { id: "st15", name: "রিফাত বিন আলম", institute: "বরিশাল ব্রজমোহন (বিএম) কলেজ", points: 480, hours: 8.0, badge: "🥈 সিলভার লিগ", avatar: "👨‍🎓" },
  { id: "st16", name: "জান্নাতুল ফেরদৌস", institute: "ময়মনসিংহ জিলা স্কুল ও কলেজ", points: 460, hours: 7.6, badge: "🥈 সিলভার লিগ", avatar: "👩‍🎓" },
  { id: "st17", name: "ফাহিম মুনতাসির", institute: "রংপুর সরকারি কলেজ", points: 440, hours: 7.3, badge: "🥈 সিলভার লিগ", avatar: "👨‍🎓" },
  { id: "st18", name: "আনিকা তাহসিন", institute: "বীরশ্রেষ্ঠ নূর মোহাম্মদ পাবলিক কলেজ", points: 420, hours: 7.0, badge: "🥈 সিলভার লিগ", avatar: "👩‍🎓" },
  { id: "st19", name: "জুবায়ের হোসেন", institute: "সরকারি আজিজুল হক কলেজ, বগুড়া", points: 400, hours: 6.6, badge: "🥈 সিলভার লিগ", avatar: "👨‍🎓" },
  { id: "st20", name: "মারিয়া হক", institute: "কুষ্টিয়া সরকারি কলেজ", points: 380, hours: 6.3, badge: "🥈 সিলভার লিগ", avatar: "👩‍🎓" },
  { id: "st21", name: "শাহরিয়ার নাফিস", institute: "ক্যান্টনমেন্ট পাবলিক স্কুল ও কলেজ, রংপুর", points: 360, hours: 6.0, badge: "🥉 ব্রোঞ্জ লিগ", avatar: "👨‍🎓" },
  { id: "st22", name: "ইশরাত জাহান", institute: "ফেনী সরকারি কলেজ", points: 340, hours: 5.6, badge: "🥉 ব্রোঞ্জ লিগ", avatar: "👩‍🎓" },
  { id: "st23", name: "তৌসিফ আহমেদ", institute: "যশোর সরকারি সিটি কলেজ", points: 320, hours: 5.3, badge: "🥉 ব্রোঞ্জ লিগ", avatar: "👨‍🎓" },
  { id: "st24", name: "তানিয়া সুলতানা", institute: "গাজীপুর ভাওয়াল বদরে আলম সরকারি কলেজ", points: 300, hours: 5.0, badge: "🥉 ব্রোঞ্জ লিগ", avatar: "👩‍🎓" },
  { id: "st25", name: "আশরাফুল ইসলাম", institute: "পাবনা এডওয়ার্ড কলেজ", points: 280, hours: 4.6, badge: "🥉 ব্রোঞ্জ লিগ", avatar: "👨‍🎓" },
  { id: "st26", name: "মুনতাহা কবির", institute: "নোয়াখালী সরকারি কলেজ", points: 260, hours: 4.3, badge: "🥉 ব্রোঞ্জ লিগ", avatar: "👩‍🎓" },
  { id: "st27", name: "শামীম রেজা", institute: "টাঙ্গাইল সরকারি সা’দত কলেজ", points: 240, hours: 4.0, badge: "🥉 ব্রোঞ্জ লিগ", avatar: "👨‍🎓" },
  { id: "st28", name: "লামিয়া চৌধুরী", institute: "সুনামগঞ্জ সরকারি কলেজ", points: 220, hours: 3.6, badge: "🥉 ব্রোঞ্জ লিগ", avatar: "👩‍🎓" },
  { id: "st29", name: "আবির মাহমুদ", institute: "মাদারীপুর সরকারি নাজিমউদ্দিন কলেজ", points: 200, hours: 3.3, badge: "🥉 ব্রোঞ্জ লিগ", avatar: "👨‍🎓" },
  { id: "st30", name: "ফারিহা নওরীন", institute: "ব্রাহ্মণবাড়িয়া সরকারি কলেজ", points: 180, hours: 3.0, badge: "🥉 ব্রোঞ্জ লিগ", avatar: "👩‍🎓" },
  { id: "st31", name: "হাসান জামীল", institute: "জামালপুর সরকারি আশেক মাহমুদ কলেজ", points: 160, hours: 2.6, badge: "🥉 ব্রোঞ্জ লিগ", avatar: "👨‍🎓" },
  { id: "st32", name: "সাবরিনা ইয়াসমিন", institute: "পটুয়াখালী সরকারি কলেজ", points: 140, hours: 2.3, badge: "🥉 ব্রোঞ্জ লিগ", avatar: "👩‍🎓" },
];

export default function FocusStudy() {
  // User Profile
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ictUser")) || { name: "আমার প্রোফাইল", mobile: "০১৭xxxxxxxx", institute: "HSC শিক্ষার্থী" };
    } catch (_) {
      return { name: "আমার প্রোফাইল", mobile: "০১৭xxxxxxxx", institute: "HSC শিক্ষার্থী" };
    }
  });

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

  // Sessions History
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem("ict_focus_sessions");
      if (saved) return JSON.parse(saved);
      // Demo Initial Past Sessions for Instant Visual Delight
      const now = new Date();
      return [
        { id: "s1", subjectId: "ict", minutes: 90, date: new Date(now.getTime() - 86400000 * 1).toISOString(), timestamp: Date.now() - 86400000 * 1 },
        { id: "s2", subjectId: "physics", minutes: 60, date: new Date(now.getTime() - 86400000 * 2).toISOString(), timestamp: Date.now() - 86400000 * 2 },
        { id: "s3", subjectId: "math", minutes: 120, date: new Date(now.getTime() - 86400000 * 3).toISOString(), timestamp: Date.now() - 86400000 * 3 },
        { id: "s4", subjectId: "english", minutes: 45, date: new Date(now.getTime() - 86400000 * 4).toISOString(), timestamp: Date.now() - 86400000 * 4 },
        { id: "s5", subjectId: "ict", minutes: 80, date: new Date(now.getTime() - 86400000 * 5).toISOString(), timestamp: Date.now() - 86400000 * 5 },
      ];
    } catch (_) {
      return [];
    }
  });

  // Custom Subject Modal/Input
  const [newSubName, setNewSubName] = useState("");
  const [showAddSub, setShowAddSub] = useState(false);

  // Leaderboard Filter & Search States
  const [leagueFilter, setLeagueFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(15);

  // Motivational Quote Rotation
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    const qInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 12000);
    return () => clearInterval(qInterval);
  }, []);

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
    return "🥉 ব্রোঞ্জ লিগ (Active)";
  };

  // Dynamic Leaderboard merging current user
  const fullLeaderboard = [
    ...DEMO_LEADERBOARD,
    {
      id: "my_user",
      name: user.name || "আমার প্রোফাইল",
      institute: user.institute || "HSC শিক্ষার্থী",
      points: userStudyPoints,
      hours: parseFloat(userTotalHours),
      badge: getUserBadge(userStudyPoints),
      avatar: "🌟",
      isCurrentUser: true,
    },
  ].sort((a, b) => b.points - a.points);

  const currentUserRank = fullLeaderboard.findIndex((item) => item.isCurrentUser) + 1;
  const TOTAL_ACADEMY_STUDENTS = 312;

  // Filtered leaderboard based on search and league
  const filteredLeaderboard = fullLeaderboard.filter((item) => {
    const matchesLeague =
      leagueFilter === "all" ||
      (leagueFilter === "diamond" && item.badge.includes("ডায়মন্ড")) ||
      (leagueFilter === "gold" && item.badge.includes("গোল্ড")) ||
      (leagueFilter === "silver" && item.badge.includes("সিলভার")) ||
      (leagueFilter === "bronze" && item.badge.includes("ব্রোঞ্জ"));

    const matchesSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.institute.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLeague && matchesSearch;
  });

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

            {/* Motivational Live Quote */}
            <div className="fs-quote-card">
              <span className="fs-quote-icon">❝</span>
              <p className="fs-quote-text">{MOTIVATIONAL_QUOTES[quoteIndex]}</p>
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
              {userStudyPoints >= 600 ? "A+" : userStudyPoints >= 400 ? "A" : "B+"}
            </div>
            <div className="grade-info">
              <h3>তোমার মাসিক স্টাডি গ্রেড: {userStudyPoints >= 600 ? "A+ (অসাধারণ নিয়মানুবর্তিতা)" : "A (চমৎকার অগ্রগতি)"}</h3>
              <p>
                তুমি নিয়মিত পড়াশোনা করছো! প্রতিদিন মাত্র ৩০ মিনিট বেশি সময় দিলে তুমি পরবর্তী লিগে শীর্ষ স্থান অধিকার করতে পারবে।
              </p>
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
                  {sessions.slice(0, 10).map((s) => {
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
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          TAB 4: LEADERBOARD WITH PRIVACY (লিডারবোর্ড)
         ═══════════════════════════════════════════════ */}
      {activeTab === "leaderboard" && !isFullscreen && (
        <div className="wrap fs-report-view">
          <div className="fs-report-header-card">
            <div>
              <h2>🏆 শিক্ষার্থী স্টাডি লিডারবোর্ড</h2>
              <p>একাডেমির সকল শিক্ষার্থীর পড়ার ধারাবাহিকতা ও অবস্থান (ব্যক্তিগত পড়ার সময়ের গোপনীয়তা সংরক্ষিত):</p>
            </div>
            <div className="fs-my-rank-chip">
              <span>তোমার অবস্থান: #{currentUserRank} / {TOTAL_ACADEMY_STUDENTS} জন</span>
            </div>
          </div>

          {/* Privacy Notice Banner */}
          <div className="fs-privacy-notice">
            <span className="lock-icon">🔒</span>
            <p>
              <strong>প্রাইভেসি প্রোটেকশন:</strong> তোমার ব্যক্তিগত পড়ার নিখুঁত সময় বা ব্যক্তিগত ডায়েরি অন্য কেউ দেখতে পাবে না। পড়ার নিয়মিত অনুশীলনের ওপর ভিত্তি করে শুধুমাত্র স্টাডি পয়েন্ট ও লিগ র‍্যাঙ্কিং প্রদর্শিত হয়।
            </p>
          </div>

          {/* Current User Standings Card */}
          <div className="fs-user-standings-card">
            <div className="standings-left">
              <span className="standings-avatar">🌟</span>
              <div>
                <h4 className="standings-name">{user.name || "আমার প্রোফাইল"}</h4>
                <p className="standings-inst">{user.institute || "HSC শিক্ষার্থী"}</p>
              </div>
            </div>
            <div className="standings-right">
              <div className="standings-stat">
                <span className="st-lbl">বর্তমান র‍্যাঙ্ক</span>
                <span className="st-val">#{currentUserRank} তম</span>
              </div>
              <div className="standings-stat">
                <span className="st-lbl">বর্তমান লিগ</span>
                <span className="st-val league">{getUserBadge(userStudyPoints).split(" ")[0]} {getUserBadge(userStudyPoints).split(" ")[1]}</span>
              </div>
              <div className="standings-stat">
                <span className="st-lbl">স্টাডি পয়েন্ট</span>
                <span className="st-val pts">{userStudyPoints} pts</span>
              </div>
            </div>
          </div>

          {/* Search & League Filter Bar */}
          <div className="fs-leaderboard-filters-card">
            <div className="lb-search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="lb-search-input"
                placeholder="শিক্ষার্থীর নাম বা কলেজের নাম দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
                  ✕
                </button>
              )}
            </div>

            <div className="lb-league-chips">
              <button
                className={`lb-chip ${leagueFilter === "all" ? "active" : ""}`}
                onClick={() => setLeagueFilter("all")}
              >
                সকল শিক্ষার্থী ({fullLeaderboard.length})
              </button>
              <button
                className={`lb-chip ${leagueFilter === "diamond" ? "active" : ""}`}
                onClick={() => setLeagueFilter("diamond")}
              >
                💎 ডায়মন্ড লিগ ({fullLeaderboard.filter((x) => x.badge.includes("ডায়মন্ড")).length})
              </button>
              <button
                className={`lb-chip ${leagueFilter === "gold" ? "active" : ""}`}
                onClick={() => setLeagueFilter("gold")}
              >
                🥇 গোল্ড লিগ ({fullLeaderboard.filter((x) => x.badge.includes("গোল্ড")).length})
              </button>
              <button
                className={`lb-chip ${leagueFilter === "silver" ? "active" : ""}`}
                onClick={() => setLeagueFilter("silver")}
              >
                🥈 সিলভার লিগ ({fullLeaderboard.filter((x) => x.badge.includes("সিলভার")).length})
              </button>
              <button
                className={`lb-chip ${leagueFilter === "bronze" ? "active" : ""}`}
                onClick={() => setLeagueFilter("bronze")}
              >
                🥉 ব্রোঞ্জ লিগ ({fullLeaderboard.filter((x) => x.badge.includes("ব্রোঞ্জ")).length})
              </button>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="fs-leaderboard-card">
            <div style={{ overflowX: "auto" }}>
              <table className="fs-table">
                <thead>
                  <tr>
                    <th>র‍্যাঙ্ক</th>
                    <th>শিক্ষার্থীর নাম</th>
                    <th>প্রতিষ্ঠান</th>
                    <th>লিগ স্তর</th>
                    <th>স্টাডি পয়েন্ট</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaderboard.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "var(--muted)" }}>
                        কোনো শিক্ষার্থী পাওয়া যায়নি। অন্য নাম দিয়ে সার্চ করুন।
                      </td>
                    </tr>
                  ) : (
                    filteredLeaderboard.slice(0, visibleCount).map((item) => {
                      const overallIndex = fullLeaderboard.findIndex((x) => x.id === item.id);
                      return (
                        <tr
                          key={item.id}
                          className={item.isCurrentUser ? "current-user-row" : ""}
                        >
                          <td>
                            <span className={`rank-badge rank-${overallIndex + 1}`}>
                              {overallIndex === 0 ? "🥇 ১" : overallIndex === 1 ? "🥈 ২" : overallIndex === 2 ? "🥉 ৩" : `${overallIndex + 1}`}
                            </span>
                          </td>
                          <td>
                            <div className="user-profile-cell">
                              <span className="user-avatar">{item.avatar}</span>
                              <span className="user-name">
                                {item.name} {item.isCurrentUser && <span className="you-tag">(তুমি)</span>}
                              </span>
                            </div>
                          </td>
                          <td className="user-inst">{item.institute}</td>
                          <td>
                            <span className="league-pill">{item.badge}</span>
                          </td>
                          <td>
                            <span className="score-val">{item.points} pts</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / Load More Controls */}
            {filteredLeaderboard.length > visibleCount && (
              <div className="lb-load-more-row">
                <button
                  className="lb-load-more-btn"
                  onClick={() => setVisibleCount((prev) => prev + 15)}
                >
                  ⬇️ আরও শিক্ষার্থী দেখুন (বাকি {filteredLeaderboard.length - visibleCount} জন)
                </button>
                <button
                  className="lb-show-all-btn"
                  onClick={() => setVisibleCount(filteredLeaderboard.length)}
                >
                  সব শিক্ষার্থী দেখুন ({filteredLeaderboard.length} জন)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          TAB 5: ADMIN PANEL REPORT (অ্যাডমিন ভিউ)
         ═══════════════════════════════════════════════ */}
      {activeTab === "admin" && !isFullscreen && (
        <div className="wrap fs-report-view">
          <div className="fs-report-header-card admin-header">
            <div>
              <h2>🛡️ অ্যাডমিন স্টাডি অ্যানালিটিক্স প্যানেল</h2>
              <p>সকল শিক্ষার্থীর পড়ার সময়, সক্রিয়তা ও বিষয়ভিত্তিক সম্পৃক্ততা পর্যবেক্ষণ করুন:</p>
            </div>
            <div className="admin-status-pill">
              <span>Admin Access: Active 🟢</span>
            </div>
          </div>

          {/* Admin Stats Overview */}
          <div className="fs-kpi-grid">
            <div className="kpi-card">
              <span className="kpi-icon">👥</span>
              <span className="kpi-num">{fullLeaderboard.length}</span>
              <span className="kpi-label">মোট শিক্ষার্থী</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-icon">📚</span>
              <span className="kpi-num">{(fullLeaderboard.reduce((a, b) => a + b.hours, 0)).toFixed(1)} ঘণ্টা</span>
              <span className="kpi-label">একাডেমির মোট পড়ার সময়</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-icon">💻</span>
              <span className="kpi-num">HSC ICT</span>
              <span className="kpi-label">সর্বাধিক পঠিত বিষয়</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-icon">📈</span>
              <span className="kpi-num">৮৪%</span>
              <span className="kpi-label">ধারাবাহিক অংশগ্রহণ</span>
            </div>
          </div>

          {/* Detailed Admin Table */}
          <div className="fs-history-table-card">
            <h3>📑 শিক্ষার্থী অনুযায়ী স্টাডি ডাটা ও সময় পর্যালোচনা</h3>
            <div style={{ overflowX: "auto" }}>
              <table className="fs-table">
                <thead>
                  <tr>
                    <th>আইডি</th>
                    <th>শিক্ষার্থীর নাম</th>
                    <th>কলেজ / প্রতিষ্ঠান</th>
                    <th>মোট পড়ার সময়</th>
                    <th>স্টাডি পয়েন্ট</th>
                    <th>স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody>
                  {fullLeaderboard.map((st, i) => (
                    <tr key={st.id}>
                      <td>#STU-0{i + 1}</td>
                      <td><strong>{st.name}</strong></td>
                      <td>{st.institute}</td>
                      <td><span className="hours-chip">{st.hours} ঘণ্টা</span></td>
                      <td>{st.points} pts</td>
                      <td><span className="active-badge">সক্রিয় 🟢</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
