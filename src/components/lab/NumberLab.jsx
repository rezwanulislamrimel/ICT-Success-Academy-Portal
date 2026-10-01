import { useState } from 'react';
import { parseNum, fmt, NAMES } from './nl.js';

const Row = ({ k, v }) => <div className="lb-row"><span>{k}</span><code>{v}</code></div>;
const Hint = ({ t }) => <p className="lb-hint">{t}</p>;

function Convert() {
  const [s, setS] = useState('25.625'); const [b, setB] = useState(10);
  const v = parseNum(s, b), ok = Number.isFinite(v);
  const steps = [];
  if (ok && b === 10 && Number.isInteger(v) && v > 0 && v < 65536) for (let n = v; n > 0; n = Math.floor(n / 2)) steps.push(`${n} ÷ 2 = ${Math.floor(n / 2)}, বাকি ${n % 2}`);
  return (
    <div>
      <div className="lb-in">
        <input value={s} className={ok || !s ? '' : 'err'} onChange={(e) => setS(e.target.value)} aria-label="সংখ্যা" />
        <select value={b} onChange={(e) => setB(+e.target.value)}>{[2, 8, 10, 16].map((x) => <option key={x} value={x}>{NAMES[x]}</option>)}</select>
      </div>
      {ok ? <>{[2, 8, 10, 16].map((x) => <Row key={x} k={NAMES[x]} v={fmt(v, x)} />)}
        {steps.length > 0 && <details><summary>বাইনারি রূপান্তরের ধাপ (নিচ থেকে উপরে পড়ো)</summary><ol>{steps.map((t) => <li key={t}>{t}</li>)}</ol></details>}</>
        : <Hint t="সঠিক সংখ্যা লেখো। ভগ্নাংশের জন্য . ব্যবহার করো, যেমন 101.11" />}
    </div>
  );
}

function Calc() {
  const [a, setA] = useState('1011'); const [b, setB] = useState('110'); const [op, setOp] = useState('+');
  const x = parseNum(a, 2), y = parseNum(b, 2), ok = Number.isFinite(x) && Number.isFinite(y) && !(op === '÷' && y === 0);
  const r = ok ? { '+': x + y, '−': x - y, '×': x * y, '÷': x / y }[op] : NaN;
  return (
    <div>
      <div className="lb-in">
        <input value={a} onChange={(e) => setA(e.target.value)} aria-label="প্রথম বাইনারি" />
        <select value={op} onChange={(e) => setOp(e.target.value)}>{['+', '−', '×', '÷'].map((o) => <option key={o}>{o}</option>)}</select>
        <input value={b} onChange={(e) => setB(e.target.value)} aria-label="দ্বিতীয় বাইনারি" />
      </div>
      {ok ? <><Row k="বাইনারি ফল" v={(r < 0 ? '−' : '') + fmt(Math.abs(r), 2)} /><Row k="দশমিকে" v={`${x} ${op} ${y} = ${+r.toFixed(6)}`} /></> : <Hint t="দুটি সঠিক বাইনারি সংখ্যা দাও (০ ও ১)।" />}
    </div>
  );
}

function Comp() {
  const [s, setS] = useState('00101101'); const [d, setD] = useState('-45');
  const okb = /^[01]+$/.test(s);
  const ones = okb ? [...s].map((c) => (c === '1' ? '0' : '1')).join('') : '';
  const twos = okb ? ((BigInt('0b' + ones) + 1n) & ((1n << BigInt(s.length)) - 1n)).toString(2).padStart(s.length, '0') : '';
  const n = parseInt(d, 10), okd = Number.isInteger(n) && n >= -128 && n <= 127;
  return (
    <div>
      <p className="lb-hint">১ ও ২-এর পরিপূরক (বাইনারি সংখ্যা দাও)</p>
      <div className="lb-in"><input value={s} className={okb || !s ? '' : 'err'} onChange={(e) => setS(e.target.value)} /></div>
      {okb && <><Row k="১-এর পরিপূরক" v={ones} /><Row k="২-এর পরিপূরক" v={twos} /></>}
      <p className="lb-hint">৮ বিটে ঋণাত্মক সংখ্যা (−১২৮ থেকে ১২৭)</p>
      <div className="lb-in"><input value={d} className={okd || !d ? '' : 'err'} onChange={(e) => setD(e.target.value)} /></div>
      {okd && <Row k={`${n} এর ৮ বিট`} v={(n & 255).toString(2).padStart(8, '0')} />}
    </div>
  );
}

function Codes() {
  const [s, setS] = useState('2026');
  const digits = /^\d+$/.test(s), n = digits ? parseInt(s, 10) : null;
  const chars = [...s].slice(0, 8);
  return (
    <div>
      <div className="lb-in"><input value={s} maxLength={12} onChange={(e) => setS(e.target.value)} aria-label="সংখ্যা বা অক্ষর" /></div>
      {digits && <>
        <Row k="BCD" v={[...s].map((c) => (+c).toString(2).padStart(4, '0')).join(' ')} />
        <Row k="Excess-3" v={[...s].map((c) => (+c + 3).toString(2).padStart(4, '0')).join(' ')} />
        {n < 2 ** 31 && <><Row k="বাইনারি" v={n.toString(2)} /><Row k="Gray code" v={(n ^ (n >> 1)).toString(2).padStart(n.toString(2).length, '0')} /></>}
      </>}
      <div className="lb-scroll"><table className="lb-t"><thead><tr><th>অক্ষর</th><th>Dec</th><th>Binary</th><th>Hex</th><th>Unicode</th><th>ASCII?</th></tr></thead>
        <tbody>{chars.map((ch, i) => { const cp = ch.codePointAt(0); return (
          <tr key={i}><td>{ch}</td><td>{cp}</td><td>{cp.toString(2).padStart(cp < 256 ? 8 : 16, '0')}</td><td>{cp.toString(16).toUpperCase()}</td><td>U+{cp.toString(16).toUpperCase().padStart(4, '0')}</td><td>{cp < 128 ? '✔' : '✘'}</td></tr>); })}</tbody></table></div>
      <Hint t="ASCII ৭ বিট (০–১২৭); Unicode-এ বাংলাসহ সব ভাষার অক্ষর আছে।" />
    </div>
  );
}

const TABS = [['রূপান্তর', Convert], ['যোগ-বিয়োগ-গুণ-ভাগ', Calc], ['পরিপূরক', Comp], ['BCD / Gray / ASCII', Codes]];
export default function NumberLab() {
  const [t, setT] = useState(0); const C = TABS[t][1];
  return (<div><div className="lb-sub">{TABS.map(([n], i) => <button key={n} className={i === t ? 'on' : ''} onClick={() => setT(i)}>{n}</button>)}</div><C /></div>);
}
