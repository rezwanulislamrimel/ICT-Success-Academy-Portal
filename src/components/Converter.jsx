import { useState } from 'react';

const BASES = [10, 2, 8, 16];
const VALID = { 10: /^[0-9]+$/, 2: /^[01]+$/, 8: /^[0-7]+$/, 16: /^[0-9a-fA-F]+$/ };
const NAMES = { 10: 'Decimal', 2: 'Binary', 8: 'Octal', 16: 'Hex' };

export default function Converter() {
  const [n, setN] = useState(25);
  const [raw, setRaw] = useState({});
  const [err, setErr] = useState(null);

  const onChange = (b, v) => {
    v = v.trim();
    setRaw({ [b]: v });
    if (!v) return setErr(null);
    const num = VALID[b].test(v) ? parseInt(v, b) : NaN;
    if (!Number.isSafeInteger(num)) return setErr(b);
    setErr(null); setN(num);
  };
  const bits = (n & 255).toString(2).padStart(8, '0');

  return (
    <div className="conv" aria-labelledby="convT">
      <h2 id="convT">সংখ্যা পদ্ধতি কনভার্টার</h2>
      <small>যেকোনো ঘরে লেখো, বাকিগুলো নিজে নিজে বদলে যাবে।</small>
      {BASES.map((b) => (
        <label key={b}>{NAMES[b]}{' '}
          <input className={err === b ? 'err' : ''} autoComplete="off"
            value={raw[b] ?? n.toString(b).toUpperCase()} onChange={(e) => onChange(b, e.target.value)} />
        </label>
      ))}
      <div className="bits" aria-label="৮ বিট">
        {[...bits].map((ch, i) => (
          <button key={i} className={'bit' + (ch === '1' ? ' on' : '')} aria-label={`বিট ${7 - i}: ${ch}`}
            onClick={() => { setN((n & 255) ^ (1 << (7 - i))); setRaw({}); setErr(null); }}>{ch}</button>
        ))}
      </div>
      <div className="bitnote">বিটে ক্লিক করে ০/১ বদলাও (৮ বিট, ০–২৫৫)</div>
    </div>
  );
}
