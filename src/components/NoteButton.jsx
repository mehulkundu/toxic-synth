const NoteButton = ({ note, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className='px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95'
      style={{
        background: selected
          ? "linear-gradient(145deg, #ff6b35, #d45525)"
          : "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
        boxShadow: selected
          ? "inset 0 2px 4px rgba(0,0,0,0.5), 0 0 10px rgba(255,107,53,0.3)"
          : "2px 2px 4px #0a0a0a",
        color: selected ? "#fff" : "#666",
      }}>
      {note}
    </button>
  );
};

export default NoteButton;
