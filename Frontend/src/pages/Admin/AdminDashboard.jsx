// import { useEffect, useState } from "react";
// import { getAllUsers } from "../../api/adminApi";
// import { Users, Briefcase } from "lucide-react";
// import { PieChart, Pie, Cell, Tooltip } from "recharts";
// import toast from "react-hot-toast";

// export default function AdminDashboard() {
//   const [stats, setStats] = useState({
//     total: 0,
//     seekers: 0,
//     providers: 0,
//   });

//   const [chartData, setChartData] = useState([]);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const res = await getAllUsers();

//         const users = res.data.filter(u => u.role !== "Admin");

//         const seekers = users.filter(u => u.role === "Seeker").length;
//         const providers = users.filter(u => u.role === "Provider").length;

//         setStats({
//           total: users.length,
//           seekers,
//           providers,
//         });

//         setChartData([
//           { name: "Seekers", value: seekers },
//           { name: "Providers", value: providers },
//         ]);

//       } catch {
//         toast.error("Failed to load dashboard data");
//       }
//     };

//     loadData();
//   }, []);

//   return (
//     <div className="space-y-6">

//       {/* STATS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//         <StatCard
//           title="Total Users"
//           value={stats.total}
//           icon={<Users />}
//         />

//         <StatCard
//           title="Providers"
//           value={stats.providers}
//           icon={<Briefcase />}
//         />

//         <StatCard
//           title="Seekers"
//           value={stats.seekers}
//           icon={<Users />}
//         />

//       </div>

//       {/* CHART */}
//       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
//         <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
//           User Distribution
//         </h2>

//         <PieChart width={300} height={300}>
//           <Pie data={chartData} dataKey="value" outerRadius={100}>
//             <Cell fill="#22c55e" />
//             <Cell fill="#3b82f6" />
//           </Pie>
//           <Tooltip />
//         </PieChart>
//       </div>

//     </div>
//   );
// }

// /* 🔹 STAT CARD */
// function StatCard({ title, value, icon }) {
//   return (
//     <div className="p-5 bg-white dark:bg-slate-800 rounded-xl shadow flex items-center gap-4">
//       <div className="text-blue-500">{icon}</div>
//       <div>
//         <p className="text-sm text-slate-500">{title}</p>
//         <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
//           {value}
//         </h3>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { getAllUsers } from "../../api/adminApi";
// import { Users, Briefcase } from "lucide-react";
// import toast from "react-hot-toast";
// import * as signalR from "@microsoft/signalr";

// /* ✅ DevExtreme */
// import PieChart, {
//   Series,
//   Tooltip as PieTooltip,
//   Legend
// } from "devextreme-react/pie-chart";

// import DataGrid, {
//   Column,
//   SearchPanel,
//   Paging,
//   FilterRow
// } from "devextreme-react/data-grid";

// export default function AdminDashboard() {
//   const [stats, setStats] = useState({
//     total: 0,
//     seekers: 0,
//     providers: 0,
//   });

//   const [chartData, setChartData] = useState([]);
//   const [users, setUsers] = useState([]);

//   const loadData = async () => {
//     try {
//       const res = await getAllUsers();

//       const usersData = res.data.filter(u => u.role !== "Admin");

//       const seekers = usersData.filter(u => u.role === "Seeker").length;
//       const providers = usersData.filter(u => u.role === "Provider").length;

//       setStats({
//         total: usersData.length,
//         seekers,
//         providers,
//       });

//       setChartData([
//         { name: "Seekers", value: seekers },
//         { name: "Providers", value: providers },
//       ]);

//       setUsers(usersData);

//     } catch {
//       toast.error("Failed to load dashboard data");
//     }
//   };

//   useEffect(() => {
//     loadData();

//     /* 🔥 SignalR Connection */
//     const connection = new signalR.HubConnectionBuilder()
//       .withUrl("http://localhost:7124/notificationHub")
//       .withAutomaticReconnect()
//       .build();

//     connection.start().then(() => {
//       connection.on("ReceiveAdminUpdate", () => {
//         loadData(); // 🔥 auto-refresh
//       });
//     });

