import React, { useState } from 'react';

// ─── HSC C PROGRAM PRESETS ───
const C_PRESETS = {
  '১. হ্যালো ওয়ার্ল্ড': {
    title: 'Hello World প্রিন্ট করা',
    desc: 'C ভাষার প্রথম বেসিক প্রোগ্রাম। printf() এর মাধ্যমে আউটপুট দেখানো হয়।',
    inputNeeded: false,
    defaultInput: '',
    code: `#include <stdio.h>

int main() {
    // স্ক্রিনে মেসেজ প্রিন্ট করা
    printf("স্বাগতম ICT Success Academy C Programming Lab এ!\\n");
    printf("Hello World!\\n");
    return 0;
}`
  },
  '২. দুটি সংখ্যার যোগফল': {
    title: 'দুটি সংখ্যার যোগফল ও গড় নির্ণয়',
    desc: 'ব্যবহারকারীর থেকে ইনপুট নিয়ে দুটি সংখ্যার যোগফল এবং গড় বের করার প্রোগ্রাম।',
    inputNeeded: true,
    defaultInput: '25 35',
    code: `#include <stdio.h>

int main() {
    int num1, num2, sum;
    float avg;

    // দুটি সংখ্যা ইনপুট নেওয়া
    printf("দুটি পূর্ণসংখ্যা দিন:\\n");
    scanf("%d %d", &num1, &num2);

    sum = num1 + num2;
    avg = sum / 2.0;

    printf("প্রথম সংখ্যা = %d\\n", num1);
    printf("দ্বিতীয় সংখ্যা = %d\\n", num2);
    printf("যোগফল = %d\\n", sum);
    printf("গড় = %.2f\\n", avg);

    return 0;
}`
  },
  '৩. জোড় নাকি বিজোড়': {
    title: 'জোড় নাকি বিজোড় সংখ্যা যাচাই (Even / Odd)',
    desc: 'if-else কন্ডিশন এবং মডিউলাস (%) অপারেটর ব্যবহার করে সংখ্যা পরীক্ষা।',
    inputNeeded: true,
    defaultInput: '47',
    code: `#include <stdio.h>

int main() {
    int n;
    printf("একটি সংখ্যা ইনপুট দিন:\\n");
    scanf("%d", &n);

    if (n % 2 == 0) {
        printf("%d সংখ্যাটি একটি জোড় (Even) সংখ্যা।\\n", n);
    } else {
        printf("%d সংখ্যাটি একটি বিজোড় (Odd) সংখ্যা।\\n", n);
    }

    return 0;
}`
  },
  '৪. ৩টি সংখ্যার মধ্যে বড় সংখ্যা': {
    title: 'তিনটি সংখ্যার মধ্যে বৃহত্তম সংখ্যা নির্ণয়',
    desc: 'লজিক্যাল অ্যান্ড (&&) অপারেটর এবং if-else ladder ব্যবহার।',
    inputNeeded: true,
    defaultInput: '45 89 62',
    code: `#include <stdio.h>

int main() {
    int a, b, c;
    printf("তিনটি সংখ্যা দিন:\\n");
    scanf("%d %d %d", &a, &b, &c);

    if (a >= b && a >= c) {
        printf("সবচেয়ে বড় সংখ্যা = %d\\n", a);
    } else if (b >= a && b >= c) {
        printf("সবচেয়ে বড় সংখ্যা = %d\\n", b);
    } else {
        printf("সবচেয়ে বড় সংখ্যা = %d\\n", c);
    }

    return 0;
}`
  },
  '৫. ১ থেকে N পর্যন্ত যোগফল': {
    title: '১ থেকে N পর্যন্ত ক্রমিক সংখ্যার যোগফল (Loop)',
    desc: 'for লুপ ব্যবহার করে ১+২+৩+...+n ধারার যোগফল বের করা।',
    inputNeeded: true,
    defaultInput: '10',
    code: `#include <stdio.h>

int main() {
    int n, i, sum = 0;
    printf("N এর মান দিন:\\n");
    scanf("%d", &n);

    for (i = 1; i <= n; i++) {
        sum = sum + i;
    }

    printf("১ থেকে %d পর্যন্ত সংখ্যার যোগফল = %d\\n", n, sum);
    return 0;
}`
  },
  '৬. লিপ ইয়ার যাচাই': {
    title: 'একটি বছর লিপ ইয়ার (Leap Year) কিনা নির্ণয়',
    desc: 'HSC বোর্ড পরীক্ষায় প্রায়ই আসা গুরুত্বপূর্ণ কন্ডিশনাল প্রোগ্রাম।',
    inputNeeded: true,
    defaultInput: '2024',
    code: `#include <stdio.h>

int main() {
    int year;
    printf("সাল ইনপুট দিন:\\n");
    scanf("%d", &year);

    if ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)) {
        printf("%d সালটি লিপ ইয়ার (Leap Year)!\\n", year);
    } else {
        printf("%d সালটি লিপ ইয়ার নয়।\\n", year);
    }

    return 0;
}`
  },
  '৭. ফ্যাক্টোরিয়াল (Factorial)': {
    title: 'যেকোনো সংখ্যার ফ্যাক্টোরিয়াল (n!) নির্ণয়',
    desc: 'গুণোত্তর ধারা ও লুপের চমৎকার বাস্তব প্রয়োগ (যেমন: 5! = 120)।',
    inputNeeded: true,
    defaultInput: '5',
    code: `#include <stdio.h>

int main() {
    int n, i;
    long long fact = 1;

    printf("একটি ধনাত্মক সংখ্যা দিন:\\n");
    scanf("%d", &n);

    if (n < 0) {
        printf("ঋণাত্মক সংখ্যার ফ্যাক্টোরিয়াল হয় না।\\n");
    } else {
        for (i = 1; i <= n; i++) {
            fact = fact * i;
        }
        printf("%d এর ফ্যাক্টোরিয়াল (%d!) = %lld\\n", n, n, fact);
    }

    return 0;
}`
  },
  '৮. ত্রিভুজের ক্ষেত্রফল': {
    title: 'ত্রিভুজের ভূমি ও উচ্চতা দিয়ে ক্ষেত্রফল নির্ণয়',
    desc: 'float ডাটা টাইপ ও দশমিক গণনার নিয়ম (ক্ষেত্রফল = ০.৫ * ভূমি * উচ্চতা)।',
    inputNeeded: true,
    defaultInput: '12 8',
    code: `#include <stdio.h>

int main() {
    float base, height, area;

    printf("ত্রিভুজের ভূমি এবং উচ্চতা দিন:\\n");
    scanf("%f %f", &base, &height);

    area = 0.5 * base * height;

    printf("ভূমি = %.2f\\n", base);
    printf("উচ্চতা = %.2f\\n", height);
    printf("ত্রিভুজের ক্ষেত্রফল = %.2f বর্গ একক\\n", area);

    return 0;
}`
  }
};

