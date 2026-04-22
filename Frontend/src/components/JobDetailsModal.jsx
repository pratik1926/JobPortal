import { X } from "lucide-react";

export default function JobDetailsModal({ job, onClose, isAdmin, onApply }) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 relative">

        {/* 🔥 HEADER */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
              {job.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Posted by {job.providerName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* 🔥 DESCRIPTION */}
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Description
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {job.description}
          </p>
        </div>

        {/* 🔥 SKILLS */}
        {job.skills && (
          <div className="mb-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Skills Required
            </p>

            <div className="flex flex-wrap gap-2">
              {job.skills.split(",").map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs rounded-full 
                             bg-blue-100 text-blue-600 
                             dark:bg-blue-900 dark:text-blue-300"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 🔥 DETAILS GRID */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">

          <div>
            <p className="text-slate-400">Provider</p>
            <p className="font-medium text-slate-700 dark:text-white">
              {job.providerName}
            </p>
          </div>

          <div>
            <p className="text-slate-400">Email</p>
            <p className="font-medium text-slate-700 dark:text-white">
              {job.providerEmail}
            </p>
          </div>

          <div>
            <p className="text-slate-400">Budget</p>
            <p className="font-medium text-green-600">
              ₹ {job.budget}
            </p>
          </div>

          <div>
            <p className="text-slate-400">Location</p>
            <p className="font-medium text-slate-700 dark:text-white">
              {job.location}
            </p>
          </div>

        </div>

        {/* 🔥 ACTIONS */}
        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-sm"
          >
            Close
          </button>

          {/* ✅ ONLY FOR SEEKER */}
          {!isAdmin && onApply && (
            <button
              onClick={() => onApply(job)}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700"
            >
              Apply
            </button>
          )}

        </div>

      </div>
    </div>
  );
}