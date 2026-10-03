import { useState } from "react";
import "./BoardQuestions.css";

// ────────────────────────────────────────────────────────
// DINAJPUR BOARD DATABASE (2016 - 2024)
// ────────────────────────────────────────────────────────
const QUESTION_DB = {
  HSC: {
    "2024": {
      MCQ: [
        { q: "১. ডেটা কমিউনিকেশনে ডেটা ট্রান্সমিশন মোড কত প্রকার?", options: ["২", "৩", "৪", "৫"], ans: 1 },
        { q: "২. C ভাষায় ভেরিয়েবলের নামের প্রথম অক্ষর কী হতে পারে?", options: ["সংখ্যা", "অ্যালফাবেট", "স্পেশাল ক্যারেক্টার", "ফাঁকা স্থান"], ans: 1 }
      ],
      CQ: ["১. ক) ক্লাউড কম্পিউটিং কী?\n   খ) ফাইবার অপটিক ক্যাবল কেন দ্রুত ডেটা ট্রান্সফার করে?\n   গ) উদ্দীপকে উল্লেখিত নেটওয়ার্ক টপোলজির চিত্র আঁকো।\n   ঘ) উদ্দীপকের টপোলজিতে একটি কম্পিউটার নষ্ট হলে কী হবে? বিশ্লেষণ করো।"]
    },
    "2023": {
      MCQ: [
        { q: "১. (25)₁₀ এর বাইনারি মান কোনটি?", options: ["11001", "10101", "11100", "10011"], ans: 0 },
        { q: "২. HTML এ <a> ট্যাগের 'href' কী?", options: ["Attribute", "Tag", "Value", "Element"], ans: 0 }
      ],
      CQ: ["১. ক) গ্লোবাল ভিলেজ কী?\n   খ) বায়োমেট্রিক্স কীভাবে নিরাপত্তা দেয়?\n   গ) উদ্দীপকের আলোকে নেটওয়ার্ক টপোলজি ব্যাখ্যা করো।\n   ঘ) উদ্দীপকের টপোলজির সুবিধা-অসুবিধা বিশ্লেষণ করো।"]
    },
    "2022": {
      MCQ: [
        { q: "১. কোনটি রিলেশনাল ডেটাবেস সফটওয়্যার?", options: ["Oracle", "Windows", "Linux", "Mac OS"], ans: 0 }
      ],
      CQ: ["১. ক) ডেটাবেস অ্যাডমিনিস্ট্রেটর কী?\n   খ) প্রাইমারি কী ও ফরেন কী এর পার্থক্য লেখো।"]
    },
    "2021": { MCQ: [], CQ: [] },
    "2020": { MCQ: [], CQ: [] },
    "2019": { MCQ: [], CQ: [] },
    "2018": { MCQ: [], CQ: [] },
    "2017": { MCQ: [], CQ: [] },
    "2016": {
      MCQ: [{ q: "১. ICT এর পূর্ণরূপ কী?", options: ["Information and Communication Technology", "Internal Communication Technology", "Information and Computer Technology", "Internet and Communication Technology"], ans: 0 }],
      CQ: ["১. ক) ই-কমার্স কী?\n   খ) অনলাইনে কেনাকাটার সুবিধা লেখো।"]
    }
  },
  SSC: {
    "2024": {
      MCQ: [{ q: "১. কম্পিউটারের ব্রেইন বলা হয় কাকে?", options: ["RAM", "ROM", "CPU", "Hard Disk"], ans: 2 }],
      CQ: ["১. ক) মাল্টিমিডিয়া কী?\n   খ) প্রেজেন্টেশন সফটওয়্যারের গুরুত্ব লেখো।"]
    },
    "2023": {
      MCQ: [{ q: "১. ই-মেইল পাঠানোর জন্য কোনটি প্রয়োজন?", options: ["ইন্টারনেট সংযোগ", "প্রিন্টার", "স্ক্যানার", "স্পিকার"], ans: 0 }],
      CQ: ["১. ক) ই-লার্নিং কী?\n   খ) শিক্ষায় ইন্টারনেটের প্রভাব আলোচনা করো।"]
    },
    "2022": { MCQ: [], CQ: [] },
    "2021": { MCQ: [], CQ: [] },
    "2020": { MCQ: [], CQ: [] },
    "2019": { MCQ: [], CQ: [] },
    "2018": { MCQ: [], CQ: [] },
    "2017": { MCQ: [], CQ: [] },
    "2016": { MCQ: [], CQ: [] }
  }
};

