import { Power } from "lucide-react";
import { useState, useEffect } from "react";
import OscillatorSection from "./OscillatorSection";
import EnvelopeSection from "./EnvelopeSection";
import FilterSection from "./FilterSection";
import LfoSection from "./LfoSection";
import RootNoteSelector from "./RootNoteSelector";
import ChordSection from "./ChordSection";
import Keyboard from "./Keyboard";
import Knob from "./Knob";
import { useSynthEngine } from "../hooks/useSynthEngine";

const WebSynth = () => {
  const {
    isOn,
    setIsOn,
    volume,
    setVolume,
    activeOscTab,
    setActiveOscTab,
    activeEnvTab,
    setActiveEnvTab,
    activeFilterTab,
    setActiveFilterTab,
    activeLfoTab,
    setActiveLfoTab,
    osc1,
    setOsc1,
    osc2,
    setOsc2,
    osc3,
    setOsc3,
    env1,
    setEnv1,
    env2,
    setEnv2,
    env3,
    setEnv3,
    filter1,
    setFilter1,
    filter2,
    setFilter2,
    filter3,
    setFilter3,
    lfo1,
    setLfo1,
    lfo2,
    setLfo2,
    lfo3,
    setLfo3,
    routing,
    setRouting,
    chordType,
    setChordType,
    transpose,
    setTranspose,
    playChord,
    stopChord,
    pressedKeysRef,
  } = useSynthEngine();

  const [mode, setMode] = useState("diatonic"); // diatonic or chromatic
  const [rootNote, setRootNote] = useState(261.63); // Default to C4

  const diatonicChords = [
    { name: "I", type: "major", root_offset: 0 },
    { name: "ii", type: "minor", root_offset: 2 },
    { name: "iii", type: "minor", root_offset: 4 },
    { name: "IV", type: "major", root_offset: 5 },
    { name: "V", type: "major", root_offset: 7 },
    { name: "vi", type: "minor", root_offset: 9 },
    { name: "vii°", type: "dim", root_offset: 11 },
  ];

  const chords = diatonicChords.map((chord) => {
    const rootFreq = rootNote * Math.pow(2, chord.root_offset / 12);
    return { ...chord, rootFreq };
  });

  const keyToFreq = {
    a: 261.63, w: 277.18, s: 293.66, e: 311.13, d: 329.63, f: 349.23, t: 369.99,
    g: 392.0, y: 415.3, h: 440.0, u: 466.16, j: 493.88, k: 523.25, o: 554.37, l: 587.33,
  };

  const diatonicKeyMap = { a: 0, s: 1, d: 2, f: 3, g: 4, h: 5, j: 6 };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (pressedKeysRef.current.has(key)) return;

      if (mode === 'diatonic') {
        const chordIndex = diatonicKeyMap[key];
        if (chordIndex !== undefined) {
          const chord = chords[chordIndex];
          playChord(chord.rootFreq, chord.name, chord.type);
        }
      } else { // chromatic mode
        if (keyToFreq[key]) {
          playChord(keyToFreq[key], key, chordType);
        }
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (mode === 'diatonic') {
        const chordIndex = diatonicKeyMap[key];
        if (chordIndex !== undefined) {
          const chord = chords[chordIndex];
          stopChord(chord.name, chord.type);
        }
      } else { // chromatic mode
        if (keyToFreq[key]) {
          stopChord(key, chordType);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [mode, chords, playChord, stopChord, chordType, pressedKeysRef]);


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

        {/* Master Control Section */}
        <div className='p-4 rounded-xl mb-4 flex items-center justify-center gap-8'
             style={{
               background: "linear-gradient(145deg, #252525, #1a1a1a)",
               boxShadow: "inset 2px 2px 4px #0a0a0a, inset -2px -2px 4px #2a2a2a",
             }}>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setMode('diatonic')}
              className='px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95'
              style={{
                background: mode === 'diatonic' ? "linear-gradient(145deg, #ff6b35, #d45525)" : "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
                boxShadow: mode === 'diatonic' ? "inset 0 2px 4px rgba(0,0,0,0.5), 0 0 10px rgba(255,107,53,0.3)" : "2px 2px 4px #0a0a0a",
                color: mode === 'diatonic' ? "#fff" : "#666",
              }}>
              Diatonic
            </button>
            <button
              onClick={() => setMode('chromatic')}
              className='px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95'
              style={{
                background: mode === 'chromatic' ? "linear-gradient(145deg, #ff6b35, #d45525)" : "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
                boxShadow: mode === 'chromatic' ? "inset 0 2px 4px rgba(0,0,0,0.5), 0 0 10px rgba(255,107,53,0.3)" : "2px 2px 4px #0a0a0a",
                color: mode === 'chromatic' ? "#fff" : "#666",
              }}>
              Chromatic
            </button>
          </div>
          <Knob
            label='TRANSPOSE'
            value={transpose}
            onChange={setTranspose}
            min={-24}
            max={24}
            step={1}
          />
        </div>

        {mode === "diatonic" ? (
          <RootNoteSelector rootNote={rootNote} setRootNote={setRootNote} />
        ) : (
          <ChordSection
            chordType={chordType}
            setChordType={setChordType}
          />
        )}

        {/* Keyboard */}
        <Keyboard
          mode={mode}
          chords={chords}
          playChord={playChord}
          stopChord={stopChord}
          pressedKeysRef={pressedKeysRef}
          chordType={chordType}
        />
      </div>
    </div>
  );
};

export default WebSynth;
