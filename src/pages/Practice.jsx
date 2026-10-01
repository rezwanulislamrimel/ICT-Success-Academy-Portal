import { useState } from 'react';
import { LEVELS } from '../data.js';
import { TOPICS, getQs, loadExtra } from '../mcq/bank.js';
import { genQs, hasGen } from '../mcq/gen.js';
import Game from '../mcq/Game.jsx';
import '../mcq/mcq.css';

const best = (k) => { try { return +localStorage.getItem('mcq:' + k) || 0; } catch (e) { return 0; } };
const sample = (a, n) => [...a].sort(() => Math.random() - 0.5).slice(0, n);
async function pool(topic, n) { return sample([...getQs(topic), ...(await loadExtra(topic)), ...genQs(topic, 60)], n); }

export default function Practice() {
  const [level, setLevel] = useState('HSC');
  const [play, setPlay] = useState(null);
  const [busy, setBusy] = useState(false);
  const L = LEVELS[level], tp = TOPICS[level];
  const start = async (title, key, topics, per) => {
    setBusy(true);
    const qs = (await Promise.all(topics.map((t) => pool(t, per)))).flat();
    setBusy(false); setPlay({ title, key, topics, per, qs, id: Date.now() });
  };
  const again = async () => { const qs = (await Promise.all(play.topics.map((t) => pool(t, play.per)))).flat(); setPlay({ ...play, qs, id: Date.now() }); };
  if (play) return <div className="wrap"><Game key={play.id} title={play.title} storeKey={play.key} qs={play.qs} onAgain={again} onExit={() => setPlay(null)} /></div>;
  const info = (t) => (hasGen(t) ? '♾️ প্রতিবার নতুন প্রশ্ন' : `${getQs(t).length}টি প্রশ্ন`);
  return (
    <div className="wrap mq-hub" style={{ paddingTop: 26 }}>
      <h1>🎮 ফ্রি MCQ গেম</h1>
      <p className="sub">৩টি জীবন, ২০ সেকেন্ড সময়, স্ট্রিক বোনাস আর 50-50 লাইফলাইন। চ্যাপ্টার বেছে খেলা শুরু করো — একদম ফ্রি!</p>
      <div className="tabs" role="tablist">{Object.keys(LEVELS).map((k) => <button key={k} className="tab" role="tab" aria-selected={k === level} onClick={() => setLevel(k)}>{k}</button>)}</div>
      {busy && <p className="sub">প্রশ্ন সাজানো হচ্ছে…</p>}
      <div className="mq-grid">
        <button className="mq-card mix" onClick={() => start(level + ' — মিক্স চ্যালেঞ্জ', level + ':mix', tp, 8)}>
          <b className="n">🎲</b><span>মিক্স চ্যালেঞ্জ (সব চ্যাপ্টার)</span><small>প্রতি চ্যাপ্টার থেকে ৮টি · সর্বোচ্চ স্কোর {best(level + ':mix')}</small></button>
        {L.chapters.map((c, i) => (
          <button key={c[0]} className="mq-card" onClick={() => start(c[0], level + ':' + i, [tp[i]], 20)}>
            <b className="n">{i + 1}</b><span>{c[0]}</span><small>{info(tp[i])} · সর্বোচ্চ স্কোর {best(level + ':' + i)}</small></button>))}
      </div>
    </div>
  );
}
