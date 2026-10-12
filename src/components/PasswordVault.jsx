import React, { useState, useRef, useEffect } from "react";
import "./PasswordVault.css";

// ── Web Audio Mechanical Sound Effects ──
function playVaultSound(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "tick") {
      // Mechanical gear click on keystroke
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(380, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === "unlock") {
      // Heavy bolt slide & triumphant chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = "triangle";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(140, ctx.currentTime);
      osc1.frequency.linearRampToValueAtTime(260, ctx.currentTime + 0.15);
      osc2.frequency.setValueAtTime(523.25, ctx.currentTime + 0.2); // C5
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.35); // E5
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.35);
      osc2.start(ctx.currentTime + 0.2);
      osc2.stop(ctx.currentTime + 0.65);
    } else if (type === "error") {
      // Dull rejection thuds
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    }
  } catch (_) {}
}

// ── SVG Mechanical Cog / Gear Component ──
function Gear({ size = 36, teeth = 8, rotation = 0, innerRadius = 10, outerRadius = 15, toothWidth = 4, color = "#475569" }) {
  const toothElements = Array.from({ length: teeth }).map((_, i) => {
    const angle = (i * 360) / teeth;
    return (
      <rect
        key={i}
        x={-toothWidth / 2}
        y={-outerRadius}
        width={toothWidth}
        height={outerRadius - innerRadius + 2}
        transform={`rotate(${angle})`}
        fill={color}
      />
    );
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="-20 -20 40 40"
      className="pv-gear-svg"
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <circle cx="0" cy="0" r={innerRadius + 1} fill={color} />
      {toothElements}
      <circle cx="0" cy="0" r={innerRadius - 3.5} fill="#1e293b" />
      <circle cx="0" cy="0" r="2.5" fill="#64748b" />
    </svg>
  );
}

/**
 * PasswordVault Component
 * 3D Metallic Safe Vault with rotating gears and combination safe wheel
 */
export default function PasswordVault({
  correctPassword = "1234",
  onUnlock = () => {},
  title = "VAULT CODE",
  subtitle = "নিরাপদ কোড দিয়ে ভল্ট আনলক করুন",
  hint = "ডিফল্ট পিন: 1234",
  placeholder = "••••",
  autoFocus = false,
  maxLength = 12,
}) {
  const [code, setCode] = useState("");
  const [showPlain, setShowPlain] = useState(false);
  const [gearRotation, setGearRotation] = useState(0);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [status, setStatus] = useState("idle"); // 'idle' | 'unlocking' | 'unlocked' | 'error'
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (status === "unlocking") return;

    if (val.length > code.length) {
      // Keystroke typed: turn gears forward and wheel slightly
      setGearRotation((prev) => prev + 36);
      setWheelRotation((prev) => prev + 25);
      playVaultSound("tick");
    } else if (val.length < code.length) {
      // Backspace: turn gears reverse
      setGearRotation((prev) => prev - 36);
      setWheelRotation((prev) => prev - 25);
      playVaultSound("tick");
    }

    setCode(val);
    if (status === "error") {
      setStatus("idle");
      setErrorMsg("");
    }
  };

  const handleUnlock = (e) => {
    if (e) e.preventDefault();
    if (!code) {
      setErrorMsg("অনুগ্রহ করে কোড লিখুন");
      setStatus("error");
      playVaultSound("error");
      return;
    }

    // Checking code match (accept string or array of acceptable codes)
    const isValid = Array.isArray(correctPassword)
      ? correctPassword.includes(code.trim())
      : String(correctPassword).trim() === code.trim();

    if (isValid) {
      setStatus("unlocking");
      setErrorMsg("");
      // Dramatic Wheel spin
      setWheelRotation((prev) => prev + 360);
      setGearRotation((prev) => prev + 180);
      playVaultSound("unlock");

      setTimeout(() => {
        setStatus("unlocked");
        onUnlock(code.trim());
      }, 750);
    } else {
      setStatus("error");
      setErrorMsg("ভুল কোড! সঠিক কোড দিন");
      setWheelRotation((prev) => prev - 30);
      playVaultSound("error");
    }
  };

  const toggleShowPlain = () => {
    setShowPlain(!showPlain);
    playVaultSound("tick");
  };

  return (
    <div className={`pv-vault-wrapper ${status}`}>
      {/* 3D Metallic Safe Door Chassis */}
      <div className="pv-safe-door">
        {/* Corner Steel Rivets / Bolts */}
        <span className="pv-rivet pv-rivet-tl"></span>
        <span className="pv-rivet pv-rivet-tr"></span>
        <span className="pv-rivet pv-rivet-bl"></span>
        <span className="pv-rivet pv-rivet-br"></span>

        {/* Retractable Locking Security Bolts */}
        <div className="pv-lock-bolt pv-bolt-top"></div>
        <div className="pv-lock-bolt pv-bolt-right"></div>
        <div className="pv-lock-bolt pv-bolt-bottom"></div>

        {/* ── Left Side: Code Input & Mechanical Gears ── */}
        <div className="pv-left-controls">
          <div className="pv-vault-header">
            <span className="pv-vault-title">{title}</span>
            <span className={`pv-led-status ${status}`}></span>
          </div>

          <form onSubmit={handleUnlock} className="pv-input-form" noValidate>
            <div className="pv-input-wrap">
              <input
                ref={inputRef}
                type={showPlain ? "text" : "password"}
                className={`pv-code-input ${status === "error" ? "input-err" : ""}`}
                value={code}
                onChange={handleInputChange}
                placeholder={placeholder}
                maxLength={maxLength}
                disabled={status === "unlocking" || status === "unlocked"}
                autoComplete="off"
              />
              <button
                type="button"
                className="pv-eye-btn"
                onClick={toggleShowPlain}
                title={showPlain ? "গোপন করুন" : "কোড দেখুন"}
              >
                {showPlain ? "👁️" : "🔒"}
              </button>
            </div>

            {errorMsg && <p className="pv-err-text">⚠ {errorMsg}</p>}

            {/* 3 Interlocking Mechanical Gears */}
            <div className="pv-gears-cluster" title="মেকানিক্যাল গিয়ার্স">
              <div className="pv-gear-item gear-1">
                <Gear size={34} teeth={8} rotation={gearRotation} color="#64748b" />
              </div>
              <div className="pv-gear-item gear-2">
                <Gear size={40} teeth={10} rotation={-gearRotation * 1.25} color="#94a3b8" />
              </div>
              <div className="pv-gear-item gear-3">
                <Gear size={32} teeth={8} rotation={gearRotation * 0.9} color="#475569" />
              </div>
            </div>

            {/* Unlock Action Button */}
            <button
              type="submit"
              className={`pv-unlock-btn ${status}`}
              disabled={status === "unlocking" || status === "unlocked"}
            >
              {status === "unlocking" ? (
                <span>🔄 আনলক হচ্ছে...</span>
              ) : status === "unlocked" ? (
                <span>🔓 উন্মুক্ত (Unlocked)</span>
              ) : (
                <span>Unlock (আনলক)</span>
              )}
            </button>
          </form>

          {subtitle && <p className="pv-vault-sub">{subtitle}</p>}
          {hint && <p className="pv-vault-hint">💡 {hint}</p>}
        </div>

        {/* ── Right Side: 3D Safe Dial Wheel Handle ── */}
        <div className="pv-right-wheel">
          <div
            className="pv-wheel-assembly"
            style={{ transform: `rotate(${wheelRotation}deg)` }}
            onClick={() => {
              setWheelRotation((p) => p + 45);
              setGearRotation((p) => p + 30);
              playVaultSound("tick");
            }}
            title="ভল্ট হুইল ঘোরান"
          >
            {/* Outer embossed ring */}
            <div className="pv-wheel-rim">
              <div className="pv-rim-notch notch-1"></div>
              <div className="pv-rim-notch notch-2"></div>
              <div className="pv-rim-notch notch-3"></div>
              <div className="pv-rim-notch notch-4"></div>
            </div>

            {/* 4 Sturdy Steel Wheel Spokes */}
            <div className="pv-wheel-spoke spoke-v"></div>
            <div className="pv-wheel-spoke spoke-h"></div>

            {/* Center Heavy Dial Hub */}
            <div className="pv-wheel-hub">
              <div className="pv-hub-core">
                <span className="pv-hub-icon">{status === "unlocked" ? "🔓" : "🛡️"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
