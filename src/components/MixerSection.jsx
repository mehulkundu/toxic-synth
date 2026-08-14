import { Power } from "lucide-react";
import ModuleContainer from "./ModuleContainer";
import Knob from "./Knob";

const MixerSection = ({
  osc1, setOsc1,
  osc2, setOsc2,
  osc3, setOsc3,
  volume, setVolume,
  isOn, setIsOn,
}) => {
  return (
    <ModuleContainer title="Mixer">
      <div className="flex flex-col justify-around h-full">
        <div className="flex justify-around items-center">
          <Knob
            label="VOLUME"
            value={volume}
            onChange={setVolume}
            min={0}
            max={1}
            step={0.01}
          />
          <button
            onClick={() => setIsOn(!isOn)}
            className={`w-16 h-16 rounded-full transition-all duration-300 ${isOn ? 'bg-orange-500 shadow-lg' : 'bg-gray-700'}`}>
            <Power className='w-8 h-8 mx-auto text-white' />
          </button>
        </div>
        <div className="flex justify-around items-end">
          <Knob
            label="OSC 1"
            value={osc1.level}
            onChange={(value) => setOsc1({ ...osc1, level: value })}
            min={0} max={1} step={0.01}
            size={50}
          />
          <Knob
            label="OSC 2"
            value={osc2.level}
            onChange={(value) => setOsc2({ ...osc2, level: value })}
            min={0} max={1} step={0.01}
            size={50}
          />
          <Knob
            label="OSC 3"
            value={osc3.level}
            onChange={(value) => setOsc3({ ...osc3, level: value })}
            min={0} max={1} step={0.01}
            size={50}
          />
        </div>
      </div>
    </ModuleContainer>
  );
};

export default MixerSection;
