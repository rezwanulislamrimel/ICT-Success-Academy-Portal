import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  const toggleTheme = () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
  };
  const openAI = (e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('ask-ai', { detail: {} })); };
  return (
    <header>
      <div className="wrap bar">
        <Link className="logo" to="/"><img src="/logo.webp" alt="ICT Success Academy logo" /> <span>ICT Success Academy</span></Link>
        <nav aria-label="প্রধান মেনু">
          <NavLink to="/courses">কোর্স</NavLink>
          <NavLink to="/lab">ল্যাব</NavLink>
          <NavLink to="/practice">🎮 ফ্রি MCQ</NavLink>
          <a href="#" onClick={openAI}>AI সহায়ক</a>
          <NavLink to="/about" className="hide-sm">কেন আমরা</NavLink>
          <NavLink to="/admission">ভর্তি</NavLink>
          <button id="theme" aria-label="থিম পরিবর্তন" onClick={toggleTheme}>◐</button>
        </nav>
      </div>
    </header>
  );
}
