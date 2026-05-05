// // import { useState } from "react";
// // import { updateJob } from "../../api/jobApi";

// // export default function EditJobModal({ job, onClose, onUpdated }) {
// //   const [form, setForm] = useState({
// //     title: job.title,
// //     description: job.description,
// //     budget: job.budget,
// //     location: job.location,
// //   });

// //   const [loading, setLoading] = useState(false);

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async () => {
// //     try {
// //       setLoading(true);

// //       const res = await updateJob(job.id, form);

// //       onUpdated(res.data);
// //       onClose();
// //     } catch (err) {
// //       console.error("Update failed", err);
// //       alert("Failed to update job");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      
// //       {/* MODAL CARD */}
// //       <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
        
// //         {/* HEADER */}
// //         <div className="px-6 py-4 border-b">
// //           <h2 className="text-xl font-semibold">Edit Job</h2>
// //           <p className="text-sm text-gray-500 mt-1">
// //             Update your job details below
// //           </p>
// //         </div>

// //         {/* FORM BODY */}
// //         <div className="p-6 space-y-5">

// //           {/* TITLE */}
// //           <div>
// //             <label className="block text-sm font-medium text-gray-600 mb-1">
// //               Job Title
// //             </label>
// //             <input
// //               name="title"
// //               value={form.title}
// //               onChange={handleChange}
// //               className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             />
// //           </div>

// //           {/* DESCRIPTION */}
// //           <div>
// //             <label className="block text-sm font-medium text-gray-600 mb-1">
// //               Description
// //             </label>
// //             <textarea
// //               name="description"
// //               value={form.description}
// //               onChange={handleChange}
// //               rows={4}
// //               className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             />
// //           </div>

// //           {/* GRID: Budget + Location */}
// //           <div className="grid grid-cols-2 gap-4">
            
// //             <div>
// //               <label className="block text-sm font-medium text-gray-600 mb-1">
// //                 Budget (₹)
// //               </label>
// //               <input
// //                 name="budget"
// //                 type="number"
// //                 value={form.budget}
// //                 onChange={handleChange}
// //                 className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-600 mb-1">
// //                 Location
// //               </label>
// //               <input
// //                 name="location"
// //                 value={form.location}
// //                 onChange={handleChange}
// //                 className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               />
// //             </div>

// //           </div>
// //         </div>

// //         {/* ACTION BAR */}
// //         <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
// //           <button
// //             onClick={onClose}
// //             className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
// //           >
// //             Cancel
// //           </button>

// //           <button
// //             onClick={handleSubmit}
// //             disabled={loading}
// //             className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
// //           >
// //             {loading ? "Saving..." : "Save Changes"}
// //           </button>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }

// import { useState } from "react";
// import { updateJob } from "../../api/jobApi";

// export default function EditJobModal({ job, onClose, onUpdated }) {
//   const [form, setForm] = useState({
//     title: job.title,
//     description: job.description,
//     budget: job.budget,
//     location: job.location,
//     skills: job.skills || "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//   if (e) e.preventDefault();

//   try {
//     setLoading(true);

//     const res = await updateJob(job.id, form);

//     onUpdated(res.data);
//     onClose();
//   } catch (err) {
//     console.error("Update failed", err);
//     alert("Failed to update job");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      
//       <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
        
//         {/* HEADER */}
//         <div className="px-6 py-4 border-b">
//           <h2 className="text-xl font-semibold">Edit Job</h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Update your job details
//           </p>
//         </div>

//         {/* BODY */}
//         <div className="p-6 space-y-5">

//           <div>
//             <label className="text-sm text-gray-600">Job Title</label>
//             <input
//               name="title"
//               value={form.title}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="text-sm text-gray-600">Description</label>
//             <textarea
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               rows={4}
//               className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* 🔥 SKILLS */}
//           <div>
//             <label className="text-sm text-gray-600">
//               Skills / Expertise
//             </label>
//             <input
//               name="skills"
//               value={form.skills}
//               onChange={handleChange}
//               placeholder="React, Node, MongoDB"
//               className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm text-gray-600">Budget</label>
//               <input
//                 name="budget"
//                 type="number"
//                 value={form.budget}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm text-gray-600">Location</label>
//               <input
//                 name="location"
//                 value={form.location}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//         </div>

//         {/* FOOTER */}
//         <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
//           >
//             Cancel
//           </button>

//           <button
//             type = "button"
//             onClick={handleSubmit}
//             disabled={loading}
//             className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
//           >
//             {loading ? "Saving..." : "Save Changes"}
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { updateJob } from "../../api/jobApi";

export default function EditJobModal({ job, onClose, onUpdated }) {
  const [form, setForm] = useState({
    title: job.title || "",
    description: job.description || "",
    budget: job.budget || 0,
    location: job.location || "",
    skills: job.skills || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  if (e) e.preventDefault();

  try {
    setLoading(true);

    const updatedJob = await updateJob(job.id, form);

    if (!updatedJob) {
      alert("Something went wrong");
      return;
    }

    // ✅ update UI
    onUpdated(updatedJob);

    // ✅ success message
    alert("✅ Job updated successfully");

    // ✅ close modal
    onClose();

  } catch (err) {
    console.error("Update failed", err);
    alert("Failed to update job");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Edit Job</h2>
          <p className="text-sm text-gray-500">
            Update your job details
          </p>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">

          <div>
            <label className="text-sm text-gray-600">Job Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Skills / Expertise</label>
            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Budget</label>
              <input
                name="budget"
                type="number"
                value={form.budget}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}