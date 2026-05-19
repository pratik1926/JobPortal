
import React, { useState } from "react";
import * as XLSX from "xlsx";
import DataGrid, { Column } from "devextreme-react/data-grid";
import axiosClient from "../../../api/axiosClient"; // 🔥 adjust path if needed

export default function BulkJobUpload() {
  const [jobs, setJobs] = useState([]);

  // ✅ VALIDATION LOGIC
  const isValidJob = (job) => {
    return (
        job.title?.trim() &&
        job.description?.trim() &&
        job.location?.trim() &&
        job.budget > 0 &&
        job.skills?.length > 0
    );
  };

  // 📂 FILE UPLOAD
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const formatted = jsonData.map((row, index) => {
        const job = {
          id: index + 1,
          title: row.Title || "",
          description: row.Description || "",
          budget: Number(row.Budget) || 0,
          location: row.Location || "",
          skills: row.Skills ? row.Skills.split(",") : [],
          status: "Pending",
          error: null
        };

        return {
          ...job,
          isValid: isValidJob(job)
        };
      });

      setJobs(formatted);
    };

    reader.readAsArrayBuffer(file);
  };

  // 🔥 SINGLE POST
  const handleSinglePost = async (jobId) => {
    const job = jobs.find((j) => j.id === jobId);

    try {
      await axiosClient.post("/job", {
        title: job.title,
        description: job.description,
        budget: job.budget,
        location: job.location,
        skills: job.skills.join(",")
      });

      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? { ...j, status: "Success", error: null }
            : j
        )
      );
    } catch (err) {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? {
                ...j,
                status: "Failed",
                error:
                  err.response?.data?.message || "Failed to post"
              }
            : j
        )
      );
    }
  };

  // 🔥 POST ALL VALID
  const handlePostAll = async () => {
  const validJobs = jobs.filter((j) => isValidJob(j));

  if (validJobs.length === 0) {
    alert("No valid jobs to post");
    return;
  }

  try {
    const payload = validJobs.map(j => ({
      title: j.title.trim(),
      description: j.description.trim(),
      budget: Number(j.budget),          // ensure number
      location: j.location.trim(),
      skills: j.skills.join(",")         // string, not array
    }));

    console.log("PAYLOAD:", JSON.stringify(payload, null, 2));

    const res = await axiosClient.post(
      "/job/bulk",
      payload,
      {
        headers: {
          "Content-Type": "application/json" // 🔥 force JSON
        }
      }
    );

    const result = res.data;

    let index = 0;
    const updated = jobs.map((job) => {
      if (!isValidJob(job)) return job;

      const r = result[index++];
      return {
        ...job,
        status: r.status,
        error: r.error
      };
    });

    setJobs(updated);

  } catch (err) {
    console.error(err);
    console.log("BACKEND ERROR:", err.response?.data);
    alert(err.response?.data?.message || "Bulk post failed");
  }
};
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-3">
        Bulk Job Upload
      </h2>

      {/* FILE INPUT */}
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
      />

      {/* POST ALL BUTTON */}
      <div className="mt-3">
        <button
          onClick={handlePostAll}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Post All Valid Jobs
        </button>
      </div>

      {/* GRID */}
      <div className="mt-4">
        <DataGrid
          dataSource={jobs}
          keyExpr="id"
          showBorders={true}
        >
          <Column dataField="title" caption="Title" />
          <Column dataField="description" caption="Description" />
          <Column dataField="budget" caption="Budget" />
          <Column dataField="location" caption="Location" />

          <Column
            dataField="skills"
            caption="Skills"
            calculateCellValue={(row) =>
              row.skills.join(", ")
            }
          />

          <Column dataField="status" caption="Status" />
          <Column dataField="error" caption="Error" />

          {/* 🔥 ACTION COLUMN */}
          <Column
            caption="Action"
            cellRender={(cellData) => {
              const job = cellData.data;

              if (!job.isValid) {
                return (
                  <span className="text-red-500 text-sm">
                    Invalid
                  </span>
                );
              }

              return (
                <button
                  onClick={() =>
                    handleSinglePost(job.id)
                  }
                  className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                >
                  Post
                </button>
              );
            }}
          />
        </DataGrid>
      </div>
    </div>
  );
}