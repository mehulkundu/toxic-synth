import { useRef, useEffect } from "react";
import TabButton from "./TabButton";
import ControlButton from "./ControlButton";
import WaveButton from "./WaveButton";
import Knob from "./Knob";

const FilterSection = ({
  activeTab,
  setActiveTab,
  filter1,
  setFilter1,
  filter2,
  setFilter2,
  filter3,
  setFilter3,
}) => {
  const filterCanvasRef = useRef(null);

  const currentFilter =
    activeTab === 1 ? filter1 : activeTab === 2 ? filter2 : filter3;
  const setCurrentFilter =
    activeTab === 1 ? setFilter1 : activeTab === 2 ? setFilter2 : setFilter3;

  useEffect(() => {
    const canvas = filterCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width,
      h = canvas.height;
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, w, h);

    if (!currentFilter.on) {
      ctx.fillStyle = "#333";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("OFF", w / 2, h / 2);
      return;
    }

    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#ffd700";
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const freq = 20 * Math.pow(1000, x / w);
      const normalized = freq / currentFilter.freq;
      let response;
      if (currentFilter.type === "lowpass") {
        response =
          1 / Math.sqrt(1 + Math.pow(normalized * currentFilter.res, 2));
      } else {
        response =
          normalized /
          Math.sqrt(1 + Math.pow(normalized / currentFilter.res, 2));
      }
      const y = h - response * h * 0.8;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [currentFilter]);

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
          FILTER
        </div>
        <ControlButton
          active={currentFilter.on}
          onClick={() =>
            setCurrentFilter({ ...currentFilter, on: !currentFilter.on })
          }
        />
      </div>

      <div
        className='mb-3 rounded-lg overflow-hidden transition-all duration-200'
        style={{
          background: "#0a0a0a",
          boxShadow: "inset 2px 2px 4px #000",
        }}>
        <canvas
          ref={filterCanvasRef}
          width={400}
          height={80}
          className='w-full'
        />
      </div>

      <div className='grid grid-cols-2 gap-2 mb-3'>
        <WaveButton
          wave='lowpass'
          selected={currentFilter.type === "lowpass"}
          onClick={() =>
            setCurrentFilter({ ...currentFilter, type: "lowpass" })
          }
        />
        <WaveButton
          wave='highpass'
          selected={currentFilter.type === "highpass"}
          onClick={() =>
            setCurrentFilter({ ...currentFilter, type: "highpass" })
          }
        />
      </div>

      <div className='grid grid-cols-2 gap-6'>
        <Knob
          label='FREQ'
          value={currentFilter.freq}
          onChange={(v) => setCurrentFilter({ ...currentFilter, freq: v })}
          min={100}
          max={8000}
          step={50}
        />
        <Knob
          label='RES'
          value={currentFilter.res}
          onChange={(v) => setCurrentFilter({ ...currentFilter, res: v })}
          min={0.1}
          max={20}
          step={0.1}
        />
      </div>
    </div>
  );
};

export default FilterSection;
