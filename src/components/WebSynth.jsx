import { useState, useEffect, useRef, useCallback } from "react";
import { Power, Volume2 } from "lucide-react";
import OscillatorSection from "./OscillatorSection";
import EnvelopeSection from "./EnvelopeSection";
import FilterSection from "./FilterSection";
import LfoSection from "./LfoSection";
import ChordSection from "./ChordSection";
import Keyboard from "./Keyboard";

const WebSynth = () => {
  // State declarations
  const [isOn, setIsOn] = useState(false);
  const [activeOscTab, setActiveOscTab] = useState(1);
  const [activeEnvTab, setActiveEnvTab] = useState(1);
  const [activeFilterTab, setActiveFilterTab] = useState(1);
  const [activeLfoTab, setActiveLfoTab] = useState(1);
  const [osc1, setOsc1] = useState({
    on: true,
    wave: "sawtooth",
    detune: 0,
    voices: 3,
    spread: 15,
    level: 0.8,
  });
  const [osc2, setOsc2] = useState({
    on: true,
    wave: "square",
    detune: -7,
    voices: 2,
    spread: 10,
    level: 0.6,
  });
  const [osc3, setOsc3] = useState({
    on: false,
    wave: "sine",
    detune: 12,
    voices: 1,
    spread: 0,
    level: 0.4,
  });
  const [env1, setEnv1] = useState({
    on: true,
    a: 0.01,
    d: 0.2,
    s: 0.7,
    r: 0.3,
  });
  const [env2, setEnv2] = useState({
    on: true,
    a: 0.1,
    d: 0.3,
    s: 0.5,
    r: 0.5,
  });
  const [env3, setEnv3] = useState({
    on: false,
    a: 0.5,
    d: 0.4,
    s: 0.3,
    r: 1.0,
  });
  const [filter1, setFilter1] = useState({
    on: true,
    freq: 2000,
    res: 1,
    type: "lowpass",
  });
  const [filter2, setFilter2] = useState({
    on: true,
    freq: 1000,
    res: 5,
    type: "lowpass",
  });
  const [filter3, setFilter3] = useState({
    on: false,
    freq: 4000,
    res: 0.5,
    type: "lowpass",
  });
  const [lfo1, setLfo1] = useState({
    on: false,
    rate: 4,
    depth: 0,
    wave: "sine",
  });
  const [lfo2, setLfo2] = useState({
    on: false,
    rate: 0.5,
    depth: 0,
    wave: "sine",
  });
  const [lfo3, setLfo3] = useState({
    on: false,
    rate: 8,
    depth: 0,
    wave: "triangle",
  });
  const [routing, setRouting] = useState({
    osc1: { env: "env1", filter: "filter1", lfo: "lfo1" },
    osc2: { env: "env2", filter: "filter2", lfo: "lfo2" },
    osc3: { env: "env3", filter: "filter3", lfo: "lfo3" },
  });
  const [chordType, setChordType] = useState("major");
  const [transpose, setTranspose] = useState(0);
  const [volume, setVolume] = useState(0.3);

  const audioContextRef = useRef(null);
  const activeNotesRef = useRef(new Map());
  const masterGainRef = useRef(null);
  const pressedKeysRef = useRef(new Set());

  const chordIntervals = {
    major: [0, 4, 7],
    minor: [0, 3, 7],
    dim: [0, 3, 6],
    aug: [0, 4, 8],
    maj7: [0, 4, 7, 11],
    min7: [0, 3, 7, 10],
    dom7: [0, 4, 7, 10],
    sus2: [0, 2, 7],
    sus4: [0, 5, 7],
  };

  // Audio context initialization
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();
    masterGainRef.current = audioContextRef.current.createGain();
    masterGainRef.current.gain.value = volume;
    masterGainRef.current.connect(audioContextRef.current.destination);
    return () => {
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        volume,
        audioContextRef.current.currentTime,
        0.1
      );
    }
  }, [volume]);

  // Audio functions (playChord, stopChord, key handlers) remain the same as original
  const playChord = useCallback(
    (baseFreq, key) => {
      if (!isOn || !audioContextRef.current || pressedKeysRef.current.has(key))
        return;
      pressedKeysRef.current.add(key);

      const intervals = chordIntervals[chordType];
      const transposedFreq = baseFreq * Math.pow(2, transpose / 12);

      const ctx = audioContextRef.current;
      const now = ctx.currentTime;
      const allVoices = [];

      intervals.forEach((interval) => {
        const noteFreq = transposedFreq * Math.pow(2, interval / 12);

        const oscs = [
          { config: osc1, route: routing.osc1 },
          { config: osc2, route: routing.osc2 },
          { config: osc3, route: routing.osc3 },
        ];

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
            const voiceDetune =
              config.detune * 100 +
              (v === 0
                ? 0
                : (v % 2 === 0 ? 1 : -1) * Math.ceil(v / 2) * config.spread);

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

        activeNotesRef.current.set(`${key}-${interval}`, {
          voices: allVoices,
          noteGain,
          release: r,
        });
      });
    },
    [
      isOn,
      chordType,
      transpose,
      osc1,
      osc2,
      osc3,
      env1,
      env2,
      env3,
      filter1,
      filter2,
      filter3,
      lfo1,
      lfo2,
      lfo3,
      routing,
    ]
  );

  const stopChord = useCallback(
    (key) => {
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
          if (voice.osc) {
            voice.osc.stop(now + release + 0.1);
          }
          if (voice.lfoOsc) {
            voice.lfoOsc.stop(now + release + 0.1);
          }
        });

        activeNotesRef.current.delete(noteKey);
      });
    },
    [chordType]
  );

  const keyToFreq = {
    a: 261.63,
    w: 277.18,
    s: 293.66,
    e: 311.13,
    d: 329.63,
    f: 349.23,
    t: 369.99,
    g: 392.0,
    y: 415.3,
    h: 440.0,
    u: 466.16,
    j: 493.88,
    k: 523.25,
    o: 554.37,
    l: 587.33,
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (keyToFreq[key] && !pressedKeysRef.current.has(key)) {
        playChord(keyToFreq[key], key);
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (keyToFreq[key]) {
        stopChord(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [playChord, stopChord]);

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-stone-800 via-stone-900 to-black p-20 overflow-auto'>
      <div
        className='w-full max-w-7xl mx-auto rounded-3xl p-6'
        style={{
          background: "linear-gradient(145deg, #252525, #1a1a1a)",
          boxShadow: "inset 2px 2px 5px #0a0a0a, inset -2px -2px 5px #2a2a2a",
        }}>
        {/* Header Section */}
        <div className='flex items-center justify-between mb-6 pb-4 border-b border-gray-700'>
          <div>
            <h1 className='text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600'>
              Toxic Synth
            </h1>
            <div className='text-xs text-gray-500 font-mono'>
              3-OSC MODULAR ARCHITECTURE
            </div>
          </div>
          <div className='flex items-center gap-6'>
            <div className='flex flex-col items-center gap-2'>
              {/* Master Volume Knob */}
              <div className='flex flex-col items-center gap-3'>
                <div className='text-xs text-gray-500 font-mono tracking-widest'>
                  VOLUME
                </div>

                <div className='relative w-16 h-16'>
                  {/* Hidden input */}
                  <input
                    type='range'
                    min='0'
                    max='1'
                    step='0.01'
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20'
                  />

                  {/* Knob body */}
                  <div className='absolute inset-0 rounded-full cursor-pointer'>
                    <div
                      className='absolute inset-0 rounded-full'
                      style={{
                        background: `
                radial-gradient(circle at 30% 30%, #4a4a4a 0%, #1a1a1a 70%),
                linear-gradient(145deg, #2a2a2a, #1a1a1a)
              `,
                        boxShadow: `
                inset 0 2px 4px rgba(255,255,255,0.1),
                inset 0 -2px 4px rgba(0,0,0,0.8),
                0 8px 24px rgba(0,0,0,0.8),
                0 2px 6px rgba(0,0,0,0.4)
              `,
                        border: "1px solid rgba(0,0,0,0.4)",
                      }}
                    />

                    {/* Rotating indicator */}
                    <div
                      className='absolute inset-2 rounded-full transition-transform duration-150'
                      style={{
                        background: `
                radial-gradient(circle at 40% 40%, #3a3a3a, #1a1a1a),
                linear-gradient(145deg, #2a2a2a, #1a1a1a)
              `,
                        boxShadow: `
                inset 2px 2px 4px rgba(255,255,255,0.05),
                inset -2px -2px 4px rgba(0,0,0,0.8),
                0 2px 4px rgba(0,0,0,0.3)
              `,
                        transform: `rotate(${volume * 330 - 165}deg)`,
                      }}>
                      {/* Indicator line */}
                      <div
                        className='absolute w-1 h-4 left-1/2 transition-all duration-200'
                        style={{
                          background:
                            "linear-gradient(to bottom, #f97316, #dc2626, #991b1b)",
                          transform: "translateX(-50%)",
                          top: "2px",
                          borderRadius: "1px",
                          boxShadow: "0 0 8px rgba(249, 115, 22, 0.6)",
                        }}
                      />

                      {/* Center dot */}
                      <div
                        className='absolute w-2 h-2 bg-gray-900 rounded-full left-1/2 top-1/2'
                        style={{
                          transform: "translate(-50%, -50%)",
                          boxShadow: `
                  inset 1px 1px 2px rgba(255,255,255,0.1),
                  inset -1px -1px 2px rgba(0,0,0,0.8)
                `,
                        }}
                      />
                    </div>

                    {/* Shine overlay */}
                    <div
                      className='absolute inset-1 rounded-full pointer-events-none'
                      style={{
                        background: `
                linear-gradient(135deg, 
                  rgba(255,255,255,0.15) 0%, 
                  rgba(255,255,255,0.05) 40%,
                  transparent 70%
                )
              `,
                        mixBlendMode: "overlay",
                      }}
                    />
                  </div>
                </div>

                {/* Value display */}
                <div className='text-xs text-gray-400 font-mono px-3 py-1 rounded bg-gray-900/50'>
                  {(volume * 100).toFixed(0)}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOn(!isOn)}
              className='relative w-20 h-20 rounded-full transition-all duration-300 hover:scale-105 active:scale-95'
              style={{
                background: isOn
                  ? "linear-gradient(145deg, #ff6b35, #d45525, #b34118)"
                  : "linear-gradient(145deg, #2a2a2a, #1a1a1a, #0a0a0a)",
                boxShadow: isOn
                  ? "inset 3px 3px 6px rgba(255, 140, 90, 0.8), inset -3px -3px 6px rgba(160, 50, 20, 0.6), 2px 2px 8px rgba(0,0,0,0.6), 0 0 30px rgba(255,107,53,0.5), 0 0 0 1px rgba(255,107,53,0.3)"
                  : "inset 5px 5px 10px #0a0a0a, inset -3px -3px 8px #3a3a3a, 3px 3px 10px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,0,0,0.7), 0 0 0 2px rgba(60,60,60,0.3)",
                transform: isOn ? "scale(1.05)" : "none",
                border: "none",
                outline: "none",
              }}>
              {/* Enhanced inner bezel */}
              <div
                className='absolute inset-2 rounded-full pointer-events-none'
                style={{
                  background: isOn
                    ? "linear-gradient(145deg, rgba(255,180,130,0.1), rgba(180,60,30,0.2))"
                    : "linear-gradient(145deg, rgba(80,80,80,0.1), rgba(10,10,10,0.3))",
                  boxShadow: isOn
                    ? "inset 1px 1px 2px rgba(255,200,150,0.3), inset -1px -1px 2px rgba(160,50,20,0.4)"
                    : "inset 1px 1px 3px rgba(100,100,100,0.2), inset -1px -1px 3px rgba(0,0,0,0.5)",
                  border: isOn
                    ? "1px solid rgba(255,120,70,0.3)"
                    : "1px solid rgba(0,0,0,0.5)",
                }}
              />

              {/* Power icon with enhanced depth */}
              <Power
                className={`absolute inset-0 m-auto transition-all duration-300 ${
                  isOn ? "text-white scale-110" : "text-gray-500"
                }`}
                style={{
                  filter: isOn
                    ? "drop-shadow(1px 1px 2px rgba(0,0,0,0.3))"
                    : "drop-shadow(1px 1px 1px rgba(0,0,0,0.5))",
                }}
                size={32}
              />
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className='grid grid-cols-2 gap-6 mb-6'>
          <OscillatorSection
            activeTab={activeOscTab}
            setActiveTab={setActiveOscTab}
            osc1={osc1}
            setOsc1={setOsc1}
            osc2={osc2}
            setOsc2={setOsc2}
            osc3={osc3}
            setOsc3={setOsc3}
            routing={routing}
            setRouting={setRouting}
          />

          <EnvelopeSection
            activeTab={activeEnvTab}
            setActiveTab={setActiveEnvTab}
            env1={env1}
            setEnv1={setEnv1}
            env2={env2}
            setEnv2={setEnv2}
            env3={env3}
            setEnv3={setEnv3}
          />

          <FilterSection
            activeTab={activeFilterTab}
            setActiveTab={setActiveFilterTab}
            filter1={filter1}
            setFilter1={setFilter1}
            filter2={filter2}
            setFilter2={setFilter2}
            filter3={filter3}
            setFilter3={setFilter3}
          />

          <LfoSection
            activeTab={activeLfoTab}
            setActiveTab={setActiveLfoTab}
            lfo1={lfo1}
            setLfo1={setLfo1}
            lfo2={lfo2}
            setLfo2={setLfo2}
            lfo3={lfo3}
            setLfo3={setLfo3}
          />
        </div>

        {/* Chord Section */}
        <ChordSection
          chordType={chordType}
          setChordType={setChordType}
          transpose={transpose}
          setTranspose={setTranspose}
        />

        {/* Keyboard */}
        <Keyboard
          playChord={playChord}
          stopChord={stopChord}
          pressedKeysRef={pressedKeysRef}
        />
      </div>
    </div>
  );
};

export default WebSynth;
