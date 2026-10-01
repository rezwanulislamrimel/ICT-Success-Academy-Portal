import { useState } from 'react';
import { QUIZ } from '../data.js';

export default function Practice() {
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState(null);
  const [right, setRight] = useState(0);
  const [done, setDone] = useState(0);
  const Q = QUIZ[qi];

  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i); setDone(done + 1);
    if (i === Q.a) setRight(right + 1);
  };
  const askAI = () => window.dispatchEvent(new CustomEvent('ask-ai', {
    detail: { text: 'এই MCQ টা সহজ করে বুঝিয়ে দাও: ' + Q.q + ' (সঠিক উত্তর: ' + Q.o[Q.a] + ')' } }));

  return (
    <div className="wrap">
      <section>
        <div className="quiz">
          <div className="sec-head" style={{ margin: 0 }}>
            <h2>দ্রুত প্র্যাকটিস</h2>
            <p>প্রতিদিন কয়েকটি MCQ করলে ভুলগুলো আগেই ধরা পড়ে। উত্তর বেছে নিলেই ব্যাখ্যা দেখা যাবে।</p>
          </div>
          <div className="qcard">
            <div className="q">{Q.q}</div>
            <div>
              {Q.o.map((t, i) => (
                <button key={i} className={'opt' + (picked !== null && i === Q.a ? ' ok' : '') + (picked === i && i !== Q.a ? ' bad' : '')}
                  disabled={picked !== null} onClick={() => pick(i)}>{t}</button>
              ))}
            </div>
            <div aria-live="polite">{picked !== null && (picked === Q.a ? 'সঠিক। ' : 'ভুল। ') + Q.w}</div>
            {picked !== null && <button className="askai" onClick={askAI}>AI-কে ব্যাখ্যা করতে বলো</button>}
            <div className="qfoot">
              <span>{done ? `সঠিক ${right} / ${done}` : `প্রশ্ন ${qi + 1} / ${QUIZ.length}`}</span>
              <button onClick={() => { setQi((qi + 1) % QUIZ.length); setPicked(null); }}>পরের প্রশ্ন</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