//     return () => {
//       connection.stop();
//     };
//   }, []);

//   return (
//     <div className="space-y-6 p-4">

//       {/* 🔹 STATS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//         <StatCard
//           title="Total Users"
//           value={stats.total}
//           icon={<Users />}
//         />

//         <StatCard
//           title="Providers"
//           value={stats.providers}
//           icon={<Briefcase />}
//         />

//         <StatCard
//           title="Seekers"
//           value={stats.seekers}
//           icon={<Users />}
//         />

//       </div>

//       {/* 🔹 DEVEXTREME PIE CHART */}
//       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
//         <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
//           User Distribution
//         </h2>

//         <PieChart
//           dataSource={chartData}
//           palette="Bright"
//         >
//           <Series
//             argumentField="name"
//             valueField="value"
//           />
//           <Legend visible={true} />
//           <PieTooltip enabled={true} />
//         </PieChart>
//       </div>

//       {/* 🔹 USERS TABLE */}
//       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
//         <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
//           Users List
//         </h2>

//         <DataGrid
//           dataSource={users}
//           showBorders={true}
//           columnAutoWidth={true}
//         >
//           <SearchPanel visible={true} />
//           <FilterRow visible={true} />
//           <Paging defaultPageSize={5} />

//           <Column dataField="name" caption="Name" />
//           <Column dataField="email" caption="Email" />
//           <Column dataField="role" caption="Role" />

//           {/* 🔥 ACTION BUTTON */}
//           <Column
//             type="buttons"
//             buttons={[
//               {
//                 text: "Ban",
//                 onClick: (e) => handleBan(e.row.data.id)
//               }
//             ]}
//           />
//         </DataGrid>
//       </div>

//     </div>
//   );

//   /* 🔥 BAN USER */
//   async function handleBan(userId) {
//     try {
//       // 👉 call your backend here
//       console.log("Ban user:", userId);

//       toast.success("User banned");
//       loadData();

//     } catch {
//       toast.error("Failed to ban user");
//     }
//   }
// }

// /* 🔹 STAT CARD */
// function StatCard({ title, value, icon }) {
//   return (
//     <div className="p-5 bg-white dark:bg-slate-800 rounded-xl shadow flex items-center gap-4">
//       <div className="text-blue-500">{icon}</div>
//       <div>
//         <p className="text-sm text-slate-500">{title}</p>
//         <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
//           {value}
//         </h3>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { getAllUsers, banUser, unbanUser } from "../../api/adminApi";
// import { Users, Briefcase } from "lucide-react";
// import toast from "react-hot-toast";
// import * as signalR from "@microsoft/signalr";


// /* ✅ DevExtreme */
// import PieChart, {
//   Series,
//   Tooltip as PieTooltip,
//   Legend
// } from "devextreme-react/pie-chart";

// import DataGrid, {
//   Column,
//   SearchPanel,
//   Paging,
//   FilterRow
// } from "devextreme-react/data-grid";

// export default function AdminDashboard() {
//   const [stats, setStats] = useState({
//     total: 0,
//     seekers: 0,
//     providers: 0,
//   });

//   const [chartData, setChartData] = useState([]);
//   const [users, setUsers] = useState([]);

//   const loadData = async () => {
//     try {
//       const res = await getAllUsers();

//       // 🔥 FILTER: remove admins + banned users
//       const usersData = res.data.filter(
//         u => u.role !== "Admin" 
//       );

//       const seekers = usersData.filter(u => u.role === "Seeker").length;
//       const providers = usersData.filter(u => u.role === "Provider").length;

//       setStats({
//         total: usersData.length,
//         seekers,
//         providers,
//       });

//       setChartData([
//         { name: "Seekers", value: seekers },
//         { name: "Providers", value: providers },
//       ]);

//       setUsers(usersData);

//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load dashboard data");
//     }
//   };

//   useEffect(() => {
//     loadData();

