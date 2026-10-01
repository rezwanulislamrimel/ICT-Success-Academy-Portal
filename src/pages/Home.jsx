import { Link } from 'react-router-dom';
import Converter from '../components/Converter.jsx';

export default function Home() {
  return (
    <div className="wrap">
      <div className="hero">
        <div>
          <img className="hero-logo" src="/hero-logo.webp" alt="ICT Success Academy — Learn, Grow, Succeed" />
          <h1>ICT শেখা হোক সহজ, বুঝে বুঝে</h1>
          <p className="lead">SSC, HSC, অনার্স ও ডিগ্রি — প্রতিটি লেভেলের ICT এক জায়গায়। চ্যাপ্টারভিত্তিক ক্লাস, প্র্যাকটিস প্রশ্ন আর পরীক্ষার প্রস্তুতি।</p>
          <Link className="btn primary" to="/admission">ভর্তি হও</Link>{' '}
          <Link className="btn ghost" to="/courses">কোর্স দেখো</Link>
        </div>
        <Converter />
      </div>
    </div>
  );
}
