// Dragon Flap sounds. Built by the Sound builder, following CONTRACT.md section 3.
// flap: a juicy squish · score: a cash-register ding · crash: a wooden crate tumble.
// Web Audio only. Every sound is under 0.5 seconds and quiet (gain 0.2 or less).
(function () {
  let audio = null;
  function getAudio() {
    if (!audio) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      audio = new AudioCtx();
    }
    if (audio.state === 'suspended') audio.resume();
    return audio;
  }

  // A short burst of noise, shaped by a filter. Used for the squish and the crash.
  function noiseBurst(ctx, when, seconds, filterType, startFreq, endFreq, gainPeak) {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(startFreq, when);
    filter.frequency.exponentialRampToValueAtTime(endFreq, when + seconds);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainPeak, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + seconds);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(when);
    source.stop(when + seconds);
  }

  // One clean tone with a fast fade. Used for the ding.
  function tone(ctx, when, seconds, type, startFreq, endFreq, gainPeak) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, when);
    if (endFreq !== startFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, when + seconds);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainPeak, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + seconds);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(when);
    osc.stop(when + seconds);
  }

  window.SOUNDS = {
    // A juicy squish: a quick, wet puff of low noise with a little downward blip.
    flap: function () {
      try {
        const ctx = getAudio();
        if (!ctx) return;
        const now = ctx.currentTime;
        noiseBurst(ctx, now, 0.12, 'lowpass', 900, 200, 0.18);
        tone(ctx, now, 0.1, 'sine', 300, 130, 0.1);
      } catch (error) {}
    },

    // A cash-register ding: two bright bell tones, like a sale ringing up.
    score: function () {
      try {
        const ctx = getAudio();
        if (!ctx) return;
        const now = ctx.currentTime;
        tone(ctx, now, 0.3, 'sine', 1245, 1245, 0.14);
        tone(ctx, now, 0.3, 'sine', 1865, 1865, 0.08);
        tone(ctx, now + 0.07, 0.25, 'triangle', 2490, 2490, 0.05);
      } catch (error) {}
    },

    // A crate tumble: a low wooden thud with a clatter of noise on top.
    crash: function () {
      try {
        const ctx = getAudio();
        if (!ctx) return;
        const now = ctx.currentTime;
        tone(ctx, now, 0.22, 'triangle', 160, 55, 0.18);
        noiseBurst(ctx, now, 0.3, 'bandpass', 1800, 350, 0.15);
        noiseBurst(ctx, now + 0.1, 0.18, 'bandpass', 900, 250, 0.1);
      } catch (error) {}
    }
  };
})();