//     /* 🔥 SignalR */
//     const connection = new signalR.HubConnectionBuilder()
//       .withUrl("http://localhost:7124/notificationHub")
//       .withAutomaticReconnect()
//       .build();

//     connection.start().then(() => {
//       connection.on("ReceiveAdminUpdate", () => {
//         loadData();
//       });
//     });

//     return () => {
//       connection.stop();
//     };
//   }, []);

//   return (
//     <div className="space-y-6 p-4">

//       {/* 🔹 STATS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//         <StatCard title="Total Users" value={stats.total} icon={<Users />} />
//         <StatCard title="Providers" value={stats.providers} icon={<Briefcase />} />
//         <StatCard title="Seekers" value={stats.seekers} icon={<Users />} />

//       </div>

//       {/* 🔹 PIE CHART */}
//       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
//         <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
//           User Distribution
//         </h2>

//         <PieChart dataSource={chartData} palette="Bright">
//           <Series argumentField="name" valueField="value" />
//           <Legend visible={true} />
//           <PieTooltip enabled={true} />
//         </PieChart>
//       </div>

//       {/* 🔹 USERS TABLE */}
//       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
//         <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
//           Users List
//         </h2>

//         {/* <DataGrid
//           dataSource={users}
//           showBorders={true}
//           columnAutoWidth={true}
          
//         > */}

//         <DataGrid
//           dataSource={users}
//           showBorders={true}
//           columnAutoWidth={true}
//           rowClassName={(rowData) =>
//             rowData.data?.isBanned ? "bg-red-50" : ""
//           }
//         >
//           <SearchPanel visible={true} />
//           <FilterRow visible={true} />
//           <Paging defaultPageSize={5} />

//           <Column dataField="name" caption="Name" />
//           <Column dataField="email" caption="Email" />
//           <Column dataField="role" caption="Role" />

//           {/* 🔥 STATUS COLUMN */}
//           <Column
//   dataField="isBanned"
//   caption="Status"
//   cellRender={(data) => (
//     <span className={data.value ? "text-red-500 font-semibold" : "text-green-500 font-semibold"}>
//       {data.value ? "Banned" : "Active"}
//     </span>
//   )}
// />
//           {/* <Column
//             dataField="isBanned"
//             caption="Status"
//             cellRender={(data) => (
//               <span className={data.value ? "text-red-500" : "text-green-500"}>
//                 {data.value ? "Banned" : "Active"}
//               </span>
//             )}
//           /> */}

//           {/* 🔥 ACTION BUTTON */}
//           <Column
//             caption="Action"
//             cellRender={(data) => {
//               const isBanned = data.data.isBanned;

//               return (
//                 <button
//                   onClick={() => handleToggleBan(data.data.id, isBanned)}
//                   className={`px-3 py-1 rounded text-white ${
//                     isBanned ? "bg-green-500" : "bg-red-500"
//                   }`}
//                 >
//                   {isBanned ? "Unban" : "Ban"}
//                 </button>
//               );
//             }}
//           />
//         </DataGrid>
//       </div>

//     </div>
//   );

//   // /* 🔥 BAN USER */
//   //  function handleBan(userId) {
//   //   try {
//   //     await banUser(userId);

//   //     toast.success("User banned successfully");

//   //     loadData(); // refresh UI

//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error("Failed to ban user");
//   //   }
//   // }
//   async function handleToggleBan(userId, isBanned) {
//   try {
//     if (isBanned) {
//       await unbanUser(userId);
//       toast.success("User unbanned");
//     } else {
//       await banUser(userId);
//       toast.success("User banned");
//     }

//     loadData();

//   } catch (err) {
//     console.error(err);
//     toast.error("Action failed");
//   }
// }
// }

// /* 🔹 STAT CARD */
// function StatCard({ title, value, icon }) {
//   return (
//     <div className="p-5 bg-white dark:bg-slate-800 rounded-xl shadow flex items-center gap-4">
//       <div className="text-blue-500">{icon}</div>
//       <div>
//         <p className="text-sm text-slate-500">{title}</p>
//         <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
//           {value}
//         </h3>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { getAllUsers, banUser, unbanUser } from "../../api/adminApi";
// import { Users, Briefcase } from "lucide-react";
// import toast from "react-hot-toast";
// import * as signalR from "@microsoft/signalr";

