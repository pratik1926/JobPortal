import { cn } from "../../lib/cn";

export function Section({
  className,
  children,
}) {
  return (
    <section
      className={cn(
        "py-8 lg:py-10",
        className
      )}
    >
      {children}
    </section>
  );
}