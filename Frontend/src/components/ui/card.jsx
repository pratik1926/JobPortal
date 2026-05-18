import { cn } from "../../lib/cn";

export function Card({
  className,
  children,
  ...props
}) {
  return (
    <div
      className={cn(
        `
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-card
        `,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}