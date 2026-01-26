import React from "react";

export function Select({ label, options, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm">{label}</label>}

      <select {...props} className="border rounded px-3 py-2 bg-white dark:bg-gray-900" >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
