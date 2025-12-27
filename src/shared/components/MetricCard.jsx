import React from "react";

export function MetricCard({ label, value, helperText, className, onClick }) {
  const displayValue =
    value !== undefined && value !== null && value !== "" ? value : "-";

  const isClickable = typeof onClick === 'function';

  return (
    <div
      className={
        "rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-3 " +
        (isClickable ? "cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all " : "") +
        (className ?? "")
      }
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </div>

      <div className="mt-1 text-sm font-semibold text-slate-900 flex items-center gap-1">
        {displayValue}
        {isClickable && (
          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>

      {helperText && (
        <div className="mt-0.5 text-[11px] text-slate-500">{helperText}</div>
      )}
    </div>
  );
}

export default MetricCard;
