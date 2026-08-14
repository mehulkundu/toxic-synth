import { useRef, useEffect } from "react";
import ModuleContainer from "./ModuleContainer";
import ControlButton from "./ControlButton";
import Knob from "./Knob";

const Envelope = ({ env, setEnv, envNum }) => {
  const envCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = envCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, w, h);

    if (!env.on) {
      ctx.fillStyle = "#444";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText("OFF", w / 2, h / 2);
      return;
    }

    const attackTime = env.a;
    const decayTime = env.d;
    const sustainLevel = env.s;
    const releaseTime = env.r;

    // Calculate total duration for scaling, ensuring sustain has some visual presence
    const minSustainDisplayTime = 0.2; // Minimum time to display sustain level
    const totalDuration = attackTime + decayTime + releaseTime + minSustainDisplayTime;
    const scaleX = w / totalDuration;

    ctx.strokeStyle = "#f7931e";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, h); // Start at (0, 0) in canvas coordinates (bottom-left)

    // Attack
    const attackX = attackTime * scaleX;
    ctx.lineTo(attackX, 0); // Peak at (attackTime, 1)

    // Decay
    const decayX = (attackTime + decayTime) * scaleX;
    ctx.lineTo(decayX, h * (1 - sustainLevel)); // Decay to sustain level

    // Sustain - extend to allow for release
    const sustainX = w - (releaseTime * scaleX);
    ctx.lineTo(sustainX, h * (1 - sustainLevel));

    // Release
    ctx.lineTo(w, h); // Release to (totalDuration, 0)

    ctx.stroke();
  }, [env]);

  return (
    <ModuleContainer title={`ENV ${envNum}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-end">
          <ControlButton active={env.on} onClick={() => setEnv({ ...env, on: !env.on })} />
        </div>
        <canvas ref={envCanvasRef} width={200} height={40} className="w-full h-10 rounded bg-black" />
        <div className="grid grid-cols-4 gap-2">
          <Knob label="A" value={env.a} onChange={(v) => setEnv({ ...env, a: v })} min={0.01} max={2} step={0.01} size={48} />
          <Knob label="D" value={env.d} onChange={(v) => setEnv({ ...env, d: v })} min={0.01} max={2} step={0.01} size={48} />
          <Knob label="S" value={env.s} onChange={(v) => setEnv({ ...env, s: v })} min={0} max={1} step={0.01} size={48} />
          <Knob label="R" value={env.r} onChange={(v) => setEnv({ ...env, r: v })} min={0.01} max={3} step={0.01} size={48} />
        </div>
      </div>
    </ModuleContainer>
  );
};

const EnvelopeSection = ({ env1, setEnv1, env2, setEnv2, env3, setEnv3 }) => {
  return (
    <div className="flex flex-col gap-4">
      <Envelope env={env1} setEnv={setEnv1} envNum={1} />
      <Envelope env={env2} setEnv={setEnv2} envNum={2} />
      <Envelope env={env3} setEnv={setEnv3} envNum={3} />
    </div>
  );
};

export default EnvelopeSection;

