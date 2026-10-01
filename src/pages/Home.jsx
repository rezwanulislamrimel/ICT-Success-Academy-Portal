import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Converter from '../components/Converter.jsx';
import Lab from '../components/lab/Lab.jsx';
import { LEVELS } from '../data.js';
import '../home.css';

function useInView() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return [ref, seen];
}
const Reveal = ({ children, className = '' }) => {
  const [ref, seen] = useInView();
  return <div ref={ref} className={`rv ${seen ? 'in' : ''} ${className}`}>{children}</div>;
};
function Stat({ to, suffix = '', label }) {
  const [ref, seen] = useInView();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen) return;
    let i = 0; const t = setInterval(() => { i++; setV(Math.round((to * i) / 25)); if (i >= 25) clearInterval(t); }, 30);
    return () => clearInterval(t);
  }, [seen, to]);
  return <div className="hx-stat" ref={ref}><b>{v}{suffix}</b><span>{label}</span></div>;
}

const ICONS = { 'SSC': '🎒', 'HSC': '🎓', 'অনার্স': '🏛️', 'ডিগ্রি': '📘' };
const FEATS = [
  ['📚', 'চ্যাপ্টার ধরে ক্লাস', 'সিলেবাসের ক্রম মেনে পাঠ, যাতে কিছু বাদ না পড়ে।'],
  ['💻', 'হাতে-কলমে প্র্যাকটিস', 'সংখ্যা পদ্ধতি, HTML, প্রোগ্রামিং ও ডেটাবেজ নিজে করে শেখা।'],
  ['📝', 'পরীক্ষার প্রস্তুতি', 'MCQ, সৃজনশীল ও ব্যবহারিক — তিন ধরনের মডেল টেস্ট।'],
];
const STEPS = [
  ['লেভেল বেছে নাও', 'SSC, HSC, অনার্স বা ডিগ্রি — তোমার ক্লাসের কোর্স দেখো।'],
  ['ভর্তি হও', 'নাম আর মোবাইল নম্বর দাও, আমরা ব্যাচের সময় জানাব।'],
  ['শেখো ও প্র্যাকটিস করো', 'ক্লাসের পাশাপাশি MCQ ও AI সহায়কে প্রস্তুতি নাও।'],
];
const openAI = () => window.dispatchEvent(new CustomEvent('ask-ai', { detail: {} }));

