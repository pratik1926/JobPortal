import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";

const buttonVariants = cva(
  `
  inline-flex
  items-center
  justify-center
  rounded-xl
  font-medium
  transition-all
  duration-200
  disabled:pointer-events-none
  disabled:opacity-50
  `,
  {
    variants: {
      variant: {
        primary:
          "bg-brand-primary text-white hover:bg-brand-secondary",

        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200",

        danger:
          "bg-red-600 text-white hover:bg-red-700",

        ghost:
          "hover:bg-slate-100",
      },

      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5",
        lg: "h-12 px-6",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export function Button({
  className,
  variant,
  size,
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}