// /* ✅ DevExtreme */
// import PieChart, {
//   Series,
//   Tooltip as PieTooltip,
//   Legend
// } from "devextreme-react/pie-chart";

// import DataGrid, {
//   Column,
//   SearchPanel,
//   Paging,
//   FilterRow
// } from "devextreme-react/data-grid";

// export default function AdminDashboard() {
//   const [stats, setStats] = useState({
//     total: 0,
//     seekers: 0,
//     providers: 0,
//   });

//   const [chartData, setChartData] = useState([]);
//   const [users, setUsers] = useState([]);

//   const loadData = async () => {
//     try {
//       const res = await getAllUsers();

//       // ✅ Show ALL users except admin (including banned)
//       const usersData = res.data.filter(
//         (u) => u.role !== "Admin"
//       );

//       const seekers = usersData.filter((u) => u.role === "Seeker").length;
//       const providers = usersData.filter((u) => u.role === "Provider").length;

//       setStats({
//         total: usersData.length,
//         seekers,
//         providers,
//       });

//       setChartData([
//         { name: "Seekers", value: seekers },
//         { name: "Providers", value: providers },
//       ]);

//       setUsers(usersData);

//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load dashboard data");
//     }
//   };

//   // useEffect(() => {
//   //   loadData();

//   //   const connection = new signalR.HubConnectionBuilder()
//   //     .withUrl("http://localhost:7240/notificationHub")
//   //     .withAutomaticReconnect()
//   //     .build();

//   //   connection.start().then(() => {
//   //     console.log("SignalR connected")
//   //     connection.on("ReceiveAdminUpdate", () => {
//   //       loadData();
//   //     });
//   //   });

//   //   return () => {
//   //     connection.stop();
//   //   };
//   // }, []);

// //   useEffect(() => {
// //   loadData();

// //   const connection = new signalR.HubConnectionBuilder()
// //     .withUrl("https://localhost:7240/hubs/notification")
// //     .withAutomaticReconnect()
// //     .build();

// //   connection.start()
// //     .then(() => {
// //       console.log("✅ SignalR connected");

// //       connection.on("ReceiveAdminUpdate", () => {
// //         console.log("🔄 Admin update received");
// //         loadData();
// //       });
// //     })
// //     .catch((err) => {
// //       console.error("❌ SignalR connection failed:", err);
// //     });

// //   return () => {
// //     connection.stop();
// //   };
// // }, []);
// useEffect(() => {
//   let connection = null;
//   let isMounted = true;

//   const startSignalR = async () => {
//     if (!isMounted) return;

//     connection = new signalR.HubConnectionBuilder()
//       .withUrl("https://localhost:7240/hubs/notification")
//       .withAutomaticReconnect()
//       .build();

//     try {
//       await connection.start();
//       console.log("✅ SignalR connected");

//       connection.on("ReceiveAdminUpdate", () => {
//         console.log("🔄 Admin update received");
//         loadData();
//       });

//     } catch (err) {
//       console.error("❌ SignalR connection failed:", err);
//     }
//   };

//   loadData();
//   startSignalR();

//   return () => {
//     isMounted = false;
//     if (connection) {
//       connection.stop();
//       console.log("🛑 SignalR stopped");
//     }
//   };
// }, []);


//   return (
//     <div className="space-y-6 p-4">

//       {/* 🔹 STATS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <StatCard title="Total Users" value={stats.total} icon={<Users />} />
//         <StatCard title="Providers" value={stats.providers} icon={<Briefcase />} />
//         <StatCard title="Seekers" value={stats.seekers} icon={<Users />} />
//       </div>

//       {/* 🔹 PIE CHART */}
//       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
//         <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
//           User Distribution
//         </h2>

//         <PieChart dataSource={chartData} palette="Bright">
//           <Series argumentField="name" valueField="value" />
//           <Legend visible={true} />
//           <PieTooltip enabled={true} />
//         </PieChart>
//       </div>

