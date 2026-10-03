import { useState, useEffect, useRef } from "react";
import "./MCQDashboard.css";

// ─────────────────────────────────────────────
// 🔧 DEMO DATA — replace with real API calls
// ─────────────────────────────────────────────
const DEMO_EXAMS = [
  { id: 1, name: "ICT অধ্যায় ১ — তথ্য ও যোগাযোগ প্রযুক্তি",  date: "২০২৬-০৯-২৮", obtained: 42, total: 50, rank: 3,  totalStudents: 120 },
  { id: 2, name: "ICT অধ্যায় ২ — কম্পিউটার ও কম্পিউটিং",     date: "২০২৬-০৯-২২", obtained: 38, total: 50, rank: 7,  totalStudents: 145 },
  { id: 3, name: "ICT অধ্যায় ৩ — সংখ্যা পদ্ধতি",              date: "২০২৬-০৯-১৫", obtained: 35, total: 50, rank: 12, totalStudents: 98  },
  { id: 4, name: "ICT সাপ্তাহিক মডেল টেস্ট #১",               date: "২০২৬-০৯-০৮", obtained: 28, total: 50, rank: 25, totalStudents: 200 },
  { id: 5, name: "ICT অধ্যায় ৪ — ওয়েব ডিজাইন",               date: "২০২৬-০৮-৩০", obtained: 45, total: 50, rank: 1,  totalStudents: 110 },
];

const OVERALL_RANK   = 5;
const TOTAL_STUDENTS = 312;
// ─────────────────────────────────────────────

// ── Helpers ───────────────────────────────────
const BN_DAYS   = ["রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"];
const BN_MONTHS = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];

function getBnDate() {
  const now = new Date();
  return `${BN_DAYS[now.getDay()]}, ${now.getDate()} ${BN_MONTHS[now.getMonth()]} ${now.getFullYear()}`;
}

function getBnGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "শুভ সকাল" : h < 17 ? "শুভ বিকাল" : "শুভ সন্ধ্যা";
}

function getGrade(pct) {
  if (pct >= 90) return { grade:"A+", label:"অসাধারণ",           desc:"আপনার পারফরম্যান্স দুর্দান্ত! শীর্ষে থাকুন।",     bg:"#dcfce7", color:"#16a34a", bar:"linear-gradient(90deg,#16a34a,#4ade80)" };
  if (pct >= 80) return { grade:"A",  label:"চমৎকার",             desc:"আপনি খুব ভালো করছেন। একটু আরো পরিশ্রম করুন।",  bg:"#d1fae5", color:"#059669", bar:"linear-gradient(90deg,#059669,#6ee7b7)" };
  if (pct >= 70) return { grade:"B+", label:"ভালো",               desc:"ভালো প্রচেষ্টা! আরো মনোযোগ দিলে A পাবেন।",      bg:"#dbeafe", color:"#2563eb", bar:"linear-gradient(90deg,#2563eb,#93c5fd)" };
  if (pct >= 60) return { grade:"B",  label:"মোটামুটি ভালো",      desc:"ঠিকঠাক! নিয়মিত অনুশীলন করুন।",                 bg:"#e0e7ff", color:"#4f46e5", bar:"linear-gradient(90deg,#4f46e5,#a5b4fc)" };
  if (pct >= 50) return { grade:"C",  label:"উন্নতির সুযোগ আছে", desc:"আরো পড়াশোনা দরকার। হতাশ হবেন না!",             bg:"#ffedd5", color:"#ea580c", bar:"linear-gradient(90deg,#ea580c,#fdba74)" };
  return          { grade:"D",  label:"আরো পরিশ্রম দরকার",       desc:"নিয়মিত অনুশীলন শুরু করুন। আপনি পারবেন!",       bg:"#fee2e2", color:"#dc2626", bar:"linear-gradient(90deg,#dc2626,#fca5a5)" };
}

function getScoreChip(pct) {
  if (pct >= 80) return "chip-green";
  if (pct >= 60) return "chip-blue";
  if (pct >= 40) return "chip-orange";
  return "chip-red";
}

// ── Avatar ────────────────────────────────────
function Avatar({ photo, name, className = "" }) {
  if (photo) return <img src={photo} alt={name} className={`mcqd-avatar-img ${className}`} />;
  return <span className={className}>{name?.charAt(0)?.toUpperCase() ?? "?"}</span>;
}

