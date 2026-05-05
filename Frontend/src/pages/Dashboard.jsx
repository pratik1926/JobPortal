// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// import DashboardLayout from "../features/dashboard/DashboardLayout";
// import ProviderDashboard from "../features/dashboard/ProviderDashboard";
// import SeekerDashboard from "../features/dashboard/SeekerDashboard";

// export default function Dashboard() {
//   const { user } = useContext(AuthContext);

//   const role = user?.role;

//   console.log("User from context:", user);
//   console.log("Role:", role);

//   // 🔥 handle loading state
//   if (!user) {
//     return <h2>Loading...</h2>;
//   }

//   return (
//     <DashboardLayout>
//       {role === "Provider" && <ProviderDashboard />}
//       {role === "Seeker" && <SeekerDashboard />}

//       {/* fallback (important for debugging) */}
//       {!role && <h3>No role found</h3>}
//     </DashboardLayout>
//   );
// }

import ProviderDashboard from "../features/dashboard/ProviderDashboard";

export default function Dashboard(){
  return(
    <div>
    <h2>Dashboard</h2>
    <ProviderDashboard/>
    </div> );
  }