//       {/* 🔹 USERS TABLE */}
//       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
//         <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
//           Users List
//         </h2>

//         <DataGrid
//           key={users.length}
//           dataSource={users}
//           showBorders={true}
//           columnAutoWidth={true}
//           rowClassName={(rowData) =>
//             rowData.data?.isBanned ? "bg-red-50" : ""
//           }
//         >
//           <SearchPanel visible={true} />
//           <FilterRow visible={true} />
//           <Paging defaultPageSize={5} />

//           <Column dataField="name" caption="Name" />
//           <Column dataField="email" caption="Email" />
//           <Column dataField="role" caption="Role" />

//           {/* 🔥 STATUS COLUMN */}
//           <Column
//             dataField="isBanned"
//             caption="Status"
//             allowFiltering={true}
//             cellRender={(data) => (
//               <span className={data.value ? "text-red-500 font-semibold" : "text-green-500 font-semibold"}>
//                 {data.value ? "Banned" : "Active"}
//               </span>
//             )}
//           />

//           {/* 🔥 ACTION BUTTON */}
//           <Column
//             caption="Action"
//             cellRender={(data) => {
//               const isBanned = data.data.isBanned;

//               return (
//                 <button
//                   onClick={() => handleToggleBan(data.data.id, isBanned)}
//                   className={`px-3 py-1 rounded text-white font-semibold ${
//                     isBanned
//                       ? "bg-green-500 hover:bg-green-600"
//                       : "bg-red-500 hover:bg-red-600"
//                   }`}
//                 >
//                   {isBanned ? "Unban" : "Ban"}
//                 </button>
//               );
//             }}
//           />
//         </DataGrid>
//       </div>
//     </div>
//   );

//   // 🔥 TOGGLE BAN / UNBAN
//   async function handleToggleBan(userId, isBanned) {
//     try {
//       if (isBanned) {
//         await unbanUser(userId);
//         toast.success("User unbanned");
//       } else {
//         await banUser(userId);
//         toast.success("User banned");
//       }

//      await loadData();

//     } catch (err) {
//       console.error(err);
//       toast.error("Action failed");
//     }
//   }
// }

// /* 🔹 STAT CARD */
// function StatCard({ title, value, icon }) {
//   return (
//     <div className="p-5 bg-white dark:bg-slate-800 rounded-xl shadow flex items-center gap-4">
//       <div className="text-blue-500">{icon}</div>
//       <div>
//         <p className="text-sm text-slate-500">{title}</p>
//         <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
//           {value}
//         </h3>
//       </div>
//     </div>
//   );
// }
// import { useEffect, useState } from "react";
// import {
//   getAllUsers,
//   banUser,
//   unbanUser,
//   getAnalytics
// } from "../../api/adminApi";

// import { Users, Briefcase, UserX } from "lucide-react";
// import toast from "react-hot-toast";
// // import * as signalR from "@microsoft/signalr";
// import connection from "../../services/signalr";
// /* ✅ DevExtreme */
// import PieChart, {
//   Series,
//   Tooltip as PieTooltip,
//   Legend
// } from "devextreme-react/pie-chart";

// import Chart, {
//   ArgumentAxis,
//   ValueAxis,
//   Series as LineSeries
// } from "devextreme-react/chart";

// import DataGrid, {
//   Column,
//   SearchPanel,
//   Paging,
//   FilterRow
// } from "devextreme-react/data-grid";

// export default function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [analytics, setAnalytics] = useState(null);

//   // 🔹 LOAD USERS
//   const loadUsers = async () => {
//     try {
//       const res = await getAllUsers();

//       const usersData = res.data.data.filter((u)=>u.role != "Admin");
//       setUsers(usersData);

//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load users");
//     }
//   };

//   // 🔹 LOAD ANALYTICS
//   const loadAnalytics = async () => {
//     try {
//       const res = await getAnalytics();
//       setAnalytics(res.data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load analytics");
//     }
//   };

