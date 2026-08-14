const ToggleButton = ({ label, value, options, onChange }) => {
  return (
    <div className="flex items-center justify-center p-2 rounded-lg">
      <span className="mr-4 text-sm font-bold text-gray-400">{label}</span>
      <div className="flex rounded-md bg-gray-900">
        {options.map((option) => (
          <button
            key={option.value}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              value === option.value
                ? "bg-orange-500 text-white"
                : "text-gray-400 hover:bg-gray-700"
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToggleButton;
