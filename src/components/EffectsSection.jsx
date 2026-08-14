import ModuleContainer from "./ModuleContainer";
import Knob from "./Knob";

const EffectsSection = ({ delay, setDelay, reverb, setReverb }) => {
  return (
    <ModuleContainer title="Effects">
      <div className="flex flex-col gap-4">
        <div className="flex justify-around">
          <Knob
            label="DELAY TIME"
            value={delay.time}
            onChange={(v) => setDelay({ ...delay, time: v })}
            min={0}
            max={1}
            step={0.01}
            size={48}
          />
          <Knob
            label="DELAY FB"
            value={delay.feedback}
            onChange={(v) => setDelay({ ...delay, feedback: v })}
            min={0}
            max={0.95}
            step={0.01}
            size={48}
          />
        </div>
        <div className="flex justify-around">
          <Knob
            label="REVERB DECAY"
            value={reverb.decay}
            onChange={(v) => setReverb({ ...reverb, decay: v })}
            min={0.1}
            max={10}
            step={0.1}
            size={48}
          />
          <Knob
            label="REVERB MIX"
            value={reverb.mix}
            onChange={(v) => setReverb({ ...reverb, mix: v })}
            min={0}
            max={1}
            step={0.01}
            size={48}
          />
        </div>
      </div>
    </ModuleContainer>
  );
};

export default EffectsSection;
