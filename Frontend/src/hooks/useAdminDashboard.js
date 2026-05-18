import {
  useEffect,
  useState,
  useRef
} from "react";

import toast from
"react-hot-toast";

import connection from
"../services/signalr";

import {
  getAllUsers,
  banUser,
  unbanUser,
  getAnalytics,
  exportJobsReport,
  getJobsReportPreview,
  exportSystemReport,
  exportUsersReport,
  exportModerationReport,
  exportCategoriesReport,
  exportTimelineReport
} from "../api/adminApi";

export function useAdminDashboard() {

  const [users, setUsers] =
    useState([]);

  const [analytics,
    setAnalytics] =
    useState(null);

  const [jobsPreview,
    setJobsPreview] =
    useState([]);

  const isLoadingUsersRef =
    useRef(false);

  const isLoadingAnalyticsRef =
    useRef(false);

  const loadUsers =
    async () => {

    if (
      isLoadingUsersRef.current
    )
      return;

    isLoadingUsersRef.current =
      true;

    try {

      const res =
        await getAllUsers(
          1,
          5
        );

      const usersArray =
        res.data?.data;

      const filtered =
        usersArray.filter(
          (u) =>
            u.role !== "Admin"
        );

      setUsers(filtered);

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to load users"
      );

    } finally {

      isLoadingUsersRef.current =
        false;
    }
  };

  const loadAnalytics =
    async () => {

    if (
      isLoadingAnalyticsRef.current
    )
      return;

    isLoadingAnalyticsRef.current =
      true;

    try {

      const res =
        await getAnalytics();

      const analyticsData =
        res.data?.data ||
        res.data;

      if (!analyticsData)
        throw new Error(
          "Invalid analytics response"
        );

      setAnalytics(
        analyticsData
      );

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to load analytics"
      );

    } finally {

      isLoadingAnalyticsRef.current =
        false;
    }
  };

  const fetchJobsPreview =
    async () => {

    try {

      const response =
        await getJobsReportPreview();

      setJobsPreview(
        response.data
      );

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to load report preview"
      );
    }
  };

  useEffect(() => {

    loadUsers();

    loadAnalytics();

    fetchJobsPreview();

    connection.off(
      "ReceiveAdminUpdate"
    );

    connection.on(
      "ReceiveAdminUpdate",
      () => {

        loadUsers();

        loadAnalytics();
      }
    );

    return () => {

      connection.off(
        "ReceiveAdminUpdate"
      );
    };

  }, []);

  const downloadJobsReport =
    async () => {

    try {

      const response =
        await exportJobsReport();

      const url =
        window.URL
          .createObjectURL(
            new Blob([
              response.data
            ])
          );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.setAttribute(
        "download",
        "jobs-report.xlsx"
      );

      document.body
        .appendChild(link);

      link.click();

      link.remove();

      toast.success(
        "Jobs report downloaded"
      );

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to export jobs report"
      );
    }
  };

  const downloadFile = async (
  apiCall,
  filename,
  successMessage
) => {

  try {

    const response =
      await apiCall();

    const url =
      window.URL.createObjectURL(
        new Blob([response.data])
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      filename
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

    toast.success(
      successMessage
    );

  } catch (err) {

    console.error(err);

    toast.error(
      "Download failed"
    );
  }
};

  const handleToggleBan =
    async (
      userId,
      isBanned
    ) => {

    try {

      if (isBanned) {

        await unbanUser(
          userId
        );

        toast.success(
          "User unbanned"
        );

      } else {

        await banUser(
          userId
        );

        toast.success(
          "User banned"
        );
      }

      loadUsers();

      loadAnalytics();

    } catch (err) {

      console.error(err);

      toast.error(
        "Action failed"
      );
    }
  };

  return {
    users,
    analytics,
    jobsPreview,
    
    downloadJobsReport,
    handleToggleBan,
    downloadFile,

    exportSystemReport,
    exportUsersReport,
    exportModerationReport,
    exportCategoriesReport,
    exportTimelineReport
  };
}