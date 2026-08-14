import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const OctaveButton = ({ onClick, children, label }) => (
  <button
    onClick={onClick}
    className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors flex flex-col items-center"
    aria-label={label}
  >
    {children}
  </button>
);

const OctaveControl = ({ transpose, octaveUp, octaveDown }) => {
  const octave = transpose / 12;

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg">
      <OctaveButton onClick={octaveDown} label="Octave Down">
        <ChevronDown size={16} />
      </OctaveButton>
      <div className="text-white font-mono text-sm">OCTAVE: {octave}</div>
      <OctaveButton onClick={octaveUp} label="Octave Up">
        <ChevronUp size={16} />
      </OctaveButton>
    </div>
  );
};

export default OctaveControl;
