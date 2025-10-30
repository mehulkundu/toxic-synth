
const RootNoteSelector = ({ rootNote, setRootNote }) => {
  const notes = [
    { value: 261.63, label: "C" },
    { value: 277.18, label: "C#" },
    { value: 293.66, label: "D" },
    { value: 311.13, label: "D#" },
    { value: 329.63, label: "E" },
    { value: 349.23, label: "F" },
    { value: 369.99, label: "F#" },
    { value: 392.0, label: "G" },
    { value: 415.3, label: "G#" },
    { value: 440.0, label: "A" },
    { value: 466.16, label: "A#" },
    { value: 493.88, label: "B" },
  ];

  return (
    <div className="p-4 rounded-xl mb-4 transition-all duration-200 hover:shadow-lg"
         style={{
           background: "linear-gradient(145deg, #252525, #1a1a1a)",
           boxShadow: "inset 2px 2px 4px #0a0a0a, inset -2px -2px 4px #2a2a2a",
         }}>
      <div className="text-sm font-bold text-orange-400 mb-3 text-center tracking-widest">
        ROOT NOTE
      </div>
      <div className="flex justify-center">
        <select
          value={rootNote}
          onChange={(e) => setRootNote(parseFloat(e.target.value))}
          className="bg-gray-700 text-white p-2 rounded"
        >
          {notes.map((note) => (
            <option key={note.value} value={note.value}>
              {note.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RootNoteSelector;
