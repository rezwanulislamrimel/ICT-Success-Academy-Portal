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

import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ictUser");
      if (saved) setUser(JSON.parse(saved));
    } catch (_) {}
  }, []);

  // Scroll hole header e floating effect ar blur baranor jonno
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
  };

  const openAI = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("ask-ai", { detail: {} }));
  };

  return (
    <header className={`world-class-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="wrap bar">
        {/* Modern Logo with Glow Animation */}
        <Link className="logo" to="/">
          <div className="logo-icon-wrapper">
            <img src="/logo.webp" alt="ICT Success Academy logo" />
          </div>
          <span className="logo-text">ICT Success Academy</span>
        </Link>

        {/* Navigation with Smooth Hover & Active Pill Animation */}
        <nav aria-label="প্রধান মেনু" className={isOpen ? "nav-open" : ""}>
          <NavLink to="/courses" onClick={() => setIsOpen(false)}>
            কোর্স
          </NavLink>
          <NavLink to="/lab" onClick={() => setIsOpen(false)}>
            ল্যাব
          </NavLink>
          <NavLink to="/practice" onClick={() => setIsOpen(false)}>
            🎮 ফ্রি MCQ
          </NavLink>
          <a
            href="#"
            onClick={(e) => {
              openAI(e);
              setIsOpen(false);
            }}
            className="ai-link"
          >
            AI সহায়ক ✨
          </a>
          <NavLink
            to="/about"
            className="hide-sm"
            onClick={() => setIsOpen(false)}
          >
            কেন আমরা
          </NavLink>
          <NavLink
            to="/admission"
            className="admission-pill"
            onClick={() => setIsOpen(false)}
          >
            ভর্তি 🚀
          </NavLink>

          {/* Login / Profile Button */}
          {user ? (
            <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className="nav-profile-btn">
              <span className="nav-avatar-circle">
                {user.photo
                  ? <img src={user.photo} alt="" className="nav-avatar-img" />
                  : user.name.charAt(0).toUpperCase()
                }
              </span>
              <span>{user.name.split(" ")[0]}</span>
            </NavLink>
          ) : (
            <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className="nav-login-btn">
              🔑 Login
            </NavLink>
          )}

          <button id="theme" aria-label="থিম পরিবর্তন" onClick={toggleTheme}>
            ◐
          </button>
        </nav>

        {/* Animated Mobile Hamburger Button */}
        <button
          className={`mobile-toggle-btn ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <style>{`
        .nav-login-btn {
          display: inline-flex !important;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #16a34a, #0d9488) !important;
          color: #fff !important;
          font-weight: 700 !important;
          font-size: 14px !important;
          padding: 8px 20px !important;
          border-radius: 50px !important;
          text-decoration: none !important;
          transition: transform 0.2s, box-shadow 0.2s !important;
          box-shadow: 0 3px 14px rgba(22,163,74,0.4) !important;
          letter-spacing: 0.3px;
        }
        .nav-login-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 22px rgba(22,163,74,0.55) !important;
          color: #fff !important;
          opacity: 0.93;
        }
        .nav-profile-btn {
          display: inline-flex !important;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #14532d, #16a34a) !important;
          color: #fff !important;
          font-weight: 700 !important;
          font-size: 14px !important;
          padding: 5px 16px 5px 5px !important;
          border-radius: 50px !important;
          text-decoration: none !important;
          transition: transform 0.2s, box-shadow 0.2s !important;
          box-shadow: 0 3px 14px rgba(20,83,45,0.4) !important;
        }
        .nav-profile-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 22px rgba(22,163,74,0.55) !important;
          color: #fff !important;
        }
        .nav-avatar-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255,255,255,0.22);
          border: 2px solid rgba(255,255,255,0.5);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
          color: #fff;
          overflow: hidden;
          flex-shrink: 0;
        }
        .nav-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
      `}</style>
    </header>
  );
}

// Build CV tempalte if needed turn this on

// import React, { useState, useEffect } from "react";
// import { Link, NavLink } from "react-router-dom";

// export default function Header() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [user, setUser] = useState(null);

//   // CV Builder Modal State
//   const [isCVModalOpen, setIsCVModalOpen] = useState(false);

