// ═══════════════════════════════════════════════════════════════════
//  FOCUS STUDY AMBIENT AUDIO ENGINE (Web Audio API)
//  Zero external MP3 dependencies • 100% Offline • Realistic & Instant
// ═══════════════════════════════════════════════════════════════════

let audioCtx = null;
let activeNodes = [];
let masterGain = null;
let currentMode = "none";
let currentVolume = 0.5;

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

export function stopAmbientSound() {
  currentMode = "none";
  if (masterGain && audioCtx) {
    try {
      // Smooth fade-out to prevent headphone clicks
      masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
    } catch (_) {}
  }

  setTimeout(() => {
    activeNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (_) {}
    });
    activeNodes = [];
    masterGain = null;
  }, 160);
}

export function setAmbientVolume(vol) {
  currentVolume = Math.max(0, Math.min(1, vol));
  if (masterGain && audioCtx) {
    try {
      masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(currentVolume, audioCtx.currentTime + 0.05);
    } catch (_) {}
  }
}

export function startAmbientSound(mode, volume = 0.5) {
  const ctx = getContext();
  if (!ctx) return;

  if (mode === "none") {
    stopAmbientSound();
    return;
  }

  // If already playing this mode, just update volume
  if (currentMode === mode && masterGain) {
    setAmbientVolume(volume);
    return;
  }

  // Stop previous sound nodes
  stopAmbientSound();
  currentMode = mode;
  currentVolume = volume;

  // Master Gain Node for volume control and smooth fade-in
  masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(currentVolume, ctx.currentTime + 0.25);
  masterGain.connect(ctx.destination);

  if (mode === "rain") {
    createRainSound(ctx, masterGain);
  } else if (mode === "binaural") {
    createBinauralSound(ctx, masterGain);
  } else if (mode === "waves") {
    createWavesSound(ctx, masterGain);
  }
}

// ── 🌧️ Realistic Rain Sound Generator ──
function createRainSound(ctx, outputDestination) {
  const sampleRate = ctx.sampleRate;
  const bufferDuration = 4; // 4 seconds seamless loop
  const bufferSize = sampleRate * bufferDuration;
  const noiseBuffer = ctx.createBuffer(2, bufferSize, sampleRate);

  // Generate Stereo Pink/Brown Noise with randomized droplet density
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
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.14;
      b6 = white * 0.115926;
    }
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  // Multi-stage filtering for rich gentle rain texture
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 1350;
  lowpass.Q.value = 0.7;

  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 150;

  // Rain Gain
  const rainGain = ctx.createGain();
  rainGain.gain.value = 0.65;

  noiseSource.connect(lowpass);
  lowpass.connect(highpass);
  highpass.connect(rainGain);
  rainGain.connect(outputDestination);

  noiseSource.start(0);
  activeNodes.push(noiseSource, lowpass, highpass, rainGain);
}

// ── 🎧 10 Hz Alpha Wave Binaural Focus Drone Generator ──
function createBinauralSound(ctx, outputDestination) {
  // Base study carrier frequency: 216 Hz (left) & 226 Hz (right) -> 10 Hz Alpha Beat
  const baseFreq = 216;
  const beatDiff = 10; // 10 Hz Alpha wave for deep focus & retention

  const leftOsc = ctx.createOscillator();
  const rightOsc = ctx.createOscillator();
  leftOsc.type = "sine";
  rightOsc.type = "sine";
  leftOsc.frequency.value = baseFreq;
  rightOsc.frequency.value = baseFreq + beatDiff;

  // Sub-harmonic warm tone (108 Hz warm drone)
  const subOsc = ctx.createOscillator();
  subOsc.type = "sine";
  subOsc.frequency.value = baseFreq / 2;

  const subGain = ctx.createGain();
  subGain.gain.value = 0.18;
  subOsc.connect(subGain);
  subGain.connect(outputDestination);

  // Stereo Panning for binaural effect (or Channel Merger fallback)
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
    // Fallback if StereoPanner is unavailable
    const merger = ctx.createChannelMerger(2);
    leftOsc.connect(merger, 0, 0);
    rightOsc.connect(merger, 0, 1);
    merger.connect(outputDestination);
    activeNodes.push(merger);
  }

  // Gentle tone gains
  const toneGain = ctx.createGain();
  toneGain.gain.value = 0.22;

  leftOsc.start(0);
  rightOsc.start(0);
  subOsc.start(0);

  activeNodes.push(leftOsc, rightOsc, subOsc, subGain, toneGain);
}

// ── 🌊 Calm Ocean Waves / Stream Generator ──
function createWavesSound(ctx, outputDestination) {
  const sampleRate = ctx.sampleRate;
  const bufferDuration = 5;
  const bufferSize = sampleRate * bufferDuration;
  const noiseBuffer = ctx.createBuffer(2, bufferSize, sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const data = noiseBuffer.getChannelData(ch);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  // Dynamic filter simulating rolling waves
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 450;
  filter.Q.value = 1.2;

  // LFO to slowly sweep the wave filter cutoff up and down
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.12; // slow wave period (~8.3 seconds)
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 350;

  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  const waveGain = ctx.createGain();
  waveGain.gain.value = 0.6;

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

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.4);
  } catch (_) {}
}
