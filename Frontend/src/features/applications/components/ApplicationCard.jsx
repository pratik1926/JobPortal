import StatusBadge from "./StatusBadge";

export default function ApplicationCard({
  app,
  children,
  onClick,
}) {

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-5 shadow-sm hover:shadow-md transition cursor-pointer"
    >

      <p className="mb-2">
        <strong>Job:</strong> {app.jobTitle}
      </p>

      <p className="mb-2">
        <strong>Email:</strong> {app.seekerEmail}
      </p>

      <p className="mb-3">
        <strong>Status:</strong>{" "}
        <StatusBadge status={app.status} />
      </p>

      {app.resumeUrl && (
        <a
          href={`https://localhost:7240${app.resumeUrl}`}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-blue-500 underline"
        >
          View Resume
        </a>
      )}

      <div className="mt-5">
        {children}
      </div>

    </div>
  );
}