import { useRef, useEffect } from "react";
import ModuleContainer from "./ModuleContainer";
import ControlButton from "./ControlButton";
import WaveButton from "./WaveButton";
import Knob from "./Knob";

const Oscillator = ({ osc, setOsc, routing, setRouting, oscNum }) => {
  const oscCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = oscCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, w, h);

    if (!osc.on) {
      ctx.fillStyle = "#444";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText("OFF", w / 2, h / 2);
      return;
    }

    ctx.strokeStyle = "#ff6b35";
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const t = (x / w) * Math.PI * 4;
      let y;
      if (osc.wave === "sine") y = Math.sin(t);
      else if (osc.wave === "square") y = Math.sin(t) > 0 ? 1 : -1;
      else if (osc.wave === "sawtooth") y = 2 * (t / (Math.PI * 2) - Math.floor(t / (Math.PI * 2) + 0.5));
      else if (osc.wave === "triangle") y = Math.abs(((t / Math.PI) % 2) - 1) * 2 - 1;
      const yPos = h / 2 + y * h * 0.4;
      if (x === 0) ctx.moveTo(x, yPos);
      else ctx.lineTo(x, yPos);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, [osc]);

  return (
    <ModuleContainer title={`OSC ${oscNum}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {["sine", "square", "sawtooth", "triangle"].map((wave) => (
              <WaveButton key={wave} wave={wave} selected={osc.wave === wave} onClick={() => setOsc({ ...osc, wave })} />
            ))}
          </div>
          <ControlButton active={osc.on} onClick={() => setOsc({ ...osc, on: !osc.on })} />
        </div>
        <canvas ref={oscCanvasRef} width={200} height={40} className="w-full h-10 rounded bg-black" />
        <div className="grid grid-cols-3 gap-4">
          <Knob label="DETUNE" value={osc.detune} onChange={(v) => setOsc({ ...osc, detune: v })} min={-24} max={24} step={1} size={48} />
          <Knob label="VOICES" value={osc.voices} onChange={(v) => setOsc({ ...osc, voices: Math.round(v) })} min={1} max={8} step={1} size={48} />
          <Knob label="SPREAD" value={osc.spread} onChange={(v) => setOsc({ ...osc, spread: v })} min={0} max={50} step={1} size={48} />
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex flex-col items-center">
            <label htmlFor={`env-route-${oscNum}`}>ENV</label>
            <select id={`env-route-${oscNum}`} value={routing.env} onChange={(e) => setRouting({ ...routing, env: e.target.value })} className="bg-gray-700 text-white rounded px-1 py-0.5 w-full">
              <option value="env1">1</option>
              <option value="env2">2</option>
              <option value="env3">3</option>
            </select>
          </div>
          <div className="flex flex-col items-center">
            <label htmlFor={`filter-route-${oscNum}`}>FILTER</label>
            <select id={`filter-route-${oscNum}`} value={routing.filter} onChange={(e) => setRouting({ ...routing, filter: e.target.value })} className="bg-gray-700 text-white rounded px-1 py-0.5 w-full">
              <option value="filter1">1</option>
              <option value="filter2">2</option>
              <option value="filter3">3</option>
            </select>
          </div>
          <div className="flex flex-col items-center">
            <label htmlFor={`lfo-route-${oscNum}`}>LFO</label>
            <select id={`lfo-route-${oscNum}`} value={routing.lfo} onChange={(e) => setRouting({ ...routing, lfo: e.target.value })} className="bg-gray-700 text-white rounded px-1 py-0.5 w-full">
              <option value="lfo1">1</option>
              <option value="lfo2">2</option>
              <option value="lfo3">3</option>
            </select>
          </div>
        </div>
      </div>
    </ModuleContainer>
  );
};

const OscillatorSection = ({ osc1, setOsc1, osc2, setOsc2, osc3, setOsc3, routing, setRouting }) => {
  return (
    <div className="flex flex-col gap-4">
      <Oscillator osc={osc1} setOsc={setOsc1} routing={routing.osc1} setRouting={(r) => setRouting({ ...routing, osc1: r })} oscNum={1} />
      <Oscillator osc={osc2} setOsc={setOsc2} routing={routing.osc2} setRouting={(r) => setRouting({ ...routing, osc2: r })} oscNum={2} />
      <Oscillator osc={osc3} setOsc={setOsc3} routing={routing.osc3} setRouting={(r) => setRouting({ ...routing, osc3: r })} oscNum={3} />
    </div>
  );
};

export default OscillatorSection;

