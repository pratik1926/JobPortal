// import { MapPin } from "lucide-react";

// export default function JobCard({ job, onClick }) {
//   return (
//     <div
//       onClick={onClick}
//       className="p-5 rounded-2xl bg-white dark:bg-slate-800 shadow 
//                  hover:shadow-lg cursor-pointer transition"
//     >
//       <div className="flex justify-between">
//         <div>
//           {/* TITLE */}
//           <h3 className="font-semibold text-lg text-slate-800 dark:text-white">
//             {job.title}
//           </h3>

//           {/* DESCRIPTION */}
//           <p className="text-sm text-slate-500 dark:text-slate-400">
//             {job.description}
//           </p>

//           {/* 🔥 SKILLS (NEW) */}
//           {job.skills && (
//             <div className="flex flex-wrap gap-2 mt-3">
//               {job.skills.split(",").map((skill, i) => (
//                 <span
//                   key={i}
//                   className="px-2 py-1 text-xs rounded-full 
//                              bg-blue-100 text-blue-600 
//                              dark:bg-blue-900 dark:text-blue-300"
//                 >
//                   {skill.trim()}
//                 </span>
//               ))}
//             </div>
//           )}

//           {/* PROVIDER */}
//           <p className="text-xs text-slate-400 mt-3">
//             {job.providerName} ({job.providerEmail})
//           </p>
//         </div>
//       </div>

//       {/* FOOTER */}
//       <div className="mt-4 flex justify-between text-sm text-slate-500 dark:text-slate-400">
//         <span className="font-medium">₹ {job.budget}</span>

//         <span className="flex items-center gap-1">
//           <MapPin size={14} />
//           {job.location}
//         </span>
//       </div>
//     </div>
//   );
// }

import { MapPin } from "lucide-react";

export default function JobCard({ job, onClick, clickable = true }) {
  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`p-5 rounded-2xl bg-white dark:bg-slate-800 shadow transition
      ${clickable ? "hover:shadow-xl cursor-pointer" : ""}`}
    >
      {/* Title */}
      <h3 className="font-semibold text-lg">{job.title}</h3>

      {/* Description */}
      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
        {job.description}
      </p>

      {/* Skills */}
      {job.skills && (
        <div className="flex flex-wrap gap-2 mt-3">
          {job.skills.split(",").map((skill, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 rounded"
            >
              {skill.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex justify-between text-sm text-slate-500">
        <span>₹ {job.budget}</span>

        <span className="flex items-center gap-1">
          <MapPin size={14} />
          {job.location}
        </span>
      </div>
    </div>
  );
}