//   // // 🔹 SIGNALR + INITIAL LOAD
//   // useEffect(() => {
//   //   let connection = null;
//   //   let isMounted = true;

//   //   const startSignalR = async () => {
//   //     if (!isMounted) return;

//   //     connection = new signalR.HubConnectionBuilder()
//   //       .withUrl("https://localhost:7240/hubs/notification")
//   //       .withAutomaticReconnect()
//   //       .build();

//   //     try {
//   //       await connection.start();
//   //       console.log("✅ SignalR connected");

//   //       connection.on("ReceiveAdminUpdate", () => {
//   //         console.log("🔄 Admin update received");
//   //         loadUsers();
//   //         loadAnalytics(); // 🔥 IMPORTANT
//   //       });

//   //     } catch (err) {
//   //       console.error("❌ SignalR error:", err);
//   //     }
//   //   };

//   //   loadUsers();
//   //   loadAnalytics();
//   //   startSignalR();

//   //   return () => {
//   //     isMounted = false;
//   //     if (connection) connection.stop();
//   //   };
//   // }, []);
  

// //   useEffect(() => {
// //   let connection;

// //   const initSignalR = async () => {
// //     connection = new signalR.HubConnectionBuilder()
// //       .withUrl("https://localhost:7240/hubs/notification")
// //       .withAutomaticReconnect()
// //       .build();

// //     // 🔥 Register listener BEFORE start
// //     connection.on("ReceiveAdminUpdate", () => {
// //       console.log("🔄 Admin update received");
// //       loadUsers();
// //       loadAnalytics();
// //     });

// //     try {
// //       if (connection.state === "Disconnected") {
// //         await connection.start();
// //         console.log("✅ SignalR connected");
// //       }
// //     } catch (err) {
// //       console.error("❌ SignalR start error:", err);
// //     }
// //   };

// //   loadUsers();
// //   loadAnalytics();
// //   initSignalR();

// //   return () => {
// //     if (connection) {
// //       connection.stop();
// //       console.log("🛑 SignalR stopped");
// //     }
// //   };
// // }, []);

//   useEffect(() => {
//   loadUsers();
//   loadAnalytics();

//   // 🔥 attach listener to existing global connection
//   connection.off("ReceiveAdminUpdate");

//   connection.on("ReceiveAdminUpdate", () => {
//     console.log("🔄 Admin update received");
//     loadUsers();
//     loadAnalytics();
//   });

//   return () => {
//     connection.off("ReceiveAdminUpdate");
//   };
// }, []);

//   // 🔥 BAN / UNBAN
//   const handleToggleBan = async (userId, isBanned) => {
//     try {
//       if (isBanned) {
//         await unbanUser(userId);
//         toast.success("User unbanned");
//       } else {
//         await banUser(userId);
//         toast.success("User banned");
//       }

//       loadUsers();
//       loadAnalytics();

//     } catch (err) {
//       console.error(err);
//       toast.error("Action failed");
//     }
//   };

//   return (
//     <div className="space-y-6 p-4">

//       {/* 🔹 STATS CARDS */}
//       {analytics && (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

//           <StatCard
//             title="Total Users"
//             value={analytics.totalUsers}
//             icon={<Users />}
//           />

//           <StatCard
//             title="Active Users"
//             value={analytics.activeUsers}
//             icon={<Users />}
//           />

//           <StatCard
//             title="Banned Users"
//             value={analytics.bannedUsers}
//             icon={<UserX />}
//           />

//           <StatCard
//             title="Total Jobs"
//             value={analytics.totalJobs}
//             icon={<Briefcase />}
//           />

//         </div>
//       )}

//       {/* 🔹 PIE CHART */}
//       {analytics && (
//         <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
//           <h2 className="text-lg font-semibold mb-4">
//             User Distribution
//           </h2>

//           <PieChart
//             dataSource={[
//               { name: "Seekers", value: analytics.seekers },
//               { name: "Providers", value: analytics.providers }
//             ]}
//             palette="Bright"
//           >
//             <Series argumentField="name" valueField="value" />
//             <Legend visible={true} />
//             <PieTooltip enabled={true} />
//           </PieChart>
//         </div>
//       )}

