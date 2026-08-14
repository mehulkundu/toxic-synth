import { useRef, useEffect } from "react";
import ModuleContainer from "./ModuleContainer";
import ControlButton from "./ControlButton";
import WaveButton from "./WaveButton";
import Knob from "./Knob";

const Lfo = ({ lfo, setLfo, lfoNum }) => {
  const lfoCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = lfoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, w, h);

    if (!lfo.on) {
      ctx.fillStyle = "#444";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText("OFF", w / 2, h / 2);
      return;
    }

    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const cycles = Math.max(1, Math.min(8, lfo.rate / 2));
    for (let x = 0; x < w; x++) {
      const t = (x / w) * Math.PI * 2 * cycles;
      let y;
      if (lfo.wave === "sine") y = Math.sin(t);
      else if (lfo.wave === "square") y = Math.sin(t) > 0 ? 1 : -1;
      else if (lfo.wave === "sawtooth") y = 2 * (t / (Math.PI * 2) - Math.floor(t / (Math.PI * 2) + 0.5));
      else if (lfo.wave === "triangle") y = Math.abs(((t / Math.PI) % 2) - 1) * 2 - 1;
      const yPos = h / 2 + y * h * 0.4 * lfo.depth;
      if (x === 0) ctx.moveTo(x, yPos);
      else ctx.lineTo(x, yPos);
    }
    ctx.stroke();
  }, [lfo]);

  return (
    <ModuleContainer title={`LFO ${lfoNum}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {["sine", "square", "sawtooth", "triangle"].map((wave) => (
              <WaveButton key={wave} wave={wave} selected={lfo.wave === wave} onClick={() => setLfo({ ...lfo, wave })} />
            ))}
          </div>
          <ControlButton active={lfo.on} onClick={() => setLfo({ ...lfo, on: !lfo.on })} />
        </div>
        <canvas ref={lfoCanvasRef} width={200} height={40} className="w-full h-10 rounded bg-black" />
        <div className="grid grid-cols-2 gap-4">
          <Knob label="RATE" value={lfo.rate} onChange={(v) => setLfo({ ...lfo, rate: v })} min={0.1} max={20} step={0.1} size={48} />
          <Knob label="DEPTH" value={lfo.depth} onChange={(v) => setLfo({ ...lfo, depth: v })} min={0} max={1} step={0.01} size={48} />
        </div>
      </div>
    </ModuleContainer>
  );
};

const LfoSection = ({ lfo1, setLfo1, lfo2, setLfo2, lfo3, setLfo3 }) => {
  return (
    <div className="flex flex-col gap-4">
      <Lfo lfo={lfo1} setLfo={setLfo1} lfoNum={1} />
      <Lfo lfo={lfo2} setLfo={setLfo2} lfoNum={2} />
      <Lfo lfo={lfo3} setLfo={setLfo3} lfoNum={3} />
    </div>
  );
};

export default LfoSection;

