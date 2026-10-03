import { useState } from "react";
import "./BoardQuestions.css";

// ────────────────────────────────────────────────────────
// DINAJPUR BOARD DATABASE (IMAGE FORMAT)
// ────────────────────────────────────────────────────────
// Image files should be placed inside: public/board-questions/
const QUESTION_DB = {
  HSC: {
    "2024": { MCQ: "/board-questions/hsc_2024_mcq.jpg", CQ: "/board-questions/hsc_2024_cq.jpg" },
    "2023": { MCQ: "/board-questions/hsc_2023_mcq.jpg", CQ: "/board-questions/hsc_2023_cq.jpg" },
    "2022": { MCQ: "/board-questions/hsc_2022_mcq.jpg", CQ: "/board-questions/hsc_2022_cq.jpg" },
    "2021": { MCQ: "/board-questions/hsc_2021_mcq.jpg", CQ: "/board-questions/hsc_2021_cq.jpg" },
    "2020": { MCQ: "/board-questions/hsc_2020_mcq.jpg", CQ: "/board-questions/hsc_2020_cq.jpg" },
    "2019": { MCQ: "/board-questions/hsc_2019_mcq.jpg", CQ: "/board-questions/hsc_2019_cq.jpg" },
    "2018": { MCQ: "/board-questions/hsc_2018_mcq.jpg", CQ: "/board-questions/hsc_2018_cq.jpg" },
    "2017": { MCQ: "/board-questions/hsc_2017_mcq.jpg", CQ: "/board-questions/hsc_2017_cq.jpg" },
    "2016": { MCQ: "/board-questions/hsc_2016_mcq.jpg", CQ: "/board-questions/hsc_2016_cq.jpg" }
  },
  SSC: {
    "2024": { MCQ: "/board-questions/ssc_2024_mcq.jpg", CQ: "/board-questions/ssc_2024_cq.jpg" },
    "2023": { MCQ: "/board-questions/ssc_2023_mcq.jpg", CQ: "/board-questions/ssc_2023_cq.jpg" },
    "2022": { MCQ: "/board-questions/ssc_2022_mcq.jpg", CQ: "/board-questions/ssc_2022_cq.jpg" },
    "2021": { MCQ: "/board-questions/ssc_2021_mcq.jpg", CQ: "/board-questions/ssc_2021_cq.jpg" },
    "2020": { MCQ: "/board-questions/ssc_2020_mcq.jpg", CQ: "/board-questions/ssc_2020_cq.jpg" },
    "2019": { MCQ: "/board-questions/ssc_2019_mcq.jpg", CQ: "/board-questions/ssc_2019_cq.jpg" },
    "2018": { MCQ: "/board-questions/ssc_2018_mcq.jpg", CQ: "/board-questions/ssc_2018_cq.jpg" },
    "2017": { MCQ: "/board-questions/ssc_2017_mcq.jpg", CQ: "/board-questions/ssc_2017_cq.jpg" },
    "2016": { MCQ: "/board-questions/ssc_2016_mcq.jpg", CQ: "/board-questions/ssc_2016_cq.jpg" }
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
          <h2>{level} {type} পরীক্ষা - {year} (দিনাজপুর বোর্ড)</h2>
          <div className="bq-paper">
            {currentQuestions ? (
              <div className="bq-image-container">
                <img 
                  src={currentQuestions} 
                  alt={`${level} ${type} ${year} Dinajpur Board Question`} 
                  className="bq-question-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="bq-missing-image" style={{ display: 'none' }}>
                  <p>🖼️ ছবি পাওয়া যায়নি!</p>
                  <p className="bq-empty-sub">দয়া করে <b>public/board-questions/</b> ফোল্ডারে <b>{currentQuestions.split('/').pop()}</b> নামে ছবিটি রাখুন।</p>
                </div>
              </div>
            ) : (
              <div className="bq-empty">
                <p>😞 দুঃখিত, {year} সালের {level} {type} প্রশ্ন এখনো ডাটাবেসে যুক্ত করা হয়নি।</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
