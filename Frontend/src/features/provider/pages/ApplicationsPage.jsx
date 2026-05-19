import { useEffect, useState } from "react";

import {
  getApplicationsForProvider,
  updateApplicationStatus,
} from "../../../api/jobApi";

import toast from "react-hot-toast";

import ReportUserModal from "../components/ReportUserModal";

import ApplicationCard from "../../applications/components/ApplicationCard";
import ApplicationFilter from "../../applications/components/ApplicationFilter";
import ApplicationPagination from "../../applications/components/ApplicationPagination";
import ApplicationModal from "../../applications/components/ApplicationModal";

export default function ApplicationsPage() {

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [jobFilter, setJobFilter] =
    useState("");

  // PAGINATION
  const [page, setPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(5);

  const [total, setTotal] =
    useState(0);

  // MODALS
  const [showReportModal, setShowReportModal] =
    useState(false);

  const [showApplicationModal, setShowApplicationModal] =
    useState(false);

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  // =========================
  // FETCH APPLICATIONS
  // =========================
  useEffect(() => {
    fetchApplications();
  }, [page, pageSize]);

  const fetchApplications = async () => {

    try {

      const res =
        await getApplicationsForProvider(
          page,
          pageSize
        );

      setApplications(
        res.data.data || []
      );

      setTotal(
        res.data.total || 0
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // FILTERING
  // =========================
  const filteredApplications =
    applications.filter((app) =>
      app.jobTitle
        ?.toLowerCase()
        .includes(
          jobFilter.toLowerCase()
        )
    );

  // =========================
  // OPEN APPLICATION MODAL
  // =========================
  const openApplication = (
    application
  ) => {

    setSelectedApplication(application);

    setShowApplicationModal(true);
  };

  // =========================
  // STATUS UPDATE
  // =========================
  const handleStatusChange = async (
    id,
    status
  ) => {

    try {

      await updateApplicationStatus(
        id,
        status
      );

      setApplications((prev) =>
        prev.map((app) =>
          app.id === id
            ? { ...app, status }
            : app
        )
      );

      setSelectedApplication((prev) =>
        prev
          ? { ...prev, status }
          : prev
      );

      toast.success(
        `Application ${status}`
      );

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data ||
        "Invalid action"
      );
    }
  };

  // =========================
  // REPORT MODAL
  // =========================
  const openReportModal = (
    app
  ) => {

    setSelectedApplication(app);

    setShowReportModal(true);
  };

  const totalPages =
    Math.ceil(total / pageSize);

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (
      <p className="p-6">
        Loading applications...
      </p>
    );
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      {/* <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">
        Applications
      </h2> */}

      {/* FILTER */}
      <ApplicationFilter
        value={jobFilter}
        onChange={setJobFilter}
      />

      {/* EMPTY STATE */}
      {filteredApplications.length === 0 ? (

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 shadow text-center">

          <p className="text-slate-500">

            {jobFilter
              ? "No applications match this job title"
              : "No applications found"}

          </p>

        </div>

      ) : (

        filteredApplications.map((app) => (

          <ApplicationCard
            key={app.id}
            app={app}
            onClick={() =>
              openApplication(app)
            }
          >

            <button
              className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition"
            >
              View Details
            </button>

          </ApplicationCard>
        ))
      )}

      {/* PAGINATION */}
      <ApplicationPagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />

      {/* PAGE SIZE */}
      <div className="mt-4">

        <select
          value={pageSize}
          onChange={(e) => {

            setPage(1);

            setPageSize(
              Number(e.target.value)
            );
          }}
          className="px-4 py-2 border rounded-xl"
        >

          <option value={5}>
            5
          </option>

          <option value={10}>
            10
          </option>

          <option value={20}>
            20
          </option>

        </select>

      </div>

      {/* APPLICATION MODAL */}
      <ApplicationModal
        open={showApplicationModal}
        onClose={() =>
          setShowApplicationModal(false)
        }
        application={selectedApplication}
      >

        {selectedApplication?.status === "Applied" && (

          <div className="flex gap-3 mt-6">

            <button
              onClick={() =>
                handleStatusChange(
                  selectedApplication.id,
                  "Approved"
                )
              }
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl transition"
            >
              Accept
            </button>

            <button
              onClick={() =>
                handleStatusChange(
                  selectedApplication.id,
                  "Rejected"
                )
              }
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition"
            >
              Reject
            </button>

          </div>
        )}

        {selectedApplication?.status === "Approved" && (

          <div className="flex gap-3 mt-6">

            <button
              disabled
              className="bg-slate-500 text-white px-5 py-2 rounded-xl"
            >
              Approved
            </button>

            <button
              onClick={() =>
                openReportModal(
                  selectedApplication
                )
              }
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl transition"
            >
              Report User
            </button>

          </div>
        )}

      </ApplicationModal>

      {/* REPORT MODAL */}
      <ReportUserModal
        open={showReportModal}
        onClose={() =>
          setShowReportModal(false)
        }
        application={selectedApplication}
      />

    </div>
  );
}