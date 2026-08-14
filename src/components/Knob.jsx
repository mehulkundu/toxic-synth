import { useState, useMemo } from "react";

const Knob = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  size = 64, // Adjusted for a more compact design
  className = "",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());

  // More realistic rotation range (e.g., -135 to 135 degrees)
  const rotation = ((value - min) / (max - min)) * 270 - 135;

  const handleInputChange = (e) => {
    let newValue = parseFloat(e.target.value);
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
      onChange(newValue);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleValueBlur();
    }
  };

  // Generate tick marks
  const ticks = useMemo(() => {
    const numTicks = 11; // e.g., 0% to 100% in 10% increments
    return Array.from({ length: numTicks }, (_, i) => {
      const angle = -135 + (i / (numTicks - 1)) * 270;
      return {
        angle,
        isMajor: i % 5 === 0, // Major ticks at start and end
      };
    });
  }, []);

  const knobStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  const innerKnobStyle = {
    transform: `rotate(${rotation}deg)`,
  };

  return (
    <div className={`flex flex-col items-center gap-2 group ${className}`}>
      <div className='relative' style={knobStyle}>
        {/* Tick Marks */}
        <div className='absolute inset-0'>
          {ticks.map((tick, i) => (
            <div
              key={i}
              className='absolute w-px h-full left-1/2 top-0'
              style={{ transform: `rotate(${tick.angle}deg)` }}>
              <div
                className={`mx-auto ${
                  tick.isMajor ? "h-2 bg-gray-400" : "h-1 bg-gray-600"
                }`}
                style={{ width: "1px" }}
              />
            </div>
          ))}
        </div>

        {/* Main Knob */}
        <div
          className='absolute rounded-full cursor-pointer transition-all duration-200 group-hover:scale-105 group-active:scale-95'
          style={{ inset: "8px" }} // Space for ticks
        >
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

          {/* Knob Body */}
          <div
            className='absolute inset-0 rounded-full transition-all duration-200'
            style={{
              background:
                "radial-gradient(circle at 50% 40%, #5a5a5a 0%, #2a2a2a 100%)",
              boxShadow:
                "inset 0 2px 3px rgba(0,0,0,0.5), inset 0 -1px 1px rgba(255,255,255,0.1), 0 5px 10px rgba(0,0,0,0.5)",
              border: "1px solid #111",
            }}
          />

          {/* Rotating Indicator */}
          <div
            className='absolute inset-0 rounded-full transition-transform duration-150'
            style={innerKnobStyle}>
            <div
              className='absolute w-1 h-3 bg-orange-500 rounded-full'
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                top: "4px",
                boxShadow: "0 0 5px rgba(249, 115, 22, 0.7)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Label */}
      <div className='text-xs font-medium text-gray-400 tracking-wider uppercase transition-colors duration-200 group-hover:text-orange-300'>
        {label}
      </div>

      {/* Value Display */}
      {isEditing ? (
        <input
          type='text'
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleValueBlur}
          onKeyPress={handleKeyPress}
          className='text-sm text-orange-400 font-mono bg-transparent w-16 text-center border-b-2 border-orange-500/50 outline-none transition-all duration-200 focus:border-orange-400'
          autoFocus
        />
      ) : (
        <div
          className='text-sm text-orange-400 font-mono w-16 text-center cursor-text transition-colors duration-200 hover:bg-gray-800/50 rounded'
          onClick={handleValueClick}>
          {value % 1 === 0 ? value : value.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default Knob;
