import { lazy, Suspense, useState } from 'react';
import NumberLab from './NumberLab.jsx';
import LogicLab from './LogicLab.jsx';
import HtmlLab from './HtmlLab.jsx';
import CLab from './CLab.jsx';
import './lab.css';

const SqlLab = lazy(() => import('./SqlLab.jsx'));
const TABS = [
  ['🔢', 'সংখ্যা ও কোড', NumberLab],
  ['🔌', 'লজিক গেট', LogicLab],
  ['🌐', 'HTML প্লেগ্রাউন্ড', HtmlLab],
  ['💻', 'C প্রোগ্রামিং', CLab],
  ['🗄️', 'SQL ডেটাবেজ', SqlLab]
];

export default function Lab() {
  const [t, setT] = useState(0); const C = TABS[t][2];
  return (
    <div className="lb">
      <div className="lb-tabs" role="tablist">{TABS.map(([i, n], k) => <button key={n} role="tab" aria-selected={k === t} onClick={() => setT(k)}><span>{i}</span> {n}</button>)}</div>
      <div className="lb-body"><Suspense fallback={<p className="lb-hint">লোড হচ্ছে…</p>}><C /></Suspense></div>
    </div>
  );
}
