import { useRef, useEffect } from "react";
import TabButton from "./TabButton";
import ControlButton from "./ControlButton";
import Knob from "./Knob";

const EnvelopeSection = ({
  activeTab,
  setActiveTab,
  env1,
  setEnv1,
  env2,
  setEnv2,
  env3,
  setEnv3,
}) => {
  const envCanvasRef = useRef(null);

  const currentEnv = activeTab === 1 ? env1 : activeTab === 2 ? env2 : env3;
  const setCurrentEnv =
    activeTab === 1 ? setEnv1 : activeTab === 2 ? setEnv2 : setEnv3;

  useEffect(() => {
    const canvas = envCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width,
      h = canvas.height;
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, w, h);

    if (!currentEnv.on) {
      ctx.fillStyle = "#333";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("OFF", w / 2, h / 2);
      return;
    }

    const totalTime = currentEnv.a + currentEnv.d + 0.5 + currentEnv.r;
    const scale = w / totalTime;
    ctx.strokeStyle = "#f7931e";
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#f7931e";
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(currentEnv.a * scale, h * 0.1);
    ctx.lineTo((currentEnv.a + currentEnv.d) * scale, h * (1 - currentEnv.s));
    ctx.lineTo(
      (currentEnv.a + currentEnv.d + 0.5) * scale,
      h * (1 - currentEnv.s)
    );
    ctx.lineTo(w, h);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [currentEnv]);

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
          ENVELOPE
        </div>
        <ControlButton
          active={currentEnv.on}
          onClick={() => setCurrentEnv({ ...currentEnv, on: !currentEnv.on })}
        />
      </div>

      <div
        className='mb-3 rounded-lg overflow-hidden transition-all duration-200'
        style={{
          background: "#0a0a0a",
          boxShadow: "inset 2px 2px 4px #000",
        }}>
        <canvas ref={envCanvasRef} width={400} height={80} className='w-full' />
      </div>

      <div className='grid grid-cols-4 gap-3'>
        <Knob
          label='ATK'
          value={currentEnv.a}
          onChange={(v) => setCurrentEnv({ ...currentEnv, a: v })}
          min={0.01}
          max={2}
          step={0.01}
        />
        <Knob
          label='DEC'
          value={currentEnv.d}
          onChange={(v) => setCurrentEnv({ ...currentEnv, d: v })}
          min={0.01}
          max={2}
          step={0.01}
        />
        <Knob
          label='SUS'
          value={currentEnv.s}
          onChange={(v) => setCurrentEnv({ ...currentEnv, s: v })}
          min={0}
          max={1}
          step={0.01}
        />
        <Knob
          label='REL'
          value={currentEnv.r}
          onChange={(v) => setCurrentEnv({ ...currentEnv, r: v })}
          min={0.01}
          max={3}
          step={0.01}
        />
      </div>
    </div>
  );
};

export default EnvelopeSection;
