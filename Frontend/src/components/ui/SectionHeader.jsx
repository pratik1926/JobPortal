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
        items-start
        justify-between
        gap-4
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