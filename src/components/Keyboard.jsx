const DiatonicKeyboard = ({ chords, playChord, stopChord, pressedKeysRef }) => {
  const handleMouseDown = (chord) => {
    playChord(chord.rootFreq, chord.name, chord.type);
  };

  const handleMouseUp = (chord) => {
    stopChord(chord.name, chord.type);
  };

  const handleMouseLeave = (chord) => {
    if (pressedKeysRef.current.has(chord.name)) {
      stopChord(chord.name, chord.type);
    }
  };

  const isPressed = (chord) => pressedKeysRef.current.has(chord.name);

  return (
    <div className='flex justify-center gap-2'>
      {chords.map((chord) => (
        <div
          key={chord.name}
          className={`relative w-16 h-32 cursor-pointer select-none transition-all duration-75 rounded-lg ${
            isPressed(chord) ? "scale-[0.98]" : "hover:scale-[1.02]"
          }`}
          style={{
            background: isPressed(chord)
              ? "linear-gradient(145deg, #ff6b35, #d45525)"
              : "linear-gradient(145deg, #f8f8f8, #e8e8e8)",
            boxShadow: isPressed(chord)
              ? "inset 3px 3px 6px rgba(0,0,0,0.3), 0 0 12px rgba(255,107,53,0.5)"
              : "4px 4px 8px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(0,0,0,0.1), inset 1px 1px 2px rgba(255,255,255,0.8)",
            transform: isPressed(chord) ? "translateY(2px)" : "none",
          }}
          onMouseDown={() => handleMouseDown(chord)}
          onMouseUp={() => handleMouseUp(chord)}
          onMouseLeave={() => handleMouseLeave(chord)}
          onTouchStart={() => handleMouseDown(chord)}
          onTouchEnd={() => handleMouseUp(chord)}>
          <div
            className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 text-lg font-bold transition-all duration-150 ${
              isPressed(chord) ? "text-white scale-110" : "text-gray-600"
            }`}>
            {chord.name}
          </div>
        </div>
      ))}
    </div>
  );
};

const ChromaticKeyboard = ({ playChord, stopChord, pressedKeysRef, chordType }) => {
  const keyToFreq = {
    a: 261.63, w: 277.18, s: 293.66, e: 311.13, d: 329.63, f: 349.23, t: 369.99,
    g: 392.0, y: 415.3, h: 440.0, u: 466.16, j: 493.88, k: 523.25, o: 554.37, l: 587.33,
  };

  const whiteKeys = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
  const blackKeys = [
    { key: "w", position: 0 }, { key: "e", position: 1 }, { key: "t", position: 3 },
    { key: "y", position: 4 }, { key: "u", position: 5 }, { key: "o", position: 7 },
  ];

  const handleMouseDown = (key) => {
    playChord(keyToFreq[key], key, chordType);
  };

  const handleMouseUp = (key) => {
    stopChord(key, chordType);
  };

  const handleMouseLeave = (key) => {
    if (pressedKeysRef.current.has(key)) {
      stopChord(key, chordType);
    }
  };

  const isPressed = (key) => pressedKeysRef.current.has(key);

  return (
    <div className='flex justify-center'>
      <div className='relative' style={{ width: `${whiteKeys.length * 3.5}rem` }}>
        <div className='flex relative z-0'>
          {whiteKeys.map((key, index) => (
            <div
              key={`white-${key}`}
              className={`relative w-14 h-32 cursor-pointer select-none transition-all duration-75 ${
                isPressed(key) ? "scale-[0.98]" : "hover:scale-[1.02]"
              }`}
              style={{
                background: isPressed(key)
                  ? "linear-gradient(145deg, #ff6b35, #d45525)"
                  : "linear-gradient(145deg, #f8f8f8, #e8e8e8)",
                boxShadow: isPressed(key)
                  ? "inset 3px 3px 6px rgba(0,0,0,0.3), 0 0 12px rgba(255,107,53,0.5)"
                  : "4px 4px 8px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(0,0,0,0.1), inset 1px 1px 2px rgba(255,255,255,0.8)",
                borderRadius: "0 0 8px 8px",
                marginRight: index === whiteKeys.length - 1 ? 0 : "1px",
                transform: isPressed(key) ? "translateY(2px)" : "none",
              }}
              onMouseDown={() => handleMouseDown(key)}
              onMouseUp={() => handleMouseUp(key)}
              onMouseLeave={() => handleMouseLeave(key)}
              onTouchStart={() => handleMouseDown(key)}
              onTouchEnd={() => handleMouseUp(key)}>
              <div
                className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 text-sm font-bold transition-all duration-150 ${
                  isPressed(key) ? "text-white scale-110" : "text-gray-600"
                }`}>
                {key.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
        <div className='absolute top-0 left-0 w-full h-32 pointer-events-none'>
          {blackKeys.map(({ key, position }) => (
            <div
              key={`black-${key}`}
              className={`absolute w-10 h-20 cursor-pointer select-none transition-all duration-75 ${
                isPressed(key) ? "scale-[0.95]" : "hover:scale-[1.05]"
              }`}
              style={{
                left: `calc(${position * 3.5}rem + 2.25rem)`,
                background: isPressed(key)
                  ? "linear-gradient(145deg, #ff6b35, #d45525)"
                  : "linear-gradient(145deg, #1a1a1a, #000000)",
                boxShadow: isPressed(key)
                  ? "inset 2px 2px 4px rgba(0,0,0,0.6), 0 0 15px rgba(255,107,53,0.7)"
                  : "3px 3px 8px rgba(0,0,0,0.8), inset 1px 1px 2px rgba(255,255,255,0.1), inset -1px -1px 2px rgba(0,0,0,0.5)",
                borderRadius: "0 0 6px 6px",
                transform: isPressed(key) ? "translateY(1px)" : "none",
                pointerEvents: "auto",
              }}
              onMouseDown={() => handleMouseDown(key)}
              onMouseUp={() => handleMouseUp(key)}
              onMouseLeave={() => handleMouseLeave(key)}
              onTouchStart={() => handleMouseDown(key)}
              onTouchEnd={() => handleMouseUp(key)}>
              <div
                className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-bold transition-all duration-150 ${
                  isPressed(key) ? "text-white scale-110" : "text-gray-500"
                }`}>
                {key.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Keyboard = (props) => {
  const { mode } = props;

  return (
    <div
      className='p-6 rounded-2xl transition-all duration-200 hover:shadow-2xl'
      style={{
        background: "linear-gradient(145deg, #252525, #1a1a1a)",
        boxShadow: "inset 3px 3px 6px #0a0a0a, inset -2px -2px 4px #2a2a2a",
      }}>
      <div className='text-center text-gray-400 text-sm mb-4 font-mono tracking-wide'>
        {mode === "diatonic" ? "DIATONIC CHORD KEYBOARD" : "PLAY CHORDS WITH A-L KEYS"}
      </div>
      {mode === "diatonic" ? <DiatonicKeyboard {...props} /> : <ChromaticKeyboard {...props} />}
    </div>
  );
};

export default Keyboard;
