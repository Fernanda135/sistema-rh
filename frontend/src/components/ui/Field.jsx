import React from "react";

export function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[15px] font-medium text-white">
        {label} {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {children}

      {error && (
        <span className="text-sm text-red-400 mt-1">{error}</span>
      )}
    </div>
  );
}
