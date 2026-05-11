
import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../api/adminApi";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  // 🔥 pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers(page, pageSize);

      console.log("USERS PAGE:", res.data);

      const usersArray = res.data?.data;

      if (!usersArray) throw new Error("Invalid users response");

      const filtered = usersArray.filter(
        (u) => u.role !== "Admin"
      );

      setUsers(filtered);
      setTotal(res.data.total);

    } catch (err) {
      console.error("USERS ERROR:", err);
      toast.error("Failed to load users");
    }
  };

  // 🔥 fetch when page changes
  useEffect(() => {
    fetchUsers();
  }, [page, pageSize]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;

    try {
      await deleteUser(id);
      fetchUsers(); // 🔥 refresh current page
      toast.success("User deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // 🔥 calculate total pages
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">

      {/* 🔹 USERS */}
      {users.length === 0 ? (
        <p className="text-gray-500">No users found</p>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className="p-5 rounded-2xl bg-white shadow flex justify-between"
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
        ))
      )}

      {/* 🔹 PAGINATION */}
      <div className="flex justify-between items-center mt-6">

        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>

        {/* 🔹 PAGE SIZE */}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1); // reset
          }}
          className="ml-4 border p-1 rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>

      </div>
    </div>
  );
}