import { useState } from 'react';
import { LEVELS } from '../data.js';

export default function Courses() {
  const [level, setLevel] = useState('HSC');
  const L = LEVELS[level];
  return (
    <div className="wrap">
      <section>
        <div className="sec-head"><h2>লেভেল অনুযায়ী কোর্স</h2><p>তোমার ক্লাস বেছে নাও।</p></div>
        <div className="tabs" role="tablist">
          {Object.keys(LEVELS).map((k) => (
            <button key={k} className="tab" role="tab" aria-selected={k === level} onClick={() => setLevel(k)}>{k}</button>
          ))}
        </div>
        <div className="panel" role="tabpanel">
          <div className="meta">{L.meta.map((m) => <span key={m}>{m}</span>)}</div>
          <ul className="chapters">
            {L.chapters.map((c, i) => (
              <li key={c[0]}><b>{i + 1}</b><div><span>{c[0]}</span><em>{c[1]}</em></div></li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
