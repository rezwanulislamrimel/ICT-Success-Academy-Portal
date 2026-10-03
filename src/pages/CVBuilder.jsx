import { useState, useRef } from "react";
import "./CVBuilder.css";

export default function CVBuilder() {
  const [template, setTemplate] = useState("professional");
  
  const [cvData, setCvData] = useState({
    name: "ICT Success Academy",
    title: "Best ICT Learning Platform",
    phone: "+880 1711-000000",
    email: "info@ictsuccess.com",
    linkedin: "linkedin.com/company/ictsuccess",
    github: "github.com/ictsuccess",
    summary: "ICT Success Academy is the most trusted platform for students learning Information and Communication Technology. We provide world-class education for HSC, SSC, and Degree students.",
    experience: [
      {
        id: 1,
        company: "ICT Success Academy",
        role: "Lead Instructor",
        duration: "Jan 2020 - Present",
        details: "• Taught over 10,000 students online and offline.\n• Created comprehensive MCQ modules and mock tests.\n• Solved complex programming and database problems easily."
      }
    ],
    education: [
      {
        id: 1,
        institution: "Success University",
        degree: "BSc in Computer Science & Engineering",
        year: "2015 - 2019"
      }
    ],
    skills: "ICT, C Programming, HTML/CSS, Database Management, Logic Gates, Networking"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCvData({ ...cvData, [name]: value });
  };

  const handleArrayChange = (index, field, value, type) => {
    const newData = [...cvData[type]];
    newData[index][field] = value;
    setCvData({ ...cvData, [type]: newData });
  };

  const addField = (type, defaultObj) => {
    setCvData({ ...cvData, [type]: [...cvData[type], { id: Date.now(), ...defaultObj }] });
  };

  const removeField = (index, type) => {
    const newData = [...cvData[type]];
    newData.splice(index, 1);
    setCvData({ ...cvData, [type]: newData });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cvb-container">
      {/* ─── LEFT: EDITOR (Like Overleaf sidebar) ─── */}
      <div className="cvb-editor">
        <div className="cvb-editor-header">
          <h2>📝 CV Builder</h2>
          <div className="cvb-controls">
            <select value={template} onChange={(e) => setTemplate(e.target.value)} className="cvb-select">
              <option value="professional">Professional (ATS)</option>
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
            </select>
            <button className="cvb-btn-download" onClick={handlePrint}>📥 Download PDF</button>
          </div>
        </div>

        <div className="cvb-form">
          <div className="cvb-section">
            <h3>Personal Info</h3>
            <input type="text" name="name" value={cvData.name} onChange={handleChange} placeholder="Full Name" />
            <input type="text" name="title" value={cvData.title} onChange={handleChange} placeholder="Professional Title" />
            <div className="cvb-grid-2">
              <input type="text" name="phone" value={cvData.phone} onChange={handleChange} placeholder="Phone" />
              <input type="email" name="email" value={cvData.email} onChange={handleChange} placeholder="Email" />
              <input type="text" name="linkedin" value={cvData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" />
              <input type="text" name="github" value={cvData.github} onChange={handleChange} placeholder="GitHub URL" />
            </div>
          </div>

          <div className="cvb-section">
            <h3>Professional Summary</h3>
            <textarea name="summary" value={cvData.summary} onChange={handleChange} rows="4" placeholder="Brief summary about yourself..."></textarea>
          </div>

          <div className="cvb-section">
            <h3>Experience</h3>
            {cvData.experience.map((exp, index) => (
              <div key={exp.id} className="cvb-item-card">
                <input type="text" value={exp.company} onChange={(e) => handleArrayChange(index, "company", e.target.value, "experience")} placeholder="Company Name" />
                <div className="cvb-grid-2">
                  <input type="text" value={exp.role} onChange={(e) => handleArrayChange(index, "role", e.target.value, "experience")} placeholder="Role" />
                  <input type="text" value={exp.duration} onChange={(e) => handleArrayChange(index, "duration", e.target.value, "experience")} placeholder="e.g. Jan 2022 - Present" />
                </div>
                <textarea value={exp.details} onChange={(e) => handleArrayChange(index, "details", e.target.value, "experience")} rows="3" placeholder="Job details (use • for bullets)"></textarea>
                <button className="cvb-btn-remove" onClick={() => removeField(index, "experience")}>Remove</button>
              </div>
            ))}
            <button className="cvb-btn-add" onClick={() => addField("experience", { company: "", role: "", duration: "", details: "" })}>+ Add Experience</button>
          </div>

          <div className="cvb-section">
            <h3>Education</h3>
            {cvData.education.map((edu, index) => (
              <div key={edu.id} className="cvb-item-card">
                <input type="text" value={edu.institution} onChange={(e) => handleArrayChange(index, "institution", e.target.value, "education")} placeholder="Institution Name" />
                <div className="cvb-grid-2">
                  <input type="text" value={edu.degree} onChange={(e) => handleArrayChange(index, "degree", e.target.value, "education")} placeholder="Degree" />
                  <input type="text" value={edu.year} onChange={(e) => handleArrayChange(index, "year", e.target.value, "education")} placeholder="Year" />
                </div>
                <button className="cvb-btn-remove" onClick={() => removeField(index, "education")}>Remove</button>
              </div>
            ))}
            <button className="cvb-btn-add" onClick={() => addField("education", { institution: "", degree: "", year: "" })}>+ Add Education</button>
          </div>

          <div className="cvb-section">
            <h3>Skills</h3>
            <textarea name="skills" value={cvData.skills} onChange={handleChange} rows="3" placeholder="Comma separated skills..."></textarea>
          </div>
        </div>
      </div>

      {/* ─── RIGHT: PREVIEW (A4 size document) ─── */}
      <div className="cvb-preview-pane">
        <div className={`cv-document template-${template}`}>
          <div className="cv-header">
            <h1 className="cv-name">{cvData.name || "Your Name"}</h1>
            <h2 className="cv-title">{cvData.title || "Your Title"}</h2>
            <div className="cv-contacts">
              {cvData.phone && <span>📞 {cvData.phone}</span>}
              {cvData.email && <span>✉️ {cvData.email}</span>}
              {cvData.linkedin && <span>🔗 {cvData.linkedin}</span>}
              {cvData.github && <span>💻 {cvData.github}</span>}
            </div>
          </div>

          <div className="cv-body">
            {cvData.summary && (
              <div className="cv-block">
                <h3 className="cv-section-title">Summary</h3>
                <p className="cv-summary">{cvData.summary}</p>
              </div>
            )}

            {cvData.experience.length > 0 && (
              <div className="cv-block">
                <h3 className="cv-section-title">Experience</h3>
                {cvData.experience.map(exp => (
                  <div key={exp.id} className="cv-exp-item">
                    <div className="cv-exp-head">
                      <strong>{exp.role}</strong>
                      <span>{exp.duration}</span>
                    </div>
                    <div className="cv-exp-company">{exp.company}</div>
                    <div className="cv-exp-details">
                      {exp.details.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cvData.education.length > 0 && (
              <div className="cv-block">
                <h3 className="cv-section-title">Education</h3>
                {cvData.education.map(edu => (
                  <div key={edu.id} className="cv-edu-item">
                    <div className="cv-edu-head">
                      <strong>{edu.degree}</strong>
                      <span>{edu.year}</span>
                    </div>
                    <div className="cv-edu-institution">{edu.institution}</div>
                  </div>
                ))}
              </div>
            )}

            {cvData.skills && (
              <div className="cv-block">
                <h3 className="cv-section-title">Skills</h3>
                <p className="cv-skills">{cvData.skills}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
