const WaveButton = ({ wave, selected, onClick }) => (
  <button
    onClick={onClick}
    className='py-2 rounded text-[9px] font-bold transition-all duration-200 hover:scale-105 active:scale-95'
    style={{
      background: selected
        ? "linear-gradient(145deg, #ff6b35, #d45525)"
        : "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
      boxShadow: selected
        ? "inset 2px 2px 4px rgba(0,0,0,0.5), 0 0 8px rgba(255,107,53,0.4)"
        : "2px 2px 4px #0a0a0a",
      color: selected ? "#fff" : "#666",
      transform: selected ? "scale(1.05)" : "none",
    }}>
    {wave.slice(0, 3).toUpperCase()}
  </button>
);

export default WaveButton;
