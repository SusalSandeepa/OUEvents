import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { MdVerified, MdOutlineAdminPanelSettings } from "react-icons/md";
import {
  LuSearch,
  LuX,
  LuRefreshCw,
  LuUser,
  LuArrowUpDown,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";

function UserBlockConfirm(props) {
  const email = props.user.email;
  const close = props.close;
  const refresh = props.refresh;

  function blockUser() {
    const token = localStorage.getItem("token");
    axios
      .put(
        import.meta.env.VITE_API_URL + "api/users/block/" + email,
        {
          isBlock: !props.user.isBlock,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        console.log(response.data);
        close();
        toast.success("User block status changed successfully");
        refresh();
      })
      .catch(() => {
        toast.error("Failed to change user block status");
      });
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
      <div className="w-[400px] bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-secondary mb-2">
          {props.user.isBlock ? "Unblock User" : "Block User"}
        </h3>
        <p className="text-secondary/70 text-sm mb-6">
          Are you sure you want to {props.user.isBlock ? "unblock" : "block"}{" "}
          <strong>
            {props.user.firstName} {props.user.lastName}
          </strong>{" "}
          ({email})?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={close}
            className="px-4 py-2 text-sm font-medium text-secondary bg-secondary/10 hover:bg-secondary/20 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={blockUser}
            className="px-4 py-2 text-sm font-medium text-white bg-accent hover:opacity-90 rounded-lg"
          >
            {props.user.isBlock ? "Unblock" : "Block"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [isBlockConfirmVisible, setIsBlockConfirmVisible] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      const token = localStorage.getItem("token");
      if (token == null) {
        toast.error("Please login to access admin panel");
        navigate("/login");
        return;
      }
      axios
        .get(import.meta.env.VITE_API_URL + "api/users/all-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setUsers(response.data);
          setIsLoading(false);
        });
    }
  }, [isLoading]);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = users;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(query) ||
          user.lastName?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query),
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      let aValue, bValue;

      if (sortConfig.key === "name") {
        aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
        bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      } else if (sortConfig.key === "role") {
        // For role sorting: admin = 0, user = 1
        aValue = a.role === "admin" ? 0 : 1;
        bValue = b.role === "admin" ? 0 : 1;
        // direction "admin" means admins first, "user" means users first
        if (sortConfig.direction === "admin") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      }
      return 0;
    });

    return result;
  }, [users, searchQuery, sortConfig]);

  return (
    <div>
      {isBlockConfirmVisible && (
        <UserBlockConfirm
          refresh={() => setIsLoading(true)}
          user={userToBlock}
          close={() => setIsBlockConfirmVisible(false)}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl text-secondary font-bold">User Management</h2>
          <p className="text-gray-500 text-sm mt-1">
            Monitor and manage user accounts, roles, and access permissions.
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-[400px]">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <LuX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <LuArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={`${sortConfig.key}-${sortConfig.direction}`}
            onChange={(e) => {
              const [key, direction] = e.target.value.split("-");
              setSortConfig({ key, direction });
            }}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white min-w-[160px] appearance-none cursor-pointer"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="role-admin">Admins First</option>
            <option value="role-user">Users First</option>
          </select>
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => setIsLoading(true)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh users"
        >
          <LuRefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Results Count */}
      {!isLoading && (
        <div className="text-sm text-gray-500 mb-3">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      )}

      {/* Users Table */}
      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {searchQuery
            ? "No users match your search criteria."
            : "No users found."}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-secondary">
                  Image
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-secondary">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-secondary">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-secondary">
                  Role
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-secondary">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.email}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {user.image && user.image.startsWith("http") ? (
                      <img
                        src={user.image}
                        referrerPolicy="no-referrer"
                        alt={user.firstName}
                        className={`w-12 h-12 rounded-full object-cover border-2 ${
                          user.isBlock ? "border-red-400" : "border-green-400"
                        }`}
                      />
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-accent font-semibold border-2 bg-accent/10 ${
                          user.isBlock ? "border-red-400" : "border-green-400"
                        }`}
                      >
                        {user.firstName?.charAt(0)}
                        {user.lastName?.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-secondary">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      {user.email}
                      {user.isEmailVerified && (
                        <MdVerified className="text-blue-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role === "admin" ? (
                        <MdOutlineAdminPanelSettings />
                      ) : (
                        <LuUser className="w-3 h-3" />
                      )}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.isBlock
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.isBlock ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setUserToBlock(user);
                          setIsBlockConfirmVisible(true);
                        }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          user.isBlock
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {user.isBlock ? "Unblock" : "Block"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
