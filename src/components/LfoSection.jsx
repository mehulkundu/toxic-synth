import { useRef, useEffect } from "react";
import TabButton from "./TabButton";
import ControlButton from "./ControlButton";
import WaveButton from "./WaveButton";
import Knob from "./Knob";

const LfoSection = ({
  activeTab,
  setActiveTab,
  lfo1,
  setLfo1,
  lfo2,
  setLfo2,
  lfo3,
  setLfo3,
}) => {
  const lfoCanvasRef = useRef(null);

  const currentLfo = activeTab === 1 ? lfo1 : activeTab === 2 ? lfo2 : lfo3;
  const setCurrentLfo =
    activeTab === 1 ? setLfo1 : activeTab === 2 ? setLfo2 : setLfo3;

  useEffect(() => {
    const canvas = lfoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width,
      h = canvas.height;
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, w, h);

    if (!currentLfo.on) {
      ctx.fillStyle = "#333";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("OFF", w / 2, h / 2);
      return;
    }

    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#00ffff";
    ctx.beginPath();
    const cycles = Math.max(2, Math.min(8, currentLfo.rate));
    for (let x = 0; x < w; x++) {
      const t = (x / w) * Math.PI * 2 * cycles;
      let y;
      if (currentLfo.wave === "sine") y = Math.sin(t);
      else if (currentLfo.wave === "square") y = Math.sin(t) > 0 ? 1 : -1;
      else if (currentLfo.wave === "sawtooth")
        y = 2 * (t / (Math.PI * 2) - Math.floor(t / (Math.PI * 2) + 0.5));
      else if (currentLfo.wave === "triangle")
        y = Math.abs(((t / Math.PI) % 2) - 1) * 2 - 1;
      const yPos = h / 2 + y * h * 0.4 * currentLfo.depth;
      if (x === 0) ctx.moveTo(x, yPos);
      else ctx.lineTo(x, yPos);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [currentLfo]);

  return (
    <div
      className='p-5 rounded-xl transition-all duration-200 hover:shadow-lg'
      style={{
        background: "linear-gradient(145deg, #252525, #1a1a1a)",
        boxShadow: "inset 2px 2px 5px #0a0a0a, inset -2px -2px 5px #2a2a2a",
      }}>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex gap-1'>
          <TabButton
            num={1}
            active={activeTab}
            onClick={() => setActiveTab(1)}
          />
          <TabButton
            num={2}
            active={activeTab}
            onClick={() => setActiveTab(2)}
          />
          <TabButton
            num={3}
            active={activeTab}
            onClick={() => setActiveTab(3)}
          />
        </div>
        <div className='text-sm font-bold text-orange-400 tracking-widest'>
          LFO
        </div>
        <ControlButton
          active={currentLfo.on}
          onClick={() => setCurrentLfo({ ...currentLfo, on: !currentLfo.on })}
        />
      </div>

      <div
        className='mb-3 rounded-lg overflow-hidden transition-all duration-200'
        style={{
          background: "#0a0a0a",
          boxShadow: "inset 2px 2px 4px #000",
        }}>
        <canvas ref={lfoCanvasRef} width={400} height={80} className='w-full' />
      </div>

      <div className='grid grid-cols-4 gap-2 mb-3'>
        {["sine", "square", "sawtooth", "triangle"].map((wave) => (
          <WaveButton
            key={wave}
            wave={wave}
            selected={currentLfo.wave === wave}
            onClick={() => setCurrentLfo({ ...currentLfo, wave })}
          />
        ))}
      </div>

      <div className='grid grid-cols-2 gap-6'>
        <Knob
          label='RATE'
          value={currentLfo.rate}
          onChange={(v) => setCurrentLfo({ ...currentLfo, rate: v })}
          min={0.1}
          max={20}
          step={0.1}
        />
        <Knob
          label='DEPTH'
          value={currentLfo.depth}
          onChange={(v) => setCurrentLfo({ ...currentLfo, depth: v })}
          min={0}
          max={1}
          step={0.01}
        />
      </div>
    </div>
  );
};

export default LfoSection;
