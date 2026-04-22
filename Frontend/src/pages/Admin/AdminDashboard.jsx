// import { useEffect, useState } from "react";
// import { getAllUsers, deleteUser } from "../../api/adminApi";
// import { Trash2, Users, Briefcase, User } from "lucide-react";
// import toast from "react-hot-toast";

// export default function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);

//   const usersPerPage = 5;

//   // 🔥 FETCH USERS
//   const fetchUsers = async () => {
//     try {
//       const res = await getAllUsers();

//       // ❌ Remove admin
//       const filtered = res.data.filter((u) => u.role !== "Admin");

//       setUsers(filtered);
//     } catch {
//       toast.error("Failed to load users");
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // 🔥 DELETE
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this user?")) return;

//     try {
//       await deleteUser(id);
//       toast.success("User deleted");
//       fetchUsers();
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   // 🔍 FILTER
//   const filteredUsers = users.filter((u) =>
//     u.email.toLowerCase().includes(search.toLowerCase())
//   );

//   // 📊 PAGINATION
//   const indexOfLast = page * usersPerPage;
//   const currentUsers = filteredUsers.slice(
//     indexOfLast - usersPerPage,
//     indexOfLast
//   );

//   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

//   // 📊 STATS
//   const totalUsers = users.length;
//   const providers = users.filter((u) => u.role === "Provider").length;
//   const seekers = users.filter((u) => u.role === "Seeker").length;

//   return (
//     <div className="space-y-6">

//       {/* 📊 STATS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

//         <StatCard icon={<Users />} label="Total Users" value={totalUsers} />
//         <StatCard icon={<Briefcase />} label="Providers" value={providers} />
//         <StatCard icon={<User />} label="Seekers" value={seekers} />

//       </div>

//       {/* 🔍 SEARCH */}
//       <input
//         type="text"
//         placeholder="Search users..."
//         className="w-full px-4 py-3 rounded-xl border border-slate-200 
//                    dark:border-slate-700 bg-white dark:bg-slate-800 
//                    text-slate-800 dark:text-white outline-none"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       {/* 👥 USERS */}
//       <div className="space-y-4">
//         {currentUsers.map((user) => (
//           <div
//             key={user.id}
//             className="flex justify-between items-center p-5 rounded-2xl 
//                        bg-white dark:bg-slate-800 shadow-sm"
//           >
//             <div>
//               <h3 className="font-medium text-slate-800 dark:text-white">
//                 {user.name}
//               </h3>
//               <p className="text-sm text-slate-500">{user.email}</p>

//               <RoleBadge role={user.role} />
//             </div>

//             <button
//               onClick={() => handleDelete(user.id)}
//               className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900"
//             >
//               <Trash2 className="text-red-500" />
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* 📊 PAGINATION */}
//       <div className="flex justify-center gap-2">
//         {[...Array(totalPages)].map((_, i) => (
//           <button
//             key={i}
//             onClick={() => setPage(i + 1)}
//             className={`px-4 py-1.5 rounded-lg text-sm ${
//               page === i + 1
//                 ? "bg-blue-600 text-white"
//                 : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white"
//             }`}
//           >
//             {i + 1}
//           </button>
//         ))}
//       </div>

//     </div>
//   );
// }

// /* 🔹 STAT CARD */
// function StatCard({ icon, label, value }) {
//   return (
//     <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center gap-4">
//       <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-600">
//         {icon}
//       </div>
//       <div>
//         <p className="text-sm text-slate-500">{label}</p>
//         <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
//           {value}
//         </h2>
//       </div>
//     </div>
//   );
// }

// /* 🔹 ROLE BADGE */
// function RoleBadge({ role }) {
//   const styles = {
//     Provider: "bg-blue-100 text-blue-600",
//     Seeker: "bg-green-100 text-green-600",
//   };

//   return (
//     <span
//       className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${styles[role]}`}
//     >
//       {role}
//     </span>
//   );
// }


// import { useEffect, useState } from "react";
// import { getAllUsers, deleteUser, getAllJobs } from "../../api/adminApi";
// import { Trash2, Users, Briefcase } from "lucide-react";
// import toast from "react-hot-toast";
// import { PieChart, Pie, Cell, Tooltip } from "recharts";


// export default function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [jobs, setJobs] = useState([]);
//   const [activeTab, setActiveTab] = useState("users");
//   const[data, setData] = useState([]);