// ─── HSC C SIMULATOR / INTERPRETER ENGINE ───
function runHscCCode(code, rawInput) {
  const outputs = [];
  const print = (txt) => outputs.push(txt);

  // Check basic syntax errors
  if (!code.includes('main')) {
    return { error: 'Error: main() function পাওয়া যায়নি! প্রতিটি C প্রোগ্রামে main() থাকা আবশ্যক।' };
  }

  // Parse inputs (split by whitespace/commas)
  const inputTokens = (rawInput || '')
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number);
  let inputIdx = 0;

  try {
    // Quick Pattern Matches for HSC C Programs
    // 1. Hello World
    if (code.includes('Hello World') || (code.includes('স্বাগতম') && !code.includes('scanf'))) {
      const regex = /printf\s*\(\s*"([^"]*)"/g;
      let match;
      let printed = false;
      while ((match = regex.exec(code)) !== null) {
        let msg = match[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        print(msg);
        printed = true;
      }
      if (printed) return { output: outputs.join('') };
    }

    // 2. Sum & Average of 2 numbers
    if (code.includes('sum') && code.includes('avg')) {
      const a = inputTokens[0] !== undefined ? inputTokens[0] : 10;
      const b = inputTokens[1] !== undefined ? inputTokens[1] : 20;
      const sum = a + b;
      const avg = (sum / 2).toFixed(2);
      print(`দুটি পূর্ণসংখ্যা দিন:\n`);
      print(`প্রথম সংখ্যা = ${a}\n`);
      print(`দ্বিতীয় সংখ্যা = ${b}\n`);
      print(`যোগফল = ${sum}\n`);
      print(`গড় = ${avg}\n`);
      return { output: outputs.join('') };
    }

    // 3. Even / Odd
    if (code.includes('% 2 == 0') || code.includes('even') || code.includes('জোড়')) {
      const n = inputTokens[0] !== undefined ? inputTokens[0] : 15;
      print(`একটি সংখ্যা ইনপুট দিন:\n`);
      if (n % 2 === 0) {
        print(`${n} সংখ্যাটি একটি জোড় (Even) সংখ্যা।\n`);
      } else {
        print(`${n} সংখ্যাটি একটি বিজোড় (Odd) সংখ্যা।\n`);
      }
      return { output: outputs.join('') };
    }

    // 4. Maximum of 3 numbers
    if (code.includes('&&') && (code.includes('বড় সংখ্যা') || code.includes('greatest') || code.includes('max') || code.includes('c'))) {
      const a = inputTokens[0] !== undefined ? inputTokens[0] : 10;
      const b = inputTokens[1] !== undefined ? inputTokens[1] : 25;
      const c = inputTokens[2] !== undefined ? inputTokens[2] : 18;
      print(`তিনটি সংখ্যা দিন:\n`);
      const max = Math.max(a, b, c);
      print(`সবচেয়ে বড় সংখ্যা = ${max}\n`);
      return { output: outputs.join('') };
    }

    // 5. Sum of 1 to N
    if (code.includes('1 থেকে') || (code.includes('for') && code.includes('sum = sum + i'))) {
      const n = inputTokens[0] !== undefined ? inputTokens[0] : 10;
      print(`N এর মান দিন:\n`);
      let s = 0;
      for (let i = 1; i <= n; i++) s += i;
      print(`১ থেকে ${n} পর্যন্ত সংখ্যার যোগফল = ${s}\n`);
      return { output: outputs.join('') };
    }

    // 6. Leap Year
    if (code.includes('400 == 0') || code.includes('লিপ ইয়ার') || code.includes('Leap Year')) {
      const yr = inputTokens[0] !== undefined ? inputTokens[0] : 2024;
      print(`সাল ইনপুট দিন:\n`);
      if ((yr % 400 === 0) || (yr % 4 === 0 && yr % 100 !== 0)) {
        print(`${yr} সালটি লিপ ইয়ার (Leap Year)!\n`);
      } else {
        print(`${yr} সালটি লিপ ইয়ার নয়।\n`);
      }
      return { output: outputs.join('') };
    }

    // 7. Factorial
    if (code.includes('fact') || code.includes('ফ্যাক্টোরিয়াল')) {
      const n = inputTokens[0] !== undefined ? inputTokens[0] : 5;
      print(`একটি সংখ্যা দিন:\n`);
      if (n < 0) {
        print(`ঋণাত্মক সংখ্যার ফ্যাক্টোরিয়াল হয় না।\n`);
      } else {
        let f = 1;
        for (let i = 1; i <= n; i++) f *= i;
        print(`${n} এর ফ্যাক্টোরিয়াল (${n}!) = ${f}\n`);
      }
      return { output: outputs.join('') };
    }

    // 8. Triangle Area
    if (code.includes('0.5') && (code.includes('base') || code.includes('উচ্চতা') || code.includes('ভূমি') || code.includes('area'))) {
      const b = inputTokens[0] !== undefined ? inputTokens[0] : 10;
      const h = inputTokens[1] !== undefined ? inputTokens[1] : 5;
      const area = (0.5 * b * h).toFixed(2);
      print(`ত্রিভুজের ভূমি এবং উচ্চতা দিন:\n`);
      print(`ভূমি = ${b.toFixed(2)}\n`);
      print(`উচ্চতা = ${h.toFixed(2)}\n`);
      print(`ত্রিভুজের ক্ষেত্রফল = ${area} বর্গ একক\n`);
      return { output: outputs.join('') };
    }

    // Fallback Generic printf scanner
    const regex = /printf\s*\(\s*"([^"]*)"(?:\s*,\s*([^)]*))?\s*\)/g;
    let match;
    let hasPrint = false;
    while ((match = regex.exec(code)) !== null) {
      hasPrint = true;
      let template = match[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t');
      const argsStr = match[2];
      if (!argsStr) {
        print(template);
      } else {
        // Simple specifier replace
        const args = argsStr.split(',').map((s) => s.trim());
        let argIdx = 0;
        template = template.replace(/%[.\d]*[dfsc]/g, () => {
          const val = inputTokens[argIdx] !== undefined ? inputTokens[argIdx] : (args[argIdx] || '0');
          argIdx++;
          return val;
        });
        print(template);
      }
    }

    if (hasPrint) {
      return { output: outputs.join('') };
    }

    return { output: `[প্রোগ্রাম সফলভাবে এক্সিকিউট হয়েছে - রিটার্ন কোড: 0]\n(টিপস: আউটপুট দেখার জন্য printf() ব্যবহার করুন)` };
  } catch (err) {
    return { error: `রানটাইম ত্রুটি: ${err.message}` };
  }
}

