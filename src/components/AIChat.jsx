import React from 'react';

/* ============ AI সহায়ক (React) ============ */

  /* নিজের সাইটে হোস্ট করলে এখানে Cloudflare Worker-এর লিংক বসাবে। API key কখনো এই ফাইলে রাখবে না। */
  const CHAT_API_URL = "";            /* ১ম পছন্দ: নিজের Cloudflare Worker (ai-worker.js) — ফ্রি ও নিরাপদ */
  const FREE_URL = "https://text.pollinations.ai/openai"; /* ২য় পছন্দ: কী ছাড়াই ফ্রি AI (ফলব্যাক) */
  const FREE_MODEL = "openai-fast";
  const FREE_KEY = "";                /* Pollinations-এর publishable key থাকলে এখানে দিলে লিমিট বাড়ে */
  const COOLDOWN_MS = 2500;

  const RULES = "You are the study assistant of ICT Success Academy in Bangladesh. Help SSC, HSC, Honours and Degree students with ICT only: information and communication technology, number systems, digital devices and logic gates, networking and communication, web design and HTML, programming (C), databases (DBMS), AI, robotics, cyber safety, office software and general computer topics. Reply in the same language the student writes in (Bangla, Banglish or English). Use simple words, short steps and small examples, and add exam tips when useful. Show calculations step by step. If the question is not about ICT or studying, politely say you can only help with ICT and suggest an ICT question instead. If you are unsure about a board-specific detail such as syllabus or marks, say so instead of guessing. Keep answers under about 250 words unless the student asks for more.";

  const SUGGEST = [
    "বাইনারি থেকে দশমিকে রূপান্তর কীভাবে করব?",
    "HTML-এ টেবিল বানানোর নিয়ম দেখাও",
    "নেটওয়ার্ক টপোলজি কী? প্রকারভেদ বলো",
    "Primary key আর Foreign key-র পার্থক্য কী?"
  ];

  const h = React.createElement, useState = React.useState, useRef = React.useRef, useEffect = React.useEffect;

  function inline(t){
    return t.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map(function(p,i){
      if(/^\*\*[^*]+\*\*$/.test(p)) return h('strong',{key:i},p.slice(2,-2));
      if(/^`[^`]+`$/.test(p)) return h('code',{key:i},p.slice(1,-1));
      return p;
    });
  }
  function md(text){
    const out=[];
    text.split('```').forEach(function(b,bi){
      if(bi%2===1){
        out.push(h('pre',{key:'p'+bi},h('code',null,b.replace(/^[a-zA-Z0-9+#]*\n/,'').replace(/\n$/,''))));
        return;
      }
      let list=null;
      const flush=function(){ if(list){ out.push(h(list.t,{key:'l'+bi+'-'+out.length},list.items)); list=null; } };
      b.split('\n').forEach(function(ln,li){
        const ul=ln.match(/^\s*[-*•]\s+(.*)/), ol=ln.match(/^\s*\d+[.)]\s+(.*)/);
        if(ul||ol){
          const t=ul?'ul':'ol';
          if(!list||list.t!==t){ flush(); list={t:t,items:[]}; }
          list.items.push(h('li',{key:list.items.length},inline((ul||ol)[1])));
          return;
        }
        flush();
        const hd=ln.match(/^#{1,6}\s+(.*)/);
        if(hd){ out.push(h('p',{key:'h'+bi+'-'+li,className:'md-h'},inline(hd[1]))); return; }
        if(ln.trim()) out.push(h('p',{key:'t'+bi+'-'+li},inline(ln)));
      });
      flush();
    });
    return out;
  }

  function cleanHistory(msgs){
    const out=[];
    msgs.forEach(function(m,i){
      if(m.err) return;
      if(m.role==='user' && msgs[i+1] && msgs[i+1].err) return;
      out.push({role:m.role,content:m.content});
    });
    return out;
  }

  function siteContext(){ try{ return (document.querySelector('main')||document.body).innerText.replace(/\s+/g,' ').slice(0,2500); }catch(e){ return ''; } }
  function sysPrompt(){ return RULES+' Answer with a short direct answer first, then a simple example, then a one-line exam tip. For questions about the academy (courses, fees, contact) use ONLY this website text and say you are not sure if it is not there: '+siteContext(); }
  async function streamOpenAI(url,body,headers,signal,onText){
    const r=await fetch(url,{method:'POST',headers:Object.assign({'Content-Type':'application/json'},headers||{}),body:JSON.stringify(body),signal:signal});
    if(!r.ok) throw {code:r.status===429?'rate_limited':'upstream_error'};
    if(!r.body||!r.body.getReader){ const d=await r.json(); return (d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content)||''; }
    const rd=r.body.getReader(), dec=new TextDecoder(); let buf='', out='';
    for(;;){ const x=await rd.read(); if(x.done) break; buf+=dec.decode(x.value,{stream:true});
      const lines=buf.split('\n'); buf=lines.pop();
      for(const ln of lines){ const t=ln.trim(); if(t.indexOf('data:')!==0) continue; const j=t.slice(5).trim(); if(j==='[DONE]') continue;
        try{ const d=JSON.parse(j); const c=d.choices&&d.choices[0]&&d.choices[0].delta&&d.choices[0].delta.content; if(c){ out+=c; onText(out); } }catch(e){} } }
    return out;
  }
  async function askAI(history,signal,onText,sample){
    const sys=sysPrompt(), errs=[];
    const chain=[];
    if(CHAT_API_URL) chain.push(async function(){ const r=await fetch(CHAT_API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({system:sys,messages:history}),signal:signal}); if(!r.ok) throw {code:r.status===429?'rate_limited':'upstream_error'}; const d=await r.json(); onText(d.text||''); return d.text||''; });
    if(sample) chain.push(async function(){ const turns=history.map(function(m,i){ return i===0?{role:'user',content:sys+'\n\nStudent question:\n'+m.content}:m; }); const res=await sample(turns,{cache:false,modelTier:'quick',signal:signal,onText:function(o){ onText(o.text); }}); return res.text; });
    if(FREE_URL) chain.push(function(){ return streamOpenAI(FREE_URL,{model:FREE_MODEL,stream:true,messages:[{role:'system',content:sys}].concat(history)},FREE_KEY?{Authorization:'Bearer '+FREE_KEY}:null,signal,onText); });
    for(const f of chain){ try{ const t=await f(); if(t) return t; }catch(e){ if(e&&(e.code==='cancelled'||e.name==='AbortError')) throw {code:'cancelled'}; errs.push(e); } }
    throw errs[0]||{code:'unavailable'};
  }
  function speak(t){ try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t.replace(/[*`#]/g,'')); u.lang=/[\u0980-\u09FF]/.test(t)?'bn-BD':'en-US'; speechSynthesis.speak(u); }catch(e){} }

  function Chat(){
    const st=useState(false), open=st[0], setOpen=st[1];
    const ms=useState([]), msgs=ms[0], setMsgs=ms[1];
    const tx=useState(''), text=tx[0], setText=tx[1];
    const bz=useState(false), busy=bz[0], setBusy=bz[1];
    const ctl=useRef(null), end=useRef(null), inp=useRef(null), sampleRef=useRef(null), msgsRef=useRef([]), sendRef=useRef(null);
    msgsRef.current=msgs;

    useEffect(function(){
      if(window.claude && window.claude.use){
        window.claude.use('sample').then(function(s){ sampleRef.current=s||null; }).catch(function(){ sampleRef.current=null; });
      }
    },[]);
    useEffect(function(){
      const onAsk=function(e){
        setOpen(true);
        const q=e.detail && e.detail.text;
        if(q && sendRef.current) sendRef.current(q);
      };
      window.addEventListener('ask-ai',onAsk);
      return function(){ window.removeEventListener('ask-ai',onAsk); };
    },[]);
    useEffect(function(){ if(end.current) end.current.scrollIntoView({block:'end'}); },[msgs,open]);
    useEffect(function(){ if(open && inp.current) inp.current.focus(); },[open]);
    useEffect(function(){
      if(!open) return;
      const k=function(e){ if(e.key==='Escape') setOpen(false); };
      window.addEventListener('keydown',k);
      return function(){ window.removeEventListener('keydown',k); };
    },[open]);

    function setLast(patch){
      setMsgs(function(m){ const c=m.slice(); c[c.length-1]=Object.assign({},c[c.length-1],patch); return c; });
    }

    async function send(q){
      q=(q||'').trim();
      if(!q || busy) return;
      let history=cleanHistory(msgsRef.current).concat([{role:'user',content:q}]).slice(-10);
      while(history.length && history[0].role!=='user') history.shift();
      setMsgs(msgsRef.current.concat([{role:'user',content:q},{role:'assistant',content:'',pending:true}]));
      setText(''); setBusy(true);
      const c=new AbortController(); ctl.current=c;
      try{
        const now=Date.now(); if(now-(send.t||0)<COOLDOWN_MS){ setMsgs(msgsRef.current.slice(0,-2)); setBusy(false); return; } send.t=now;
        const reply=await askAI(history,c.signal,function(t){ setLast({content:t,pending:true}); },sampleRef.current);
        if(!reply) throw {code:'empty_completion'};
        setLast({content:reply,pending:false});
      }catch(e){
        const code=(e&&e.code)||'upstream_error';
        if(e && e.text){ setLast({content:e.text,pending:false}); }
        else{
          const copy = code==='cancelled' ? 'উত্তর থামানো হয়েছে।'
            : code==='rate_limited' ? 'অনেক বেশি প্রশ্ন হয়ে গেছে। একটু পরে আবার চেষ্টা করো।'
            : (code==='unavailable'||code==='not_granted'||code==='sampling_disabled'||code==='not_declared'||code==='capability_disabled') ? 'এই মুহূর্তে AI সহায়ক ব্যবহার করা যাচ্ছে না। একটু পরে আবার চেষ্টা করো।'
            : 'উত্তর আনতে সমস্যা হয়েছে। আবার চেষ্টা করো।';
          setLast({content:copy,pending:false,err:true});
        }
      }finally{ setBusy(false); ctl.current=null; }
    }
    sendRef.current=send;
    const ls=useState(false), listening=ls[0], setListening=ls[1];
    function mic(){
      const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR||busy) return;
      const r=new SR(); r.lang='bn-BD'; r.interimResults=false; setListening(true);
      r.onresult=function(e){ setText(function(t){ return (t+' '+e.results[0][0].transcript).trim(); }); };
      r.onend=r.onerror=function(){ setListening(false); };
      try{ r.start(); }catch(e){ setListening(false); }
    }
    const micBtn=(window.SpeechRecognition||window.webkitSpeechRecognition)?h('button',{className:'mic',onClick:mic,'aria-label':'কথা বলে প্রশ্ন করো',title:'কথা বলে প্রশ্ন করো'},listening?'🎙…':'🎤'):null;

    function onKey(e){ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(text); } }

    const body = msgs.length===0
      ? h('div',{className:'chips'},
          h('p',null,'ICT-র যেকোনো প্রশ্ন করো। SSC, HSC, অনার্স বা ডিগ্রি — সব লেভেলের।'),
          SUGGEST.map(function(t){ return h('button',{key:t,className:'chip',onClick:function(){ send(t); }},t); }))
      : msgs.map(function(m,i){
          const cls='msg '+m.role+(m.err?' err':'');
          return h('div',{key:i,className:cls},
            m.role==='assistant' ? [m.content ? md(m.content) : 'ভাবছি…', (m.content&&!m.pending&&!m.err)?h('div',{key:'t',className:'tools'},
              h('button',{onClick:function(){ try{navigator.clipboard.writeText(m.content);}catch(e){} }},'কপি'),
              h('button',{onClick:function(){ speak(m.content); }},'🔊 শোনো'),
              h('button',{onClick:function(){ const u=msgsRef.current[i-1]; if(u) send(u.content); },disabled:busy},'আবার')):null] : m.content);
        });

    return h('div',{className:'chat'},
      open && h('div',{className:'chat-panel',role:'dialog','aria-label':'ICT AI সহায়ক'},
        h('div',{className:'chat-head'},
          h('div',null,h('b',null,'ICT AI সহায়ক'),h('small',null,'শুধু ICT বিষয়ের প্রশ্নের উত্তর দেয়')),
          h('button',{onClick:function(){ if(!busy) setMsgs([]); },disabled:busy,'aria-label':'নতুন চ্যাট'},'নতুন চ্যাট')),
        h('div',{className:'chat-body','aria-live':'polite'},body,h('div',{ref:end})),
        h('div',{className:'chat-foot'},
          micBtn, h('textarea',{ref:inp,rows:1,value:text,placeholder:'প্রশ্ন লেখো…','aria-label':'প্রশ্ন লেখো',maxLength:1000,onChange:function(e){ setText(e.target.value); },onKeyDown:onKey}),
          busy
            ? h('button',{onClick:function(){ if(ctl.current) ctl.current.abort(); }},'থামাও')
            : h('button',{onClick:function(){ send(text); },disabled:!text.trim()},'পাঠাও'))),
      h('button',{className:'chat-fab','aria-expanded':open,onClick:function(){ setOpen(!open); }},open?'বন্ধ করো':'AI-কে জিজ্ঞেস করো')
    );
  }

export default Chat;
