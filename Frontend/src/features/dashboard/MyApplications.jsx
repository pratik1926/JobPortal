import { useEffect, useState } from "react";

import { getMyApplications } from "../../api/jobApi";

import ApplicationCard from "../../components/applications/ApplicationCard";
import ApplicationFilter from "../../components/applications/ApplicationFilter";
import ApplicationPagination from "../../components/applications/ApplicationPagination";
import ApplicationModal from "../../components/applications/ApplicationModal";

export default function MyApplications() {

  const [applications, setApplications] =
    useState([]);

  const [selectedApp, setSelectedApp] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

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

  // =========================
  // FETCH APPLICATIONS
  // =========================
  useEffect(() => {
    fetchMyApplications();
  }, [page, pageSize]);

  const fetchMyApplications = async () => {

    try {

      const res =
        await getMyApplications(
          page,
          pageSize
        );

      console.log(
        "SEEKER APPLICATIONS:",
        res.data
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
  // MODAL
  // =========================
  const openApplication = (
    application
  ) => {

    setSelectedApp(application);

    setShowModal(true);
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
        My Applications
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
              : "You have not applied to any jobs yet"}

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

            <div className="flex gap-3 mt-4">

              <button
                className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition"
              >
                View Details
              </button>

            </div>

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
        open={showModal}
        onClose={() =>
          setShowModal(false)
        }
        application={selectedApp}
      />

    </div>
  );
}