/* অটো প্রশ্ন জেনারেটর: প্রতিবার নতুন সংখ্যা/কোড দিয়ে প্রশ্ন বানায়; উত্তর কম্পিউটার নিজে হিসাব করে, তাই নির্ভুল। */
const r = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const sh = (a) => [...a].sort(() => Math.random() - 0.5);
const B = (n, w = 0) => n.toString(2).padStart(w, '0');
const H = (n) => n.toString(16).toUpperCase();
const flip = (s) => { const i = r(0, s.length - 1); return s.slice(0, i) + (s[i] === '1' ? '0' : '1') + s.slice(i + 1); };

function mk(q, ans, cands, w) {
  ans = String(ans);
  const set = [...new Set(cands.map(String))].filter((x) => x !== ans && x !== 'NaN' && x !== '-0');
  for (let g = 0; set.length < 3 && g < 30; g++) { const x = String(+ans + r(-9, 9)); if (!isNaN(x) && x !== ans && !set.includes(x)) set.push(x); }
  if (set.length < 3) return null;
  const opts = sh([ans, ...set.slice(0, 3)]);
  return [q, opts, opts.indexOf(ans), w];
}
const pairs = (list, qa, qb, fmtA = (x) => x) => () => {
  const [p, ...rest] = sh(list); const [d, a] = p;
  return Math.random() < 0.5 ? mk(qa(d), a, rest.map((x) => x[1]), `${a} — ${d}।`) : mk(qb(a), d, rest.map((x) => x[0]), `${a} — ${d}।`);
};

const GATES = { AND: (a, b) => a & b, OR: (a, b) => a | b, NAND: (a, b) => 1 - (a & b), NOR: (a, b) => 1 - (a | b), XOR: (a, b) => a ^ b, XNOR: (a, b) => 1 - (a ^ b) };

const number = [
  () => { const n = r(5, 255); return mk(`(${B(n)})₂ এর দশমিক মান কত?`, n, [n + 1, n - 1, n + 2, n - 2, n + r(3, 9)], `প্রতিটি বিটকে ২-এর ঘাতে গুণ করে যোগ করলে ${n}।`); },
  () => { const n = r(5, 255), b = B(n); return mk(`(${n})₁₀ কে বাইনারিতে লিখলে কত হয়?`, b, [flip(b), flip(b), B(n + 1), B(n - 1), flip(B(n + 2))], `২ দিয়ে ক্রমাগত ভাগ করে নিচ থেকে উপরে পড়লে ${b}।`); },
  () => { const n = r(16, 255); return mk(`(${n})₁₀ কে হেক্সাডেসিমালে লিখলে কত হয়?`, H(n), [H(n + 1), H(n - 1), H(n + 16), H(n - 16)], `১৬ দিয়ে ভাগ করলে ${H(n)}।`); },
  () => { const n = r(16, 255); return mk(`(${H(n)})₁₆ এর দশমিক মান কত?`, n, [n + 1, n - 1, n + 16, n - 16], `প্রতিটি অঙ্ককে ১৬-এর ঘাতে গুণ করে যোগ করলে ${n}।`); },
  () => { const n = r(9, 255); return mk(`(${n})₁₀ কে অক্টালে লিখলে কত হয়?`, n.toString(8), [(n + 1).toString(8), (n - 1).toString(8), (n + 8).toString(8), (n - 8).toString(8)], `৮ দিয়ে ভাগ করলে ${n.toString(8)}।`); },
  () => { const n = r(16, 255); return mk(`(${B(n)})₂ কে হেক্সাডেসিমালে রূপান্তর করো।`, H(n), [H(n + 1), H(n - 1), H(n + 16), H(n - 16)], `৪ বিটের গ্রুপ করলে ${H(n)}।`); },
  () => { const n = r(8, 255); return mk(`(${B(n)})₂ কে অক্টালে রূপান্তর করো।`, n.toString(8), [(n + 1).toString(8), (n - 1).toString(8), (n + 8).toString(8), (n - 8).toString(8)], `৩ বিটের গ্রুপ করলে ${n.toString(8)}।`); },
  () => { const a = r(3, 31), b = r(3, 31), s = a + b; return mk(`(${B(a)})₂ + (${B(b)})₂ = ?`, B(s), [B(s + 1), B(s - 1), flip(B(s)), B(s + 2)], `দশমিকে ${a} + ${b} = ${s} = (${B(s)})₂।`); },
  () => { const a = r(10, 60), b = r(1, a - 1), s = a - b; return mk(`(${B(a)})₂ − (${B(b)})₂ = ?`, B(s), [B(s + 1), B(s + 2), flip(B(s)), B(s + 3)], `দশমিকে ${a} − ${b} = ${s} = (${B(s)})₂।`); },
  () => { const n = r(1, 254), s = B(n, 8), o = [...s].map((c) => (c === '1' ? '0' : '1')).join(''); return mk(`${s} এর ১-এর পরিপূরক কত?`, o, [flip(o), s, [...s].reverse().join(''), flip(o)], `প্রতিটি বিট উল্টে দিলে ${o}।`); },
  () => { const n = r(1, 254), s = B(n, 8), o = [...s].map((c) => (c === '1' ? '0' : '1')).join(''), t = B(256 - n, 8); return mk(`${s} এর ২-এর পরিপূরক কত?`, t, [o, flip(t), B(257 - n, 8), B(255 - n + 2, 8)], `১-এর পরিপূরক ${o}, তার সাথে ১ যোগ করলে ${t}।`); },
  () => { const n = r(10, 99), t = Math.floor(n / 10), u = n % 10, a = `${B(t, 4)} ${B(u, 4)}`; return mk(`দশমিক ${n} এর BCD কোড কোনটি?`, a, [`${B(u, 4)} ${B(t, 4)}`, B(n), `${B(t, 4)} ${B((u + 1) % 10, 4)}`, `${B((t + 1) % 10, 4)} ${B(u, 4)}`], `প্রতিটি অঙ্ক আলাদা ৪ বিটে: ${a}।`); },
  () => { const n = r(4, 15), g = B(n ^ (n >> 1), 4); return mk(`বাইনারি ${B(n, 4)} এর গ্রে (Gray) কোড কত?`, g, [B(n, 4), flip(g), B((n ^ (n >> 1)) ^ 3, 4), B(n ^ 1, 4)], `MSB একই থাকে, পরের বিটগুলো পাশাপাশি বিটের XOR: ${g}।`); },
  () => { const a = r(0, 1), b = r(0, 1), out = r(0, 1), ks = Object.keys(GATES), ok = sh(ks.filter((k) => GATES[k](a, b) === out)), no = sh(ks.filter((k) => GATES[k](a, b) !== out));
    if (!ok.length || no.length < 3) return null; return mk(`A = ${a}, B = ${b} হলে কোন গেটের আউটপুট ${out} হবে?`, ok[0], no.slice(0, 3).concat(no), `${ok[0]} গেটে (${a}, ${b}) ইনপুটে আউটপুট ${out}।`); },
  () => { const a = r(0, 1), b = r(0, 1), s = a ^ b, c = a & b; return mk(`হাফ অ্যাডারে A = ${a}, B = ${b} হলে Sum ও Carry কত?`, `Sum=${s}, Carry=${c}`, ['Sum=0, Carry=0', 'Sum=0, Carry=1', 'Sum=1, Carry=0', 'Sum=1, Carry=1'], `Sum = A XOR B = ${s}, Carry = A AND B = ${c}।`); },
];

