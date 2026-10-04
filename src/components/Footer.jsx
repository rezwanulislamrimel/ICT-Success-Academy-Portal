import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        {/* ─── PRE-FOOTER CTA CARD ─── */}
        <div className="footer-cta-wrap">
          <div className="footer-cta-card">
            <div className="footer-cta-content">
              <h3>🚀 ICT প্রস্তুতিতে কোনো আপস নয়!</h3>
              <p>
                আজই যুক্ত হও সেরা মেন্টরশিপ ও স্মার্ট রিসোর্সের সাথে। ভর্তি হও
                অথবা ফ্রি টেস্ট দিয়ে শুরু করো।
              </p>
            </div>
            <div className="footer-cta-actions">
              <Link to="/admission" className="footer-btn-primary">
                ভর্তি আবেদন করো ⚡
              </Link>
              <Link to="/practice" className="footer-btn-secondary">
                ফ্রি MCQ পরীক্ষা 🎯
              </Link>
            </div>
          </div>
        </div>

        {/* ─── MAIN FOOTER GRID ─── */}
        <div className="footer-main-grid">
          {/* 1. Brand Column */}
          <div className="footer-brand-col">
            <div className="footer-live-badge">
              <span className="pulse-dot"></span>
              <span>২০২৬ সেশনে ভর্তি কার্যক্রম চলছে</span>
            </div>

            <h3 className="footer-logo-title">
              <span className="grad-text">ICT Success Academy</span>
            </h3>

            <p className="footer-brand-desc">
              HSC, SSC, অনার্স ও ডিগ্রি শিক্ষার্থীদের জন্য দেশের সবচেয়ে
              বিশ্বস্ত ও আধুনিক ICT লার্নিং প্ল্যাটফর্ম। Learn, Grow & Succeed!
            </p>

            <div className="footer-stats-strip">
              <span>⭐ ৫.০ রেটিং</span>
              <span>•</span>
              <span>👨‍🎓 ১০০+ শিক্ষার্থী</span>
              <span>•</span>
              <span>🏆 শীর্ষ সাফল্য</span>
            </div>

            {/* Social Icons */}
            <div className="footer-social-row">
              <a
                href="https://www.facebook.com/ICTSuccessAcademy"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn facebook"
                aria-label="Facebook Page"
                title="Facebook"
              >
                <svg
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              <a
                href="https://www.youtube.com/@ICTSuccessAcademy"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn youtube"
                aria-label="YouTube Channel"
                title="YouTube"
              >
                <svg
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/ictsuccessacademy2026"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn instagram"
                aria-label="Instagram Profile"
                title="Instagram"
              >
                <svg
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>

              <a
                href="mailto:ictsuccessacademy@gmail.com"
                className="footer-social-btn email"
                aria-label="Direct Email"
                title="Email Us"
              >
                <svg
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
              </a>

              <a
                href="tel:+8801600005412"
                className="footer-social-btn phone"
                aria-label="Call Hotline"
                title="Call 01600005412"
              >
                <svg
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* 2. Quick Navigation */}
          <div className="footer-nav-col">
            <h4>কুইক লিঙ্ক</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/">🏠 হোম পেজ</Link>
              </li>
              <li>
                <Link to="/courses">
                  📚 কোর্সসমূহ <span className="link-tag hot">জনপ্রিয়</span>
                </Link>
              </li>
              <li>
                <Link to="/practice">🎯 ফ্রি MCQ টেস্ট</Link>
              </li>
              <li>
                <Link to="/about">💡 কেন আমরা</Link>
              </li>
              <li>
                <Link to="/admission">
                  📝 ভর্তি আবেদন <span className="link-tag new">সরাসরি</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Smart Tools & Features */}
          <div className="footer-nav-col">
            <h4>স্মার্ট রিসোর্স</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/ai-assistant">
                  🧑‍🏫 ICT গুরু <span className="link-tag ai">AI টিউটর</span>
                </Link>
              </li>
              <li>
                <Link to="/board-questions">
                  📚 বোর্ড প্রশ্ন <span className="link-tag new">২০১৮-২৬</span>
                </Link>
              </li>
              <li>
                <Link to="/cv-builder">
                  📄 CV Builder <span className="link-tag">Overleaf</span>
                </Link>
              </li>
              <li>
                <Link to="/lab">🔬 ভার্চুয়াল ICT Lab</Link>
              </li>
              <li>
                <Link to="/dashboard">📊 শিক্ষার্থী ড্যাশবোর্ড</Link>
              </li>
            </ul>
          </div>

          {/* 4. Contact & Hotline */}
          <div className="footer-nav-col">
            <h4>যোগাযোগ ও হেল্প</h4>
            <div className="footer-contact-box">
              <a href="tel:+8801600005412" className="contact-card-item">
                <div className="contact-card-icon">📞</div>
                <div className="contact-card-info">
                  <span className="contact-card-label">
                    হটলাইন সাপোর্ট (সকাল ৯টা - রাত ১০টা)
                  </span>
                  <span className="contact-card-val">01600005412</span>
                </div>
              </a>

              <a
                href="mailto:ictsuccessacademy@gmail.com"
                className="contact-card-item"
              >
                <div className="contact-card-icon">📧</div>
                <div className="contact-card-info">
                  <span className="contact-card-label">
                    অফিসিয়াল ইমেইল সাপোর্ট
                  </span>
                  <span className="contact-card-val">
                    ictsuccessacademy@gmail.com
                  </span>
                </div>
              </a>

              <a
                href="https://www.facebook.com/ICTSuccessAcademy"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-item"
              >
                <div className="contact-card-icon">📘</div>
                <div className="contact-card-info">
                  <span className="contact-card-label">
                    ফেসবুক অফিসিয়াল পেজ
                  </span>
                  <span className="contact-card-val">
                    fb.com/ICTSuccessAcademy
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM LEGAL & TRUST BAR ─── */}
      <div className="footer-bottom-bar">
        <div className="wrap footer-bottom-wrap">
          <div className="footer-copyright">
            © {new Date().getFullYear()} <strong>ICT Success Academy</strong>।
            সর্বস্বত্ব সংরক্ষিত।
          </div>

          <div className="footer-trust-badge">
            <span>Made with 💚 in Bangladesh for ICT Students 🇧🇩</span>
          </div>

          <div className="footer-sys-status">
            <span
              className="pulse-dot"
              style={{ width: "6px", height: "6px" }}
            ></span>
            <span>All Systems Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
