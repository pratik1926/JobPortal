import { useState } from "react";
import axiosClient from "../api/axiosClient";
import toast from "react-hot-toast";
import { X, MapPin } from "lucide-react";

export default function JobApplyModal({ job, onClose }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);

  const handleResumeUpload = async (file) => {
  if (!file) return;

  setResume(file);

  try {
    const formData = new FormData();

    formData.append("Resume", file);

    const response = await axiosClient.post(
      "/Job/parse-resume",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const parsed = response.data;
    console.log(parsed);

    // 🔥 AUTOFILL
    setCandidateName(parsed.candidateName || "");
    setEmail(parsed.email || "");
    setPhoneNumber(parsed.phoneNumber || "");
    setSkills(parsed.skills || []);
    setEducation(parsed.education || []);
    toast.success("Resume parsed successfully!");

  } catch (err) {
    console.log(err);
    toast.error("Failed to parse resume");
  }
};

  const handleApply = async () => {
  if (!resume) {
    toast.error("Please upload your resume");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("Resume", resume);
    formData.append("CoverLetter", coverLetter);

    await axiosClient.post(`/Job/apply/${job.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Application submitted!");
    onClose();

  } catch (err) {
    // ❌ already handled globally
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* HEADER */}
        <div className="p-6 border-b dark:border-slate-800 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              {job.title}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {job.providerName}
            </p>
          </div>

          <button onClick={onClose}>
            <X className="text-slate-400 hover:text-red-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* DESCRIPTION */}
          <div>
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
              Job Description
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {job.description}
            </p>
          </div>

          {/* SKILLS */}
          {job.skills && (
            <div>
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                Required Skills
              </h3>

              <div className="flex flex-wrap gap-2">
                {job.skills.split(",").map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full 
                               bg-purple-100 text-purple-600 
                               dark:bg-purple-900 dark:text-purple-300"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* META */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
            <div>
              <p className="text-xs text-slate-400">Budget</p>
              <p className="font-semibold text-green-600">
                ₹ {job.budget}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Location</p>
              <p className="flex items-center gap-1">
                <MapPin size={14} />
                {job.location}
              </p>
            </div>
          </div>

          {/* APPLICATION */}
          <div className="border-t pt-4 dark:border-slate-800">
            <h3 className="text-sm font-semibold mb-3">
              Apply for this job
            </h3>

            {/* FILE */}
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleResumeUpload(e.target.files[0])}
              className="w-full border rounded-lg p-2 mb-3"
            />

            <input
              type="text"
              placeholder="Candidate Name"
              value={candidateName}
              onChange={(e) =>
                setCandidateName(e.target.value)
              }
              className="w-full border rounded-lg p-3 mb-3"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border rounded-lg p-3 mb-3"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(e.target.value)
              }
              className="w-full border rounded-lg p-3 mb-3"
            />

            {skills.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-semibold mb-2">
                  Extracted Skills
                </p>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs rounded-full
                                bg-green-100 text-green-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* EDUCATION */}
<div className="mb-4">
  <p className="text-sm font-semibold mb-2">
    Education
  </p>

  {education.length > 0 ? (
    education.map((edu, index) => (
      <textarea
        key={index}
        value={edu}
        onChange={(e) => {
          const updatedEducation =
            [...education];

          updatedEducation[index] =
            e.target.value;

          setEducation(
            updatedEducation
          );
        }}
        className="w-full border rounded-lg p-3 mb-2 text-sm"
        rows={3}
      />
    ))
  ) : (
    <textarea
      placeholder="Education details"
      className="w-full border rounded-lg p-3 text-sm"
      rows={3}
      onChange={(e) =>
        setEducation([e.target.value])
      }
    />
  )}
</div>
            
            {/* COVER LETTER */}
            <textarea
              placeholder="Write a cover letter..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full border rounded-lg p-3 h-28"
            />
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200"
          >
            Cancel
          </button>

          <button
            onClick={handleApply}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-purple-600 text-white"
          >
            {loading ? "Applying..." : "Apply Now"}
          </button>
        </div>

      </div>
    </div>
  );
}