const TAGS = [['সবচেয়ে বড় হেডিং', '<h1>'], ['প্যারাগ্রাফ', '<p>'], ['লাইন ব্রেক', '<br>'], ['হাইপারলিংক', '<a>'], ['ছবি যুক্ত করা', '<img>'], ['টেবিলের সারি', '<tr>'], ['টেবিলের ডেটা ঘর', '<td>'], ['টেবিলের হেডার ঘর', '<th>'], ['অর্ডারড লিস্ট (১, ২, ৩)', '<ol>'], ['আনঅর্ডারড লিস্ট (বুলেট)', '<ul>'], ['লিস্টের আইটেম', '<li>'], ['ফর্ম তৈরি', '<form>'], ['ইনপুট ঘর', '<input>'], ['ড্রপডাউন তালিকা', '<select>'], ['বোল্ড লেখা', '<b>'], ['ইটালিক লেখা', '<i>'], ['ট্যাবে দেখানো পেজের শিরোনাম', '<title>'], ['পেজের দৃশ্যমান অংশ', '<body>'], ['অনুভূমিক রেখা', '<hr>'], ['CSS স্টাইল লেখা', '<style>'], ['বহু লাইনের টেক্সট বক্স', '<textarea>'], ['ক্লিক করার বাটন', '<button>'], ['অন্য পেজ এমবেড করা', '<iframe>']];
const ATTR = [['ছবির ঠিকানা', 'src'], ['লিংকের ঠিকানা', 'href'], ['ছবি না এলে বিকল্প লেখা', 'alt'], ['টেবিলের বর্ডার', 'border'], ['একাধিক কলাম জুড়ে ঘর', 'colspan'], ['একাধিক সারি জুড়ে ঘর', 'rowspan'], ['ইনপুটের ধরন', 'type'], ['ইনপুটে হালকা সহায়ক লেখা', 'placeholder'], ['লিংক নতুন ট্যাবে খোলা', 'target']];
const web = [
  pairs(TAGS, (d) => `"${d}" তৈরিতে কোন ট্যাগ ব্যবহার হয়?`, (t) => `${t} ট্যাগ কী কাজে ব্যবহৃত হয়?`),
  pairs(ATTR, (d) => `HTML-এ "${d}" নির্দেশ করতে কোন অ্যাট্রিবিউট ব্যবহার হয়?`, (t) => `${t} অ্যাট্রিবিউটের কাজ কোনটি?`),
];

