const ModuleContainer = ({ title, children }) => {
  return (
    <div
      className='relative p-4 rounded-lg h-full flex flex-col'
      style={{
        background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
        boxShadow: "inset 2px 2px 5px #0a0a0a, inset -2px -2px 5px #3a3a3a, 3px 3px 10px rgba(0,0,0,0.8)",
        border: "1px solid rgba(0,0,0,0.7)",
      }}>
      {/* Screws for vintage look */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-gray-800 shadow-inner"></div>
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gray-800 shadow-inner"></div>
      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-gray-800 shadow-inner"></div>
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-gray-800 shadow-inner"></div>

      <h2 className='text-center text-sm font-bold text-orange-400 tracking-widest uppercase mb-4 pb-2 border-b-2 border-gray-700'>
        {title}
      </h2>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
};

export default ModuleContainer;
