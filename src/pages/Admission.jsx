import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WA_NUMBER } from '../config.js';

const wa = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

export default function Admission() {
  const [link, setLink] = useState('');
  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const msg = `আসসালামু আলাইকুম, আমি ICT Success Academy-তে ভর্তি হতে চাই।\n\nনাম: ${f.get('name')}\nমোবাইল: ${f.get('phone')}\nলেভেল: ${f.get('level')}\nপ্রতিষ্ঠান: ${f.get('inst') || '-'}`;
    const u = wa(msg); setLink(u);
    window.open(u, '_blank', 'noopener');
  };
  return (
    <div className="wrap">
      <section>
        <div className="enroll">
          <div>
            <h2>নতুন ব্যাচে ভর্তি চলছে</h2>
            <p>ফর্ম পূরণ করে "WhatsApp-এ পাঠাও" চাপো। তোমার তথ্য সহ মেসেজ সরাসরি আমাদের WhatsApp-এ চলে যাবে।</p>
            <div className="contact">
              <a href="tel:+8801600005412">📞 01600005412</a>
              <a href="mailto:ictsuccessacademy@gmail.com">✉ ictsuccessacademy@gmail.com</a>
              <a href="https://www.facebook.com/ICTSuccessAcademy" target="_blank" rel="noopener noreferrer">Facebook পেজ</a>
            </div>
            <a className="wa-btn" href={wa('আসসালামু আলাইকুম, ICT Success Academy-র ভর্তি সম্পর্কে জানতে চাই।')} target="_blank" rel="noopener noreferrer">💬 সরাসরি WhatsApp-এ মেসেজ করো</a>
            <p><Link to="/practice" style={{ color: 'inherit', fontWeight: 700 }}>🎮 ভর্তির আগে ফ্রি MCQ প্র্যাকটিস করে দেখো →</Link></p>
          </div>
          <form onSubmit={submit}>
            <input name="name" placeholder="তোমার নাম" required autoComplete="name" />
            <input name="phone" placeholder="মোবাইল নম্বর (01XXXXXXXXX)" inputMode="tel" required autoComplete="tel" pattern="01[0-9]{9}" title="১১ ডিজিটের নম্বর, যেমন 01XXXXXXXXX" />
            <select name="level" aria-label="লেভেল" defaultValue="HSC"><option>SSC</option><option>HSC</option><option>অনার্স</option><option>ডিগ্রি</option></select>
            <input name="inst" placeholder="স্কুল/কলেজের নাম (ঐচ্ছিক)" />
            <button type="submit" className="wa">💬 WhatsApp-এ পাঠাও</button>
            {link && <div aria-live="polite">WhatsApp না খুললে <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', fontWeight: 700 }}>এখানে ক্লিক করো</a>।</div>}
          </form>
        </div>
      </section>
    </div>
  );
}
