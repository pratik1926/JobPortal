import { useState } from "react";
import { createJob } from "../../api/jobApi";

export default function PostJob({ onJobCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    location: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const jobData = {
        title: form.title,
        description: form.description,
        budget: parseInt(form.budget),
        location: form.location,
        // ❌ NO providerId here anymore
      };

      const res = await createJob(jobData);

      console.log("Job created:", res.data);

      alert("Job posted successfully");

      // 🔥 refresh job list in dashboard
      if (onJobCreated) {
        onJobCreated();
      }

      // Reset form
      setForm({
        title: "",
        description: "",
        budget: "",
        location: "",
      });

    } catch (err) {
      console.error(err);
      alert("Failed to post job");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Post a Job</h3>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <br /><br />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <br /><br />

        <input
          type="number"
          placeholder="Budget"
          value={form.budget}
          onChange={(e) =>
            setForm({ ...form, budget: e.target.value })
          }
        />

        <br /><br />

        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <br /><br />

        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}