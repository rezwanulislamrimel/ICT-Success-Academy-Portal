import { useState } from 'react';

const GATES = { AND: (a, b) => a & b, OR: (a, b) => a | b, NOT: (a) => 1 - a, NAND: (a, b) => 1 - (a & b), NOR: (a, b) => 1 - (a | b), XOR: (a, b) => a ^ b, XNOR: (a, b) => 1 - (a ^ b) };
const EX = ['A AND B', 'NOT A OR B', '(A AND B) XOR C', 'A XOR B  (Half adder Sum)'];

function evalExpr(src, vars) {
  const js = src.toUpperCase().replace(/\(.*?\)/g, (m) => m).replace(/\bNOT\b/g, '!').replace(/\bAND\b/g, '&').replace(/\bOR\b/g, '|').replace(/\bXOR\b/g, '^').replace(/\s*\(.*Sum\)|\s*\(.*Carry\)/gi, '');
  if (!/^[ABC01()!&|^\s]+$/.test(js)) throw new Error('শুধু A, B, C, AND, OR, NOT, XOR, ( ) ব্যবহার করো');
  const rows = [];
  for (let m = 0; m < 2 ** vars.length; m++) {
    const v = Object.fromEntries(vars.map((x, i) => [x, (m >> (vars.length - 1 - i)) & 1]));
    const out = Function('A', 'B', 'C', `return Number(${js})&1`)(v.A ?? 0, v.B ?? 0, v.C ?? 0);
    rows.push([...vars.map((x) => v[x]), out]);
  }
  return rows;
}

export default function LogicLab() {
  const [g, setG] = useState('AND'); const [ex, setEx] = useState('(A AND B) XOR C');
  const one = g === 'NOT';
  const rows = one ? [0, 1].map((a) => [a, GATES.NOT(a)]) : [0, 1].flatMap((a) => [0, 1].map((b) => [a, b, GATES[g](a, b)]));
  let table = null, err = '';
  try { const vars = ['A', 'B', 'C'].filter((x) => new RegExp('\\b' + x + '\\b', 'i').test(ex)); if (vars.length) table = { vars, rows: evalExpr(ex, vars) }; } catch (e) { err = e.message || 'এক্সপ্রেশনে ভুল আছে'; }
  const T = ({ head, rows }) => (<table className="lb-t"><thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={j === r.length - 1 ? 'out' : ''}>{c}</td>)}</tr>)}</tbody></table>);
  return (
    <div>
      <div className="lb-sub">{Object.keys(GATES).map((k) => <button key={k} className={k === g ? 'on' : ''} onClick={() => setG(k)}>{k}</button>)}</div>
      <T head={one ? ['A', 'Y'] : ['A', 'B', 'Y']} rows={rows} />
      <p className="lb-hint">নিজের বুলিয়ান এক্সপ্রেশন লেখো (A, B, C দিয়ে):</p>
      <div className="lb-in"><input value={ex} onChange={(e) => setEx(e.target.value)} aria-label="বুলিয়ান এক্সপ্রেশন" /></div>
      <div className="lb-sub">{EX.map((x) => <button key={x} onClick={() => setEx(x.replace(/\s*\(.*\)/, ''))}>{x}</button>)}</div>
      {err ? <p className="lb-hint" style={{ color: 'var(--bad)' }}>{err}</p> : table && <T head={[...table.vars, 'Y']} rows={table.rows} />}
    </div>
  );
}
