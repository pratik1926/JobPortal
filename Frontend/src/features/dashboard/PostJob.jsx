// import { useState } from "react";
// import { createJob } from "../../api/jobApi";

// export default function PostJob({ onJobCreated }) {
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     budget: "",
//     location: "",
//     skills: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const jobData = {
//         title: form.title,
//         description: form.description,
//         budget: parseInt(form.budget),
//         location: form.location,
//         skills: form.skills,
//       };

//       const res = await createJob(jobData);

//       console.log("Job created:", res.data);

//       alert("Job posted successfully");

//       if (onJobCreated) {
//         onJobCreated();
//       }

//       // Reset form
//       setForm({
//         title: "",
//         description: "",
//         budget: "",
//         location: "",
//         skills: "",
//       });

//     } catch (err) {
//       console.error(err);
//       alert("Failed to post job");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md border">
//       <h3 className="text-lg font-semibold mb-4">Post a Job</h3>

//       <form onSubmit={handleSubmit} className="space-y-4">

//         <input
//           name="title"
//           placeholder="Job Title"
//           value={form.title}
//           onChange={handleChange}
//           className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//         />

//         <textarea
//           name="description"
//           placeholder="Job Description"
//           value={form.description}
//           onChange={handleChange}
//           rows={4}
//           className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//         />

//         <div className="grid grid-cols-2 gap-4">
//           <input
//             name="budget"
//             type="number"
//             placeholder="Budget"
//             value={form.budget}
//             onChange={handleChange}
//             className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//           />

//           <input
//             name="location"
//             placeholder="Location"
//             value={form.location}
//             onChange={handleChange}
//             className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* 🔥 SKILLS */}
//         <input
//           name="skills"
//           placeholder="Skills (React, Node, MongoDB)"
//           value={form.skills}
//           onChange={handleChange}
//           className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
//         >
//           {loading ? "Posting..." : "Post Job"}
//         </button>

//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import Form, {
  Item,
  GroupItem,
  RequiredRule
} from "devextreme-react/form";
import { Button } from "devextreme-react/button";
import { createJob } from "../../api/jobApi";
import toast from "react-hot-toast";

export default function PostJob({ onJobCreated }) {
  const [job, setJob] = useState({
    title: "",
    description: "",
    budget: null,
    location: "",
    skills: ""
  });

  // 🔥 HANDLE SUBMIT
  const handleSubmit = async () => {
    try {
      await createJob(job);

      toast.success("Job posted successfully");

      // reset form
      setJob({
        title: "",
        description: "",
        budget: null,
        location: "",
        skills: ""
      });

      // refresh parent (dashboard)
      onJobCreated && onJobCreated();

    } catch (err) {
      console.error(err);
      toast.error("Failed to post job");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-xl font-semibold">Post a Job</h2>

      <Form
        formData={job}
        colCount={2}
        onFieldDataChanged={(e) => {
          setJob((prev) => ({
            ...prev,
            [e.dataField]: e.value
          }));
        }}
      >
        <GroupItem colCount={2} caption="Job Details">

          {/* TITLE */}
          <Item dataField="title">
            <RequiredRule message="Title is required" />
          </Item>

          {/* BUDGET */}
          <Item
            dataField="budget"
            editorType="dxNumberBox"
            editorOptions={{
              min: 0,
              showSpinButtons: true
            }}
          >
            <RequiredRule message="Budget is required" />
          </Item>

          {/* LOCATION */}
          <Item dataField="location" colSpan={2}>
            <RequiredRule message="Location is required" />
          </Item>

          {/* SKILLS */}
          <Item
            dataField="skills"
            colSpan={2}
            editorOptions={{
              placeholder: "React, Node, SQL..."
            }}
          />

          {/* DESCRIPTION */}
          <Item
            dataField="description"
            colSpan={2}
            editorType="dxTextArea"
            editorOptions={{
              height: 120
            }}
          >
            <RequiredRule message="Description is required" />
          </Item>

        </GroupItem>
      </Form>

      {/* SUBMIT BUTTON */}
      <Button
        text="Post Job"
        type="success"
        stylingMode="contained"
        onClick={handleSubmit}
      />
    </div>
  );
}