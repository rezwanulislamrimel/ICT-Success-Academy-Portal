// import { Link, NavLink } from 'react-router-dom';

// export default function Header() {
//   const toggleTheme = () => {
//     const root = document.documentElement;
//     const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
//     root.dataset.theme = dark ? 'light' : 'dark';
//   };
//   const openAI = (e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('ask-ai', { detail: {} })); };
//   return (
//     <header>
//       <div className="wrap bar">
//         <Link className="logo" to="/"><img src="/logo.webp" alt="ICT Success Academy logo" /> <span>ICT Success Academy</span></Link>
//         <nav aria-label="প্রধান মেনু">
//           <NavLink to="/courses">কোর্স</NavLink>
//           <NavLink to="/lab">ল্যাব</NavLink>
//           <NavLink to="/practice">🎮 ফ্রি MCQ</NavLink>
//           <a href="#" onClick={openAI}>AI সহায়ক</a>
//           <NavLink to="/about" className="hide-sm">কেন আমরা</NavLink>
//           <NavLink to="/admission">ভর্তি</NavLink>
//           <button id="theme" aria-label="থিম পরিবর্তন" onClick={toggleTheme}>◐</button>
//         </nav>
//       </div>
//     </header>
//   );
// }



import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ictUser');
      if (saved) setUser(JSON.parse(saved));
    } catch (_) {}
  }, []);

  // Scroll hole header e floating effect ar blur baranor jonno
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
  };

  const openAI = (e) => { 
    e.preventDefault(); 
    window.dispatchEvent(new CustomEvent('ask-ai', { detail: {} })); 
  };

  return (
    <header className={`world-class-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="wrap bar">
        {/* Modern Logo with Glow Animation */}
        <Link className="logo" to="/">
          <div className="logo-icon-wrapper">
            <img src="/logo.webp" alt="ICT Success Academy logo" />
          </div>
          <span className="logo-text">ICT Success Academy</span>
        </Link>

        {/* Navigation with Smooth Hover & Active Pill Animation */}
        <nav aria-label="প্রধান মেনু" className={isOpen ? 'nav-open' : ''}>
          <NavLink to="/courses" onClick={() => setIsOpen(false)}>কোর্স</NavLink>
          <NavLink to="/lab" onClick={() => setIsOpen(false)}>ল্যাব</NavLink>
          <NavLink to="/practice" onClick={() => setIsOpen(false)}>🎮 ফ্রি MCQ</NavLink>
          <a href="#" onClick={(e) => { openAI(e); setIsOpen(false); }} className="ai-link">AI সহায়ক ✨</a>
          <NavLink to="/about" className="hide-sm" onClick={() => setIsOpen(false)}>কেন আমরা</NavLink>
          <NavLink to="/admission" className="admission-pill" onClick={() => setIsOpen(false)}>ভর্তি 🚀</NavLink>
          
          {/* Dashboard Dynamic Button */}
          {user ? (
            <NavLink to="/dashboard" onClick={() => setIsOpen(false)} style={{ color: '#16a34a', fontWeight: 'bold' }}>
              📊 {user.name.split(' ')[0]}'s Profile
            </NavLink>
          ) : (
            <NavLink to="/dashboard" onClick={() => setIsOpen(false)} style={{ color: '#0d9488', fontWeight: 'bold' }}>
              📊 Login Dashboard
            </NavLink>
          )}

          <button id="theme" aria-label="থিম পরিবর্তন" onClick={toggleTheme}>◐</button>
        </nav>

        {/* Animated Mobile Hamburger Button */}
        <button 
          className={`mobile-toggle-btn ${isOpen ? 'open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}