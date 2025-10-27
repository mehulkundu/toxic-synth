import Knob from "./Knob";
import ChordButton from "./ChordButton";

const ChordSection = ({ chordType, setChordType, transpose, setTranspose }) => {
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

  return (
    <div
      className='p-4 rounded-xl mb-4 transition-all duration-200 hover:shadow-lg'
      style={{
        background: "linear-gradient(145deg, #252525, #1a1a1a)",
        boxShadow: "inset 2px 2px 4px #0a0a0a, inset -2px -2px 4px #2a2a2a",
      }}>
      <div className='text-sm font-bold text-orange-400 mb-3 text-center tracking-widest'>
        CHORD MODE
      </div>
      <div className='flex gap-2 mb-3 justify-center flex-wrap'>
        {Object.keys(chordIntervals).map((chord) => (
          <ChordButton
            key={chord}
            chord={chord}
            selected={chordType === chord}
            onClick={() => setChordType(chord)}
          />
        ))}
      </div>
      <div className='flex justify-center'>
        <Knob
          label='TRANSPOSE'
          value={transpose}
          onChange={setTranspose}
          min={-24}
          max={24}
          step={1}
        />
      </div>
    </div>
  );
};

export default ChordSection;
