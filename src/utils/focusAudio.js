// ═══════════════════════════════════════════════════════════════════
//  PREMIUM FOCUS STUDY AMBIENT AUDIO ENGINE (Web Audio API)
//  Continuous Infinite Looping • Zero Race Conditions • Studio Quality
// ═══════════════════════════════════════════════════════════════════

let audioCtx = null;
let activeNodes = [];
let masterGain = null;
let currentMode = "none";
let currentVolume = 0.6;

function getContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function getAmbientSoundMode() {
  return currentMode;
}

export function stopAmbientSound() {
  currentMode = "none";

  // Capture existing nodes & gain in a local closure so ANY newly started
  // sound is NEVER accidentally canceled by setTimeout!
  const nodesToStop = [...activeNodes];
  const gainToFade = masterGain;

  // Immediately clear references for new sounds
  activeNodes = [];
  masterGain = null;

  if (gainToFade && audioCtx) {
    try {
      const now = audioCtx.currentTime;
      gainToFade.gain.setValueAtTime(gainToFade.gain.value, now);
      gainToFade.gain.linearRampToValueAtTime(0.0001, now + 0.15);
    } catch (_) {}
  }

  setTimeout(() => {
    nodesToStop.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (_) {}
    });
  }, 180);
}

export function setAmbientVolume(vol) {
  currentVolume = Math.max(0.05, Math.min(1, vol));
  if (masterGain && audioCtx) {
    try {
      masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(currentVolume, audioCtx.currentTime + 0.05);
    } catch (_) {}
  }
}

export function startAmbientSound(mode, volume = 0.6) {
  const ctx = getContext();
  if (!ctx) return;

  if (!mode || mode === "none") {
    stopAmbientSound();
    return;
  }

  // If already playing this exact mode, simply update volume
  if (currentMode === mode && masterGain) {
    setAmbientVolume(volume);
    return;
  }

  // Stop previous sound nodes cleanly
  stopAmbientSound();

  currentMode = mode;
  currentVolume = Math.max(0.05, Math.min(1, volume));

  // Master Gain Node for smooth fade-in and volume scaling
  masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(currentVolume, ctx.currentTime + 0.3);
  masterGain.connect(ctx.destination);

  if (mode === "rain") {
    createRainSound(ctx, masterGain);
  } else if (mode === "binaural") {
    createBinauralSound(ctx, masterGain);
  } else if (mode === "waves") {
    createWavesSound(ctx, masterGain);
  }
}

// ── 🌧️ Studio-Grade Gentle Rain Generator ──
// Seamless 8-second stereo pink noise with droplet resonance and wind modulation
function createRainSound(ctx, outputDestination) {
  const sampleRate = ctx.sampleRate;
  const bufferDuration = 8; // 8 seconds seamless buffer
  const bufferSize = sampleRate * bufferDuration;
  const noiseBuffer = ctx.createBuffer(2, bufferSize, sampleRate);

  // Generate warm stereo pink noise
  for (let ch = 0; ch < 2; ch++) {
    const data = noiseBuffer.getChannelData(ch);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.76160 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.16;
      b6 = white * 0.115926;
    }

    // Cross-fade the first and last 0.3s of buffer so loop is 100% infinite and seamless
    const fadeLen = Math.floor(sampleRate * 0.3);
    for (let i = 0; i < fadeLen; i++) {
      const ratio = i / fadeLen;
      const blend = 0.5 * (1 - Math.cos(Math.PI * ratio));
      const tailIdx = bufferSize - fadeLen + i;
      data[i] = data[i] * blend + data[tailIdx] * (1 - blend);
      data[tailIdx] = data[i];
    }
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  // Main Rain Filter (Lowpass 1100 Hz for soothing soft rain)
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 1150;
  lowpass.Q.value = 0.7;

  // Highpass to eliminate subwoofer rumble
  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 140;

  // Droplet sparkle resonator (adds subtle realism of rain hitting surfaces)
  const dropletFilter = ctx.createBiquadFilter();
  dropletFilter.type = "bandpass";
  dropletFilter.frequency.value = 2100;
  dropletFilter.Q.value = 1.8;

  const dropletGain = ctx.createGain();
  dropletGain.gain.value = 0.12;

  const mainRainGain = ctx.createGain();
  mainRainGain.gain.value = 0.75;

  // Connect Main Rain Path
  noiseSource.connect(lowpass);
  lowpass.connect(highpass);
  highpass.connect(mainRainGain);
  mainRainGain.connect(outputDestination);

  // Connect Droplet Path
  noiseSource.connect(dropletFilter);
  dropletFilter.connect(dropletGain);
  dropletGain.connect(outputDestination);

  noiseSource.start(0);
  activeNodes.push(noiseSource, lowpass, highpass, mainRainGain, dropletFilter, dropletGain);
}

