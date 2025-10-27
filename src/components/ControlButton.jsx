const ControlButton = ({ children, active, onClick }) => (
  <div
    className='relative inline-flex items-center cursor-pointer'
    onClick={onClick}>
    {/* Modern slide switch with enhanced skeuomorphism */}
    <div
      className='relative w-16 h-8 rounded-full transition-all duration-300'
      style={{
        background: active
          ? "linear-gradient(145deg, #1a4f1a, #2E7D32, #3d8b40, #4CAF50)"
          : "linear-gradient(145deg, #2a2a2a, #212121, #1a1a1a, #000)",
        boxShadow: active
          ? `
              inset 3px 3px 6px rgba(0, 0, 0, 0.4),
              inset -3px -3px 6px rgba(255, 255, 255, 0.1),
              0 6px 12px rgba(0, 0, 0, 0.4),
              0 0 15px rgba(76, 175, 80, 0.3)
            `
          : `
              inset 3px 3px 6px rgba(0, 0, 0, 0.6),
              inset -3px -3px 6px rgba(255, 255, 255, 0.05),
              0 6px 12px rgba(0, 0, 0, 0.5)
            `,
        border: "1px solid #000",
      }}>
      {/* Metallic rim effect */}
      <div
        className='absolute inset-0 rounded-full pointer-events-none'
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.1), rgba(0,0,0,0.3))",
          border: "1px solid transparent",
          backgroundImage: `
              linear-gradient(145deg, 
                rgba(255,255,255,0.2) 0%, 
                rgba(255,255,255,0.05) 20%,
                rgba(0,0,0,0.1) 50%,
                rgba(0,0,0,0.3) 100%
              )
            `,
          mixBlendMode: "overlay",
        }}
      />

      {/* Color glow effect */}
      <div
        className='absolute inset-0 rounded-full transition-all duration-300'
        style={{
          background: active
            ? "radial-gradient(circle at 70% 50%, rgba(76, 175, 80, 0.4), transparent 70%)"
            : "radial-gradient(circle at 30% 50%, rgba(244, 67, 54, 0.3), transparent 70%)",
          opacity: active ? 0.9 : 0.5,
        }}
      />

      {/* Slider knob with enhanced 3D effect */}
      <div
        className='absolute top-1/2 w-7 h-7 rounded-full transform -translate-y-1/2 transition-all duration-300 ease-out z-10'
        style={{
          left: active ? "calc(100% - 24px)" : "2px",
          background: active
            ? "linear-gradient(145deg, #f5f5f5, #e0e0e0, #c8c8c8, #bdbdbd)"
            : "linear-gradient(145deg, #f0f0f0, #d5d5d5, #bdbdbd, #a8a8a8)",
          boxShadow: active
            ? `
                  0 4px 8px rgba(0, 0, 0, 0.5),
                  inset 2px 2px 4px rgba(255, 255, 255, 0.9),
                  inset -2px -2px 4px rgba(0, 0, 0, 0.1),
                  0 0 10px rgba(76, 175, 80, 0.4)
                `
            : `
                  0 4px 8px rgba(0, 0, 0, 0.6),
                  inset 2px 2px 4px rgba(255, 255, 255, 0.8),
                  inset -2px -2px 4px rgba(0, 0, 0, 0.3)
                `,
          border: "1px solid #8d8d8d",
        }}>
        {/* Knob highlight for 3D effect */}
        <div
          className='absolute top-1 left-2 w-3 h-2 rounded-full opacity-80'
          style={{
            background:
              "radial-gradient(ellipse at top left, rgba(255,255,255,0.8), transparent)",
          }}
        />

        {/* Status indicator with depth */}
        <div
          className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300'
          style={{
            backgroundColor: active ? "#4CAF50" : "#F44336",
            boxShadow: active
              ? `
                    inset 1px 1px 2px rgba(255,255,255,0.3),
                    0 0 6px rgba(76, 175, 80, 0.8),
                    0 1px 2px rgba(0,0,0,0.4)
                  `
              : `
                    inset 1px 1px 2px rgba(255,255,255,0.3),
                    0 0 6px rgba(244, 67, 54, 0.6),
                    0 1px 2px rgba(0,0,0,0.4)
                  `,
          }}
        />
      </div>

      {/* Track groove for extra realism */}
      <div
        className='absolute top-1/2 left-2 right-2 h-1 transform -translate-y-1/2 rounded-full opacity-40'
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,0,0,0.5), transparent)",
          boxShadow: "inset 0 1px 1px rgba(0,0,0,0.8)",
        }}
      />
    </div>

    {/* Label with subtle glow */}
    <span
      className='ml-3 text-sm font-medium transition-all duration-300'
      style={{
        color: "#fff",
        textShadow: active
          ? "0 0 8px rgba(76, 175, 80, 0.5)"
          : "0 0 8px rgba(244, 67, 54, 0.3)",
      }}>
      {children}
    </span>
  </div>
);

export default ControlButton;
