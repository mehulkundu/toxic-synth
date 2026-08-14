import ModuleContainer from "./ModuleContainer";
import Knob from "./Knob";

const ModulationMatrix = ({ routing, setRouting }) => {
  const sources = ["lfo1", "lfo2", "lfo3", "env1", "env2", "env3"];
  const destinations = ["osc1_freq", "osc2_freq", "osc3_freq", "filter1_freq", "filter2_freq", "filter3_freq"];

  const handleSourceChange = (index, newSource) => {
    const newRouting = [...routing];
    newRouting[index].source = newSource;
    setRouting(newRouting);
  };

  const handleDestinationChange = (index, newDestination) => {
    const newRouting = [...routing];
    newRouting[index].destination = newDestination;
    setRouting(newRouting);
  };

  const handleAmountChange = (index, newAmount) => {
    const newRouting = [...routing];
    newRouting[index].amount = newAmount;
    setRouting(newRouting);
  };

  return (
    <ModuleContainer title="Modulation Matrix">
      <div className="flex flex-col gap-4">
        {routing.map((route, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 items-center">
            <select
              value={route.source}
              onChange={(e) => handleSourceChange(index, e.target.value)}
              className="bg-gray-700 text-white p-1 rounded text-xs">
              {sources.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
            </select>
            <select
              value={route.destination}
              onChange={(e) => handleDestinationChange(index, e.target.value)}
              className="bg-gray-700 text-white p-1 rounded text-xs">
              {destinations.map(d => <option key={d} value={d}>{d.replace("_", " ").toUpperCase()}</option>)}
            </select>
            <Knob
              label="AMOUNT"
              value={route.amount}
              onChange={(v) => handleAmountChange(index, v)}
              min={-1}
              max={1}
              step={0.01}
              size={40}
            />
          </div>
        ))}
      </div>
    </ModuleContainer>
  );
};

export default ModulationMatrix;
