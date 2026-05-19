import { cn } from "../../lib/cn";

export function SectionHeader({
  title,
  description,
  className,
  actions
}) {
  return (
    <div
      className={cn(
        `
        mb-5
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-start
        sm:justify-between
        `,
        className
      )}
    >

      <div>

        <h2 className="
          text-xl
          font-semibold
          tracking-tight
          text-text-primary
        ">
          {title}
        </h2>

        {description && (
          <p className="
            mt-1
            text-sm
            text-text-secondary
          ">
            {description}
          </p>
        )}

      </div>

      {actions && (
        <div>
          {actions}
        </div>
      )}

    </div>
  );
}