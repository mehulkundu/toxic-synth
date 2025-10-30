import { useState, useEffect, useRef, useCallback } from "react";

const chordIntervals = {
  major: [0, 4, 7], minor: [0, 3, 7], dim: [0, 3, 6], aug: [0, 4, 8],
  maj7: [0, 4, 7, 11], min7: [0, 3, 7, 10], dom7: [0, 4, 7, 10],
  sus2: [0, 2, 7], sus4: [0, 5, 7],
};

export const useSynthEngine = () => {
  const [isOn, setIsOn] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [activeOscTab, setActiveOscTab] = useState(1);
  const [activeEnvTab, setActiveEnvTab] = useState(1);
  const [activeFilterTab, setActiveFilterTab] = useState(1);
  const [activeLfoTab, setActiveLfoTab] = useState(1);
  const [osc1, setOsc1] = useState({ on: true, wave: "sawtooth", detune: 0, voices: 3, spread: 15, level: 0.8 });
  const [osc2, setOsc2] = useState({ on: true, wave: "square", detune: -7, voices: 2, spread: 10, level: 0.6 });
  const [osc3, setOsc3] = useState({ on: false, wave: "sine", detune: 12, voices: 1, spread: 0, level: 0.4 });
  const [env1, setEnv1] = useState({ on: true, a: 0.01, d: 0.2, s: 0.7, r: 0.3 });
  const [env2, setEnv2] = useState({ on: true, a: 0.1, d: 0.3, s: 0.5, r: 0.5 });
  const [env3, setEnv3] = useState({ on: false, a: 0.5, d: 0.4, s: 0.3, r: 1.0 });
  const [filter1, setFilter1] = useState({ on: true, freq: 2000, res: 1, type: "lowpass" });
  const [filter2, setFilter2] = useState({ on: true, freq: 1000, res: 5, type: "lowpass" });
  const [filter3, setFilter3] = useState({ on: false, freq: 4000, res: 0.5, type: "lowpass" });
  const [lfo1, setLfo1] = useState({ on: false, rate: 4, depth: 0, wave: "sine" });
  const [lfo2, setLfo2] = useState({ on: false, rate: 0.5, depth: 0, wave: "sine" });
  const [lfo3, setLfo3] = useState({ on: false, rate: 8, depth: 0, wave: "triangle" });
  const [routing, setRouting] = useState({ osc1: { env: "env1", filter: "filter1", lfo: "lfo1" }, osc2: { env: "env2", filter: "filter2", lfo: "lfo2" }, osc3: { env: "env3", filter: "filter3", lfo: "lfo3" } });
  const [chordType, setChordType] = useState("major");
  const [transpose, setTranspose] = useState(0);

  const audioContextRef = useRef(null);
  const activeNotesRef = useRef(new Map());
  const masterGainRef = useRef(null);
  const pressedKeysRef = useRef(new Set());

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    masterGainRef.current = audioContextRef.current.createGain();
    masterGainRef.current.gain.value = volume;
    masterGainRef.current.connect(audioContextRef.current.destination);
    return () => {
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(volume, audioContextRef.current.currentTime, 0.1);
    }
  }, [volume]);

  const playChord = useCallback((baseFreq, key, chordType) => {
    if (!isOn || !audioContextRef.current || pressedKeysRef.current.has(key)) return;
    pressedKeysRef.current.add(key);

    const intervals = chordIntervals[chordType];
    const transposedFreq = baseFreq * Math.pow(2, transpose / 12);

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;
    const allVoices = [];

    intervals.forEach((interval) => {
      const noteFreq = transposedFreq * Math.pow(2, interval / 12);
      const oscs = [{ config: osc1, route: routing.osc1 }, { config: osc2, route: routing.osc2 }, { config: osc3, route: routing.osc3 }];
      const noteGain = ctx.createGain();
      noteGain.gain.value = 0;
      noteGain.connect(masterGainRef.current);

      oscs.forEach(({ config, route }) => {
        if (!config.on) return;
        const envs = { env1, env2, env3 };
        const filters = { filter1, filter2, filter3 };
        const lfos = { lfo1, lfo2, lfo3 };
        const env = envs[route.env];
        const flt = filters[route.filter];
        const lfo = lfos[route.lfo];
        if (!env.on) return;

        for (let v = 0; v < config.voices; v++) {
          const voiceDetune = config.detune * 100 + (v === 0 ? 0 : (v % 2 === 0 ? 1 : -1) * Math.ceil(v / 2) * config.spread);
          const osc = ctx.createOscillator();
          osc.type = config.wave;
          osc.frequency.value = noteFreq;
          osc.detune.value = voiceDetune;
          const oscGain = ctx.createGain();
          oscGain.gain.value = config.level / config.voices;
          let filterNode = null;
          if (flt.on) {
            filterNode = ctx.createBiquadFilter();
            filterNode.type = flt.type;
            filterNode.frequency.value = flt.freq;
            filterNode.Q.value = flt.res;
            if (lfo.on && lfo.depth > 0) {
              const lfoOsc = ctx.createOscillator();
              lfoOsc.type = lfo.wave;
              lfoOsc.frequency.value = lfo.rate;
              const lfoGain = ctx.createGain();
              lfoGain.gain.value = lfo.depth * flt.freq;
              lfoOsc.connect(lfoGain);
              lfoGain.connect(filterNode.frequency);
              lfoOsc.start(now);
              allVoices.push({ lfoOsc });
            }
          }
          osc.connect(oscGain);
          if (filterNode) {
            oscGain.connect(filterNode);
            filterNode.connect(noteGain);
          } else {
            oscGain.connect(noteGain);
          }
          osc.start(now);
          allVoices.push({ osc, noteGain, release: env.r });
        }
      });

      const { a, d, s, r } = env1;
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(1, now + a);
      noteGain.gain.linearRampToValueAtTime(s, now + a + d);
      activeNotesRef.current.set(`${key}-${interval}`, { voices: allVoices, noteGain, release: r });
    });
  }, [isOn, transpose, osc1, osc2, osc3, env1, env2, env3, filter1, filter2, filter3, lfo1, lfo2, lfo3, routing]);

  const stopChord = useCallback((key, chordType) => {
    if (!audioContextRef.current) return;
    pressedKeysRef.current.delete(key);

    const intervals = chordIntervals[chordType];
    intervals.forEach((interval) => {
      const noteKey = `${key}-${interval}`;
      const noteData = activeNotesRef.current.get(noteKey);
      if (!noteData) return;

      const ctx = audioContextRef.current;
      const now = ctx.currentTime;
      const { noteGain, release, voices } = noteData;

      noteGain.gain.cancelScheduledValues(now);
      noteGain.gain.setValueAtTime(noteGain.gain.value, now);
      noteGain.gain.linearRampToValueAtTime(0, now + release);

      voices.forEach((voice) => {
        if (voice.osc) voice.osc.stop(now + release + 0.1);
        if (voice.lfoOsc) voice.lfoOsc.stop(now + release + 0.1);
      });

      activeNotesRef.current.delete(noteKey);
    });
  }, []);

  // Effect to stop all notes when synth is turned off
  useEffect(() => {
    if (!isOn) {
      if (audioContextRef.current) {
        const keysToStop = new Set();
        activeNotesRef.current.forEach((_, key) => {
          keysToStop.add(key.split('-')[0]);
        });
        keysToStop.forEach(key => stopChord(key, chordType));
      }
    }
  }, [isOn, stopChord, chordType]);

  return {
    isOn, setIsOn, volume, setVolume, activeOscTab, setActiveOscTab, activeEnvTab, setActiveEnvTab,
    activeFilterTab, setActiveFilterTab, activeLfoTab, setActiveLfoTab, osc1, setOsc1, osc2, setOsc2,
    osc3, setOsc3, env1, setEnv1, env2, setEnv2, env3, setEnv3, filter1, setFilter1, filter2, setFilter2,
    filter3, setFilter3, lfo1, setLfo1, lfo2, setLfo2, lfo3, setLfo3, routing, setRouting, chordType,
    setChordType, transpose, setTranspose, playChord, stopChord, pressedKeysRef,
  };
};
