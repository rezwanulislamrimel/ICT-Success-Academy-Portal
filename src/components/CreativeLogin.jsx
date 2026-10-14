import React, { useState, useRef, useEffect } from "react";
import PasswordVault from "./PasswordVault.jsx";
import "./CreativeLogin.css";

// ── Web Audio Sound for Form Interactions ──
function playInteractionSound(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "sprint") {
      // Wind whoosh / sprint dash
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.28);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } else if (type === "alert") {
      // Police whistle chirp
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (_) {}
}

export default function CreativeLogin({ onLogin }) {
  const containerRef = useRef(null);

  // Retrieve previous student data if any
  const [savedUser] = useState(() => {
    try {
      const s = localStorage.getItem("ict_last_student") || localStorage.getItem("ictUser");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const [form, setForm] = useState({
    name: savedUser?.name || "",
    mobile: savedUser?.mobile || "",
    institute: savedUser?.institute || "",
    email: savedUser?.email || "",
    password: savedUser?.pin || "1234",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFocus, setActiveFocus] = useState(null); // 'name' | 'mobile' | 'institute' | 'email' | 'password'
  const [showFullReg, setShowFullReg] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [photo, setPhoto] = useState(savedUser?.photo || null);
  const fileRef = useRef(null);

  // Dynamic Mascot Advice Message based on focus & state
  const getMascotMessage = () => {
    if (errors.mobile) return "আরেহ! মোবাইল নম্বরটি ১১ সংখ্যার হতে হবে (যেমন: 017XXXXXXXX) 📱";
    if (errors.name) return "তোমার পূর্ণ নামটি অবশ্যই পূরণ করো! ✍️";
    if (errors.password) return "পাসওয়ার্ড বা ৪-ডিজিটের পিনটি দাও (ডিফল্ট: 1234) 🤫";
    if (activeFocus === "password") return "পুলিশ পাহারা দিচ্ছে! সাবধানে ৪-ডিজিট পিন দাও (ডিফল্ট: 1234) 👮‍♂️💨";
    if (activeFocus === "mobile") return "তোমার সচল মোবাইল নম্বরটি লিখো! 📱";
    if (activeFocus === "name") return "এইচএসসি কুইজে যে নাম প্রদর্শিত হবে তা লিখো 🎓";
    if (activeFocus === "institute") return "তোমার স্কুল বা কলেজের নাম লিখো 🏫";
    if (isSubmitting) return "দৌড়াও! ড্যাশবোর্ডে প্রবেশ হচ্ছে... 🚀";
    if (savedUser?.name) return `স্বাগতম ${savedUser.name}! ড্যাশবোর্ডে ঢুকতে পিন দিয়ে Sign In চাপো! 🌟`;
    return "স্বাগতম! ICT Success Academy তে লগইন করে কুইজ ও পড়ার রেকর্ড দেখো 🚀";
  };

  // Sync message with global PageMascot in Layout
  useEffect(() => {
    const msg = getMascotMessage();
    const mood = activeFocus === "password" ? "alert" : isSubmitting ? "running" : "happy";
    window.dispatchEvent(new CustomEvent("mascot-message", { detail: { message: msg, mood } }));
  }, [activeFocus, errors, isSubmitting, showFullReg]);

  // Interactive mousemove torch effect
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    containerRef.current.style.setProperty("--target-x", `${x.toFixed(1)}%`);
    containerRef.current.style.setProperty("--target-y", `${y.toFixed(1)}%`);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("ছবির সাইজ ২ MB এর বেশি হতে পারবে না।");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (showFullReg && !form.name.trim()) {
      errs.name = "নাম অবশ্যই পূরণ করতে হবে";
    }
    if (!form.mobile.trim() || !/^01[3-9]\d{8}$/.test(form.mobile.trim())) {
      errs.mobile = "সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন";
    }
    if (showFullReg && !form.institute.trim()) {
      errs.institute = "প্রতিষ্ঠানের নাম অবশ্যই দিতে হবে";
    }
    if (!form.password.trim()) {
      errs.password = "পাসওয়ার্ড বা পিন কোড দিন";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!validate()) {
      playInteractionSound("alert");
      return;
    }

    setIsSubmitting(true);
    playInteractionSound("sprint");

    setTimeout(() => {
      const user = {
        name: form.name.trim() || savedUser?.name || "শিক্ষার্থী",
        mobile: form.mobile.trim(),
        institute: form.institute.trim() || savedUser?.institute || "আইসিটি সাকসেস একাডেমি",
        email: form.email.trim() || savedUser?.email || "",
        pin: form.password.trim() || "1234",
        photo: photo,
      };

      localStorage.setItem("ictUser", JSON.stringify(user));
      localStorage.setItem("ict_last_student", JSON.stringify(user));

      onLogin(user);
    }, 700);
  };

  const handleVaultUnlockSuccess = () => {
    let student = savedUser;
    if (!student) {
      student = {
        name: form.name.trim() || "মেহেদী হাসান",
        mobile: form.mobile.trim() || "01712345678",
        institute: form.institute.trim() || "নটর ডেম কলেজ, ঢাকা",
        email: form.email.trim() || "mehedi@example.com",
        pin: form.password.trim() || "1234",
        photo: null,
      };
      localStorage.setItem("ict_last_student", JSON.stringify(student));
    }
    localStorage.setItem("ictUser", JSON.stringify(student));
    setShowVaultModal(false);
    onLogin(student);
  };

  return (
    <div
      ref={containerRef}
      className={`creative-login-wrapper ${activeFocus === "password" ? "password-focus" : ""} ${isSubmitting ? "is-submitting" : ""}`}
      onMouseMove={handleMouseMove}
    >
      {/* Background ambient glow torch */}
      <div className="creative-torch-glow" />

      {/* Ambient sparks */}
      <div className="creative-sparks-wrap">
        <div className="creative-spark" style={{ left: "15%", width: 6, height: 6, animationDelay: "0s" }} />
        <div className="creative-spark" style={{ left: "30%", width: 8, height: 8, animationDelay: "2s" }} />
        <div className="creative-spark" style={{ left: "65%", width: 5, height: 5, animationDelay: "1s" }} />
        <div className="creative-spark" style={{ left: "85%", width: 7, height: 7, animationDelay: "3.5s" }} />
      </div>

      {/* Main Login Card */}
      <div className="creative-login-card">
        {/* Brand Pill */}
        <div style={{ textAlign: "center" }}>
          <div className="creative-brand-pill">
            <span>★</span> ICT SUCCESS ACADEMY
          </div>
          <h1 className="creative-title">Welcome back</h1>
          <p className="creative-subtitle">Please sign in to your student account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Registration Extra Fields */}
          {showFullReg && (
            <div className="creative-reg-section">
              {/* Photo Upload */}
              <div className="creative-form-group" style={{ textAlign: "center", marginBottom: 16 }}>
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    border: "2px dashed #f97316",
                    background: "#fff7ed",
                    margin: "0 auto 6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                  title="প্রোফাইল ছবি আপলোড করুন"
                >
                  {photo ? (
                    <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: 24 }}>📷</span>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />
                <span style={{ fontSize: 11, color: "#78716c" }}>ছবি আপলোড (ঐচ্ছিক)</span>
              </div>

              {/* Full Name */}
              <div className="creative-form-group">
                <label className="creative-label" htmlFor="name">
                  পূর্ণ নাম <span className="creative-req">*</span>
                </label>
                <div className="creative-input-wrap">
                  <span className="creative-input-icon">👤</span>
                  <input
                    id="name"
                    type="text"
                    className="creative-input"
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={() => setActiveFocus("name")}
                    onBlur={() => setActiveFocus(null)}
                  />
                </div>
                {errors.name && <p className="creative-err">⚠ {errors.name}</p>}
              </div>

              {/* Institution */}
              <div className="creative-form-group">
                <label className="creative-label" htmlFor="institute">
                  প্রতিষ্ঠানের নাম <span className="creative-req">*</span>
                </label>
                <div className="creative-input-wrap">
                  <span className="creative-input-icon">🏫</span>
                  <input
                    id="institute"
                    type="text"
                    className="creative-input"
                    placeholder="স্কুল / কলেজ / বিশ্ববিদ্যালয়ের নাম"
                    value={form.institute}
                    onChange={(e) => setForm({ ...form, institute: e.target.value })}
                    onFocus={() => setActiveFocus("institute")}
                    onBlur={() => setActiveFocus(null)}
                  />
                </div>
                {errors.institute && <p className="creative-err">⚠ {errors.institute}</p>}
              </div>

              {/* Email */}
              <div className="creative-form-group">
                <label className="creative-label" htmlFor="email">
                  ইমেইল (ঐচ্ছিক)
                </label>
                <div className="creative-input-wrap">
                  <span className="creative-input-icon">✉️</span>
                  <input
                    id="email"
                    type="email"
                    className="creative-input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setActiveFocus("email")}
                    onBlur={() => setActiveFocus(null)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mobile / Account ID */}
          <div className="creative-form-group">
            <label className="creative-label" htmlFor="mobile">
              মোবাইল নম্বর <span className="creative-req">*</span>
            </label>
            <div className="creative-input-wrap">
              <span className="creative-input-icon">📱</span>
              <input
                id="mobile"
                type="tel"
                maxLength={11}
                className="creative-input"
                placeholder="০১XXXXXXXXX"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                onFocus={() => setActiveFocus("mobile")}
                onBlur={() => setActiveFocus(null)}
              />
            </div>
            {errors.mobile && <p className="creative-err">⚠ {errors.mobile}</p>}
          </div>

          {/* Password / Vault PIN */}
          <div className="creative-form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="creative-label" htmlFor="password">
                পাসওয়ার্ড / ভল্ট পিন <span className="creative-req">*</span>
              </label>
              <span style={{ fontSize: 11, color: "#f97316", fontWeight: 600 }}>
                ডিফল্ট: 1234
              </span>
            </div>
            <div className="creative-input-wrap">
              <span className="creative-input-icon">🔒</span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                maxLength={12}
                className="creative-input"
                placeholder="••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onFocus={() => {
                  setActiveFocus("password");
                  playInteractionSound("alert");
                }}
                onBlur={() => setActiveFocus(null)}
              />
              <button
                type="button"
                className="creative-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
            {errors.password && <p className="creative-err">⚠ {errors.password}</p>}
          </div>

          {/* ══════════════════════════════════════════════
              MASCOT CHASE SCENE (Directly over the Button!)
             ══════════════════════════════════════════════ */}
          <div className="creative-mascot-chase-scene" title="সাবধান! পুলিশ চোরকে তাড়া করছে!">
            {/* Ground running track */}
            <div className="chase-ground-track" />

            {/* Police Mascot */}
            <div className="mascot-cop-wrap" title="Security Officer">
              <img src="/police-mascot.png" alt="Police Mascot" className="mascot-cop-img" />
            </div>

            {/* Comic Smoke Burst */}
            <div className="mascot-smoke-wrap">
              <img src="/comic-smoke-burst.png" alt="Smoke burst" className="mascot-smoke-img" />
            </div>

            {/* Student Mascot */}
            <div className="mascot-runner-wrap" title="Student Mascot">
              <img src="/student-mascot.png" alt="Student Mascot" className="mascot-runner-img" />
            </div>
          </div>

          {/* Sign In Button */}
          <button type="submit" className="creative-btn-signin" disabled={isSubmitting}>
            {isSubmitting ? "লগইন হচ্ছে..." : "🚀 Sign In ড্যাশবোর্ড"}
          </button>
        </form>

        {/* Divider */}
        <div className="creative-divider">
          <span>অথবা অন্যভাবে প্রবেশ করুন</span>
        </div>

        {/* Action Toggles: 3D Vault & Full Register */}
        <div className="creative-actions-row">
          <button
            type="button"
            className="creative-btn-vault"
            onClick={() => setShowVaultModal(true)}
            title="৩D মেটালিক ভল্ট ডায়াল দিয়ে আনলক করুন"
          >
            🔐 ৩D মেটালিক ভল্ট
          </button>

          <button
            type="button"
            className="creative-btn-register-toggle"
            onClick={() => setShowFullReg(!showFullReg)}
          >
            {showFullReg ? "⚡ দ্রুত লগইন মোড" : "📝 নতুন অ্যাকাউন্ট তৈরি"}
          </button>
        </div>

        {/* Footer info */}
        <div className="creative-card-footer">
          {showFullReg ? (
            <p style={{ margin: 0 }}>
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <button type="button" onClick={() => setShowFullReg(false)}>
                লগইন করুন
              </button>
            </p>
          ) : (
            <p style={{ margin: 0 }}>
              নতুন শিক্ষার্থী?{" "}
              <button type="button" onClick={() => setShowFullReg(true)}>
                এখানে রেজিস্টার করুন
              </button>
            </p>
          )}
        </div>
      </div>

      {/* ── 3D Vault Modal Overlay ── */}
      {showVaultModal && (
        <div className="creative-vault-modal-backdrop" onClick={() => setShowVaultModal(false)}>
          <div className="creative-vault-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="creative-vault-close-btn"
              onClick={() => setShowVaultModal(false)}
              title="ভল্ট বন্ধ করুন"
            >
              ✕
            </button>
            <PasswordVault
              correctPassword={savedUser?.pin ? [String(savedUser.pin), "1234", "0000"] : ["1234", "0000"]}
              title="STUDENT VAULT"
              subtitle="আপনার সিক্রেট ৪-ডিজিট পিন দিয়ে প্রবেশ করুন"
              hint={savedUser?.pin ? `সেভ করা পিন: ${savedUser.pin} অথবা 1234` : "ডিফল্ট পিন: 1234"}
              onUnlock={handleVaultUnlockSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
