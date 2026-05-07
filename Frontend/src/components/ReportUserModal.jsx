import { useState } from "react";

import { createReport } from "../api/reportApi";

import toast from "react-hot-toast";

import {
  ShieldAlert,
  X,
} from "lucide-react";

export default function ReportUserModal({
  open,
  onClose,
  application,
}) {

  const [loading, setLoading] =
    useState(false);

  const [reportForm, setReportForm] =
    useState({
      reason: "",
      details: "",
    });

  // =========================
  // REPORT CATEGORIES
  // =========================
  const reportReasons = [
    "Abusive Behavior",
    "Harassment",
    "Spam or Scam",
    "Fraudulent Activity",
    "Fake Information",
    "Unprofessional Conduct",
    "Payment Issues",
    "Inappropriate Messages",
    "Violation of Platform Rules",
    "Other",
  ];

  // =========================
  // SUBMIT REPORT
  // =========================
  const handleSubmitReport = async () => {

    if (!reportForm.reason) {

      toast.error(
        "Please select a reason"
      );

      return;
    }

    try {

      setLoading(true);

      await createReport({
        applicationId:
          application.id,

        reason:
          reportForm.reason,

        details:
          reportForm.details,
      });

      toast.success(
        "Report submitted successfully"
      );

      setReportForm({
        reason: "",
        details: "",
      });

      onClose();

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to submit report"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // CLOSE
  // =========================
  const handleClose = () => {

    setReportForm({
      reason: "",
      details: "",
    });

    onClose();
  };

  if (!open || !application) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">

              <ShieldAlert
                className="text-red-600"
                size={24}
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Report User
              </h2>

              <p className="text-sm text-slate-500">
                Submit a moderation report
              </p>

            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X size={26} />
          </button>

        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">

          {/* USER INFO */}
          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4">

            <p className="text-sm text-slate-400 mb-1">
              Reporting User
            </p>

            <p className="font-semibold text-slate-800 dark:text-white">
              {application.seekerEmail}
            </p>

          </div>

          {/* REASON */}
          <div>

            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
              Report Category
            </label>

            <select
              value={reportForm.reason}
              onChange={(e) =>
                setReportForm((prev) => ({
                  ...prev,
                  reason:
                    e.target.value,
                }))
              }
              className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            >

              <option value="">
                Select report reason
              </option>

              {reportReasons.map(
                (reason) => (

                  <option
                    key={reason}
                    value={reason}
                  >
                    {reason}
                  </option>
                )
              )}
            </select>

          </div>

          {/* DETAILS */}
          <div>

            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
              Incident Details
            </label>

            <textarea
              rows={5}
              placeholder="Explain what happened..."
              value={reportForm.details}
              onChange={(e) =>
                setReportForm((prev) => ({
                  ...prev,
                  details:
                    e.target.value,
                }))
              }
              className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
            />

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-800">

          <button
            onClick={handleClose}
            className="px-5 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmitReport}
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading
              ? "Submitting..."
              : "Submit Report"}
          </button>

        </div>

      </div>
    </div>
  );
}