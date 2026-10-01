const D = '0123456789ABCDEF';
export const NAMES = { 2: 'Binary (২)', 8: 'Octal (৮)', 10: 'Decimal (১০)', 16: 'Hex (১৬)' };
export function parseNum(s, b) {
  s = s.trim().toUpperCase(); if (!s || s === '.') return NaN;
  const [i, f = ''] = s.split('.');
  if (![...(i + f)].every((c) => D.indexOf(c) >= 0 && D.indexOf(c) < b)) return NaN;
  let v = i ? parseInt(i, b) : 0;
  [...f].forEach((c, k) => { v += D.indexOf(c) / b ** (k + 1); });
  return Number.isFinite(v) ? v : NaN;
}
export function fmt(v, b, max = 10) {
  let i = Math.floor(v), f = v - i, s = i.toString(b).toUpperCase();
  if (f > 1e-12) { s += '.'; let k = 0; while (f > 1e-12 && k < max) { f *= b; const d = Math.floor(f + 1e-9); s += D[d]; f -= d; k++; } }
  return s;
}
