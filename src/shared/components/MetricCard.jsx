import React from "react";

export function MetricCard({ label, value, helperText, className }) {
  const displayValue =
    value !== undefined && value !== null && value !== "" ? value : "-";

  return (
    <div
      className={
        "rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-3 " +
        (className ?? "")
      }
    >
      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </div>

      <div className="mt-1 text-sm font-semibold text-slate-900">
        {displayValue}
      </div>

      {helperText && (
        <div className="mt-0.5 text-[11px] text-slate-500">{helperText}</div>
      )}
    </div>
  );
}

export default MetricCard;
