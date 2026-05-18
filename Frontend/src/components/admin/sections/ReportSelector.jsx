import { Select }
from "../../ui/Select";

export default function ReportSelector({
  selectedReport,
  setSelectedReport
}) {
  return (
    <div className="
      flex
      justify-end
    ">

      <Select
        value={selectedReport}
        onChange={(e) =>
          setSelectedReport(
            e.target.value
          )
        }
        className="
          input-base
          w-64
          shadow-sm
        "
      >
        <option value="overview">
          Platform Overview
        </option>

        <option value="moderation">
          Moderation Analytics
        </option>

        <option value="jobsReport">
          Jobs Report
        </option>
      </Select>

    </div>
  );
}