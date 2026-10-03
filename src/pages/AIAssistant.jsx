import React, { useState, useRef, useEffect } from "react";
import "./AIAssistant.css";

/* ─── Config ─── */
const FREE_URL = "https://text.pollinations.ai/openai";
const FREE_MODEL = "openai-fast";
const COOLDOWN_MS = 2500;

const RULES =
  "You are the study assistant of ICT Success Academy in Bangladesh. Help SSC, HSC, Honours and Degree students with ICT only: information and communication technology, number systems, digital devices and logic gates, networking and communication, web design and HTML, programming (C), databases (DBMS), AI, robotics, cyber safety, office software and general computer topics. Reply in the same language the student writes in (Bangla, Banglish or English). Use simple words, short steps and small examples, and add exam tips when useful. Show calculations step by step. If the question is not about ICT or studying, politely say you can only help with ICT and suggest an ICT question instead. If you are unsure about a board-specific detail such as syllabus or marks, say so instead of guessing. Keep answers under about 250 words unless the student asks for more.";

const VOICE_RULES =
  "You are a voice-based ICT tutor for ICT Success Academy, Bangladesh. The student is practicing ICT topics by voice (like a mock interview or oral exam). Keep your replies SHORT (under 100 words), conversational, and encouraging. If they make a mistake, gently correct them and explain why. Ask follow-up questions to test deeper understanding. Speak like a friendly teacher. Reply in the same language the student speaks (Bangla or English). If the topic is not ICT-related, steer them back to ICT.";

const SUGGEST = [
  "বাইনারি থেকে দশমিকে রূপান্তর কীভাবে করব?",
  "HTML-এ টেবিল বানানোর নিয়ম দেখাও",
  "নেটওয়ার্ক টপোলজি কী? প্রকারভেদ বলো",
  "Primary key আর Foreign key-র পার্থক্য কী?",
];

const VOICE_TOPICS = [
  "গ্লোবাল ভিলেজ সম্পর্কে বলো",
  "Number System নিয়ে কথা বলি",
  "Networking Mock Interview",
  "C Programming Viva Practice",
  "Database (DBMS) ভাইভা",
  "HTML/CSS Mock Test",
];

/* ─── helpers ─── */
function inline(t) {
  return t.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (/^`[^`]+`$/.test(p)) return <code key={i}>{p.slice(1, -1)}</code>;
    return p;
  });
}
function md(text) {
  const out = [];
  text.split("```").forEach((b, bi) => {
    if (bi % 2 === 1) {
      out.push(<pre key={"p" + bi}><code>{b.replace(/^[a-zA-Z0-9+#]*\n/, "").replace(/\n$/, "")}</code></pre>);
      return;
    }
    let list = null;
    const flush = () => { if (list) { const Tag = list.t; out.push(<Tag key={"l" + bi + "-" + out.length}>{list.items}</Tag>); list = null; } };
    b.split("\n").forEach((ln, li) => {
      const ul = ln.match(/^\s*[-*•]\s+(.*)/), ol = ln.match(/^\s*\d+[.)]\s+(.*)/);
      if (ul || ol) {
        const t = ul ? "ul" : "ol";
        if (!list || list.t !== t) { flush(); list = { t, items: [] }; }
        list.items.push(<li key={list.items.length}>{inline((ul || ol)[1])}</li>);
        return;
      }
      flush();
      const hd = ln.match(/^#{1,6}\s+(.*)/);
      if (hd) { out.push(<p key={"h" + bi + "-" + li} className="md-h">{inline(hd[1])}</p>); return; }
      if (ln.trim()) out.push(<p key={"t" + bi + "-" + li}>{inline(ln)}</p>);
    });
    flush();
  });
  return out;
}

function cleanHistory(msgs) {
  return msgs.filter((m, i, a) => !m.err && !(m.role === "user" && a[i + 1]?.err)).map(m => ({ role: m.role, content: m.content }));
}

async function streamOpenAI(url, body, signal, onText) {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal });
  if (!r.ok) throw { code: r.status === 429 ? "rate_limited" : "upstream_error" };
  if (!r.body?.getReader) { const d = await r.json(); return d.choices?.[0]?.message?.content || ""; }
  const rd = r.body.getReader(), dec = new TextDecoder();
  let buf = "", out = "";
  for (;;) {
    const x = await rd.read(); if (x.done) break;
    buf += dec.decode(x.value, { stream: true });
    const lines = buf.split("\n"); buf = lines.pop();
    for (const ln of lines) {
      const t = ln.trim(); if (!t.startsWith("data:")) continue;
      const j = t.slice(5).trim(); if (j === "[DONE]") continue;
      try { const d = JSON.parse(j); const c = d.choices?.[0]?.delta?.content; if (c) { out += c; onText(out); } } catch (e) {}
    }
  }
  return out;
}

