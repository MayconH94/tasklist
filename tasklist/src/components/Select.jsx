import { ChevronDown } from "lucide-react";

// <select> com a mesma aparência em todos os temas (seta própria, sem a do navegador).
export default function Select({ className = "", children, ...props }) {
  return (
    <div className={`relative ${className}`}>
      <select
        {...props}
        className="h-9 w-full appearance-none rounded-lg border border-line bg-surface pl-3 pr-8 text-[13px] text-ink outline-none transition-colors focus:border-accent"
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
