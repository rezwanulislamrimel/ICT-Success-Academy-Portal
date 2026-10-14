import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "./PageMascot.css";

// ── Web Audio Sound for Mascot Reactions ──
function playMascotSound(type = "pop") {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "pop") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === "cheer") {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.3);
      });
    }
  } catch (_) {}
}

const ROUTE_MESSAGES = {
  "/": {
    text: "স্বাগতম! ICT Success Academy তে তোমার HSC ICT প্রস্তুতি শুরু করো 🚀",
    link: "/focus-study",
    linkText: "⏱️ স্টাডি টাইমার",
  },
  "/focus-study": {
    text: "পড়ার টেবিলে গভীর মনোযোগ দাও! টাইমার চালিয়ে পড়তে বসো ⏱️",
    link: "/practice",
    linkText: "📝 কুইজ অনুশীলন",
  },
  "/practice": {
    text: "নিয়মিত MCQ অনুশীলন করো, তোমার দুর্বলতাগুলো দূর হবে! 📝",
    link: "/focus-study",
    linkText: "⏱️ স্টাডি ট্র্যাকার",
  },
  "/courses": {
    text: "আমাদের সাজানো প্রিমিয়াম ICT কোর্সগুলো এক নজরে দেখে নাও! 💡",
    link: "/admission",
    linkText: "🎓 ভর্তি তথ্য",
  },
  "/board-questions": {
    text: "বিগত বছরের বোর্ড প্রশ্ন সমাধান করে পরীক্ষার জন্য শতভাগ প্রস্তুত হও! 🎯",
    link: "/practice",
    linkText: "📝 মডেল টেস্ট",
  },
  "/ai-assistant": {
    text: "যেকোনো জটিল ICT বিষয়ে আমাদের এআই টিউটরকে নির্দ্বিধায় প্রশ্ন করো! 🤖",
    link: "/practice",
    linkText: "💡 প্র্যাকটিস করো",
  },
  "/dashboard": {
    text: "ড্যাশবোর্ডে তোমার পরীক্ষার স্কোর ও পড়ার অগ্রগতি ট্র্যাক করো! 🏆",
    link: "/focus-study",
    linkText: "⏱️ ফোকাস স্টাডি",
  },
  "/lab": {
    text: "প্র্যাকটিক্যাল ও কোডিং ল্যাবে তোমার দক্ষতা সরাসরি যাচাই করো! 💻",
    link: "/courses",
    linkText: "📚 কোর্সসমূহ",
  },
  "/cv-builder": {
    text: "স্মার্ট সিভি তৈরি করে তোমার ভবিষ্যৎ ক্যারিয়ার এক ধাপ এগিয়ে নাও! 📄",
    link: "/courses",
    linkText: "🚀 নতুন স্কিল শেখো",
  },
  "/admission": {
    text: "ভর্তির নিয়মাবলী দেখে দ্রুত তোমার আসন নিশ্চিত করো! 🎓",
    link: "/courses",
    linkText: "📖 কোর্স ডিটেইলস",
  },
  "/about": {
    text: "আমাদের লক্ষ্য ও সেরা মেন্টরদের সম্পর্কে বিস্তারিত জানো! ✨",
    link: "/admission",
    linkText: "🎓 ভর্তি হও",
  },
};

const FUN_QUOTES = [
  "আজকে একটু বেশি পড়ার সিদ্ধান্ত তোমাকে সবার চেয়ে এগিয়ে রাখবে! 🌟",
  "কঠিন পরিশ্রম কখনো বৃথা যায় না—বিজয় তোমার হবেই! 🏆",
  "ICT প্রস্তুতিতে কোনো ফাঁক রেখো না, বুঝে পড়ো! 💻",
  "মনোযোগ হারালে চলবে না; পড়ার টেবিলই তোমার বিজয়ের রণক্ষেত্র! 🛡️",
  "৪-সংখ্যার সিক্রেট পিন মনে রেখেছ তো? ডিফল্ট পিন কিন্তু 1234! 🤫",
  "তোমার প্রতিদিনের ছোট ছোট প্রচেষ্টাই ইতিহাস গড়ে তুলবে! ⚡",
  "ভুল থেকেই শিক্ষা নাও, আর প্রতিটি ভুলের পর দ্বিগুণ শক্তিতে ঘুরে দাঁড়াও! 🎯",
];

