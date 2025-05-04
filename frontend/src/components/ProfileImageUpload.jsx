import React, { useRef, useState } from "react";
import { X, Edit, User, Save } from "lucide-react";

export default function ProfileModal({ open, onClose }) {
  const fileInputRef = useRef();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [avatar, setAvatar] = useState(user.profilePic || "");
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    // Upload to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "event_images");

    //apni cloudinary wali api se fetch karna hai
    const res = await fetch("https://api.cloudinary.com/v1_1/dlxr0tmaf/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setAvatar(data.secure_url);
    setUploading(false);
  };

  const handleUpdate = () => {
    // Update user info in localStorage stored
    user.name = name;
    user.email = email;
    user.profilePic = avatar;
    localStorage.setItem("user", JSON.stringify(user));
    

    
    setIsEditing(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-neutral-900 rounded-xl p-8 w-full max-w-md border border-neutral-800 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {avatar ? (
              <img
                src={avatar}
                alt={user.name || "User"}
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-600 shadow"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center border-4 border-purple-600">
                <User size={48} className="text-gray-400" />
              </div>
            )}
            <button
              className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow"
              onClick={handleEditClick}
              disabled={uploading}
              title="Change photo"
            >
              <Edit size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          
          {isEditing ? (
            <div className="w-full space-y-3">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700"
                />
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white">{user.name || "User"}</h2>
              <p className="text-gray-400">{user.email || "No email provided"}</p>
            </>
          )}
          
          {uploading && <p className="text-purple-400 text-sm">Uploading...</p>}
          
          <div className="flex gap-3 mt-2">
            {isEditing ? (
              <button
                onClick={handleUpdate}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Save size={16} />
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Edit size={16} />
                Update Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