//   // 🔥 FETCH USERS
//   const fetchUsers = async () => {
//     try {
//       const res = await getAllUsers();
//       setUsers(res.data.filter((u) => u.role !== "Admin"));
//     } catch {
//       toast.error("Failed to load users");
//     }
//   };

//   // 🔥 FETCH JOBS
//   const fetchJobs = async () => {
//     try {
//       const res = await getAllJobs();
//       setJobs(res.data);
//     } catch {
//       toast.error("Failed to load jobs");
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//     fetchJobs();
//   }, []);

//   // 🔥 DELETE USER
//   const handleDelete = async (id) => {
//     if (!confirm("Delete this user?")) return;

//     try {
//       await deleteUser(id);
//       setUsers(users.filter((u) => u.id !== id));
//       toast.success("User deleted");
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">

//       {/* HEADER */}
//       <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
//         Admin Dashboard
//       </h1>

//       {/* TABS */}
//       <div className="flex gap-4">
//         <button
//           onClick={() => setActiveTab("users")}
//           className={`px-4 py-2 rounded-lg ${
//             activeTab === "users"
//               ? "bg-blue-600 text-white"
//               : "bg-slate-200 dark:bg-slate-700"
//           }`}
//         >
//           Users
//         </button>

//         <button
//           onClick={() => setActiveTab("jobs")}
//           className={`px-4 py-2 rounded-lg ${
//             activeTab === "jobs"
//               ? "bg-blue-600 text-white"
//               : "bg-slate-200 dark:bg-slate-700"
//           }`}
//         >
//           Jobs
//         </button>
//       </div>

//       {/* USERS TAB */}
//       {activeTab === "users" && (
//         <div className="space-y-4">
//           {users.map((user) => (
//             <div
//               key={user.id}
//               className="p-5 rounded-2xl bg-white dark:bg-slate-800 shadow flex justify-between"
//             >
//               <div>
//                 <h3 className="font-semibold">{user.name}</h3>
//                 <p className="text-sm text-slate-500">{user.email}</p>
//                 <span className="text-xs">{user.role}</span>
//               </div>

//               <button
//                 onClick={() => handleDelete(user.id)}
//                 className="text-red-500 hover:text-red-700"
//               >
//                 <Trash2 />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* JOBS TAB */}
//       {activeTab === "jobs" && (
//         <div className="space-y-4">
//           {jobs.map((job) => (
//             <div
//               key={job.id}
//               className="p-5 rounded-2xl bg-white dark:bg-slate-800 shadow"
//             >
//               <div className="flex justify-between">
//                 <div>
//                   <h3 className="font-semibold">{job.title}</h3>
//                   <p className="text-sm text-slate-500">
//                     {job.description}
//                   </p>

//                   <p className="text-xs text-slate-400 mt-2">
//                     {job.providerName} ({job.providerEmail})
//                   </p>
//                 </div>

//                 <Briefcase className="text-blue-500" />
//               </div>

//               <div className="mt-3 flex justify-between text-sm text-slate-500">
//                 <span>₹ {job.budget}</span>
//                 <span>{job.location}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/adminApi";
import { Users, Briefcase } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    seekers: 0,
    providers: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getAllUsers();

        const users = res.data.filter(u => u.role !== "Admin");

        const seekers = users.filter(u => u.role === "Seeker").length;
        const providers = users.filter(u => u.role === "Provider").length;

        setStats({
          total: users.length,
          seekers,
          providers,
        });

        setChartData([
          { name: "Seekers", value: seekers },
          { name: "Providers", value: providers },
        ]);

      } catch {
        toast.error("Failed to load dashboard data");
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6">

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <StatCard
          title="Total Users"
          value={stats.total}
          icon={<Users />}
        />

        <StatCard
          title="Providers"
          value={stats.providers}
          icon={<Briefcase />}
        />

        <StatCard
          title="Seekers"
          value={stats.seekers}
          icon={<Users />}
        />

      </div>

      {/* CHART */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
          User Distribution
        </h2>

        <PieChart width={300} height={300}>
          <Pie data={chartData} dataKey="value" outerRadius={100}>
            <Cell fill="#22c55e" />
            <Cell fill="#3b82f6" />
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

    </div>
  );
}

/* 🔹 STAT CARD */
function StatCard({ title, value, icon }) {
  return (
    <div className="p-5 bg-white dark:bg-slate-800 rounded-xl shadow flex items-center gap-4">
      <div className="text-blue-500">{icon}</div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
          {value}
        </h3>
      </div>
    </div>
  );
}