import { useNavigate } from "react-router-dom";

export default function ReportingCenter() {

  const navigate = useNavigate();

  const reports = [

    {
      title: "Full System Report",
      description:
        "Complete multi-sheet export including jobs, users, analytics and moderation.",
      color: "bg-blue-600",
      route: "system"
    },

    {
      title: "Jobs Report",
      description:
        "Preview all jobs, providers and applications analytics.",
      color: "bg-purple-600",
      route: "jobs"
    },

    {
      title: "Users Report",
      description:
        "Preview platform users, roles and account statuses.",
      color: "bg-green-600",
      route: "users"
    },

    {
      title: "Moderation Report",
      description:
        "Preview moderation actions and report statuses.",
      color: "bg-red-600",
      route: "moderation"
    },

    {
      title: "Report Categories",
      description:
        "Grouped report reasons and complaint analytics.",
      color: "bg-pink-600",
      route: "categories"
    },

    {
      title: "Reports Timeline",
      description:
        "Reports submitted over time and platform trends.",
      color: "bg-cyan-600",
      route: "timeline"
    }
  ];

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div>

        <h1 className="
          text-3xl
          font-bold
          text-slate-800
          dark:text-white
        ">
          Reporting Center
        </h1>

        <p className="
          text-slate-500
          mt-2
        ">
          Preview and export platform reports
        </p>

      </div>

      {/* REPORT GRID */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-5
      ">

        {reports.map((report) => (

          <button
            key={report.route}

            onClick={() =>
              navigate(
                `/admin/reporting/${report.route}`
              )
            }

            className={`
              ${report.color}

              rounded-2xl
              p-6
              text-left
              text-white

              shadow-lg

              hover:scale-[1.02]
              transition
            `}
          >

            <h2 className="
              text-xl
              font-semibold
            ">
              {report.title}
            </h2>

            <p className="
              mt-3
              text-sm
              opacity-90
              leading-relaxed
            ">
              {report.description}
            </p>

            <div className="
              mt-6
              text-sm
              font-medium
            ">
              View Report →
            </div>

          </button>

        ))}

      </div>

    </div>
  );
}