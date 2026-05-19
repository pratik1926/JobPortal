import { cn } from "../../../lib/cn";

export default function ReportCard({
  title,
  description,
  color,
  onClick
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        `
        rounded-2xl
        p-5
        text-left
        text-white
        shadow-card
        transition-all
        hover:-translate-y-1
        hover:shadow-elevated
        `,
        color
      )}
    >
      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm opacity-90">
        {description}
      </p>
    </button>
  );
}