import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../api/adminApi";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data.filter(u => u.role !== "Admin"));
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;

    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
      toast.success("User deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="p-5 rounded-2xl bg-white dark:bg-slate-800 shadow flex justify-between"
        >
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-slate-500">{user.email}</p>
            <span className="text-xs">{user.role}</span>
          </div>

          <button
            onClick={() => handleDelete(user.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 />
          </button>
        </div>
      ))}
    </div>
  );
}