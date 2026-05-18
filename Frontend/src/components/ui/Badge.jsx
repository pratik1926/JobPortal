import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";

const badgeVariants = cva(
  `
  inline-flex
  items-center
  rounded-full
  px-3
  py-1
  text-xs
  font-medium
  `,
  {
    variants: {
      variant: {
        success:
          "bg-green-100 text-green-700",

        warning:
          "bg-yellow-100 text-yellow-700",

        danger:
          "bg-red-100 text-red-700",

        info:
          "bg-blue-100 text-blue-700",

        neutral:
          "bg-slate-100 text-slate-700",
      },
    },

    defaultVariants: {
      variant: "neutral",
    },
  }
);

export function Badge({
  variant,
  className,
  children,
}) {
  return (
    <span
      className={cn(
        badgeVariants({ variant }),
        className
      )}
    >
      {children}
    </span>
  );
}