const prog = [
  () => { const a = r(2, 20), b = r(2, 9), op = ['+', '-', '*', '/', '%'][r(0, 4)], v = { '+': a + b, '-': a - b, '*': a * b, '/': Math.trunc(a / b), '%': a % b }[op];
    return mk(`int a = ${a}, b = ${b}; printf("%d", a ${op} b); এর আউটপুট কত?`, v, [v + 1, v - 1, v + 2, v - 2, a + b], `${a} ${op} ${b} = ${v} (পূর্ণসংখ্যার হিসাব)।`); },
  () => { const x = r(1, 9), k = r(1, 9); return mk(`int x = ${x}; x++; x += ${k}; printf("%d", x); এর আউটপুট কত?`, x + 1 + k, [x + k, x + 2 + k, x + 1, x + k - 1], `x++ এ ${x + 1}, তারপর +${k} করলে ${x + 1 + k}।`); },
  () => { const n = r(3, 12); return mk(`int s = 0, i; for(i = 1; i <= ${n}; i++) s += i; printf("%d", s); এর আউটপুট কত?`, (n * (n + 1)) / 2, [(n * (n + 1)) / 2 + n, (n * (n + 1)) / 2 - n, n * n, ((n - 1) * n) / 2], `১ থেকে ${n} পর্যন্ত যোগফল।`); },
  () => { const n = r(3, 9), le = Math.random() < 0.5, v = le ? n + 1 : n; return mk(`for(i = 0; i ${le ? '<=' : '<'} ${n}; i++) printf("*"); কয়টি * ছাপা হবে?`, v, [v + 1, v - 1, v + 2, n * 2], `লুপ ${v} বার ঘোরে।`); },
  () => { const a = sh([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4), k = r(0, 3); return mk(`int arr[4] = {${a.join(', ')}}; printf("%d", arr[${k}]); এর আউটপুট কত?`, a[k], a.filter((_, i) => i !== k).concat([a[0] + a[1]]), `ইনডেক্স ০ থেকে শুরু, তাই arr[${k}] = ${a[k]}।`); },
];

const ROWS = [['রহিম', 78], ['করিম', 65], ['সুমি', 91], ['নাদিয়া', 84], ['তানভীর', 55], ['মিতা', 72], ['হাসান', 88], ['ববি', 60]];
const SQLK = [['ডেটা দেখানো', 'SELECT'], ['নতুন রেকর্ড যোগ', 'INSERT'], ['রেকর্ড পরিবর্তন', 'UPDATE'], ['রেকর্ড মুছে ফেলা', 'DELETE'], ['নতুন টেবিল তৈরি', 'CREATE TABLE'], ['শর্ত দেওয়া', 'WHERE'], ['সাজিয়ে দেখানো', 'ORDER BY'], ['গ্রুপ করে হিসাব', 'GROUP BY'], ['টেবিল সম্পূর্ণ মুছে ফেলা', 'DROP TABLE']];
const tbl = `students: ${ROWS.map((x) => x.join(' ')).join(', ')} (name marks)`;
const db = [
  () => { const x = [60, 70, 80][r(0, 2)], c = ROWS.filter((p) => p[1] > x).length; return mk(`${tbl}\nSELECT COUNT(*) FROM students WHERE marks > ${x}; এর ফল কত?`, c, [c + 1, c - 1, c + 2, c - 2, ROWS.length], `marks > ${x} এমন ${c}টি রেকর্ড আছে।`); },
  () => { const f = [['MAX', Math.max], ['MIN', Math.min]][r(0, 1)], v = f[1](...ROWS.map((p) => p[1])); return mk(`${tbl}\nSELECT ${f[0]}(marks) FROM students; এর ফল কত?`, v, [v + 3, v - 3, 72, 100, 78], `${f[0]} ফাংশন ${v} দেয়।`); },
  () => { const s = ROWS.reduce((a, p) => a + p[1], 0); return mk(`${tbl}\nSELECT SUM(marks) FROM students; এর ফল কত?`, s, [s + 10, s - 10, s + 7, s - 7], `সব marks যোগ করলে ${s}।`); },
  () => { const t = [...ROWS].sort((a, b) => b[1] - a[1])[0]; return mk(`${tbl}\nসর্বোচ্চ marks পেয়েছে কে?`, t[0], ROWS.filter((p) => p !== t).map((p) => p[0]), `${t[0]} পেয়েছে ${t[1]}।`); },
  pairs(SQLK, (d) => `SQL-এ "${d}" এর জন্য কোন কমান্ড/ক্লজ ব্যবহার হয়?`, (t) => `SQL-এ ${t} কী কাজ করে?`),
];

const GEN = { number, web, prog, db };
export const hasGen = (t) => !!GEN[t];
export function genQs(t, n) {
  const g = GEN[t]; if (!g) return [];
  const out = [], seen = new Set();
  for (let k = 0; out.length < n && k < n * 8; k++) { const q = g[r(0, g.length - 1)](); if (q && !seen.has(q[0])) { seen.add(q[0]); out.push(q); } }
  return out;
}