// ════════════════════════════════════════════
//  LOGIN PAGE
// ════════════════════════════════════════════
function LoginPage({ onLogin }) {
  const [form, setForm]     = useState({ name:"", mobile:"", institute:"", email:"" });
  const [errors, setErrors] = useState({});
  const [photo, setPhoto]   = useState(null);
  const fileRef             = useRef();

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("ছবির সাইজ ২ MB এর বেশি হতে পারবে না।"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())      errs.name      = "নাম অবশ্যই পূরণ করতে হবে";
    if (!/^01[3-9]\d{8}$/.test(form.mobile.trim()))
                                errs.mobile    = "সঠিক মোবাইল নম্বর দিন (১১ সংখ্যা)";
    if (!form.institute.trim()) errs.institute = "প্রতিষ্ঠানের নাম অবশ্যই পূরণ করতে হবে";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const user = { ...form, photo };
    localStorage.setItem("ictUser", JSON.stringify(user));
    onLogin(user);
  };

  const Field = ({ id, label, required, type = "text", placeholder, maxLength }) => (
    <div className="mcqd-form-group">
      <label className="mcqd-label" htmlFor={id}>
        {label}
        {required && <span className="mcqd-req">*</span>}
        {!required && <span className="mcqd-opt"> (ঐচ্ছিক)</span>}
      </label>
      <input
        id={id} type={type} placeholder={placeholder} maxLength={maxLength}
        className={`mcqd-input${errors[id] ? " mcqd-input-error" : ""}`}
        value={form[id]} onChange={set(id)}
      />
      {errors[id] && <p className="mcqd-error-msg">⚠ {errors[id]}</p>}
    </div>
  );

  return (
    <div className="mcqd-login-bg">
      <div className="mcqd-login-card">
        {/* Logo */}
        <div className="mcqd-logo-wrap">
          <div className="mcqd-logo-circle">🎯</div>
          <h1 className="mcqd-login-title">ICT Success Academy</h1>
          <p className="mcqd-login-sub">MCQ Exam Dashboard — শিক্ষার্থী লগইন</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Photo upload */}
          <div className="mcqd-form-group">
            <label className="mcqd-label">প্রোফাইল ছবি</label>
            <div className="mcqd-photo-row">
              <div className="mcqd-photo-preview" onClick={() => fileRef.current.click()}>
                {photo
                  ? <img src={photo} alt="preview" className="mcqd-photo-thumb" />
                  : <span className="mcqd-photo-icon">📷</span>}
              </div>
              <div>
                <p className="mcqd-photo-label">ছবি আপলোড করুন</p>
                <p className="mcqd-photo-hint">JPG, PNG (সর্বোচ্চ ২ MB)</p>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
              </div>
            </div>
          </div>

          <Field id="name"      label="পূর্ণ নাম"         required placeholder="আপনার পূর্ণ নাম লিখুন" />
          <Field id="mobile"    label="মোবাইল নম্বর"      required type="tel" placeholder="০১XXXXXXXXX" maxLength={11} />
          <Field id="institute" label="প্রতিষ্ঠানের নাম"  required placeholder="স্কুল / কলেজ / বিশ্ববিদ্যালয়ের নাম" />
          <Field id="email"     label="ইমেইল"                       type="email" placeholder="example@gmail.com" />

          <button type="submit" className="mcqd-btn-login">🚀 ড্যাশবোর্ডে প্রবেশ করুন</button>
        </form>

        <p className="mcqd-login-note">
          <span className="mcqd-req">*</span> চিহ্নিত তথ্যগুলো পূরণ করা বাধ্যতামূলক
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
//  DASHBOARD PAGE
// ════════════════════════════════════════════
function Dashboard({ user, onLogout, onUpdateUser }) {
  const [rankBarW, setRankBarW] = useState(0);
  const [perfBarW, setPerfBarW] = useState(0);

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...user });
  const editFileRef = useRef(null);

  const totalExams    = DEMO_EXAMS.length;
  const totalMarks    = DEMO_EXAMS.reduce((s, e) => s + e.obtained, 0);
  const totalPossible = DEMO_EXAMS.reduce((s, e) => s + e.total, 0);
  const avgPct        = Math.round((totalMarks / totalPossible) * 100);
  const rankPct       = Math.round(((TOTAL_STUDENTS - OVERALL_RANK) / TOTAL_STUDENTS) * 100);
  const grade         = getGrade(avgPct);

  const badgeText =
    avgPct >= 80 ? "🏆 মেধাবী শিক্ষার্থী" :
    avgPct >= 60 ? "🥈 ভালো শিক্ষার্থী"   : "📚 নিয়মিত শিক্ষার্থী";

  useEffect(() => {
    const t1 = setTimeout(() => setRankBarW(rankPct), 300);
    const t2 = setTimeout(() => setPerfBarW(avgPct),  500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [rankPct, avgPct]);

  const handleLogout = () => {
    if (window.confirm("আপনি কি লগআউট করতে চান?")) {
      localStorage.removeItem("ictUser");
      onLogout();
    }
  };

  const startEdit = () => {
    setEditData({ ...user });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.id]: e.target.value });
  };

  const handleEditPhoto = (e) => {
    const f = e.target.files[0];
    if (f) {
      if (f.size > 2 * 1024 * 1024) return alert("ছবি ২ MB এর ছোট হতে হবে।");
      const r = new FileReader();
      r.onload = (e) => setEditData({ ...editData, photo: e.target.result });
      r.readAsDataURL(f);
    }
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if (!editData.name || !editData.mobile || !editData.institute) {
      return alert("নাম, মোবাইল এবং প্রতিষ্ঠানের নাম অবশ্যই দিতে হবে।");
    }
    if (!/^01[3-9]\d{8}$/.test(editData.mobile)) {
      return alert("সঠিক বাংলাদেশী মোবাইল নম্বর দিন।");
    }
    localStorage.setItem("ictUser", JSON.stringify(editData));
    onUpdateUser(editData);
    setIsEditing(false);
  };

  return (
    <div className="mcqd-dash-page">
      {/* ── Content ── */}
      <div className="mcqd-dash-content" style={{ marginTop: '32px' }}>

        {/* Greeting */}
        <div className="mcqd-greeting-row">
          <div>
            <h2 className="mcqd-greeting-name">{getBnGreeting()}, {user.name}! 👋</h2>
            <p className="mcqd-greeting-date">{getBnDate()}</p>
          </div>
          <span className="mcqd-greeting-badge">{badgeText}</span>
        </div>

        {/* Top row: Profile + Rank */}
        <div className="mcqd-top-row">
          {/* Profile */}
          <div className="mcqd-profile-card">
            
            {!isEditing ? (
              <>
                <div className="mcqd-profile-avatar-wrap">
                  <div className="mcqd-profile-avatar">
                    <Avatar photo={user.photo} name={user.name} />
                  </div>
                  <div className="mcqd-online-dot">✓</div>
                </div>
                <p className="mcqd-profile-name">{user.name}</p>
                <p className="mcqd-profile-inst">{user.institute}</p>
                <div className="mcqd-profile-tags">
                  <span className="mcqd-tag">📱 {user.mobile}</span>
                  {user.email && <span className="mcqd-tag">✉ {user.email}</span>}
                </div>
              </>
            ) : (
              <form onSubmit={saveEdit} className="mcqd-edit-form">
                <div className="mcqd-edit-avatar-picker" onClick={() => editFileRef.current.click()}>
                  <div className="mcqd-profile-avatar">
                    <Avatar photo={editData.photo} name={editData.name} />
                  </div>
                  <div className="mcqd-edit-avatar-overlay">📷</div>
                </div>
                <input ref={editFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleEditPhoto} />
                
                <input id="name" value={editData.name} onChange={handleEditChange} className="mcqd-input" placeholder="আপনার নাম" required />
                <input id="mobile" value={editData.mobile} onChange={handleEditChange} className="mcqd-input" placeholder="মোবাইল নম্বর" type="tel" maxLength={11} required />
                <input id="institute" value={editData.institute} onChange={handleEditChange} className="mcqd-input" placeholder="প্রতিষ্ঠানের নাম" required />
                <input id="email" value={editData.email} onChange={handleEditChange} className="mcqd-input" placeholder="ইমেইল (ঐচ্ছিক)" type="email" />
                
                <div className="mcqd-edit-actions">
                  <button type="submit" className="mcqd-btn-save">সেভ করুন</button>
                  <button type="button" onClick={cancelEdit} className="mcqd-btn-cancel">বাতিল</button>
                </div>
              </form>
            )}
            
          </div>

          {/* Rank */}
          <div className="mcqd-rank-card">
            <p className="mcqd-rank-card-title">🏆 সামগ্রিক র‍্যাংক</p>
            <div className="mcqd-rank-num-row">
              <span className="mcqd-rank-num">{OVERALL_RANK}</span>
              <span className="mcqd-rank-suffix">তম</span>
            </div>
            <p className="mcqd-rank-total">মোট {TOTAL_STUDENTS} জন শিক্ষার্থীর মধ্যে</p>
            <div className="mcqd-rank-perc-box">
              <p className="mcqd-rank-perc-label">শীর্ষ শতাংশ</p>
              <div className="mcqd-bar-bg">
                <div className="mcqd-rank-bar-fill" style={{ width: `${rankBarW}%` }} />
              </div>
              <p className="mcqd-rank-perc-val">শীর্ষ {100 - rankPct}% শিক্ষার্থীর মধ্যে আছেন</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mcqd-stats-row">
          {[
            { icon: "📝", value: totalExams,  label: "মোট পরীক্ষা", color: "#2563eb" },
            { icon: "⭐", value: totalMarks,   label: "মোট নম্বর",   color: "#16a34a" },
            { icon: "📊", value: `${avgPct}%`, label: "গড় স্কোর",   color: "#7c3aed" },
          ].map(({ icon, value, label, color }) => (
            <div key={label} className="mcqd-stat-card">
              <div className="mcqd-stat-icon">{icon}</div>
              <div className="mcqd-stat-value" style={{ color }}>{value}</div>
              <div className="mcqd-stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Performance */}
        <div className="mcqd-perf-card">
          <h3 className="mcqd-section-title">🎯 পারফরম্যান্স স্তর</h3>
          <div className="mcqd-grade-row">
            <div className="mcqd-grade-badge" style={{ background: grade.bg, color: grade.color }}>
              {grade.grade}
            </div>
            <div>
              <p className="mcqd-grade-label" style={{ color: grade.color }}>{grade.label}</p>
              <p className="mcqd-grade-desc">{grade.desc}</p>
            </div>
          </div>
          <div className="mcqd-bar-bg mcqd-bar-light">
            <div className="mcqd-perf-bar-fill" style={{ width: `${perfBarW}%`, background: grade.bar }} />
          </div>
          <div className="mcqd-bar-labels">
            <span>০%</span><span>২৫%</span><span>৫০%</span><span>৭৫%</span><span>১০০%</span>
          </div>
        </div>

        {/* Exam History */}
        <div className="mcqd-history-card">
          <div className="mcqd-history-header">
            <h3 className="mcqd-section-title" style={{ margin: 0 }}>📋 পরীক্ষার ইতিহাস</h3>
            <span className="mcqd-history-count">মোট {DEMO_EXAMS.length}টি পরীক্ষা</span>
          </div>

          {DEMO_EXAMS.length === 0 ? (
            <div className="mcqd-empty">
              <div className="mcqd-empty-icon">📭</div>
              <p>এখনো কোনো পরীক্ষা দেননি</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="mcqd-table">
                <thead>
                  <tr>
                    <th>পরীক্ষার নাম</th>
                    <th>তারিখ</th>
                    <th>স্কোর</th>
                    <th>র‍্যাংক</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_EXAMS.map((ex) => {
                    const pct = Math.round((ex.obtained / ex.total) * 100);
                    return (
                      <tr key={ex.id}>
                        <td className="mcqd-td-name">{ex.name}</td>
                        <td className="mcqd-td-date">{ex.date}</td>
                        <td>
                          <span className={`mcqd-score-chip ${getScoreChip(pct)}`}>
                            {ex.obtained}/{ex.total} ({pct}%)
                          </span>
                        </td>
                        <td>
                          <span className="mcqd-rank-chip">🏅 {ex.rank}/{ex.totalStudents}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Buttons Section */}
        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {!isEditing && (
            <button 
              className="mcqd-btn-edit-profile" 
              onClick={() => { 
                startEdit(); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }} 
              style={{ margin: 0, padding: '10px 24px', fontSize: '15px' }}
            >
              Edit Profile
            </button>
          )}
          <button 
            className="mcqd-btn-logout" 
            onClick={handleLogout} 
            style={{ background: '#fee2e2', color: '#dc2626', borderColor: '#f87171', padding: '10px 24px', fontSize: '15px', cursor: 'pointer', borderRadius: '20px' }}
          >
            🚪 লগআউট করুন
          </button>
        </div>

      </div>
    </div>
  );
}

// ════════════════════════════════════════════
//  ROOT EXPORT
// ════════════════════════════════════════════
export default function MCQDashboard() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ictUser")) ?? null; }
    catch { return null; }
  });

  if (!user) return <LoginPage onLogin={setUser} />;
  return <Dashboard user={user} onLogout={() => setUser(null)} onUpdateUser={setUser} />;
}
