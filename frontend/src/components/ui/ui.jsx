import React from "react";

// Shared UI component library for consistent styling across the app

// Base button styles
const buttonBaseClasses =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40 disabled:opacity-50 disabled:pointer-events-none";

// Button variants
const buttonVariants = {
  primary:
    "bg-sky-500/20 hover:bg-sky-500/35 border-sky-400/30 text-sky-100 border",
  secondary:
    "bg-white/5 hover:bg-white/10 border-white/10 text-white/90 border",
  ghost:
    "bg-transparent hover:bg-white/10 border-white/10 text-white/80 border",
  danger:
    "bg-red-500/20 hover:bg-red-500/35 border-red-400/30 text-red-100 border",
};

// Button sizes
const buttonSizes = {
  sm: "px-2.5 py-1.5 text-sm rounded-md",
  md: "px-3 py-2 rounded-lg",
  lg: "px-4 py-2.5 text-lg rounded-lg",
};

export const Button = ({
  variant = "secondary",
  size = "md",
  className = "",
  children,
  ...props
}) => {
  const variantClasses = buttonVariants[variant] || buttonVariants.secondary;
  const sizeClasses = buttonSizes[size] || buttonSizes.md;

  return (
    <button
      className={`${buttonBaseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Input component
export const Input = ({ className = "", size = "md", ...props }) => {
  const baseClasses =
    "w-full bg-white/10 text-white placeholder-white/40 border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40 focus-visible:border-sky-400/40 transition-colors";
  const sizeClasses =
    size === "sm" ? "px-2.5 py-1.5 text-sm rounded-md" : "px-3 py-2 rounded-lg";

  return (
    <input
      className={`${baseClasses} ${sizeClasses} ${className}`}
      {...props}
    />
  );
};

// Card component
export const Card = ({
  className = "",
  children,
  variant = "default",
  ...props
}) => {
  const baseClasses = "rounded-xl border border-white/10 bg-white/5";
  const variantClasses = variant === "nested" ? "bg-white/10" : "";

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Modal overlay component
export const ModalOverlay = ({
  children,
  onClose,
  className = "",
  ...props
}) => {
  return (
    <div
      className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) onClose?.();
      }}
      {...props}
    >
      <div
        className={`relative bg-gradient-to-b from-slate-900/90 to-slate-800/70 backdrop-blur-xl shadow-2xl border border-white/10 ${className}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// Section header component
export const SectionHeader = ({ title, children, icon, className = "" }) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        {icon && <img src={icon} alt="" className="h-5 w-5 opacity-80" />}
        <h3 className="text-white/90 font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
};

// Form field component
export const FormField = ({ label, children, className = "" }) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-white/80 text-sm mb-2">{label}</label>
      )}
      {children}
    </div>
  );
};
