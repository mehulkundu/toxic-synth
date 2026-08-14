
import NoteButton from "./NoteButton";

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
    <div className="transition-all duration-200">
      <div className="text-sm font-bold text-orange-400 mb-3 text-center tracking-widest">
        ROOT NOTE
      </div>
      <div className="flex justify-center flex-wrap gap-2">
        {notes.map((note) => (
          <NoteButton
            key={note.value}
            note={note.label}
            selected={rootNote === note.value}
            onClick={() => setRootNote(note.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default RootNoteSelector;
