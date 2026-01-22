import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { LuSave, LuX, LuPencil, LuUser, LuUpload } from "react-icons/lu";
import { MdVerified, MdOutlineAdminPanelSettings } from "react-icons/md";
import mediaUpload from "../../utils/mediaUpload";

export default function MyProfile() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null); // can be File object or URL string

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "api/users/me",
        { headers: { Authorization: "Bearer " + token } },
      );
      const userData = response.data.user;
      setUser(userData);
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setImage(userData.image || null);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error("Failed to load profile");
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!lastName.trim()) {
      toast.error("Last name is required");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      // Upload image if it's a File, otherwise use existing URL
      let imageUrl = image;
      if (image instanceof File) {
        imageUrl = await mediaUpload(image);
      }

      const response = await axios.put(
        import.meta.env.VITE_API_URL + "api/users/profile",
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          image: imageUrl || "",
        },
        { headers: { Authorization: "Bearer " + token } },
      );

      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      setImage(response.data.user.image || null);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  }

  function handleCancel() {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setImage(user.image || null);
    setIsEditing(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Calculate values directly instead of using helper functions
  const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  const imageSrc = image instanceof File ? URL.createObjectURL(image) : image;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl text-secondary font-bold">My Profile</h2>
          <p className="text-gray-500 text-sm mt-1">
            View and manage your profile information.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-white font-medium bg-accent rounded-xl hover:opacity-90 transition-opacity"
          >
            <LuPencil className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-accent/80 to-accent"></div>

        <div className="px-8 pb-8">
          {/* Avatar section */}
          <div className="relative -mt-16 mb-6">
            <div className="relative inline-block">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg bg-white"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-accent/10 border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-4xl font-bold text-accent">
                    {initials}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                {user.role === "admin" ? (
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <MdOutlineAdminPanelSettings className="w-5 h-5 text-purple-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <LuUser className="w-4 h-4 text-blue-600" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* View Mode */}
          {!isEditing && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-secondary">
                  {user.firstName} {user.lastName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-gray-500">{user.email}</p>
                  {user.isEmailVerified && (
                    <MdVerified className="w-5 h-5 text-blue-500" />
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Role</p>
                <span
                  className={
                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full " +
                    (user.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700")
                  }
                >
                  {user.role === "admin" ? (
                    <MdOutlineAdminPanelSettings className="w-4 h-4" />
                  ) : (
                    <LuUser className="w-4 h-4" />
                  )}
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500 mb-1">First Name</p>
                  <p className="text-lg font-medium text-secondary">
                    {user.firstName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Name</p>
                  <p className="text-lg font-medium text-secondary">
                    {user.lastName}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Email Address</p>
                  <p className="text-lg font-medium text-secondary">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {isEditing && (
            <div className="space-y-6">
              <p className="text-gray-600 font-medium">
                Edit your profile information
              </p>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image
                </label>
                {!image ? (
                  <label className="flex flex-col items-center justify-center w-[250px] h-[250px] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-all">
                    <LuUpload className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      Click to upload profile image
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      PNG, JPG up to 5MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative w-[250px] h-[250px] border-2 border-gray-300 rounded-xl overflow-hidden">
                    <img
                      src={imageSrc}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Name Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2.5 text-white font-medium bg-accent rounded-xl hover:opacity-90 transition-opacity"
                >
                  <LuSave className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-2.5 text-secondary font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <LuX className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
