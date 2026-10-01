import { useEffect, useState } from 'react';

const START = `<h1>আমার ওয়েবপেজ</h1>\n<p>এখানে HTML লেখো, পাশে সাথে সাথে ফলাফল দেখবে।</p>\n<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n</ul>`;
const SNIP = {
  'টেবিল': `<table border="1" cellpadding="6">\n  <tr><th>নাম</th><th>নম্বর</th></tr>\n  <tr><td>রহিম</td><td>78</td></tr>\n  <tr><td>সুমি</td><td>91</td></tr>\n</table>`,
  'ফর্ম': `<form>\n  <label>নাম: <input type="text" placeholder="তোমার নাম"></label><br><br>\n  <label>লেভেল:\n    <select><option>SSC</option><option>HSC</option></select>\n  </label><br><br>\n  <input type="radio" name="g"> ছেলে <input type="radio" name="g"> মেয়ে<br><br>\n  <button>জমা দাও</button>\n</form>`,
  'লিংক': `<a href="https://www.facebook.com/ICTSuccessAcademy">আমাদের পেজ</a>\n<hr>\n<h2>হেডিং ২</h2>\n<p><b>বোল্ড</b>, <i>ইটালিক</i>, <u>আন্ডারলাইন</u></p>`,
  'স্টাইল': `<style>\n  h1 { color: #0B3A8C; }\n  p { background: #FFF3D6; padding: 10px; border-radius: 8px; }\n</style>\n<h1>রঙিন হেডিং</h1>\n<p>CSS দিয়ে সাজানো প্যারাগ্রাফ</p>`,
};

export default function HtmlLab() {
  const [code, setCode] = useState(START); const [doc, setDoc] = useState(START);
  useEffect(() => { const t = setTimeout(() => setDoc(code), 250); return () => clearTimeout(t); }, [code]);
  return (
    <div>
      <div className="lb-sub">{Object.keys(SNIP).map((k) => <button key={k} onClick={() => setCode(SNIP[k])}>{k}</button>)}<button onClick={() => setCode('')}>খালি করো</button></div>
      <div className="lb-split">
        <textarea value={code} spellCheck="false" onChange={(e) => setCode(e.target.value)} aria-label="HTML কোড" />
        <iframe title="প্রিভিউ" sandbox="" srcDoc={`<meta charset="utf-8"><style>body{font-family:sans-serif;padding:10px}</style>${doc}`} />
      </div>
      <p className="lb-hint">বাম পাশে লিখলেই ডান পাশে সাথে সাথে ফলাফল। (নিরাপত্তার জন্য JavaScript বন্ধ।)</p>
    </div>
  );
}
