import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Plus, Terminal, User } from "lucide-react";
import CreateEventDialog from "../pages/createEvent";
import ProfileModal from "./ProfileImageUpload";

export default function Navbar() {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isProfileOpen]);

  useEffect(() => {
    if (isCreateEventOpen || showProfileModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isCreateEventOpen, showProfileModal]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black text-white">
      <div className="flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Terminal className="h-6 w-6" />
          <span className="text-3xl font-bold">TechMeet</span>
        </Link>

        <nav className="absolute left-1/2 -translate-x-1/2">
          <div className="flex space-x-8">
            <Link
              to="/"
              className={`font-medium transition text-2xl ${
                isActive("/") ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Explore
            </Link>
            <Link
              to="/my-events"
              className={`text-2xl font-medium transition ${
                isActive("/my-events") ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              My Events
            </Link>
          </div>
        </nav>
      
        <div className="flex items-center space-x-4 ">
          <button
            onClick={() => setIsCreateEventOpen(true)}
            className="flex items-center gap-1 rounded-md bg-white px-5 py-2.5 text-lg font-medium text-black hover:bg-gray-100"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </button>
          <div className="relative" ref={profileRef}>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 overflow-hidden"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              aria-label="User menu"
            >
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-white" />
              )}
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md bg-white text-black shadow-lg">
                <div className="p-3">
                  <p className="font-medium">{user.name || "User"}</p>
                  <p className="text-xs text-gray-500">{user.email || "user@example.com"}</p>
                </div>
                <hr className="my-1" />
                <Link
                  to="#"
                  onClick={() => {
                    setIsProfileOpen(false);
                    setShowProfileModal(true);
                  }}
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Profile
                </Link>
                <hr className="my-1" />
                <button
                  onClick={handleSignOut}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <CreateEventDialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen} />
      <ProfileModal open={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </header>
  );
}