const YEARS = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];

export default function BoardQuestions() {
  const [level, setLevel] = useState(null); // 'SSC' or 'HSC'
  const [type, setType] = useState(null);   // 'MCQ' or 'CQ'
  const [year, setYear] = useState(null);   // e.g. 2023

  // Reset lower levels when upper level changes
  const handleLevel = (l) => { setLevel(l); setType(null); setYear(null); };
  const handleType = (t) => { setType(t); setYear(null); };

  const currentQuestions = (level && type && year && QUESTION_DB[level]?.[year]?.[type]) || [];

  return (
    <div className="bq-container wrap">
      <div className="bq-header">
        <h1>📚 দিনাজপুর বোর্ড প্রশ্ন আর্কাইভ</h1>
        <p>SSC এবং HSC এর ২০১৬-২০২৪ সালের দিনাজপুর বোর্ডের সকল প্রশ্ন (MCQ ও CQ)</p>
      </div>

      <div className="bq-selectors">
        {/* Step 1: Select SSC or HSC */}
        <div className="bq-step">
          <h3>১. লেভেল নির্বাচন করুন:</h3>
          <div className="bq-btn-group">
            <button className={`bq-btn ${level === "SSC" ? "active" : ""}`} onClick={() => handleLevel("SSC")}>SSC (এসএসসি)</button>
            <button className={`bq-btn ${level === "HSC" ? "active" : ""}`} onClick={() => handleLevel("HSC")}>HSC (এইচএসসি)</button>
          </div>
        </div>

        {/* Step 2: Select MCQ or CQ */}
        {level && (
          <div className="bq-step fade-in">
            <h3>২. প্রশ্নের ধরন:</h3>
            <div className="bq-btn-group">
              <button className={`bq-btn ${type === "MCQ" ? "active" : ""}`} onClick={() => handleType("MCQ")}>MCQ (বহুনির্বাচনি)</button>
              <button className={`bq-btn ${type === "CQ" ? "active" : ""}`} onClick={() => handleType("CQ")}>CQ (সৃজনশীল)</button>
            </div>
          </div>
        )}

        {/* Step 3: Select Year */}
        {type && (
          <div className="bq-step fade-in">
            <h3>৩. সাল নির্বাচন করুন:</h3>
            <div className="bq-year-grid">
              {YEARS.map(y => (
                <button 
                  key={y} 
                  className={`bq-year-btn ${year == y ? "active" : ""}`} 
                  onClick={() => setYear(y)}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Render Questions */}
      {year && (
        <div className="bq-content fade-in">
          <h2>{level} {type} পরীক্ষা - {year}</h2>
          <div className="bq-paper">
            {currentQuestions.length > 0 ? (
              type === "MCQ" ? (
                <div className="bq-mcq-list">
                  {currentQuestions.map((q, i) => (
                    <div key={i} className="bq-question-card">
                      <p className="bq-q-title">{q.q}</p>
                      <div className="bq-options">
                        {q.options.map((opt, optIdx) => (
                          <label key={optIdx} className="bq-opt-label">
                            <input type="radio" name={`q_${i}`} value={optIdx} />
                            <span>{["ক", "খ", "গ", "ঘ"][optIdx]}. {opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bq-cq-list">
                  {currentQuestions.map((q, i) => (
                    <div key={i} className="bq-question-card">
                      <pre className="bq-cq-text">{q}</pre>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="bq-empty">
                <p>😞 দুঃখিত, {year} সালের {level} {type} প্রশ্ন এখনো ডাটাবেসে যুক্ত করা হয়নি।</p>
                <p className="bq-empty-sub">খুব শীঘ্রই এই সালের প্রশ্নগুলো আপডেট করা হবে!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
