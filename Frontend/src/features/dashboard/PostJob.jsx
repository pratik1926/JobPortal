// import { useState } from "react";
// import { createJob } from "../../api/jobApi";

// export default function PostJob({ onJobCreated }) {
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     budget: "",
//     location: "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const jobData = {
//         title: form.title,
//         description: form.description,
//         budget: parseInt(form.budget),
//         location: form.location,
//         // ❌ NO providerId here anymore
//       };

//       const res = await createJob(jobData);

//       console.log("Job created:", res.data);

//       alert("Job posted successfully");

//       // 🔥 refresh job list in dashboard
//       if (onJobCreated) {
//         onJobCreated();
//       }

//       // Reset form
//       setForm({
//         title: "",
//         description: "",
//         budget: "",
//         location: "",
//       });

//     } catch (err) {
//       console.error(err);
//       alert("Failed to post job");
//     }
//   };

//   return (
//     <div style={{ marginTop: "20px" }}>
//       <h3>Post a Job</h3>

//       <form onSubmit={handleSubmit}>
//         <input
//           placeholder="Title"
//           value={form.title}
//           onChange={(e) =>
//             setForm({ ...form, title: e.target.value })
//           }
//         />

//         <br /><br />

//         <textarea
//           placeholder="Description"
//           value={form.description}
//           onChange={(e) =>
//             setForm({ ...form, description: e.target.value })
//           }
//         />

//         <br /><br />

//         <input
//           type="number"
//           placeholder="Budget"
//           value={form.budget}
//           onChange={(e) =>
//             setForm({ ...form, budget: e.target.value })
//           }
//         />

//         <br /><br />

//         <input
//           placeholder="Location"
//           value={form.location}
//           onChange={(e) =>
//             setForm({ ...form, location: e.target.value })
//           }
//         />

//         <br /><br />

        

//         <button type="submit">Post Job</button>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import { createJob } from "../../api/jobApi";

export default function PostJob({ onJobCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    location: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const jobData = {
        title: form.title,
        description: form.description,
        budget: parseInt(form.budget),
        location: form.location,
        skills: form.skills,
      };

      const res = await createJob(jobData);

      console.log("Job created:", res.data);

      alert("Job posted successfully");

      if (onJobCreated) {
        onJobCreated();
      }

      // Reset form
      setForm({
        title: "",
        description: "",
        budget: "",
        location: "",
        skills: "",
      });

    } catch (err) {
      console.error(err);
      alert("Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border">
      <h3 className="text-lg font-semibold mb-4">Post a Job</h3>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            name="budget"
            type="number"
            placeholder="Budget"
            value={form.budget}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 🔥 SKILLS */}
        <input
          name="skills"
          placeholder="Skills (React, Node, MongoDB)"
          value={form.skills}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Job"}
        </button>

      </form>
    </div>
  );
}