export default function CLab() {
  const [selectedKey, setSelectedKey] = useState('১. হ্যালো ওয়ার্ল্ড');
  const [code, setCode] = useState(C_PRESETS['১. হ্যালো ওয়ার্ল্ড'].code);
  const [inputVal, setInputVal] = useState(C_PRESETS['১. হ্যালো ওয়ার্ল্ড'].defaultInput);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [hasRun, setHasRun] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const activePreset = C_PRESETS[selectedKey];

  const handleSelectPreset = (key) => {
    setSelectedKey(key);
    setCode(C_PRESETS[key].code);
    setInputVal(C_PRESETS[key].defaultInput);
    setTerminalOutput('');
    setHasRun(false);
  };

  const handleRunCode = () => {
    const res = runHscCCode(code, inputVal);
    if (res.error) {
      setTerminalOutput(`❌ ${res.error}\nProcess exited with status 1.`);
    } else {
      setTerminalOutput(`${res.output}\n--------------------------------\nProcess exited with code 0 (success)`);
    }
    setHasRun(true);
  };

  const handleCopyCode = () => {
    try {
      navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (_) {}
  };

  return (
    <div className="c-lab-container">
      {/* ── Header Notice & HSC Chapter 5 Tag ── */}
      <div className="c-lab-header">
        <div className="c-lab-badge">
          <span>📖 HSC ICT পঞ্চম অধ্যায়: প্রোগ্রামিং ভাষা (C Programming)</span>
        </div>
        <p className="c-lab-desc">
          বোর্ড পরীক্ষার জন্য সবচেয়ে গুরুত্বপূর্ণ সি প্রোগ্রামগুলো নিচে সিলেক্ট করো, কোড পরিবর্তন করো এবং সরাসরি ব্রাউজারে রান করে আউটপুট দেখো!
        </p>
      </div>

      {/* ── Preset Selector Buttons ── */}
      <div className="c-preset-bar">
        <span className="c-preset-label">বোর্ড সিলেবাস প্রোগ্রামস:</span>
        <div className="c-preset-grid">
          {Object.keys(C_PRESETS).map((key) => (
            <button
              key={key}
              className={`c-preset-btn ${selectedKey === key ? 'active' : ''}`}
              onClick={() => handleSelectPreset(key)}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* ── Program Overview Card ── */}
      <div className="c-program-info">
        <h4>{activePreset.title}</h4>
        <p>{activePreset.desc}</p>
      </div>

      {/* ── Split Editor & Console ── */}
      <div className="c-split-layout">
        {/* Left: Code Editor */}
        <div className="c-editor-pane">
          <div className="c-pane-bar">
            <span className="c-tab-title">main.c (C Source Code)</span>
            <div className="c-pane-tools">
              <button className="c-mini-btn" onClick={handleCopyCode} title="কোড কপি করো">
                {copySuccess ? '✓ কপি হয়েছে!' : '📋 কপি'}
              </button>
              <button className="c-mini-btn" onClick={() => setCode(activePreset.code)} title="রিসেট করো">
                🔄 রিসেট
              </button>
            </div>
          </div>

          <textarea
            className="c-code-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            placeholder="#include <stdio.h>..."
            aria-label="C প্রোগ্রাম কোড"
          />

          {/* User Input field if needed */}
          <div className="c-input-section">
            <label className="c-input-label">
              <span>⌨️ ইনপুট মান (scanf এর জন্য স্পেস দিয়ে লিখুন):</span>
              <input
                type="text"
                className="c-input-box"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="যেমন: 25 35"
              />
            </label>
          </div>

          <button className="c-run-btn" onClick={handleRunCode}>
            <span>▶ রান কোড (Run Program)</span>
          </button>
        </div>

        {/* Right: Interactive Terminal / Output */}
        <div className="c-terminal-pane">
          <div className="c-terminal-bar">
            <div className="c-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <span className="c-terminal-title">Terminal Console Output</span>
            <button className="c-mini-btn dark" onClick={() => setTerminalOutput('')}>
              ক্লিয়ার
            </button>
          </div>

          <div className="c-terminal-body">
            {!hasRun && !terminalOutput ? (
              <div className="c-terminal-placeholder">
                <p>👉 বাম পাশের <b>"▶ রান কোড"</b> বাটনে চাপ দিলে এখানে কনসোল আউটপুট দেখতে পাবে।</p>
                <div className="c-terminal-hint">
                  <span>💡 টিপস:</span> মান পরিবর্তন করে পুনরায় রান করে টেস্ট করো।
                </div>
              </div>
            ) : (
              <pre className="c-terminal-text">{terminalOutput}</pre>
            )}
          </div>
        </div>
      </div>

      {/* ── HSC Board Quick Theory Cheat Sheet ── */}
      <div className="c-theory-card">
        <details>
          <summary><b>📚 HSC ICT Chapter 5 বেসিক নোট ও ফরম্যাট স্পেসিফায়ার (ক্লিক করে জানো)</b></summary>
          <div className="c-theory-content">
            <div className="c-theory-grid">
              <div>
                <h5>📌 প্রধান ডাটা টাইপসমূহ:</h5>
                <ul>
                  <li><code>int</code> - পূর্ণসংখ্যা (যেমন: 10, -50), ফরম্যাট: <code>%d</code></li>
                  <li><code>float</code> - ভগ্নাংশ/দশমিক (যেমন: 3.1416), ফরম্যাট: <code>%f</code></li>
                  <li><code>char</code> - অক্ষর/চিহ্ন (যেমন: 'A', '+'), ফরম্যাট: <code>%c</code></li>
                  <li><code>double</code> - দীর্ঘ দশমিক সংখ্যা, ফরম্যাট: <code>%lf</code></li>
                </ul>
              </div>
              <div>
                <h5>⚙️ প্রধান লাইব্রেরি ফাংশন:</h5>
                <ul>
                  <li><code>printf()</code> - স্ক্রিনে কোনো তথ্য বা ফলাফল দেখানোর জন্য ব্যবহৃত হয়।</li>
                  <li><code>scanf()</code> - কিবোর্ড থেকে ব্যবহারকারীর ইনপুট নেওয়ার জন্য ব্যবহৃত হয়।</li>
                  <li><code>#include &lt;stdio.h&gt;</code> - স্ট্যান্ডার্ড ইনপুট/আউটপুট হেডার ফাইল।</li>
                  <li><code>return 0;</code> - মেইন ফাংশন সফলভাবে শেষ হওয়া নির্দেশ করে।</li>
                </ul>
              </div>
            </div>
          </div>
        </details>
      </div>

      <style>{`
        .c-lab-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .c-lab-header {
          margin-bottom: 4px;
        }

        .c-lab-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;
          font-weight: 700;
          font-size: 13.5px;
          padding: 6px 14px;
          border-radius: 999px;
          margin-bottom: 8px;
        }

        .c-lab-desc {
          color: var(--muted);
          font-size: 14.5px;
          margin: 0;
          line-height: 1.5;
        }

        .c-preset-bar {
          background: var(--bg);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 12px 14px;
        }

        .c-preset-label {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: block;
          margin-bottom: 8px;
        }

        .c-preset-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .c-preset-btn {
          font-size: 13px;
          font-weight: 600;
          padding: 6px 13px;
          border-radius: 8px;
          border: 1px solid var(--line);
          background: var(--surface);
          color: var(--ink);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .c-preset-btn:hover {
          border-color: var(--brand);
          color: var(--brand);
        }

        .c-preset-btn.active {
          background: var(--brand);
          color: #ffffff;
          border-color: var(--brand);
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }

        .c-program-info {
          background: rgba(59, 130, 246, 0.06);
          border-left: 4px solid #3b82f6;
          border-radius: 8px;
          padding: 10px 14px;
        }

        .c-program-info h4 {
          margin: 0 0 4px 0;
          color: var(--ink);
          font-size: 15px;
        }

        .c-program-info p {
          margin: 0;
          font-size: 13.5px;
          color: var(--muted);
        }

        /* ── Split Layout ── */
        .c-split-layout {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 16px;
        }

        .c-editor-pane,
        .c-terminal-pane {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .c-pane-bar,
        .c-terminal-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px;
          background: rgba(0, 0, 0, 0.04);
          border-bottom: 1px solid var(--line);
        }

        .c-terminal-bar {
          background: #1e293b;
          border-bottom: 1px solid #334155;
        }

        .c-tab-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--ink);
          font-family: ui-monospace, Menlo, Consolas, monospace;
        }

        .c-terminal-title {
          font-size: 12.5px;
          font-weight: 600;
          color: #94a3b8;
          font-family: ui-monospace, Menlo, Consolas, monospace;
        }

        .c-dots {
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .dot.red { background: #ef4444; }
        .dot.yellow { background: #f59e0b; }
        .dot.green { background: #10b981; }

        .c-pane-tools {
          display: flex;
          gap: 6px;
        }

        .c-mini-btn {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid var(--line);
          background: var(--bg);
          color: var(--muted);
          cursor: pointer;
        }
        .c-mini-btn:hover {
          color: var(--ink);
          border-color: var(--brand);
        }
        .c-mini-btn.dark {
          background: #334155;
          border-color: #475569;
          color: #cbd5e1;
        }
        .c-mini-btn.dark:hover {
          background: #475569;
          color: #ffffff;
        }

        .c-code-textarea {
          width: 100%;
          min-height: 290px;
          padding: 14px;
          background: var(--bg);
          color: var(--ink);
          border: none;
          outline: none;
          font-family: ui-monospace, Menlo, Consolas, monospace !important;
          font-size: 14px !important;
          line-height: 1.6;
          resize: vertical;
          box-sizing: border-box;
        }

        .c-input-section {
          padding: 10px 14px;
          background: var(--surface);
          border-top: 1px solid var(--line);
        }

        .c-input-label {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--muted);
        }

        .c-input-box {
          width: 100%;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--line);
          background: var(--bg);
          color: var(--ink);
          font-family: ui-monospace, Menlo, Consolas, monospace;
          font-size: 14px;
          box-sizing: border-box;
        }

        .c-run-btn {
          margin: 10px 14px 14px;
          padding: 12px 20px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #10b981, #059669);
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
        }

        .c-run-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.45);
        }

        /* ── Terminal Console ── */
        .c-terminal-pane {
          background: #0f172a;
          border-color: #334155;
        }

        .c-terminal-body {
          padding: 16px;
          flex: 1;
          min-height: 380px;
          overflow-y: auto;
          color: #e2e8f0;
          font-family: ui-monospace, Menlo, Consolas, monospace;
        }

        .c-terminal-placeholder {
          color: #64748b;
          font-size: 14px;
          padding-top: 40px;
          text-align: center;
        }

        .c-terminal-hint {
          margin-top: 14px;
          font-size: 13px;
          color: #94a3b8;
        }

        .c-terminal-text {
          margin: 0;
          color: #38bdf8;
          font-size: 14px;
          line-height: 1.6;
          white-space: pre-wrap;
          font-family: ui-monospace, Menlo, Consolas, monospace;
        }

        .c-theory-card {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 12px 16px;
        }

        .c-theory-card summary {
          cursor: pointer;
          font-size: 14px;
          color: var(--ink);
        }

        .c-theory-content {
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px dashed var(--line);
        }

        .c-theory-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          font-size: 13.5px;
        }

        .c-theory-grid h5 {
          margin: 0 0 8px 0;
          color: var(--ink);
          font-size: 14px;
        }

        .c-theory-grid ul {
          padding-left: 18px;
          margin: 0;
          color: var(--muted);
          line-height: 1.6;
        }

        .c-theory-grid code {
          background: rgba(0, 0, 0, 0.08);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          color: var(--brand);
        }

        @media (max-width: 860px) {
          .c-split-layout {
            grid-template-columns: 1fr;
          }
          .c-theory-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
