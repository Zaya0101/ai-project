import React from "react";

type ButtonDefaultProps = {
  children?: React.ReactNode;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  className?: string;
};

export function ButtonDefault({
  children,
  onClick,
  disabled = false,
  className = "",
}: ButtonDefaultProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-23.5 h-10
        px-4
        rounded-md
        bg-black text-white
        text-sm font-medium
        flex items-center justify-center gap-2
        transition
        cursor-pointer
        hover:opacity-90
        active:scale-95
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}
