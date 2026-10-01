import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import AIChat from './components/AIChat.jsx';
import Home from './pages/Home.jsx';
import Courses from './pages/Courses.jsx';
import Practice from './pages/Practice.jsx';
import About from './pages/About.jsx';
import Admission from './pages/Admission.jsx';

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/about" element={<About />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <AIChat />
    </>
  );
}