export default function Home() {
  const chapters = Object.values(LEVELS).reduce((a, l) => a + l.chapters.length, 0);
  const floats = [['01', '8%', '12%', 0], ['</>', '70%', '8%', 2], ['AND', '88%', '60%', 1], ['1010', '40%', '85%', 3], ['{ }', '5%', '70%', 4]];
  return (
    <div className="wrap">
      <section className="hx-hero">
        {floats.map(([t, l, tp, d]) => <span key={t} className="hx-float" style={{ left: l, top: tp, animationDelay: d + 's', fontSize: 22 }}>{t}</span>)}
        <div className="hero">
          <div>
            <span className="hx-badge"><i /> নতুন ব্যাচে ভর্তি চলছে</span>
            <h1>ICT শেখা হোক <em>সহজ</em>, বুঝে বুঝে</h1>
            <p className="lead">SSC, HSC, অনার্স ও ডিগ্রি — প্রতিটি লেভেলের ICT এক জায়গায়। চ্যাপ্টারভিত্তিক ক্লাস, প্র্যাকটিস প্রশ্ন, আর যেকোনো সময় AI সহায়ক।</p>
            <Link className="btn primary" to="/admission">এখনই ভর্তি হও →</Link>{' '}
            <Link className="btn ghost" to="/courses" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.6)' }}>কোর্স দেখো</Link>
            <div className="hx-chips"><span>✔ চ্যাপ্টারভিত্তিক</span><span>✔ AI সহায়ক</span><Link to="/practice" style={{ color: 'inherit' }}><span>🎮 ফ্রি MCQ গেম</span></Link></div>
          </div>
          <Converter />
        </div>
      </section>

      <div className="hx-stats">
        <Stat to={4} label="লেভেলের কোর্স" />
        <Stat to={chapters} suffix="+" label="চ্যাপ্টার কভার" />
        <Stat to={3} label="ধরনের পরীক্ষা প্রস্তুতি" />
        <Stat to={24} suffix="/৭" label="AI সহায়ক" />
      </div>

      <Reveal className="hx-sec">
        <h2>ICT ল্যাব — নিজে করে শেখো</h2><p className="sub">সংখ্যা পদ্ধতি, কোড, লজিক গেট, HTML ও SQL — সব এক জায়গায়, সাথে সাথে ফলাফল।</p>
        <Lab />
      </Reveal>

      <Reveal className="hx-sec">
        <h2>তোমার লেভেল বেছে নাও</h2><p className="sub">প্রতিটি লেভেলের জন্য আলাদা চ্যাপ্টার ও প্রস্তুতি।</p>
        <div className="hx-levels">
          {Object.entries(LEVELS).map(([k, L]) => (
            <Link key={k} to="/courses" className="hx-lv">
              <div className="ic">{ICONS[k]}</div><h3>{k}</h3><small>{L.meta[0]}</small>
              <em>{L.chapters.length}টি চ্যাপ্টার দেখো →</em>
            </Link>
          ))}
        </div>
      </Reveal>

      <Reveal className="hx-sec">
        <h2>কেন ICT Success Academy?</h2><p className="sub">বুঝে পড়ো, নিজে করো, আত্মবিশ্বাস নিয়ে পরীক্ষা দাও।</p>
        <div className="hx-feat">{FEATS.map(([i, t, p]) => <div className="hx-f" key={t}><div className="ic">{i}</div><h3>{t}</h3><p>{p}</p></div>)}</div>
      </Reveal>

      <Reveal className="hx-sec">
        <div className="hx-ai">
          <div>
            <span className="hx-badge" style={{ color: 'var(--brand)', background: 'transparent' }}>🤖 AI সহায়ক</span>
            <h2 style={{ margin: '0 0 8px' }}>পড়তে আটকে গেলে AI-কে জিজ্ঞেস করো</h2>
            <p style={{ color: 'var(--muted)' }}>বাংলা, ইংরেজি বা Banglish — যেভাবে খুশি প্রশ্ন করো। সহজ ভাষায় উদাহরণসহ উত্তর পাবে। ভয়েসেও প্রশ্ন করা যায়।</p>
            <button className="btn primary" onClick={openAI}>AI-কে প্রশ্ন করো</button>{' '}
            <Link className="btn ghost" to="/practice">MCQ প্র্যাকটিস</Link>
          </div>
          <div className="hx-demo" aria-hidden="true">
            <div className="u">বাইনারি 1010 এর দশমিক মান কত?</div>
            <div className="a"><b>উত্তর: ১০।</b><br />1×8 + 0×4 + 1×2 + 0×1 = 10। পরীক্ষায় ঘরের মান লিখে দেখালে পুরো নম্বর পাবে।</div>
          </div>
        </div>
      </Reveal>

      <Reveal className="hx-sec">
        <h2>শুরু করা খুব সহজ</h2><p className="sub">তিন ধাপেই তুমি প্রস্তুত।</p>
        <div className="hx-steps">{STEPS.map(([t, p]) => <div className="hx-step" key={t}><h3>{t}</h3><p>{p}</p></div>)}</div>
      </Reveal>

      <Reveal>
        <div className="hx-cta">
          <h2>আজই তোমার ICT যাত্রা শুরু করো</h2>
          <p>নতুন ব্যাচে সিট সীমিত। এখনই যোগাযোগ করো।</p>
          <Link className="btn dark" to="/admission">ভর্তির আবেদন</Link>
          <Link className="btn ghost" to="/practice" style={{ borderColor: '#2A1B00', color: '#2A1B00' }}>🎮 ফ্রি MCQ খেলো</Link>
          <a className="btn ghost" href="tel:+8801600005412" style={{ borderColor: '#2A1B00', color: '#2A1B00' }}>📞 01600005412</a>
        </div>
      </Reveal>
    </div>
  );
}
