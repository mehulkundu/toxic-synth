import { useRef, useEffect } from "react";
import ModuleContainer from "./ModuleContainer";
import ControlButton from "./ControlButton";
import WaveButton from "./WaveButton";
import Knob from "./Knob";

const Filter = ({ filter, setFilter, filterNum }) => {
  const filterCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = filterCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, w, h);

    if (!filter.on) {
      ctx.fillStyle = "#444";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText("OFF", w / 2, h / 2);
      return;
    }

    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    const minFreq = 20; // Hz
    const maxFreq = 20000; // Hz
    const minDb = -40;
    const maxDb = 0;

    for (let x = 0; x < w; x++) {
      const freq = minFreq * Math.pow(maxFreq / minFreq, x / w);
      const normalizedFreq = freq / filter.freq;
      let gain;

      switch (filter.type) {
        case "lowpass":
          gain = 1 / Math.sqrt(
            Math.pow(1 - normalizedFreq * normalizedFreq, 2) +
            Math.pow(normalizedFreq / filter.res, 2)
          );
          break;
        case "highpass":
          gain = normalizedFreq * normalizedFreq / Math.sqrt(
            Math.pow(1 - normalizedFreq * normalizedFreq, 2) +
            Math.pow(normalizedFreq / filter.res, 2)
          );
          break;
        case "bandpass":
          gain = (normalizedFreq / filter.res) / Math.sqrt(
            Math.pow(1 - normalizedFreq * normalizedFreq, 2) +
            Math.pow(normalizedFreq / filter.res, 2)
          );
          break;
        case "notch":
          gain = Math.sqrt(Math.pow(1 - normalizedFreq * normalizedFreq, 2)) / Math.sqrt(
            Math.pow(1 - normalizedFreq * normalizedFreq, 2) +
            Math.pow(normalizedFreq / filter.res, 2)
          );
          break;
        case "peaking":
          // Simplified peaking gain calculation for visualization
          gain = 1 + (filter.gain * (normalizedFreq / filter.res)) / (
            Math.pow(1 - normalizedFreq * normalizedFreq, 2) +
            Math.pow(normalizedFreq / filter.res, 2)
          );
          break;
        case "lowshelf": {
          // More representative lowshelf gain calculation for visualization
          const lsGain = Math.pow(10, filter.gain / 20);
          gain = 1 + (lsGain - 1) / (1 + Math.pow(normalizedFreq, 2));
          break;
        }
        case "highshelf": {
          // More representative highshelf gain calculation for visualization
          const hsGain = Math.pow(10, filter.gain / 20);
          gain = 1 + (hsGain - 1) * (Math.pow(normalizedFreq, 2) / (1 + Math.pow(normalizedFreq, 2)));
          break;
        }
        default:
          gain = 1;
      }

      const gainDb = 20 * Math.log10(Math.max(gain, 0.0001)); // Clamp to avoid log(0)
      let y = h - ((gainDb - minDb) / (maxDb - minDb)) * h;
      y = Math.max(0, Math.min(h, y)); // Clamp y to canvas height

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [filter]);

  return (
    <ModuleContainer title={`FILTER ${filterNum}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <WaveButton wave="lowpass" selected={filter.type === "lowpass"} onClick={() => setFilter({ ...filter, type: "lowpass" })} />
            <WaveButton wave="highpass" selected={filter.type === "highpass"} onClick={() => setFilter({ ...filter, type: "highpass" })} />
            <WaveButton wave="bandpass" selected={filter.type === "bandpass"} onClick={() => setFilter({ ...filter, type: "bandpass" })} />
            <WaveButton wave="notch" selected={filter.type === "notch"} onClick={() => setFilter({ ...filter, type: "notch" })} />
            <WaveButton wave="peaking" selected={filter.type === "peaking"} onClick={() => setFilter({ ...filter, type: "peaking" })} />
            <WaveButton wave="lowshelf" selected={filter.type === "lowshelf"} onClick={() => setFilter({ ...filter, type: "lowshelf" })} />
            <WaveButton wave="highshelf" selected={filter.type === "highshelf"} onClick={() => setFilter({ ...filter, type: "highshelf" })} />
          </div>
          <ControlButton active={filter.on} onClick={() => setFilter({ ...filter, on: !filter.on })} />
        </div>
        <canvas ref={filterCanvasRef} width={200} height={40} className="w-full h-10 rounded bg-black" />
        <div className="grid grid-cols-2 gap-4">
          <Knob label="FREQ" value={filter.freq} onChange={(v) => setFilter({ ...filter, freq: v })} min={100} max={10000} step={100} size={48} />
          <Knob label="RES" value={filter.res} onChange={(v) => setFilter({ ...filter, res: v })} min={0.1} max={20} step={0.1} size={48} />
          {(filter.type === "peaking" || filter.type === "lowshelf" || filter.type === "highshelf") && (
            <Knob label="GAIN" value={filter.gain} onChange={(v) => setFilter({ ...filter, gain: v })} min={-20} max={20} step={0.1} size={48} />
          )}
        </div>
      </div>
    </ModuleContainer>
  );
};

const FilterSection = ({ filter1, setFilter1, filter2, setFilter2, filter3, setFilter3 }) => {
  return (
    <div className="flex flex-col gap-4">
      <Filter filter={filter1} setFilter={setFilter1} filterNum={1} />
      <Filter filter={filter2} setFilter={setFilter2} filterNum={2} />
      <Filter filter={filter3} setFilter={setFilter3} filterNum={3} />
    </div>
  );
};

export default FilterSection;

