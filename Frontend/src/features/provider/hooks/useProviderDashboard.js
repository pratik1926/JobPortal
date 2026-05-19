import { useEffect, useState } from "react";
import {
  getMyJobs,
  deleteJob
} from "../../../api/jobApi";

import connection
from "../../../services/signalr";

export default function useProviderDashboard() {
  const [jobs, setJobs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [editingJob, setEditingJob] =
    useState(null);

  const [page, setPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(5);

  const [total, setTotal] =
    useState(0);

  const fetchJobs = async () => {
    try {

      const res =
        await getMyJobs(
          page,
          pageSize
        );

      const {
        data,
        total
      } = res.data;

      setJobs(data);
      setTotal(total);

    } catch (err) {

      console.error(
        "Error fetching jobs",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, pageSize]);

  useEffect(() => {

    if (
      connection.state ===
      "Disconnected"
    ) {
      connection
        .start()
        .then(() =>
          console.log(
            "✅ SignalR Connected"
          )
        )
        .catch((err) =>
          console.error(
            "❌ SignalR Error:",
            err
          )
        );
    }

    const handleNotification =
      (data) => {

      alert(data.message);

      fetchJobs();
    };

    connection.on(
      "ReceiveNotification",
      handleNotification
    );

    return () => {
      connection.off(
        "ReceiveNotification",
        handleNotification
      );
    };

  }, []);

  const handleDelete =
    async (jobId) => {

    if (
      !window.confirm(
        "Delete this job?"
      )
    ) return;

    try {

      await deleteJob(jobId);

      if (
        jobs.length === 1 &&
        page > 1
      ) {

        setPage(page - 1);

      } else {

        fetchJobs();
      }

    } catch (err) {

      console.error(err);

      alert(
        "Delete failed"
      );
    }
  };

  const handleUpdated =
    (updatedJob) => {

    setJobs((prev) =>
      prev.map((j) =>
        j.id === updatedJob.id
          ? updatedJob
          : j
      )
    );
  };

  const totalPages =
    Math.ceil(
      total / pageSize
    );

  return {
    jobs,
    loading,
    editingJob,
    setEditingJob,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    fetchJobs,
    handleDelete,
    handleUpdated
  };
}