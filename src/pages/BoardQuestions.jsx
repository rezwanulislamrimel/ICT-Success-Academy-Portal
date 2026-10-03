import { useState } from "react";
import "./BoardQuestions.css";

// ────────────────────────────────────────────────────────
// DUMMY DATABASE (Add more questions here later)
// ────────────────────────────────────────────────────────
const QUESTION_DB = {
  HSC: {
    "2023": {
      MCQ: [
        { q: "১. 'WWW' এর পূর্ণরূপ কী?", options: ["World Wide Web", "World Web Wide", "Wide World Web", "Web World Wide"], ans: 0 },
        { q: "২. (101)₂ এর সমতুল্য ডেসিমেল মান কত?", options: ["3", "4", "5", "6"], ans: 2 }
      ],
      CQ: [
        "১. ক) গ্লোবাল ভিলেজ কী?\n   খ) বায়োমেট্রিক্স কীভাবে নিরাপত্তা দেয়?\n   গ) উদ্দীপকের আলোকে নেটওয়ার্ক টপোলজি ব্যাখ্যা করো।\n   ঘ) উদ্দীপকের টপোলজির সুবিধা-অসুবিধা বিশ্লেষণ করো।"
      ]
    },
    "2022": {
      MCQ: [{ q: "১. কোনটি রিলেশনাল ডেটাবেস?", options: ["MySQL", "MongoDB", "Redis", "Cassandra"], ans: 0 }],
      CQ: []
    }
  },
  SSC: {
    "2023": {
      MCQ: [{ q: "১. কম্পিউটারের ব্রেইন বলা হয় কাকে?", options: ["RAM", "ROM", "CPU", "Hard Disk"], ans: 2 }],
      CQ: ["১. ক) ই-কমার্স কী?\n   খ) ই-লার্নিং এর গুরুত্ব লেখো।"]
    }
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
        <h1>📚 বোর্ড প্রশ্ন আর্কাইভ</h1>
        <p>SSC এবং HSC এর বিগত সালের সকল বোর্ডের প্রশ্ন (MCQ ও CQ)</p>
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