//       {/* 🔹 JOB TREND */}
//       {analytics && (
//         <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
//           <h2 className="text-lg font-semibold mb-4">
//             Jobs Over Time
//           </h2>

//           <Chart dataSource={analytics.jobsPerDay}>
//             <ArgumentAxis argumentType="datetime" />
//             <ValueAxis />

//             <LineSeries
//               valueField="count"
//               argumentField="date"
//               type="line"
//             />
//           </Chart>
//         </div>
//       )}

//       {/* 🔹 USERS TABLE */}
//       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
//         <h2 className="text-lg font-semibold mb-4">
//           Users List
//         </h2>

//         <DataGrid
//           dataSource={users}
//           showBorders={true}
//           columnAutoWidth={true}
//         >
//           <SearchPanel visible={true} />
//           <FilterRow visible={true} />
//           <Paging defaultPageSize={5} />

//           <Column dataField="name" caption="Name" />
//           <Column dataField="email" caption="Email" />
//           <Column dataField="role" caption="Role" />

//           <Column
//             dataField="isBanned"
//             caption="Status"
//             cellRender={(data) => (
//               <span
//                 className={
//                   data.value
//                     ? "text-red-500 font-semibold"
//                     : "text-green-500 font-semibold"
//                 }
//               >
//                 {data.value ? "Banned" : "Active"}
//               </span>
//             )}
//           />

//           <Column
//             caption="Action"
//             cellRender={(data) => {
//               const isBanned = data.data.isBanned;

//               return (
//                 <button
//                   onClick={() =>
//                     handleToggleBan(data.data.id, isBanned)
//                   }
//                   className={`px-3 py-1 rounded text-white ${
//                     isBanned
//                       ? "bg-green-500"
//                       : "bg-red-500"
//                   }`}
//                 >
//                   {isBanned ? "Unban" : "Ban"}
//                 </button>
//               );
//             }}
//           />
//         </DataGrid>
//       </div>
//     </div>
//   );
// }

// /* 🔹 STAT CARD */
// function StatCard({ title, value, icon }) {
//   return (
//     <div className="p-5 bg-white dark:bg-slate-800 rounded-xl shadow flex items-center gap-4">
//       <div className="text-blue-500">{icon}</div>
//       <div>
//         <p className="text-sm text-slate-500">{title}</p>
//         <h3 className="text-xl font-semibold">
//           {value}
//         </h3>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import {
  getAllUsers,
  banUser,
  unbanUser,
  getAnalytics
} from "../../api/adminApi";

import { Users, Briefcase, UserX } from "lucide-react";
import toast from "react-hot-toast";
import connection from "../../services/signalr";

/* DevExtreme */
import PieChart, {
  Series,
  Tooltip as PieTooltip,
  Legend
} from "devextreme-react/pie-chart";

import Chart, {
  ArgumentAxis,
  ValueAxis,
  Series as LineSeries
} from "devextreme-react/chart";

