// export default function ApplicationModal({
//   open,
//   onClose,
//   application,
// }) {
//       if (!open || !application) {
//     return null;
//   }
//   return (
//     <div
//       onClick={onClose}
//       className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
//     >

//       <div
//         onClick={(e) => e.stopPropagation()}
//         className="w-[600px] bg-white dark:bg-slate-900 rounded-2xl p-6 relative"
//       >

//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4"
//         >
//           ✕
//         </button>

//         <h2 className="text-2xl font-bold mb-4">
//           {application.jobTitle}
//         </h2>

//         <div className="space-y-3">

//           <p>
//             <strong>Applicant:</strong>{" "}
//             {application.seekerEmail}
//           </p>

//           <p>
//             <strong>Status:</strong>{" "}
//             {application.status}
//           </p>

//           <p>
//             <strong>Applied At:</strong>{" "}
//             {new Date(application.appliedAt).toLocaleString()}
//           </p>

//           <div className="mt-5">
//             <strong>Cover Letter</strong>

//             <p className="mt-2 text-slate-600 dark:text-slate-300">
//               {application.coverLetter || "No cover letter"}
//             </p>
//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }


export default function ApplicationModal({
  open,
  onClose,
  application,
  children,
}) {

  if (!open || !application) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto"
      >

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 dark:hover:text-white transition"
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="mb-6">

          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            {application.jobTitle}
          </h2>

          <p className="text-slate-500 mt-2">
            Application Details
          </p>

        </div>

        {/* DETAILS */}
        <div className="space-y-5">

          {/* APPLICANT */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">

            <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-white">
              Applicant Information
            </h3>

            <div className="space-y-2 text-slate-700 dark:text-slate-300">

              <p>
                <strong>Email:</strong>{" "}
                {application.seekerEmail}
              </p>

              {application.location && (
                <p>
                  <strong>Location:</strong>{" "}
                  {application.location}
                </p>
              )}

            </div>

          </div>

          {/* APPLICATION */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">

            <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-white">
              Application Details
            </h3>

            <div className="space-y-2 text-slate-700 dark:text-slate-300">

              <p>
                <strong>Status:</strong>{" "}
                {application.status}
              </p>

              <p>
                <strong>Applied At:</strong>{" "}
                {new Date(application.appliedAt).toLocaleString()}
              </p>

            </div>

          </div>

          {/* COVER LETTER */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">

            <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-white">
              Cover Letter
            </h3>

            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {application.coverLetter || "No cover letter provided"}
            </p>

          </div>

          {/* RESUME */}
          {application.resumeUrl && (

            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">

              <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-white">
                Resume
              </h3>

              <a
                href={`https://localhost:7240${application.resumeUrl}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
              >
                View Resume
              </a>

            </div>
          )}

          {/* ACTIONS SLOT */}
          {children && (

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">

              <h3 className="font-semibold text-lg mb-4 text-slate-800 dark:text-white">
                Actions
              </h3>

              {children}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}