import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import SidebarSkeleton from "../components/SidebarSkeleton.jsx";
import { Users } from "lucide-react";

const Sidebar = () => {
  // Extracting necessary state and actions from stores
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  // Local state for toggling online users filter
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // Fetch users when the component mounts
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filter users based on online status
  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  // Render loading skeleton if users are being fetched
  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header Section */}
      <div className="border-b border-base-300 w-full p-5">
        <HeaderSection
          showOnlineOnly={showOnlineOnly}
          setShowOnlineOnly={setShowOnlineOnly}
        //   onlineCount={onlineUsers.length - 1}
        />
      </div>

      {/* User List Section */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserItem
              key={user._id}
              user={user}
              isSelected={selectedUser?._id === user._id}
              isOnline={onlineUsers.includes(user._id)}
              onSelect={() => setSelectedUser(user)}
            />
          ))
        ) : (
          <NoUsersMessage />
        )}
      </div>
    </aside>
  );
};

// Header section with toggle for online-only filter
const HeaderSection = ({ showOnlineOnly, setShowOnlineOnly, onlineCount }) => (
  <div>
    <div className="flex items-center gap-2">
      <Users className="size-6" />
      <span className="font-medium hidden lg:block">Contacts</span>
    </div>

    <div className="mt-3 hidden lg:flex items-center gap-2">
      <label className="cursor-pointer flex items-center gap-2">
        <input
          type="checkbox"
          checked={showOnlineOnly}
          onChange={(e) => setShowOnlineOnly(e.target.checked)}
          className="checkbox checkbox-sm"
        />
        <span className="text-sm">Show online only</span>
      </label>
      <span className="text-xs text-zinc-500">({onlineCount} online)</span>
    </div>
  </div>
);

// Single user item
const UserItem = ({ user, isSelected, isOnline, onSelect }) => (
  <button
    onClick={onSelect}
    className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
      isSelected ? "bg-base-300 ring-1 ring-base-300" : ""
    }`}
  >
    <div className="relative mx-auto lg:mx-0">
      <img
        src={user.profilePic || "/avatar.png"}
        alt={user.name}
        className="size-12 object-cover rounded-full"
      />
      {isOnline && (
        <span
          className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"
        />
      )}
    </div>
    <div className="hidden lg:block text-left min-w-0">
      <div className="font-medium truncate">{user.fullName}</div>
      <div className="text-sm text-zinc-400">{isOnline ? "Online" : "Offline"}</div>
    </div>
  </button>
);

// Message when no users are available
const NoUsersMessage = () => (
  <div className="text-center text-zinc-500 py-4">No users found</div>
);

export default Sidebar;
