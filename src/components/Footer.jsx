import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main wrap">

        {/* Brand */}
        <div className="footer-brand">
          <h3>ICT Success Academy</h3>
          <p>Learn, Grow, Succeed — ICT শিক্ষায় তোমার বিশ্বস্ত সঙ্গী।</p>
          <div className="footer-socials">
            <a href="https://www.facebook.com/ICTSuccessAcademy" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
            </a>
            <a href="https://www.youtube.com/@ICTSuccessAcademy" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="mailto:ictsuccessacademy@gmail.com" aria-label="Email">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/></svg>
            </a>
            <a href="tel:+8801600005412" aria-label="Phone">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>কুইক লিঙ্ক</h4>
          <ul>
            <li><Link to="/">হোম</Link></li>
            <li><Link to="/courses">কোর্সসমূহ</Link></li>
            <li><Link to="/practice">ফ্রি MCQ</Link></li>
            <li><Link to="/about">কেন আমরা</Link></li>
            <li><Link to="/admission">ভর্তি</Link></li>
          </ul>
        </div>

        {/* Tools */}
        <div className="footer-col">
          <h4>আমাদের টুলস</h4>
          <ul>
            <li><Link to="/ai-assistant">ICT গুরু 🧑‍🏫</Link></li>
            <li><Link to="/board-questions">বোর্ড প্রশ্ন 📚</Link></li>
            <li><Link to="/cv-builder">CV Builder 📄</Link></li>
            <li><Link to="/lab">ICT Lab 🔬</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>যোগাযোগ</h4>
          <ul className="footer-contact">
            <li>📞 <a href="tel:+8801600005412">01600005412</a></li>
            <li>📧 <a href="mailto:ictsuccessacademy@gmail.com">ictsuccessacademy@gmail.com</a></li>
            <li>📘 <a href="https://www.facebook.com/ICTSuccessAcademy" target="_blank" rel="noopener noreferrer">Facebook Page</a></li>
            <li>▶️ <a href="https://www.youtube.com/@ICTSuccessAcademy" target="_blank" rel="noopener noreferrer">YouTube Channel</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="wrap">
          <span>© {new Date().getFullYear()} ICT Success Academy। সর্বস্বত্ব সংরক্ষিত।</span>
        </div>
      </div>
    </footer>
  );
}
