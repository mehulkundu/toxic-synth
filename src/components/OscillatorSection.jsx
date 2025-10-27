import { useRef, useEffect } from "react";
import TabButton from "./TabButton";
import ControlButton from "./ControlButton";
import WaveButton from "./WaveButton";
import Knob from "./Knob";

const OscillatorSection = ({
  activeTab,
  setActiveTab,
  osc1,
  setOsc1,
  osc2,
  setOsc2,
  osc3,
  setOsc3,
  routing,
  setRouting,
}) => {
  const oscCanvasRef = useRef(null);

  const currentOsc = activeTab === 1 ? osc1 : activeTab === 2 ? osc2 : osc3;
  const setCurrentOsc =
    activeTab === 1 ? setOsc1 : activeTab === 2 ? setOsc2 : setOsc3;

  useEffect(() => {
    const canvas = oscCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width,
      h = canvas.height;
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, w, h);

    if (!currentOsc.on) {
      ctx.fillStyle = "#333";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("OFF", w / 2, h / 2);
      return;
    }

    for (let v = 0; v < currentOsc.voices; v++) {
      const detune =
        v === 0
          ? 0
          : (v % 2 === 0 ? 1 : -1) *
            Math.ceil(v / 2) *
            currentOsc.spread *
            0.001;
      ctx.strokeStyle = "#ff6b35";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#ff6b35";
      ctx.globalAlpha = 0.6 / currentOsc.voices;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const t = (x / w) * Math.PI * 4 * (1 + detune);
        let y;
        if (currentOsc.wave === "sine") y = Math.sin(t);
        else if (currentOsc.wave === "square") y = Math.sin(t) > 0 ? 1 : -1;
        else if (currentOsc.wave === "sawtooth")
          y = 2 * (t / (Math.PI * 2) - Math.floor(t / (Math.PI * 2) + 0.5));
        else if (currentOsc.wave === "triangle")
          y = Math.abs(((t / Math.PI) % 2) - 1) * 2 - 1;
        const yPos = h / 2 + y * h * 0.35;
        if (x === 0) ctx.moveTo(x, yPos);
        else ctx.lineTo(x, yPos);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, [currentOsc]);

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
          OSCILLATOR
        </div>
        <ControlButton
          active={currentOsc.on}
          onClick={() => setCurrentOsc({ ...currentOsc, on: !currentOsc.on })}
        />
      </div>

      <div
        className='mb-3 rounded-lg overflow-hidden transition-all duration-200'
        style={{
          background: "#0a0a0a",
          boxShadow: "inset 2px 2px 4px #000",
        }}>
        <canvas ref={oscCanvasRef} width={400} height={80} className='w-full' />
      </div>

      <div className='grid grid-cols-4 gap-2 mb-3'>
        {["sine", "square", "sawtooth", "triangle"].map((wave) => (
          <WaveButton
            key={wave}
            wave={wave}
            selected={currentOsc.wave === wave}
            onClick={() => setCurrentOsc({ ...currentOsc, wave })}
          />
        ))}
      </div>

      <div className='grid grid-cols-5 gap-3'>
        <Knob
          label='DET'
          value={currentOsc.detune}
          onChange={(v) => setCurrentOsc({ ...currentOsc, detune: v })}
          min={-24}
          max={24}
          step={1}
        />
        <Knob
          label='VOX'
          value={currentOsc.voices}
          onChange={(v) =>
            setCurrentOsc({ ...currentOsc, voices: Math.round(v) })
          }
          min={1}
          max={7}
          step={1}
        />
        <Knob
          label='SPR'
          value={currentOsc.spread}
          onChange={(v) => setCurrentOsc({ ...currentOsc, spread: v })}
          min={0}
          max={50}
          step={1}
        />
        <Knob
          label='LEV'
          value={currentOsc.level}
          onChange={(v) => setCurrentOsc({ ...currentOsc, level: v })}
          min={0}
          max={1}
          step={0.01}
        />

        <div className='flex flex-col gap-1 justify-center'>
          <select
            value={routing[`osc${activeTab}`].env}
            onChange={(e) =>
              setRouting({
                ...routing,
                [`osc${activeTab}`]: {
                  ...routing[`osc${activeTab}`],
                  env: e.target.value,
                },
              })
            }
            className='w-14 h-6 text-[9px] bg-gray-900 text-orange-400 rounded border border-gray-700 font-bold transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:outline-none'>
            <option value='env1'>E1</option>
            <option value='env2'>E2</option>
            <option value='env3'>E3</option>
          </select>
          <select
            value={routing[`osc${activeTab}`].filter}
            onChange={(e) =>
              setRouting({
                ...routing,
                [`osc${activeTab}`]: {
                  ...routing[`osc${activeTab}`],
                  filter: e.target.value,
                },
              })
            }
            className='w-14 h-6 text-[9px] bg-gray-900 text-orange-400 rounded border border-gray-700 font-bold transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:outline-none'>
            <option value='filter1'>F1</option>
            <option value='filter2'>F2</option>
            <option value='filter3'>F3</option>
          </select>
          <select
            value={routing[`osc${activeTab}`].lfo}
            onChange={(e) =>
              setRouting({
                ...routing,
                [`osc${activeTab}`]: {
                  ...routing[`osc${activeTab}`],
                  lfo: e.target.value,
                },
              })
            }
            className='w-14 h-6 text-[9px] bg-gray-900 text-orange-400 rounded border border-gray-700 font-bold transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:outline-none'>
            <option value='lfo1'>L1</option>
            <option value='lfo2'>L2</option>
            <option value='lfo3'>L3</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OscillatorSection;
