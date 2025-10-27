const TabButton = ({ num, active, onClick }) => (
  <button
    onClick={onClick}
    className='w-10 h-8 rounded-t-lg text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95'
    style={{
      background:
        active === num
          ? "linear-gradient(145deg, #ff6b35, #d45525)"
          : "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
      boxShadow:
        active === num
          ? "inset 0 2px 4px rgba(0,0,0,0.5), 0 0 10px rgba(255,107,53,0.3)"
          : "2px 2px 4px #0a0a0a",
      color: active === num ? "#fff" : "#666",
      transform: active === num ? "translateY(1px)" : "none",
    }}>
    {num}
  </button>
);

export default TabButton;
