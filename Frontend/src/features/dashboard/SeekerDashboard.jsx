// import SeekerJobs from "./SeekerJobs";

// export default function SeekerDashboard() {
//   return (
//     <div>
//       <h2>Seeker Dashboard</h2>

//       <SeekerJobs />
//     </div>
//   );
// }\

import SeekerJobs from "./SeekerJobs";

export default function SeekerDashboard() {
  return (
    <div className="space-y-4">

      <div>
        <h1 className="text-2xl font-bold">Browse Jobs</h1>
        <p className="text-sm text-slate-500">
          Find jobs that match your skills
        </p>
      </div>

      <SeekerJobs />
    </div>
  );
}