//   // Default CV Data (Dummy placeholders)
//   const [cvData, setCvData] = useState({
//     name: "[ Your Name Here ]",
//     title: "SQA Engineer | Your Location",
//     phone: "+8801XXXXXXXXX",
//     email: "your.email@gmail.com",
//     linkedin: "linkedin.com/in/yourprofile",
//     github: "github.com/yourusername",
//     summary:
//       "Write a short professional summary about your background, expertise in software testing, automation, and core skills.",
//     experienceCompany: "Company Name Ltd.",
//     experienceRole:
//       "Your Designation - Remote / On-site (Month Year - Present)",
//     experienceDetails:
//       "• Read through requirements and created test plans.\n• Wrote and executed test cases for functional & regression testing.\n• Logged and tracked bugs effectively.",
//     education: "University Name - Your Degree / Major (Year)",
//     skills:
//       "Manual Testing, Automation, Playwright, JavaScript, Postman, Jira, Git",
//   });

//   useEffect(() => {
//     try {
//       const saved = localStorage.getItem("ictUser");
//       if (saved) setUser(JSON.parse(saved));
//     } catch (_) {}
//   }, []);

//   // Scroll hole header e floating effect ar blur baranor jonno
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const toggleTheme = () => {
//     const root = document.documentElement;
//     const dark = root.dataset.theme
//       ? root.dataset.theme === "dark"
//       : matchMedia("(prefers-color-scheme: dark)").matches;
//     root.dataset.theme = dark ? "light" : "dark";
//   };

//   const openAI = (e) => {
//     e.preventDefault();
//     window.dispatchEvent(new CustomEvent("ask-ai", { detail: {} }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCvData({ ...cvData, [name]: value });
//   };

//   const handleDownloadPDF = () => {
//     window.print();
//   };

//   return (
//     <>
//       <header className={`world-class-header ${scrolled ? "is-scrolled" : ""}`}>
//         <div className="wrap bar">
//           {/* Modern Logo with Glow Animation */}
//           <Link className="logo" to="/">
//             <div className="logo-icon-wrapper">
//               <img src="/logo.webp" alt="ICT Success Academy logo" />
//             </div>
//             <span className="logo-text">ICT Success Academy</span>
//           </Link>

//           {/* Navigation with Smooth Hover & Active Pill Animation */}
//           <nav aria-label="প্রধান মেনু" className={isOpen ? "nav-open" : ""}>
//             <NavLink to="/courses" onClick={() => setIsOpen(false)}>
//               কোর্স
//             </NavLink>
//             <NavLink to="/lab" onClick={() => setIsOpen(false)}>
//               ল্যাব
//             </NavLink>
//             <NavLink to="/practice" onClick={() => setIsOpen(false)}>
//               🎮 ফ্রি MCQ
//             </NavLink>
//             <a
//               href="#"
//               onClick={(e) => {
//                 openAI(e);
//                 setIsOpen(false);
//               }}
//               className="ai-link"
//             >
//               AI সহায়ক ✨
//             </a>
//             <NavLink
//               to="/about"
//               className="hide-sm"
//               onClick={() => setIsOpen(false)}
//             >
//               কেন আমরা
//             </NavLink>

//             {/* CV Builder Nav Button */}
//             <button
//               onClick={() => {
//                 setIsCVModalOpen(true);
//                 setIsOpen(false);
//               }}
//               className="cv-builder-nav-btn"
//             >
//               📄 Build CV
//             </button>

//             <NavLink
//               to="/admission"
//               className="admission-pill"
//               onClick={() => setIsOpen(false)}
//             >
//               ভর্তি 🚀
//             </NavLink>

//             {/* Dashboard Dynamic Button */}
//             {user ? (
//               <NavLink
//                 to="/dashboard"
//                 onClick={() => setIsOpen(false)}
//                 style={{ color: "#16a34a", fontWeight: "bold" }}
//               >
//                 📊 {user.name.split(" ")[0]}'s Profile
//               </NavLink>
//             ) : (
//               <NavLink
//                 to="/dashboard"
//                 onClick={() => setIsOpen(false)}
//                 style={{ color: "#0d9488", fontWeight: "bold" }}
//               >
//                 📊 Login Dashboard
//               </NavLink>
//             )}

//             <button id="theme" aria-label="থিম পরিবর্তন" onClick={toggleTheme}>
//               ◐
//             </button>
//           </nav>

//           {/* Animated Mobile Hamburger Button */}
//           <button
//             className={`mobile-toggle-btn ${isOpen ? "open" : ""}`}
//             onClick={() => setIsOpen(!isOpen)}
//             aria-label="Toggle Menu"
//           >
//             <span></span>
//             <span></span>
//             <span></span>
//           </button>
//         </div>
//       </header>

//       {/* CV Builder Modal Popup */}
//       {isCVModalOpen && (
//         <div className="cv-modal-overlay">
//           <div className="cv-modal-content">
//             <div className="modal-top-bar">
//               <h2>ATS Friendly CV Builder</h2>
//               <div className="modal-actions">
//                 <button
//                   className="download-pdf-btn"
//                   onClick={handleDownloadPDF}
//                 >
//                   Download PDF
//                 </button>
//                 <button
//                   className="close-modal-btn"
//                   onClick={() => setIsCVModalOpen(false)}
//                 >
//                   ✕ Close
//                 </button>
//               </div>
//             </div>

//             <div className="builder-grid-layout">
//               {/* Form Input Panel */}
//               <div className="cv-form-panel">
//                 <h3>Enter Your Details</h3>
//                 <div className="form-group">
//                   <label>Full Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={cvData.name}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Title & Location</label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={cvData.title}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Mobile</label>
//                     <input
//                       type="text"
//                       name="phone"
//                       value={cvData.phone}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>Email</label>
//                     <input
//                       type="text"
//                       name="email"
//                       value={cvData.email}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                 </div>
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>LinkedIn</label>
//                     <input
//                       type="text"
//                       name="linkedin"
//                       value={cvData.linkedin}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>GitHub</label>
//                     <input
//                       type="text"
//                       name="github"
//                       value={cvData.github}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                 </div>
//                 <div className="form-group">
//                   <label>Career Summary</label>
//                   <textarea
//                     name="summary"
//                     rows="3"
//                     value={cvData.summary}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Experience</label>
//                   <input
//                     type="text"
//                     name="experienceCompany"
//                     value={cvData.experienceCompany}
//                     onChange={handleInputChange}
//                     style={{ marginBottom: "5px" }}
//                   />
//                   <input
//                     type="text"
//                     name="experienceRole"
//                     value={cvData.experienceRole}
//                     onChange={handleInputChange}
//                     style={{ marginBottom: "5px" }}
//                   />
//                   <textarea
//                     name="experienceDetails"
//                     rows="3"
//                     value={cvData.experienceDetails}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Education</label>
//                   <input
//                     type="text"
//                     name="education"
//                     value={cvData.education}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Technical Skills</label>
//                   <input
//                     type="text"
//                     name="skills"
//                     value={cvData.skills}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </div>

//               {/* Live Preview Panel */}
//               <div className="cv-preview-panel" id="printable-cv-area">
//                 <div className="cv-preview-page">
//                   <div className="cv-header">
//                     <h1>{cvData.name}</h1>
//                     <p className="cv-title-loc">{cvData.title}</p>
//                     <p className="cv-contacts">
//                       <span>{cvData.phone}</span> |<span>{cvData.email}</span> |
//                       <span>{cvData.linkedin}</span> |
//                       <span>{cvData.github}</span>
//                     </p>
//                   </div>
//                   <div className="cv-section">
//                     <h2>Summary</h2>
//                     <p>{cvData.summary}</p>
//                   </div>
//                   <div className="cv-section">
//                     <h2>Experience</h2>
//                     <div className="exp-company">
//                       {cvData.experienceCompany}
//                     </div>
//                     <div className="exp-role">{cvData.experienceRole}</div>
//                     <p className="pre-line">{cvData.experienceDetails}</p>
//                   </div>
//                   <div className="cv-section">
//                     <h2>Education</h2>
//                     <p>{cvData.education}</p>
//                   </div>
//                   <div className="cv-section">
//                     <h2>Technical Skills</h2>
//                     <p>{cvData.skills}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Raw CSS Styles */}
//       <style>{`
//         .cv-builder-nav-btn {
//           background: #0284c7;
//           color: white;
//           border: none;
//           padding: 8px 14px;
//           border-radius: 6px;
//           font-weight: bold;
//           cursor: pointer;
//           transition: background 0.2s;
//         }
//         .cv-builder-nav-btn:hover {
//           background: #0369a1;
//         }
//         .cv-modal-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           width: 100vw;
//           height: 100vh;
//           background-color: rgba(0, 0, 0, 0.7);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           z-index: 9999;
//           padding: 15px;
//           box-sizing: border-box;
//         }
//         .cv-modal-content {
//           background: #f4f6f9;
//           width: 100%;
//           max-width: 1150px;
//           height: 90vh;
//           border-radius: 10px;
//           display: flex;
//           flex-direction: column;
//           overflow: hidden;
//           box-shadow: 0 10px 25px rgba(0,0,0,0.3);
//         }
//         .modal-top-bar {
//           background: #ffffff;
//           padding: 12px 20px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           border-bottom: 1px solid #ddd;
//         }
//         .modal-top-bar h2 {
//           margin: 0;
//           font-size: 16px;
//           color: #333;
//         }
//         .modal-actions {
//           display: flex;
//           gap: 10px;
//         }
//         .download-pdf-btn {
//           background-color: #16a34a;
//           color: white;
//           border: none;
//           padding: 6px 12px;
//           border-radius: 4px;
//           font-weight: bold;
//           cursor: pointer;
//         }
//         .close-modal-btn {
//           background-color: #dc2626;
//           color: white;
//           border: none;
//           padding: 6px 12px;
//           border-radius: 4px;
//           font-weight: bold;
//           cursor: pointer;
//         }
//         .builder-grid-layout {
//           display: flex;
//           flex: 1;
//           overflow: hidden;
//         }
//         .cv-form-panel {
//           width: 40%;
//           background: #ffffff;
//           padding: 15px;
//           overflow-y: auto;
//           border-right: 1px solid #ddd;
//         }
//         .cv-form-panel h3 {
//           margin-top: 0;
//           font-size: 15px;
//           color: #333;
//           margin-bottom: 12px;
//         }
//         .form-group {
//           margin-bottom: 10px;
//         }
//         .form-group label {
//           display: block;
//           font-size: 11px;
//           font-weight: 600;
//           color: #555;
//           margin-bottom: 3px;
//         }
//         .form-group input, .form-group textarea {
//           width: 100%;
//           padding: 7px;
//           border: 1px solid #ccc;
//           border-radius: 4px;
//           font-size: 12px;
//           box-sizing: border-box;
//         }
//         .form-row {
//           display: flex;
//           gap: 8px;
//         }
//         .cv-preview-panel {
//           width: 60%;
//           padding: 15px;
//           overflow-y: auto;
//           display: flex;
//           justify-content: center;
//           align-items: flex-start;
//           background: #e9ecef;
//         }
//         .cv-preview-page {
//           background: #ffffff;
//           padding: 25px;
//           border-radius: 4px;
//           box-shadow: 0 4px 15px rgba(0,0,0,0.15);
//           width: 100%;
//           max-width: 680px;
//           min-height: 850px;
//           color: #222;
//           font-size: 12px;
//           line-height: 1.4;
//           box-sizing: border-box;
//         }
//         .cv-header {
//           text-align: center;
//           border-bottom: 2px solid #333;
//           padding-bottom: 8px;
//           margin-bottom: 10px;
//         }
//         .cv-header h1 {
//           font-size: 18px;
//           font-weight: bold;
//           margin: 0 0 3px 0;
//         }
//         .cv-title-loc {
//           font-size: 12px;
//           font-weight: 600;
//           color: #444;
//           margin: 0 0 3px 0;
//         }
//         .cv-contacts {
//           font-size: 11px;
//           color: #666;
//           margin: 0;
//         }
//         .cv-section {
//           margin-bottom: 10px;
//         }
//         .cv-section h2 {
//           font-size: 11px;
//           text-transform: uppercase;
//           border-bottom: 1px solid #0284c7;
//           color: #0284c7;
//           padding-bottom: 2px;
//           margin-bottom: 4px;
//         }
//         .exp-company {
//           font-weight: bold;
//           color: #222;
//         }
//         .exp-role {
//           font-style: italic;
//           color: #555;
//           margin-bottom: 2px;
//         }
//         .pre-line {
//           white-space: pre-line;
//           margin: 0;
//         }
//         @media print {
//           body * {
//             visibility: hidden;
//           }
//           #printable-cv-area, #printable-cv-area * {
//             visibility: visible;
//           }
//           #printable-cv-area {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//             background: white !important;
//             padding: 0 !important;
//           }
//           .cv-modal-overlay {
//             background: transparent !important;
//             position: static !important;
//           }
//         }
//       `}</style>
//     </>
//   );
// }
