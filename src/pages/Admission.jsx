import { useState } from 'react';

export default function Admission() {
  const [msg, setMsg] = useState('');
  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = `নাম: ${fd.get('name')}\nমোবাইল: ${fd.get('phone')}\nলেভেল: ${fd.get('level')}`;
    setMsg('ইমেইল অ্যাপ খুলছে। না খুললে উপরের নম্বরে কল করো।');
    window.location.href = 'mailto:ictsuccessacademy@gmail.com?subject=' + encodeURIComponent('ভর্তির আবেদন - ' + fd.get('level')) + '&body=' + encodeURIComponent(body);
  };
  return (
    <div className="wrap">
      <section>
        <div className="enroll">
          <div>
            <h2>নতুন ব্যাচে ভর্তি চলছে</h2>
            <p>নাম ও মোবাইল নম্বর দাও। আমরা যোগাযোগ করে ব্যাচের সময় জানিয়ে দেব।</p>
            <div className="contact">
              <a href="tel:+8801600005412">📞 01600005412</a>
              <a href="mailto:ictsuccessacademy@gmail.com">✉ ictsuccessacademy@gmail.com</a>
              <a href="https://www.facebook.com/ICTSuccessAcademy" target="_blank" rel="noopener noreferrer">Facebook পেজ</a>
            </div>
          </div>
          <form onSubmit={submit}>
            <input name="name" placeholder="তোমার নাম" required autoComplete="name" />
            <input name="phone" placeholder="মোবাইল নম্বর" inputMode="tel" required autoComplete="tel" pattern="01[0-9]{9}" title="১১ ডিজিটের নম্বর, যেমন 01XXXXXXXXX" />
            <select name="level" aria-label="লেভেল" defaultValue="HSC">
              <option>SSC</option><option>HSC</option><option>অনার্স</option><option>ডিগ্রি</option>
            </select>
            <button type="submit">আবেদন করো</button>
            <div aria-live="polite">{msg}</div>
          </form>
        </div>
      </section>
    </div>
  );
}
