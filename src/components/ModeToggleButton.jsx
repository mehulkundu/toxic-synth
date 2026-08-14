import ToggleButton from "./ToggleButton";

const ModeToggleButton = ({ mode, setMode }) => {
  const options = [
    { label: "Diatonic", value: "diatonic" },
    { label: "Chromatic", value: "chromatic" },
  ];

  return (
    <div className="flex items-center justify-center">
      <ToggleButton
        label="Mode"
        value={mode}
        options={options}
        onChange={setMode}
      />
    </div>
  );
};

export default ModeToggleButton;
