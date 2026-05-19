import { Card } from "../../../components/ui/Card";

export default function StatCard({
  title,
  value,
  icon
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">

        <div className="text-brand-primary">
          {icon}
        </div>

        <div>
          <p className="text-sm text-text-muted">
            {title}
          </p>

          <h3 className="text-2xl font-semibold text-text-primary">
            {value}
          </h3>
        </div>

      </div>
    </Card>
  );
}