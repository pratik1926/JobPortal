import { useEffect, useState } from "react";

import { getMyReports } from "../../api/reportApi";

import toast from "react-hot-toast";

import {
  ShieldAlert,
  Search,
  Clock3,
} from "lucide-react";

export default function ProviderReports() {

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  // =========================
  // LOAD REPORTS
  // =========================
  const loadReports = async () => {

    try {

      const res =
        await getMyReports();

      const reportsData =
        res.data?.data || res.data;

      setReports(reportsData);

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to load reports"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // =========================
  // PROVIDER STATUS LABELS
  // =========================
  const getProviderStatus = (
    status
  ) => {

    switch (status) {

      case "Pending":
        return "Submitted";

      case "Reviewed":
        return "Under Review";

      case "Rejected":
        return "Closed";

      case "ActionTaken":
        return "Action Taken";

      default:
        return status;
    }
  };

  // =========================
  // STATUS COLORS
  // =========================
  const getStatusStyle = (
    status
  ) => {

    switch (status) {

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Reviewed":
        return "bg-blue-100 text-blue-700";

      case "Rejected":
        return "bg-slate-200 text-slate-700";

      case "ActionTaken":
        return "bg-green-100 text-green-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // =========================
  // FILTER REPORTS
  // =========================
  const filteredReports =
    reports.filter((report) =>
      [
        report.reportedUserName,
        report.reason,
        report.details,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (
      <div className="p-6">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            My Reports
          </h1>

          <p className="text-slate-500 mt-1">
            Track reports you submitted
          </p>

        </div>

        {/* SEARCH */}
        <div className="relative">

          <Search
            className="absolute left-3 top-3 text-slate-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-white w-72"
          />

        </div>
      </div>

      {/* EMPTY */}
      {filteredReports.length === 0 ? (

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center shadow">

          <ShieldAlert
            className="mx-auto text-slate-400 mb-4"
            size={40}
          />

          <p className="text-slate-500">
            No reports submitted yet
          </p>

        </div>

      ) : (

        <div className="grid gap-5">

          {filteredReports.map(
            (report) => (

              <div
                key={report.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition"
              >

                {/* TOP */}
                <div className="flex justify-between items-start gap-4">

                  <div className="space-y-4 flex-1">

                    {/* REASON */}
                    <div>

                      <div className="flex items-center gap-3 mb-2">

                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Report Reason
                        </p>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(report.status)}`}
                        >
                          {getProviderStatus(
                            report.status
                          )}
                        </span>

                      </div>

                      <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                        {report.reason}
                      </h3>

                    </div>

                    {/* DETAILS */}
                    <div>

                      <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
                        Incident Details
                      </p>

                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {report.details ||
                          "No details provided"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* META */}
                <div className="grid md:grid-cols-3 gap-4 mt-8">

                  {/* REPORTED USER */}
                  <InfoCard
                    label="Reported User"
                    value={
                      report.reportedUserName
                    }
                  />

                  {/* JOB */}
                  <InfoCard
                    label="Job"
                    value={report.jobTitle}
                  />

                  {/* DATE */}
                  <InfoCard
                    label="Submitted"
                    value={new Date(
                      report.createdAt
                    ).toLocaleDateString()}
                  />

                </div>

                {/* TIMELINE */}
                <div className="mt-8 flex items-center gap-3 text-sm">

                  <Clock3
                    size={16}
                    className="text-slate-400"
                  />

                  <span className="text-slate-500">

                    Current Status:

                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(report.status)}`}
                  >
                    {getProviderStatus(
                      report.status
                    )}
                  </span>

                </div>

              </div>
            )
          )}

        </div>
      )}
    </div>
  );
}

/* ========================= */
/* INFO CARD */
/* ========================= */

function InfoCard({
  label,
  value,
}) {

  return (
    <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-5">

      <p className="text-sm text-slate-400 mb-2">
        {label}
      </p>

      <p className="font-semibold text-slate-800 dark:text-white">
        {value || "N/A"}
      </p>

    </div>
  );
}