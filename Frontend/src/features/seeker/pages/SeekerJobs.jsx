
import { useEffect, useState } from "react";
import { getAllJobs } from "../../../api/jobApi";
import {
  Search,
  MapPin,
  Bookmark,
  BookmarkCheck
} from "lucide-react";
import JobApplyModal from "../components/JobApplyModal";
import toast from "react-hot-toast";

export default function SeekerJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // 🔥 PAGINATION STATE
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchJobs();
  }, [page, pageSize]);

  const fetchJobs = async () => {
    try {
      const res = await getAllJobs(page, pageSize);

      console.log("JOBS RESPONSE:", res.data);

      // ✅ FIX
      setJobs(res.data.data || []);
      setTotal(res.data.total || 0);

    } catch {
      toast.error("Failed to load jobs");
    }
  };

  // 🔥 CLIENT FILTER (on paginated data)
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase()) &&
    job.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  const toggleSave = (id) => {
    if (savedJobs.includes(id)) {
      setSavedJobs(savedJobs.filter((j) => j !== id));
    } else {
      setSavedJobs([...savedJobs, id]);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-5">

      {/* 🔍 SEARCH + FILTER */}
      <div className="flex gap-4">

        <div className="flex items-center bg-white border rounded-xl px-3 flex-1">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full p-2 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <input
          type="text"
          placeholder="Location"
          className="border rounded-xl px-3 py-2"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />

      </div>

      {/* 💼 JOB LIST */}
      <div className="grid gap-4">

        {filteredJobs.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            No jobs found
          </div>
        )}

        {filteredJobs.map((job) => (
          <div
            key={job.id}
            onClick={() => setSelectedJob(job)}
            className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex justify-between">

              <div className="space-y-2">

                <h3 className="text-lg font-semibold">{job.title}</h3>

                <p className="text-sm text-slate-500 line-clamp-2">
                  {job.description}
                </p>

                {job.skills && (
                  <div className="flex gap-2 flex-wrap">
                    {job.skills.split(",").map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-100 px-2 py-1 rounded-full"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-slate-400">
                  {job.providerName}
                </p>

              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(job.id);
                }}
                className="text-slate-500"
              >
                {savedJobs.includes(job.id)
                  ? <BookmarkCheck className="text-purple-600" />
                  : <Bookmark />}
              </button>

            </div>

            <div className="flex justify-between mt-4 text-sm text-slate-500">
              <span>₹ {job.budget}</span>

              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {job.location}
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* 🔥 PAGINATION UI */}
      <div className="flex justify-between items-center pt-6">

        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages || 1}
        </span>

        <button
          onClick={() =>
            setPage((p) => Math.min(p + 1, totalPages))
          }
          disabled={page === totalPages || totalPages === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>

        <select
          value={pageSize}
          onChange={(e) => {
            setPage(1);
            setPageSize(Number(e.target.value));
          }}
          className="ml-4 p-2 border rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>

      </div>

      {/* 🔥 APPLY MODAL */}
      {selectedJob && (
        <JobApplyModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

    </div>
  );
}