export default function PageMascot({ message, mood = "happy", onMascotClick }) {
  const location = useLocation();
  const [currentQuote, setCurrentQuote] = useState(() => {
    return message || ROUTE_MESSAGES[location.pathname]?.text || "ICT Success Academy তে স্বাগতম! 🚀";
  });
  const [currentLink, setCurrentLink] = useState(() => {
    return ROUTE_MESSAGES[location.pathname] || null;
  });
  const [currentMood, setCurrentMood] = useState(mood);
  const [isBouncing, setIsBouncing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Sync when prop message changes
  useEffect(() => {
    if (message) {
      setCurrentQuote(message);
      setCurrentMood(mood);
    }
  }, [message, mood]);

  // Route awareness: update message and link on page navigation
  useEffect(() => {
    if (!message) {
      const routeInfo = ROUTE_MESSAGES[location.pathname];
      if (routeInfo) {
        setCurrentQuote(routeInfo.text);
        setCurrentLink(routeInfo);
      } else {
        setCurrentQuote("ICT Success Academy তে স্বাগতম! 🚀");
        setCurrentLink(null);
      }
      setCurrentMood("happy");
    }
  }, [location.pathname, message]);

  // Global event listener for dynamic mascot triggers
  useEffect(() => {
    const handleMascotEvent = (e) => {
      if (e.detail?.message) {
        setCurrentQuote(e.detail.message);
        if (e.detail.mood) setCurrentMood(e.detail.mood);
        if (e.detail.link) setCurrentLink({ link: e.detail.link, linkText: e.detail.linkText });
        setIsMinimized(false);
      }
    };
    window.addEventListener("mascot-message", handleMascotEvent);
    return () => window.removeEventListener("mascot-message", handleMascotEvent);
  }, []);

  const handleClick = () => {
    setIsBouncing(true);
    playMascotSound("pop");

    // Cycle through fun quotes
    const random = FUN_QUOTES[Math.floor(Math.random() * FUN_QUOTES.length)];
    setCurrentQuote(random);

    if (onMascotClick) onMascotClick();

    setTimeout(() => {
      setIsBouncing(false);
    }, 600);
  };

  return (
    <div className={`page-mascot-container ${currentMood} ${isBouncing ? "bounce-anim" : ""}`}>
      {/* Speech Bubble */}
      {!isMinimized && (
        <div className="mascot-speech-bubble" onClick={handleClick}>
          <div className="bubble-header">
            <span className="bubble-badge">💡 একাডেমি গাইড</span>
            <button
              type="button"
              className="bubble-close-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
              }}
              title="ম্যাসকট লুকান"
            >
              ✕
            </button>
          </div>
          <p className="bubble-text">{currentQuote}</p>
          {currentLink?.link && (
            <div className="bubble-link-row" onClick={(e) => e.stopPropagation()}>
              <Link to={currentLink.link} className="bubble-action-link">
                {currentLink.linkText} →
              </Link>
            </div>
          )}
          <span className="bubble-arrow" />
        </div>
      )}

      {/* Mascot Avatar & Badge */}
      <div className="mascot-body-wrap" onClick={handleClick} title="ম্যাসকটে ক্লিক করে নতুন টিপস দেখুন!">
        <div className="mascot-glow-ring" />
        <img
          src="/page-mascot.png"
          alt="ICT Academy Page Mascot"
          className="mascot-img"
        />
        {isMinimized && (
          <button
            type="button"
            className="mascot-restore-pill"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(false);
            }}
          >
            💬 টিপস
          </button>
        )}
      </div>
    </div>
  );
}