function speak(t) {
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t.replace(/[*`#]/g, ""));
    u.lang = /[\u0980-\u09FF]/.test(t) ? "bn-BD" : "en-US";
    speechSynthesis.speak(u);
  } catch (e) {}
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*          MAIN COMPONENT                  */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function AIAssistant() {
  const [tab, setTab] = useState("chat"); // "chat" | "voice"

  return (
    <div className="ai-page">
      <div className="ai-page-header">
        <h1>🤖 AI সহায়ক</h1>
        <p>ICT-র যেকোনো প্রশ্ন করো — টেক্সট চ্যাটে বা ভয়েসে কথা বলো</p>
        <div className="ai-tabs">
          <button className={`ai-tab ${tab === "chat" ? "active" : ""}`} onClick={() => setTab("chat")}>
            💬 টেক্সট চ্যাট
          </button>
          <button className={`ai-tab ${tab === "voice" ? "active" : ""}`} onClick={() => setTab("voice")}>
            🎙️ ভয়েস অ্যাসিস্ট্যান্ট
          </button>
        </div>
      </div>

      {tab === "chat" ? <TextChat /> : <VoiceAssistant />}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*         TEXT CHAT TAB                    */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function TextChat() {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const ctl = useRef(null), end = useRef(null), inp = useRef(null), msgsRef = useRef([]);
  msgsRef.current = msgs;

  useEffect(() => { if (end.current) end.current.scrollIntoView({ block: "end" }); }, [msgs]);
  useEffect(() => { if (inp.current) inp.current.focus(); }, []);

  function setLast(patch) {
    setMsgs(m => { const c = [...m]; c[c.length - 1] = { ...c[c.length - 1], ...patch }; return c; });
  }

  async function send(q) {
    q = (q || "").trim();
    if (!q || busy) return;
    let history = cleanHistory(msgsRef.current).concat([{ role: "user", content: q }]).slice(-10);
    while (history.length && history[0].role !== "user") history.shift();
    setMsgs([...msgsRef.current, { role: "user", content: q }, { role: "assistant", content: "", pending: true }]);
    setText(""); setBusy(true);
    const c = new AbortController(); ctl.current = c;
    try {
      const now = Date.now(); if (now - (send.t || 0) < COOLDOWN_MS) { setMsgs(msgsRef.current.slice(0, -2)); setBusy(false); return; } send.t = now;
      const reply = await streamOpenAI(FREE_URL, { model: FREE_MODEL, stream: true, messages: [{ role: "system", content: RULES }].concat(history) }, c.signal, t => setLast({ content: t, pending: true }));
      if (!reply) throw { code: "empty_completion" };
      setLast({ content: reply, pending: false });
    } catch (e) {
      const code = e?.code || "upstream_error";
      const copy = code === "cancelled" ? "উত্তর থামানো হয়েছে।"
        : code === "rate_limited" ? "অনেক বেশি প্রশ্ন হয়ে গেছে। একটু পরে আবার চেষ্টা করো।"
        : "উত্তর আনতে সমস্যা হয়েছে। আবার চেষ্টা করো।";
      setLast({ content: copy, pending: false, err: true });
    } finally { setBusy(false); ctl.current = null; }
  }

  const [listening, setListening] = useState(false);
  function mic() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR || busy) return;
    const r = new SR(); r.lang = "bn-BD"; r.interimResults = false; setListening(true);
    r.onresult = e => setText(t => (t + " " + e.results[0][0].transcript).trim());
    r.onend = r.onerror = () => setListening(false);
    try { r.start(); } catch (e) { setListening(false); }
  }

  return (
    <div className="ai-chat-box">
      <div className="ai-chat-body">
        {msgs.length === 0 ? (
          <div className="ai-chips">
            <p>ICT-র যেকোনো প্রশ্ন করো। SSC, HSC, অনার্স বা ডিগ্রি — সব লেভেলের।</p>
            {SUGGEST.map(t => <button key={t} className="ai-chip" onClick={() => send(t)}>{t}</button>)}
          </div>
        ) : (
          msgs.map((m, i) => (
            <div key={i} className={`ai-msg ${m.role}${m.err ? " err" : ""}`}>
              {m.role === "assistant" ? (
                <>
                  {m.content ? md(m.content) : "ভাবছি…"}
                  {m.content && !m.pending && !m.err && (
                    <div className="ai-msg-tools">
                      <button onClick={() => { try { navigator.clipboard.writeText(m.content); } catch (e) {} }}>কপি</button>
                      <button onClick={() => speak(m.content)}>🔊 শোনো</button>
                      <button onClick={() => { const u = msgsRef.current[i - 1]; if (u) send(u.content); }} disabled={busy}>আবার</button>
                    </div>
                  )}
                </>
              ) : m.content}
            </div>
          ))
        )}
        <div ref={end} />
      </div>
      <div className="ai-chat-foot">
        {(window.SpeechRecognition || window.webkitSpeechRecognition) && (
          <button className="ai-mic-btn" onClick={mic} aria-label="কথা বলে প্রশ্ন করো">{listening ? "🎙…" : "🎤"}</button>
        )}
        <textarea ref={inp} rows={1} value={text} placeholder="প্রশ্ন লেখো…" maxLength={1000}
          onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(text); } }} />
        {busy
          ? <button onClick={() => { if (ctl.current) ctl.current.abort(); }}>থামাও</button>
          : <button onClick={() => send(text)} disabled={!text.trim()}>পাঠাও</button>
        }
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*         VOICE ASSISTANT TAB              */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function VoiceAssistant() {
  const [status, setStatus] = useState("idle"); // idle | listening | thinking | speaking
  const [history, setHistory] = useState([]);
  const [transcript, setTranscript] = useState("");
  const [topic, setTopic] = useState(null);
  const histRef = useRef([]);
  histRef.current = history;
  const recognitionRef = useRef(null);
  const end = useRef(null);

  useEffect(() => { if (end.current) end.current.scrollIntoView({ block: "end" }); }, [history]);

  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("আপনার ব্রাউজার Voice Recognition সাপোর্ট করে না। Chrome ব্যবহার করুন।"); return; }
    const r = new SR();
    r.lang = "bn-BD";
    r.interimResults = true;
    r.continuous = false;
    recognitionRef.current = r;
    setStatus("listening");
    setTranscript("");

    r.onresult = e => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        interim = e.results[i][0].transcript;
      }
      setTranscript(interim);
    };
    r.onend = () => {
      const finalText = transcript || "";
      if (finalText.trim()) {
        processVoice(finalText.trim());
      } else {
        setStatus("idle");
      }
    };
    r.onerror = () => setStatus("idle");
    try { r.start(); } catch (e) { setStatus("idle"); }
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }

  async function processVoice(q) {
    setStatus("thinking");
    const userMsg = { role: "user", content: q };
    const newHistory = [...histRef.current, userMsg];
    setHistory(newHistory);

    const topicContext = topic ? `\nCurrent practice topic: ${topic}. Ask follow-up questions on this topic.` : "";
    const sysMsg = { role: "system", content: VOICE_RULES + topicContext };
    const apiHistory = [sysMsg, ...cleanHistory(newHistory).slice(-10)];

    try {
      let reply = "";
      const res = await streamOpenAI(
        FREE_URL,
        { model: FREE_MODEL, stream: true, messages: apiHistory },
        new AbortController().signal,
        t => { reply = t; }
      );
      reply = res || reply;
      const botMsg = { role: "assistant", content: reply };
      setHistory(h => [...h, botMsg]);
      setStatus("speaking");
      
      // Speak the reply
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(reply.replace(/[*`#]/g, ""));
      u.lang = /[\u0980-\u09FF]/.test(reply) ? "bn-BD" : "en-US";
      u.onend = () => setStatus("idle");
      u.onerror = () => setStatus("idle");
      speechSynthesis.speak(u);
    } catch (e) {
      setHistory(h => [...h, { role: "assistant", content: "দুঃখিত, উত্তর আনতে সমস্যা হয়েছে।", err: true }]);
      setStatus("idle");
    }
  }

  function selectTopic(t) {
    setTopic(t);
    setHistory([]);
    processVoice(t);
  }

  function reset() {
    speechSynthesis.cancel();
    setHistory([]); setTopic(null); setStatus("idle"); setTranscript("");
  }

  const hasMic = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  return (
    <div className="voice-box">
      {!hasMic ? (
        <div className="voice-no-support">
          <p>⚠️ আপনার ব্রাউজার Voice Recognition সাপোর্ট করে না।</p>
          <p>দয়া করে <b>Google Chrome</b> ব্যবহার করুন।</p>
        </div>
      ) : (
        <>
          {/* Topic selection */}
          {!topic && history.length === 0 && (
            <div className="voice-topics fade-in">
              <h3>📋 একটি টপিক বেছে নাও অথবা মাইকে চাপ দিয়ে কথা বলো:</h3>
              <div className="voice-topic-grid">
                {VOICE_TOPICS.map(t => (
                  <button key={t} className="voice-topic-btn" onClick={() => selectTopic(t)}>{t}</button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation history */}
          {history.length > 0 && (
            <div className="voice-history">
              {history.map((m, i) => (
                <div key={i} className={`voice-bubble ${m.role}${m.err ? " err" : ""}`}>
                  <span className="voice-label">{m.role === "user" ? "🗣️ তুমি" : "🤖 AI"}</span>
                  <div className="voice-text">{m.role === "assistant" ? md(m.content) : m.content}</div>
                </div>
              ))}
              <div ref={end} />
            </div>
          )}

          {/* Live transcript */}
          {status === "listening" && transcript && (
            <div className="voice-live-transcript fade-in">
              <p>🎤 "{transcript}"</p>
            </div>
          )}

          {/* Center mic button */}
          <div className="voice-controls">
            <button
              className={`voice-mic-main ${status}`}
              onClick={() => {
                if (status === "listening") stopListening();
                else if (status === "idle") startListening();
                else if (status === "speaking") { speechSynthesis.cancel(); setStatus("idle"); }
              }}
              disabled={status === "thinking"}
            >
              {status === "idle" && "🎤 কথা বলো"}
              {status === "listening" && "🔴 শুনছি..."}
              {status === "thinking" && "🧠 ভাবছি..."}
              {status === "speaking" && "⏹️ থামাও"}
            </button>
            {history.length > 0 && (
              <button className="voice-reset-btn" onClick={reset}>🔄 নতুন করে শুরু</button>
            )}
          </div>

          <div className="voice-hint">
            <p>💡 মাইক বাটনে ক্লিক করে ICT-র যেকোনো প্রশ্ন জিজ্ঞেস করো — AI ভয়েসে উত্তর দেবে ও ভুল থাকলে ঠিক করে দেবে!</p>
          </div>
        </>
      )}
    </div>
  );
}
