import { Power } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import OscillatorSection from "./OscillatorSection";
import EnvelopeSection from "./EnvelopeSection";
import FilterSection from "./FilterSection";
import LfoSection from "./LfoSection";
import MixerSection from "./MixerSection";
import ModulationMatrix from "./ModulationMatrix";
import EffectsSection from "./EffectsSection";
import RootNoteSelector from "./RootNoteSelector";
import ChordSection from "./ChordSection";
import Keyboard from "./Keyboard";
import Knob from "./Knob";
import { useSynthEngine } from "../hooks/useSynthEngine";
import ModeToggleButton from "./ModeToggleButton";
import OctaveControl from "./OctaveControl";
import ModuleContainer from "./ModuleContainer";

const WebSynth = () => {
  const {
    isOn,
    setIsOn,
    volume,
    setVolume,
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
    delay,
    setDelay,
    reverb,
    setReverb,
    chordType,
    setChordType,
    transpose,
    octaveUp,
    octaveDown,
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

  const keyToFreq = useMemo(
    () => ({
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
    }),
    []
  );

  const diatonicKeyMap = useMemo(
    () => ({ a: 0, s: 1, d: 2, f: 3, g: 4, h: 5, j: 6 }),
    []
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (pressedKeysRef.current.has(key)) return;

      if (mode === "diatonic") {
        const chordIndex = diatonicKeyMap[key];
        if (chordIndex !== undefined) {
          const chord = chords[chordIndex];
          playChord(chord.rootFreq, chord.name, chord.type);
        }
      } else {
        // chromatic mode
        if (keyToFreq[key]) {
          playChord(keyToFreq[key], key, chordType);
        }
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (mode === "diatonic") {
        const chordIndex = diatonicKeyMap[key];
        if (chordIndex !== undefined) {
          const chord = chords[chordIndex];
          stopChord(chord.name, chord.type);
        }
      } else {
        // chromatic mode
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
  }, [
    mode,
    chords,
    playChord,
    stopChord,
    chordType,
    pressedKeysRef,
    diatonicKeyMap,
    keyToFreq,
  ]);

  return (
    <div className='w-full min-h-screen p-4 flex flex-col items-center gap-4'>
      <div className='w-full flex items-center justify-between mb-8'>
        <h1
          className='text-6xl font-extrabold text-yellow-400 tracking-widest'
          style={{ fontFamily: "var(--font-display)" }}>
          Toxic Synth
        </h1>
        <p className='text-gray-300 text-lg font-mono flex gap-4'>
          <a
            href='https://github.com/mehulkundu/toxic-synth'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-300 hover:text-blue-100 transition-colors duration-200'>
            Open Source on GitHub
          </a>{" "}
          |
          <a
            href='https://x.com/KunduMehul'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-300 hover:text-blue-100 transition-colors duration-200'>
            Follow me on X - @KunduMehul
          </a>
        </p>
      </div>
      <div className='synth-rack grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
        {/* Column 1: Oscillators */}
        <div className='flex flex-col gap-4'>
          <OscillatorSection
            osc1={osc1}
            setOsc1={setOsc1}
            osc2={osc2}
            setOsc2={setOsc2}
            osc3={osc3}
            setOsc3={setOsc3}
            routing={routing}
            setRouting={setRouting}
          />
        </div>

        {/* Column 2: Filters */}
        <div className='flex flex-col gap-4'>
          <FilterSection
            filter1={filter1}
            setFilter1={setFilter1}
            filter2={filter2}
            setFilter2={setFilter2}
            filter3={filter3}
            setFilter3={setFilter3}
          />
        </div>

        {/* Column 3: Envelopes */}
        <div className='flex flex-col gap-4'>
          <EnvelopeSection
            env1={env1}
            setEnv1={setEnv1}
            env2={env2}
            setEnv2={setEnv2}
            env3={env3}
            setEnv3={setEnv3}
          />
        </div>

        {/* Column 4: LFOs */}
        <div className='flex flex-col gap-4'>
          <LfoSection
            lfo1={lfo1}
            setLfo1={setLfo1}
            lfo2={lfo2}
            setLfo2={setLfo2}
            lfo3={lfo3}
            setLfo3={setLfo3}
          />
        </div>

        {/* Row 2: Mixer, Modulation, Effects */}
        <div className='lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
          <MixerSection
            osc1={osc1}
            setOsc1={setOsc1}
            osc2={osc2}
            setOsc2={setOsc2}
            osc3={osc3}
            setOsc3={setOsc3}
            volume={volume}
            setVolume={setVolume}
            isOn={isOn}
            setIsOn={setIsOn}
          />

          <EffectsSection
            delay={delay}
            setDelay={setDelay}
            reverb={reverb}
            setReverb={setReverb}
          />
        </div>

        {/* Spanning across all columns at the bottom */}
        <div className='col-span-1 md:col-span-2 lg:col-span-4 flex flex-col gap-4'>
          <ModuleContainer title='Controls'>
            <div className='flex items-center justify-center gap-4'>
              <ModeToggleButton mode={mode} setMode={setMode} />
              {mode === "diatonic" ? (
                <RootNoteSelector
                  rootNote={rootNote}
                  setRootNote={setRootNote}
                />
              ) : (
                <ChordSection
                  chordType={chordType}
                  setChordType={setChordType}
                />
              )}
              <OctaveControl
                transpose={transpose}
                octaveUp={octaveUp}
                octaveDown={octaveDown}
              />
            </div>
          </ModuleContainer>
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
    </div>
  );
};

export default WebSynth;
