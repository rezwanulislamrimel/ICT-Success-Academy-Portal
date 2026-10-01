import { useEffect, useRef, useState } from 'react';

const T = 20;
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const prep = (qs) => shuffle(qs).map(([q, o, a, w]) => { const opts = shuffle(o.map((t, i) => ({ t, ok: i === a }))); return { q, w, opts, a: opts.findIndex((x) => x.ok) }; });
const ask = (c) => window.dispatchEvent(new CustomEvent('ask-ai', { detail: { text: 'এই MCQ টা সহজ করে বুঝিয়ে দাও: ' + c.q + ' (সঠিক উত্তর: ' + c.opts[c.a].t + ')' } }));

export default function Game({ title, storeKey, qs, onAgain, onExit }) {
  const [deck] = useState(() => prep(qs));
  const [i, setI] = useState(0), [lives, setLives] = useState(3), [score, setScore] = useState(0), [streak, setStreak] = useState(0), [maxS, setMaxS] = useState(0);
  const [time, setTime] = useState(T), [picked, setPicked] = useState(null), [hide, setHide] = useState([]), [used, setUsed] = useState(false);
  const [wrong, setWrong] = useState([]), [right, setRight] = useState(0), [over, setOver] = useState(false), [best, setBest] = useState(0);
  const cur = deck[i];

  useEffect(() => {
    if (picked !== null || over) return;
    if (time <= 0) { pick(-1); return; }
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  });

  function pick(idx) {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === cur.a) { setScore(score + 10 + Math.min(streak, 5) * 2 + Math.floor(time / 5)); setRight(right + 1); setStreak(streak + 1); setMaxS(Math.max(maxS, streak + 1)); }
    else { setLives(lives - 1); setStreak(0); setWrong(wrong.concat([cur])); }
  }
  function next() {
    if (lives <= 0 || i + 1 >= deck.length) {
      let b = score;
      try { const k = 'mcq:' + storeKey; b = Math.max(+localStorage.getItem(k) || 0, score); localStorage.setItem(k, b); } catch (e) { /* ignore */ }
      setBest(b); setOver(true); return;
    }
    setI(i + 1); setPicked(null); setTime(T); setHide([]);
  }
  function lifeline() {
    if (used || picked !== null) return;
    setUsed(true); setHide(shuffle(cur.opts.map((_, k) => k).filter((k) => k !== cur.a)).slice(0, 2));
  }

  if (over) {
    const acc = right / deck.length, stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : acc >= 0.4 ? 1 : 0;
    return (
      <div className="mq-box mq-end">
        <div className="mq-stars">{[1, 2, 3].map((s) => <span key={s} className={s <= stars ? 'on' : ''}>★</span>)}</div>
        <h2>{lives <= 0 ? 'গেম ওভার!' : stars === 3 ? 'দারুণ! অসাধারণ 🎉' : 'শেষ হয়েছে!'}</h2>
        <div className="mq-sum"><div><b>{score}</b><span>স্কোর</span></div><div><b>{right}/{deck.length}</b><span>সঠিক</span></div><div><b>{maxS}🔥</b><span>সেরা স্ট্রিক</span></div><div><b>{best}</b><span>সর্বোচ্চ স্কোর</span></div></div>
        <div className="mq-act"><button className="mq-go" onClick={onAgain}>🔁 আবার খেলো</button><button onClick={onExit}>চ্যাপ্টার তালিকা</button></div>
        {wrong.length > 0 && <div className="mq-wr"><h3>যেগুলো ভুল হয়েছে</h3>
          {wrong.map((c, k) => <div key={k} className="mq-w"><p><b>{c.q}</b></p><p>✔ {c.opts[c.a].t}</p><p className="mq-why">{c.w}</p><button className="askai" onClick={() => ask(c)}>AI-কে ব্যাখ্যা করতে বলো</button></div>)}</div>}
      </div>
    );
  }
  const done = picked !== null;
  return (
    <div className="mq-box">
      <div className="mq-top"><b>{title}</b><button onClick={onExit}>✕ বের হও</button></div>
      <div className="mq-stat"><span>{'❤️'.repeat(Math.max(lives, 0)) || '💔'}</span><span>⭐ {score}</span><span>🔥 {streak}</span><span>{i + 1}/{deck.length}</span></div>
      <div className="mq-bar"><i style={{ width: (time / T) * 100 + '%' }} className={time <= 5 ? 'low' : ''} /></div>
      <h2 className="mq-q">{cur.q}</h2>
      <div className="mq-opts">
        {cur.opts.map((o, k) => (
          <button key={k} disabled={done || hide.includes(k)} style={hide.includes(k) ? { visibility: 'hidden' } : null}
            className={'mq-o' + (done && k === cur.a ? ' ok' : '') + (done && k === picked && k !== cur.a ? ' bad' : '')} onClick={() => pick(k)}>
            <i>{'ক খ গ ঘ'.split(' ')[k]}</i> {o.t}
          </button>))}
      </div>
      {done ? <div className="mq-fb"><p>{picked === cur.a ? '✅ সঠিক! ' : picked === -1 ? '⏰ সময় শেষ! ' : '❌ ভুল। '}{cur.w}</p>
        <button className="mq-go" onClick={next}>{lives <= 0 || i + 1 >= deck.length ? 'ফলাফল দেখো' : 'পরের প্রশ্ন →'}</button></div>
        : <button className="mq-ll" disabled={used} onClick={lifeline}>✂ 50-50 {used ? '(ব্যবহৃত)' : ''}</button>}
    </div>
  );
}
