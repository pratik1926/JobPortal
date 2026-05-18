import { cn } from "../../lib/cn";

export function Select({
  value,
  onChange,
  children,
  className,
  ...props
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={cn(
        `
        input-base
        w-full
        rounded-xl
        border
        border-slate-300
        bg-white
        px-4
        py-3
        text-sm
        outline-none
        transition
        focus:border-brand-primary
        focus:ring-2
        focus:ring-blue-100
        `,
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}