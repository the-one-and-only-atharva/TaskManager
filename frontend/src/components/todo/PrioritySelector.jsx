import React from "react";
import highPriorityIcon from "../../assets/high-priority.svg";
import medPriorityIcon from "../../assets/med-priority.svg";
import lowPriorityIcon from "../../assets/low-priority.svg";

const PrioritySelector = ({ value, onChange, label = "Priority" }) => {
  const priorities = [
    {
      key: "high",
      icon: highPriorityIcon,
      alt: "High Priority",
      activeClass:
        "bg-red-500/40 border border-red-500/30 text-white scale-105",
      inactiveClass:
        "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 hover:scale-102",
    },
    {
      key: "medium",
      icon: medPriorityIcon,
      alt: "Medium Priority",
      activeClass:
        "bg-yellow-500/40 border border-yellow-500/30 text-white scale-105",
      inactiveClass:
        "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 hover:scale-102",
    },
    {
      key: "low",
      icon: lowPriorityIcon,
      alt: "Low Priority",
      activeClass:
        "bg-sky-700/40 border border-sky-500/30 text-white scale-105",
      inactiveClass:
        "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 hover:scale-102",
    },
  ];

  return (
    <div>
      <div className="text-white/90 font-medium text-xl ml-2 mb-4 mt-auto">
        {label}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {priorities.map((priority) => (
          <button
            key={priority.key}
            className={`cursor-pointer rounded-xl p-3 leading-6 transition-all duration-200 flex flex-col items-center gap-2 ${
              value === priority.key
                ? priority.activeClass
                : priority.inactiveClass
            }`}
            onClick={() => onChange(priority.key)}
            type="button"
          >
            <img src={priority.icon} alt={priority.alt} className="w-6 h-6" />
            <span className="text-xs capitalize">{priority.key}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PrioritySelector;
