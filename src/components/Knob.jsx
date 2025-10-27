import { useState } from "react";

const Knob = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  detents = 8,
  size = 16,
  className = "",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());

  // Enhanced rotation calculation with better range
  const rotation = ((value - min) / (max - min)) * 330 - 165;

  // Snap to detents
  const snapToDetent = (rawValue) => {
    if (detents <= 1) return rawValue;
    const range = max - min;
    const detentSize = range / (detents - 1);
    const snappedValue =
      Math.round((rawValue - min) / detentSize) * detentSize + min;
    const snapThreshold = detentSize * 0.1;
    if (Math.abs(rawValue - snappedValue) < snapThreshold) {
      return snappedValue;
    }
    return rawValue;
  };

  const handleInputChange = (e) => {
    let newValue = parseFloat(e.target.value);

    // Apply snapping if detents are enabled
    if (detents > 1) {
      newValue = snapToDetent(newValue);
    }

    onChange(newValue);
  };

  const handleValueClick = () => {
    setIsEditing(true);
    setEditValue(value.toString());
  };

  const handleValueBlur = () => {
    setIsEditing(false);
    const numValue = parseFloat(editValue);
    if (!isNaN(numValue)) {
      let newValue = Math.max(min, Math.min(max, numValue));
      if (step) {
        newValue = Math.round(newValue / step) * step;
      }
      if (detents > 1) {
        newValue = snapToDetent(newValue);
      }
      onChange(newValue);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleValueBlur();
    }
  };

  const knobSize = `w-${size} h-${size}`;

  return (
    <div className={`flex flex-col items-center gap-3 group ${className}`}>
      <div className={`relative ${knobSize}`}>
        {/* Outer ring - clean without scale marks */}
        <div className='absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 to-black'>
          {/* Subtle glow effect only */}
          <div
            className='absolute inset-0 rounded-full opacity-20'
            style={{
              background:
                "conic-gradient(from 0deg, transparent, rgba(249,115,22,0.2) 10%, transparent 30%, transparent, rgba(249,115,22,0.1) 70%, transparent)",
            }}
          />
        </div>

        {/* Main premium knob */}
        <div className='absolute inset-1 rounded-full cursor-pointer transition-all duration-200 group-hover:scale-105 group-active:scale-95'>
          {/* Hidden range input */}
          <input
            type='range'
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleInputChange}
            className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20'
          />

          {/* Knob body with premium gradients */}
          <div
            className='absolute inset-0 rounded-full transition-all duration-200'
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

          {/* Rotating inner part */}
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
              transform: `rotate(${rotation}deg)`,
            }}>
            {/* Premium indicator with glow */}
            <div
              className='absolute w-1 h-4 left-1/2 transition-all duration-200'
              style={{
                background:
                  "linear-gradient(to bottom, #f97316, #dc2626, #991b1b)",
                transform: "translateX(-50%)",
                top: "2px",
                borderRadius: "1px",
                boxShadow: `
                  0 0 8px rgba(249, 115, 22, 0.6),
                  0 0 12px rgba(249, 115, 22, 0.3)
                `,
              }}
            />

            {/* Premium center dot */}
            <div
              className='absolute w-2 h-2 bg-gray-900 rounded-full left-1/2 top-1/2 transition-all duration-200 group-hover:scale-110'
              style={{
                transform: "translate(-50%, -50%)",
                boxShadow: `
                  inset 1px 1px 2px rgba(255,255,255,0.1),
                  inset -1px -1px 2px rgba(0,0,0,0.8),
                  0 0 4px rgba(0,0,0,0.5)
                `,
                border: "0.5px solid rgba(0,0,0,0.6)",
              }}
            />
          </div>

          {/* Premium shine overlay */}
          <div
            className='absolute inset-1 rounded-full pointer-events-none transition-opacity duration-200 group-hover:opacity-80'
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

          {/* Active state glow */}
          <div
            className='absolute inset-0 rounded-full pointer-events-none opacity-0 transition-all duration-300 group-hover:opacity-100'
            style={{
              boxShadow: "0 0 0 2px rgba(249, 115, 22, 0.2)",
              background: "transparent",
            }}
          />
        </div>

        {/* Drag indicator glow */}
        <div
          className={`absolute inset-0 rounded-full pointer-events-none transition-opacity duration-200 ${
            value !== min ? "opacity-100" : "opacity-0"
          }`}
          style={{
            boxShadow: "0 0 20px rgba(249, 115, 22, 0.15)",
          }}
        />
      </div>

      {/* Premium label */}
      <div className='text-xs font-bold text-gray-300 tracking-widest uppercase transition-all duration-200 group-hover:text-orange-300 group-hover:tracking-wide'>
        {label}
      </div>

      {/* Premium value display */}
      {isEditing ? (
        <input
          type='text'
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleValueBlur}
          onKeyPress={handleKeyPress}
          className='text-xs text-orange-400 font-mono font-bold px-3 py-1.5 rounded-lg bg-gray-900 min-w-[60px] text-center border-2 border-orange-500 outline-none transition-all duration-200 focus:bg-gray-800 focus:border-orange-400 focus:scale-105'
          autoFocus
        />
      ) : (
        <div
          className='text-xs text-orange-400 font-mono font-bold px-3 py-1.5 rounded-lg bg-gray-900 min-w-[60px] text-center cursor-text transition-all duration-200 hover:bg-gray-800 hover:text-orange-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/10'
          onClick={handleValueClick}>
          {value % 1 === 0 ? value : value.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default Knob;
