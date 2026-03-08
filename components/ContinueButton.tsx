"use client";

export const ContinueButton = ({ onClick, disabled, label }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="cursor-pointer w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 transition-opacity"
    >
      {label}
    </button>
  );
};
