import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import logo from "../assets/logo.png";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // set first step as email
  const [step, setStep] = useState("email");

  // email state
  const [email, setEmail] = useState("");

  // otp state
  const [otp, setOtp] = useState("");

  // password state
  const [newPassword, setNewPassword] = useState("");

  // confirm password state
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Error states for inline validation
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // send OTP function
  async function sendOTP() {
    // Clear previous email error
    setEmailError("");

    // Check for empty email
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      await axios.get(
        import.meta.env.VITE_API_URL + "api/users/send-otp/" + email,
      );
      toast.success("OTP sent to " + email);
      setStep("otp");
      return;
    } catch (err) {
      // Check if the error is a 404 (email not found in database)
      if (err.response && err.response.status === 404) {
        toast.error("Email not found. Please register first.");
        navigate("/register");
        return;
      }
      toast.error("Failed to send OTP");
      return;
    }
  }

  async function changePasswordViaOTP() {
    // Clear previous errors
    setPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    // Password validation: at least 1 digit, 1 lowercase, 1 uppercase, and 8+ characters
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        "Use 8+ characters with uppercase, lowercase & a number",
      );
      hasError = true;
    }

    if (newPassword !== confirmNewPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }

    if (hasError) return;

    try {
      await axios.post(
        import.meta.env.VITE_API_URL + "api/users/change-password",
        {
          email: email,
          otp: otp,
          newPassword: newPassword,
        },
      );
      toast.success("Password changed successfully");
      navigate("/login");
      return;
    } catch (err) {
      toast.error("OTP verification failed");
      return;
    }
  }

  // Toggle functions
  function togglePassword() {
    setShowPassword(!showPassword);
  }

  function toggleConfirmPassword() {
    setShowConfirmPassword(!showConfirmPassword);
  }

  // Choose which icon to display
  let passwordIcon = showPassword ? (
    <FiEyeOff size={20} />
  ) : (
    <FiEye size={20} />
  );
  let confirmPasswordIcon = showConfirmPassword ? (
    <FiEyeOff size={20} />
  ) : (
    <FiEye size={20} />
  );

  return (
    <div className="flex w-full h-full bg-primary">
      {/* Left Side - Decorative (hidden on mobile) */}
      <div className="hidden lg:flex w-[50%] h-full flex-col justify-center items-center">
        <div className="px-16 text-center">
          <p className="mb-4 text-base tracking-widest uppercase text-accent">
            Account Recovery
          </p>
          <h1 className="font-bold leading-none tracking-tight text-8xl text-secondary">
            <Link to="/" aria-label="Go to home">
              OU
            </Link>
            <span className="text-accent">Events</span>
          </h1>
          <div className="w-24 h-1.5 bg-accent mx-auto my-10 rounded-full"></div>
          <p className="text-3xl font-light text-secondary/80">
            We've Got Your{" "}
            <span className="italic font-medium text-accent">Back</span>
          </p>
          <div className="flex items-center justify-center gap-5 mt-10 text-base tracking-wide text-secondary/60">
            <span>Secure</span>
            <span className="text-accent">•</span>
            <span>Simple</span>
            <span className="text-accent">•</span>
            <span>Swift</span>
          </div>
          <p className="max-w-sm mx-auto mt-10 text-base leading-relaxed text-secondary/50">
            Reset your password in just a few simple steps
          </p>
        </div>
      </div>

      {/* Right Side - Form (full width on mobile) */}
      {step == "email" && (
        <div className="w-full lg:w-[50%] h-full flex justify-center items-center p-4 lg:p-0">
          <div className="w-full max-w-[500px] bg-[#fdfbf9] shadow-2xl rounded-3xl py-10">
            <div className="w-full h-[100px] lg:h-[120px] flex justify-center items-center">
              <img
                src={logo}
                alt="Logo"
                className="object-contain w-auto h-full"
              />
            </div>
            <div className="text-xl lg:text-2xl font-bold text-center text-secondary">
              Forgot Password?
            </div>
            <div className="mt-2 text-sm text-center text-secondary px-4">
              Don't worry, we'll help you reset it
            </div>

            <div className="text-secondary px-6 lg:px-0 lg:ml-[50px] mt-8 text-sm font-medium">
              Email Address
            </div>
            <div className="flex-col text-sm px-6 lg:px-0">
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={`w-full max-w-[400px] h-[40px] border bg-white rounded-lg p-2 mt-2 lg:ml-[50px] ${emailError ? "border-red-500" : "border-gray-300"}`}
              />
              {emailError && (
                <p className="text-red-500 text-xs lg:ml-[50px] mt-1">
                  {emailError}
                </p>
              )}
            </div>

            <div className="flex justify-center mt-8 px-6 lg:px-0">
              <button
                onClick={sendOTP}
                className="w-full max-w-[400px] h-[40px] bg-accent/95 flex items-center border border-gray-300 justify-center text-white font-medium rounded-lg hover:bg-accent transition-colors"
              >
                Send Verification Code
              </button>
            </div>

            <div className="flex justify-center mt-6 mb-4">
              <p className="text-sm text-secondary">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-medium cursor-pointer text-accent hover:underline"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {step == "otp" && (
        <div className="w-full lg:w-[50%] h-full flex justify-center items-center p-4 lg:p-0 overflow-y-auto">
          <div className="w-full max-w-[500px] bg-[#fdfbf9] shadow-2xl rounded-3xl py-10 my-4">
            <div className="w-full h-[100px] lg:h-[120px] flex justify-center items-center">
              <img
                src={logo}
                alt="Logo"
                className="object-contain w-auto h-full"
              />
            </div>
            <div className="text-xl lg:text-2xl font-bold text-center text-secondary">
              Reset Your Password
            </div>
            <div className="mt-2 text-sm text-center text-secondary px-4">
              Enter the OTP sent to{" "}
              <span className="font-medium text-accent">{email}</span>
            </div>

            <div className="text-secondary px-6 lg:px-0 lg:ml-[50px] mt-6 text-sm font-medium">
              Verification Code (OTP)
            </div>
            <div className="flex-col text-sm px-6 lg:px-0">
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="text"
                placeholder="Enter 5-digit OTP"
                className="w-full max-w-[400px] h-[40px] border bg-white border-gray-300 rounded-lg p-2 mt-2 lg:ml-[50px] tracking-widest text-center font-semibold"
              />
            </div>

            <div className="text-secondary px-6 lg:px-0 lg:ml-[50px] mt-4 text-sm font-medium">
              New Password
            </div>
            <div className="flex-col text-sm px-6 lg:px-0">
              <div className="relative w-full max-w-[400px] lg:ml-[50px] mt-2">
                <input
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError("");
                  }}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a new password"
                  className={`w-full h-[40px] border bg-white rounded-lg p-2 pr-10 ${passwordError ? "border-red-500" : "border-gray-300"}`}
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {passwordIcon}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs lg:ml-[50px] mt-1">
                  {passwordError}
                </p>
              )}
            </div>

            <div className="text-secondary px-6 lg:px-0 lg:ml-[50px] mt-4 text-sm font-medium">
              Confirm New Password
            </div>
            <div className="flex-col text-sm px-6 lg:px-0">
              <div className="relative w-full max-w-[400px] lg:ml-[50px] mt-2">
                <input
                  value={confirmNewPassword}
                  onChange={(e) => {
                    setConfirmNewPassword(e.target.value);
                    setConfirmPasswordError("");
                  }}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  className={`w-full h-[40px] border bg-white rounded-lg p-2 pr-10 ${confirmPasswordError ? "border-red-500" : "border-gray-300"}`}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {confirmPasswordIcon}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="text-red-500 text-xs lg:ml-[50px] mt-1">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            <div className="flex justify-center mt-8 px-6 lg:px-0">
              <button
                onClick={changePasswordViaOTP}
                className="w-full max-w-[400px] h-[40px] bg-accent/95 flex items-center border border-gray-300 justify-center text-white font-medium rounded-lg hover:bg-accent transition-colors"
              >
                Reset Password
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={() => setStep("email")}
                className="text-sm text-secondary hover:text-accent cursor-pointer"
              >
                ← Back to email step
              </button>
            </div>

            <div className="flex justify-center mt-4 mb-4">
              <p className="text-sm text-secondary">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-medium cursor-pointer text-accent hover:underline"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
