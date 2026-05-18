import { cn } from "../../lib/cn";

export function Input({
  className,
  type = "text",
  ...props
}) {
  return (
    <input
      type={type}
      className={cn(
        `
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
    />
  );
}