// ── 🎧 10 Hz Alpha Wave + Meditation Ambient Drone ──
// Pure Alpha wave binaural carrier (216 Hz & 226 Hz) + harmonic ambient pad
function createBinauralSound(ctx, outputDestination) {
  const baseFreq = 216; // A3 harmonic
  const beatDiff = 10;  // 10 Hz Alpha wave for deep concentration & recall

  // Left Ear Oscillator (216 Hz)
  const leftOsc = ctx.createOscillator();
  leftOsc.type = "sine";
  leftOsc.frequency.value = baseFreq;

  // Right Ear Oscillator (226 Hz)
  const rightOsc = ctx.createOscillator();
  rightOsc.type = "sine";
  rightOsc.frequency.value = baseFreq + beatDiff;

  // Harmonic Sub-Drone (108 Hz warm fundamental bass)
  const subOsc = ctx.createOscillator();
  subOsc.type = "sine";
  subOsc.frequency.value = baseFreq / 2;

  // Harmonic Fifth (162 Hz calming warm overtone)
  const fifthOsc = ctx.createOscillator();
  fifthOsc.type = "sine";
  fifthOsc.frequency.value = (baseFreq / 2) * 1.5;

  const subGain = ctx.createGain();
  subGain.gain.value = 0.22;

  const fifthGain = ctx.createGain();
  fifthGain.gain.value = 0.14;

  const warmFilter = ctx.createBiquadFilter();
  warmFilter.type = "lowpass";
  warmFilter.frequency.value = 380;

  subOsc.connect(subGain);
  fifthOsc.connect(fifthGain);
  subGain.connect(warmFilter);
  fifthGain.connect(warmFilter);
  warmFilter.connect(outputDestination);

  // Stereo Binaural Separation
  if (ctx.createStereoPanner) {
    const panLeft = ctx.createStereoPanner();
    panLeft.pan.value = -0.85;
    leftOsc.connect(panLeft);
    panLeft.connect(outputDestination);

    const panRight = ctx.createStereoPanner();
    panRight.pan.value = 0.85;
    rightOsc.connect(panRight);
    panRight.connect(outputDestination);

    activeNodes.push(panLeft, panRight);
  } else {
    const merger = ctx.createChannelMerger(2);
    leftOsc.connect(merger, 0, 0);
    rightOsc.connect(merger, 0, 1);
    merger.connect(outputDestination);
    activeNodes.push(merger);
  }

  leftOsc.start(0);
  rightOsc.start(0);
  subOsc.start(0);
  fifthOsc.start(0);

  activeNodes.push(leftOsc, rightOsc, subOsc, fifthOsc, subGain, fifthGain, warmFilter);
}

// ── 🌊 Calming Ocean Waves Generator ──
// Rhythmic swell and undertow sweeping between 200 Hz and 750 Hz
function createWavesSound(ctx, outputDestination) {
  const sampleRate = ctx.sampleRate;
  const bufferDuration = 8;
  const bufferSize = sampleRate * bufferDuration;
  const noiseBuffer = ctx.createBuffer(2, bufferSize, sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const data = noiseBuffer.getChannelData(ch);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.6;
    }
    // Seamless cross-fade
    const fadeLen = Math.floor(sampleRate * 0.3);
    for (let i = 0; i < fadeLen; i++) {
      const ratio = i / fadeLen;
      const blend = 0.5 * (1 - Math.cos(Math.PI * ratio));
      const tailIdx = bufferSize - fadeLen + i;
      data[i] = data[i] * blend + data[tailIdx] * (1 - blend);
      data[tailIdx] = data[i];
    }
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  // Sweeping wave filter
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  filter.Q.value = 1.1;

  // 10-second rhythmic ocean swell cycle (0.1 Hz)
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.1;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 320;

  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  const waveGain = ctx.createGain();
  waveGain.gain.value = 0.72;

  noiseSource.connect(filter);
  filter.connect(waveGain);
  waveGain.connect(outputDestination);

  lfo.start(0);
  noiseSource.start(0);

  activeNodes.push(noiseSource, filter, lfo, lfoGain, waveGain);
}

// ── 🔔 Session Completion Bell / Chime ──
export function playAlertChime() {
  const ctx = getContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4); // A5

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.4);
  } catch (_) {}
}