import DataGrid, {
  Column,
  SearchPanel,
  Paging,
  FilterRow
} from "devextreme-react/data-grid";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // 🔥 loading guards (prevents duplicate calls)
  let isLoadingUsers = false;
  let isLoadingAnalytics = false;

  // 🔹 LOAD USERS
  // const loadUsers = async () => {
  //   if (isLoadingUsers) return;
  //   isLoadingUsers = true;

  //   try {
  //     const res = await getAllUsers();

  //     console.log("USERS RESPONSE:", res.data);

  //     const usersArray = Array.isArray(res.data)
  //       ? res.data
  //       : res.data?.data;

  //     if (!usersArray) throw new Error("Invalid users response");

  //     const filtered = usersArray.filter(
  //       (u) => u.role !== "Admin"
  //     );

  //     setUsers(filtered);

  //   } catch (err) {
  //     console.error("USER ERROR:", err);
  //     toast.error("Failed to load users");
  //   } finally {
  //     isLoadingUsers = false;
  //   }
  // };

  const loadUsers = async () => {
  try {
    const res = await getAllUsers(1, 5);

    const usersArray = res.data?.data;

    const filtered = usersArray.filter(
      (u) => u.role !== "Admin"
    );

    setUsers(filtered);

  } catch (err) {
    console.error(err);
    toast.error("Failed to load users");
  }
};

  // 🔹 LOAD ANALYTICS
  const loadAnalytics = async () => {
    if (isLoadingAnalytics) return;
    isLoadingAnalytics = true;

    try {
      const res = await getAnalytics();

      console.log("ANALYTICS RESPONSE:", res.data);

      const analyticsData =
        res.data?.data || res.data;

      if (!analyticsData)
        throw new Error("Invalid analytics response");

      setAnalytics(analyticsData);

    } catch (err) {
      console.error("ANALYTICS ERROR:", err);
      toast.error("Failed to load analytics");
    } finally {
      isLoadingAnalytics = false;
    }
  };

  // 🔹 INIT + SIGNALR
  useEffect(() => {
    loadUsers();
    loadAnalytics();

    connection.off("ReceiveAdminUpdate");

    connection.on("ReceiveAdminUpdate", () => {
      console.log("🔄 Admin update received");
      loadUsers();
      loadAnalytics();
    });

    return () => {
      connection.off("ReceiveAdminUpdate");
    };
  }, []);

  // 🔥 BAN / UNBAN
  const handleToggleBan = async (userId, isBanned) => {
    try {
      if (isBanned) {
        await unbanUser(userId);
        toast.success("User unbanned");
      } else {
        await banUser(userId);
        toast.success("User banned");
      }

      loadUsers();
      loadAnalytics();

    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-6 p-4">

      {/* 🔹 STATS */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <StatCard title="Total Users" value={analytics.totalUsers} icon={<Users />} />
          <StatCard title="Active Users" value={analytics.activeUsers} icon={<Users />} />
          <StatCard title="Banned Users" value={analytics.bannedUsers} icon={<UserX />} />
          <StatCard title="Total Jobs" value={analytics.totalJobs} icon={<Briefcase />} />

        </div>
      )}

      {/* 🔹 PIE */}
      {analytics && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">User Distribution</h2>

          <PieChart
            dataSource={[
              { name: "Seekers", value: analytics.seekers },
              { name: "Providers", value: analytics.providers }
            ]}
          >
            <Series argumentField="name" valueField="value" />
            <Legend visible />
            <PieTooltip enabled />
          </PieChart>
        </div>
      )}

      {/* 🔹 LINE */}
      {analytics && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Jobs Over Time</h2>

          <Chart dataSource={analytics.jobsPerDay}>
            <ArgumentAxis argumentType="datetime" />
            <ValueAxis />

            <LineSeries
              valueField="count"
              argumentField="date"
              type="line"
            />
          </Chart>
        </div>
      )}

      {/* 🔹 USERS TABLE */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Users List</h2>

        <DataGrid dataSource={users} showBorders columnAutoWidth>

          <SearchPanel visible />
          <FilterRow visible />
          <Paging defaultPageSize={5} />

          <Column dataField="name" />
          <Column dataField="email" />
          <Column dataField="role" />

          <Column
            dataField="isBanned"
            caption="Status"
            cellRender={(data) => (
              <span className={data.value ? "text-red-500" : "text-green-500"}>
                {data.value ? "Banned" : "Active"}
              </span>
            )}
          />

          <Column
            caption="Action"
            cellRender={(data) => {
              const isBanned = data.data.isBanned;

              return (
                <button
                  onClick={() =>
                    handleToggleBan(data.data.id, isBanned)
                  }
                  className={`px-3 py-1 rounded text-white ${
                    isBanned ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {isBanned ? "Unban" : "Ban"}
                </button>
              );
            }}
          />

        </DataGrid>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="p-5 bg-white rounded-xl shadow flex items-center gap-4">
      <div className="text-blue-500">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-xl font-semibold">{value}</h3>
      </div>
    </div>
  );
}