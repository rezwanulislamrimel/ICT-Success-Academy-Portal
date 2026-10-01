import { useRef, useState } from 'react';
import alasql from 'alasql';

const mk = () => {
  const db = new alasql.Database();
  db.exec("CREATE TABLE students(id INT PRIMARY KEY, name STRING, level STRING, marks INT)");
  db.exec("INSERT INTO students VALUES (1,'রহিম','HSC',78),(2,'করিম','HSC',65),(3,'সুমি','SSC',91),(4,'নাদিয়া','HSC',84),(5,'তানভীর','SSC',55)");
  return db;
};
const EX = {
  'সব দেখো': 'SELECT * FROM students',
  'WHERE': "SELECT name, marks FROM students WHERE level = 'HSC' AND marks > 70",
  'ORDER BY': 'SELECT name, marks FROM students ORDER BY marks DESC',
  'GROUP BY': 'SELECT level, COUNT(*) AS total, AVG(marks) AS avg_marks FROM students GROUP BY level',
  'INSERT': "INSERT INTO students VALUES (6,'মিতা','HSC',72)",
  'UPDATE': 'UPDATE students SET marks = 80 WHERE id = 2',
  'DELETE': 'DELETE FROM students WHERE id = 5',
};

export default function SqlLab() {
  const db = useRef(null); if (!db.current) db.current = mk();
  const [q, setQ] = useState(EX['সব দেখো']); const [out, setOut] = useState(null); const [err, setErr] = useState('');
  const run = () => {
    setErr(''); setOut(null);
    try {
      let res; q.split(';').map((x) => x.trim()).filter(Boolean).forEach((st) => { res = db.current.exec(st); });
      setOut(res);
    } catch (e) { setErr('ভুল আছে: ' + (e.message || e)); }
  };
  const cols = Array.isArray(out) && out.length ? Object.keys(out[0]) : [];
  return (
    <div>
      <p className="lb-hint">টেবিল: <code>students(id, name, level, marks)</code> — নিচের উদাহরণে ক্লিক করো বা নিজে লেখো।</p>
      <div className="lb-sub">{Object.keys(EX).map((k) => <button key={k} onClick={() => setQ(EX[k])}>{k}</button>)}</div>
      <textarea className="lb-sql" value={q} spellCheck="false" onChange={(e) => setQ(e.target.value)} aria-label="SQL কুয়েরি" />
      <div className="lb-sub"><button className="go" onClick={run}>▶ চালাও</button><button onClick={() => { db.current = mk(); setOut(null); setErr(''); }}>ডেটা রিসেট</button></div>
      {err && <p className="lb-hint" style={{ color: 'var(--bad)' }}>{err}</p>}
      {Array.isArray(out) && (cols.length ? <div className="lb-scroll"><table className="lb-t"><thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead><tbody>{out.map((r, i) => <tr key={i}>{cols.map((c) => <td key={c}>{String(r[c])}</td>)}</tr>)}</tbody></table></div> : <p className="lb-hint">কোনো রেকর্ড পাওয়া যায়নি।</p>)}
      {out !== null && !Array.isArray(out) && <p className="lb-hint">সম্পন্ন ✔ (প্রভাবিত রেকর্ড: {String(out)}) — এবার "সব দেখো" চালিয়ে দেখো।</p>}
    </div>
  );
}
