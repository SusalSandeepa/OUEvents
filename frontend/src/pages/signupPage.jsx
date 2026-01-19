import logo from "../assets/logo.png";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error states for inline validation
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  async function register() {
    // Clear previous errors
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    // Password validation: at least 1 digit, 1 lowercase, 1 uppercase, and 8+ characters
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Use 8+ characters with uppercase, lowercase & a number",
      );
      hasError = true;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }

    if (hasError) return;

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "api/users/",
        {
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: password,
        },
      );
      toast.success("Your registration is successful, Please login");
      navigate("/login");
    } catch (error) {
      console.log(error);
      // Check if email already exists (409 status)
      if (error.response && error.response.status === 409) {
        setEmailError("This email already exists, please login");
      } else {
        toast.error("Failed to create account");
      }
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
  let passwordIcon;
  if (showPassword) {
    passwordIcon = <FiEyeOff size={20} />;
  } else {
    passwordIcon = <FiEye size={20} />;
  }

  let confirmPasswordIcon;
  if (showConfirmPassword) {
    confirmPasswordIcon = <FiEyeOff size={20} />;
  } else {
    confirmPasswordIcon = <FiEye size={20} />;
  }

  return (
    <div className="flex w-full h-full bg-primary">
      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[500px]  bg-[#fdfbf9] shadow-2xl rounded-3xl">
          <div className="w-full h-[120px] flex justify-center items-center pt-4">
            <img
              src={logo}
              alt="Logo"
              className="object-contain w-auto h-full"
            />
          </div>
          <div className="text-2xl font-bold text-center text-secondary">
            Create Account
          </div>
          <div className="mt-2 text-sm text-center text-secondary">
            Sign up to get started
          </div>

          <div className="flex gap-4 ml-[50px] mt-6">
            <div className="flex-col text-sm">
              <div className="text-secondary text-sm font-medium">
                First Name
              </div>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                autoComplete="given-name"
                className="w-[192px] h-[40px] border bg-white border-gray-300 rounded-lg p-2 mt-2"
              />
            </div>
            <div className="flex-col text-sm">
              <div className="text-secondary text-sm font-medium">
                Last Name
              </div>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                autoComplete="family-name"
                className="w-[192px] h-[40px] border bg-white border-gray-300 rounded-lg p-2 mt-2"
              />
            </div>
          </div>

          <div className="text-secondary ml-[50px] mt-3 text-sm font-medium">
            Email
          </div>
          <div className="flex-col text-sm">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              placeholder="you@example.com"
              autoComplete="email"
              className={`w-[400px] h-[40px] border bg-white rounded-lg p-2 mt-2 ml-[50px] ${emailError ? "border-red-500" : "border-gray-300"}`}
            />
            {emailError && (
              <p className="text-red-500 text-xs ml-[50px] mt-1">
                {emailError}
              </p>
            )}
          </div>

          <div className="text-secondary ml-[50px] mt-3 text-sm font-medium">
            Password
          </div>
          <div className="flex-col text-sm">
            <div className="relative w-[400px] ml-[50px] mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder="Create a password"
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
              <p className="text-red-500 text-xs ml-[50px] mt-1">
                {passwordError}
              </p>
            )}
          </div>

          <div className="text-secondary ml-[50px] mt-3 text-sm font-medium">
            Confirm Password
          </div>
          <div className="flex-col text-sm">
            <div className="relative w-[400px] ml-[50px] mt-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError("");
                }}
                placeholder="Confirm your password"
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
              <p className="text-red-500 text-xs ml-[50px] mt-1">
                {confirmPasswordError}
              </p>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={register}
              className="w-[400px] h-[40px] bg-accent/95 flex items-center border border-gray-300 justify-center text-white font-medium rounded-lg hover:bg-accent"
            >
              Sign Up
            </button>
          </div>

          <div className="flex justify-center mt-4 mb-6">
            <p className="text-sm text-secondary">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium cursor-pointer text-accent hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="w-[50%] h-full flex flex-col justify-center items-center">
        <div className="px-16 text-center">
          <p className="mb-4 text-base tracking-widest uppercase text-accent">
            Start Your Journey
          </p>
          <h1 className="font-bold leading-none tracking-tight text-8xl text-secondary">
            <Link to="/" aria-label="Go to home">
              OU
            </Link>
            <span className="text-accent">Events</span>
          </h1>
          <div className="w-24 h-1.5 bg-accent mx-auto my-10 rounded-full"></div>
          <p className="text-3xl font-light text-secondary/80">
            Be Part of Something{" "}
            <span className="italic font-medium text-accent">Amazing</span>
          </p>
          <div className="flex items-center justify-center gap-5 mt-10 text-base tracking-wide text-secondary/60">
            <span>Discover</span>
            <span className="text-accent">•</span>
            <span>Engage</span>
            <span className="text-accent">•</span>
            <span>Experience</span>
          </div>
          <p className="max-w-sm mx-auto mt-10 text-base leading-relaxed text-secondary/50">
            Join our community and never miss an event at the Open University of
            Sri Lanka
          </p>
        </div>
      </div>
    </div>
  );
}
