import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { LuLock, LuEye, LuEyeOff, LuSave, LuShieldCheck } from "react-icons/lu";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validate new password on change
  function validateNewPassword(value) {
    setNewPassword(value);

    if (value === currentPassword && value !== "") {
      setNewPasswordError(
        "New password cannot be the same as current password",
      );
      return;
    }

    // Regex: 1 lowercase, 1 uppercase, 1 number, min 8 chars
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (value && !passwordRegex.test(value)) {
      setNewPasswordError(
        "Min 8 characters with 1 uppercase, 1 lowercase, and 1 number",
      );
      return;
    }

    setNewPasswordError("");
  }

  // Validate confirm password on change
  function validateConfirmPassword(value) {
    setConfirmPassword(value);

    if (value && value !== newPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  }

  // Handle form submit
  async function handleChangePassword() {
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (newPasswordError || confirmPasswordError) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.put(
        import.meta.env.VITE_API_URL + "api/users/change-password",
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
        },
        { headers: { Authorization: "Bearer " + token } },
      );

      toast.success("Password changed successfully");

      // Clear all fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setNewPasswordError("");
      setConfirmPasswordError("");
    } catch (error) {
      console.error("Failed to change password:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to change password");
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl text-secondary font-bold">Settings</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage your account settings and security preferences.
          </p>
        </div>
      </div>

      {/* Settings Card - Full Width */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="h-32 bg-gradient-to-r from-accent/80 to-accent flex items-center px-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
              <LuShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white">
                Security Settings
              </h3>
              <p className="text-white/80 text-sm mt-1">
                Keep your account secure and protected
              </p>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-8">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <LuLock className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-secondary">
                Change Password
              </h4>
              <p className="text-sm text-gray-500 mt-0.5">
                Update your account password for better security
              </p>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Password Fields */}
            <div className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <LuEyeOff className="w-5 h-5" />
                    ) : (
                      <LuEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => validateNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className={
                      "w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 " +
                      (newPasswordError
                        ? "border-red-400 focus:border-red-400"
                        : "border-gray-200 focus:border-accent")
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <LuEyeOff className="w-5 h-5" />
                    ) : (
                      <LuEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {/* Show error or hint */}
                {newPasswordError ? (
                  <p className="text-xs text-red-500 mt-1.5">
                    {newPasswordError}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1.5">
                    Min 8 characters with 1 uppercase, 1 lowercase, and 1 number
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => validateConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className={
                      "w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 " +
                      (confirmPasswordError
                        ? "border-red-400 focus:border-red-400"
                        : "border-gray-200 focus:border-accent")
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <LuEyeOff className="w-5 h-5" />
                    ) : (
                      <LuEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p className="text-xs text-red-500 mt-1.5">
                    {confirmPasswordError}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={handleChangePassword}
                  className="flex items-center gap-2 px-6 py-2.5 text-white font-medium bg-accent rounded-xl hover:opacity-90 transition-opacity"
                >
                  <LuSave className="w-4 h-4" />
                  Update Password
                </button>
              </div>
            </div>

            {/* Right Column - Tips */}
            <div className="bg-accent/5 rounded-xl p-6 border border-accent/10">
              <div className="flex items-center gap-2 mb-4">
                <LuShieldCheck className="w-5 h-5 text-accent" />
                <h5 className="text-lg font-semibold text-secondary">
                  Password Tips
                </h5>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  Use at least 8 characters
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  Include uppercase and lowercase letters
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  Add at least one number
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  Avoid using personal information
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">
                    5
                  </span>
                  Don't reuse passwords
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
