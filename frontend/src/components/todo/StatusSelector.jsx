import React from "react";

const StatusSelector = ({ value, onChange }) => {
  const statuses = [
    {
      key: "not_started",
      label: "Not Started",
      color: "bg-slate-500/40 border-slate-400/30",
    },
    {
      key: "in_progress",
      label: "In Progress",
      color: "bg-blue-500/40 border-blue-400/30",
    },
    {
      key: "blocked",
      label: "Blocked",
      color: "bg-red-500/40 border-red-400/30",
    },
    {
      key: "done",
      label: "Done",
      color: "bg-green-500/40 border-green-400/30",
    },
  ];

  return (
    <div>
      <div className="text-white/90 font-medium ml-2 mb-2">Status</div>
      <div className="grid grid-cols-2 gap-2">
        {statuses.map((status) => (
          <button
            key={status.key}
            type="button"
            onClick={() => onChange(status.key)}
            className={`cursor-pointer px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${
              value === status.key
                ? `${status.color} text-white scale-105`
                : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 hover:scale-102"
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusSelector;
