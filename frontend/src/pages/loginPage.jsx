import logo from "../assets/logo.png";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const navigate = useNavigate();
  // to get user data from google and send to backend
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      axios
        .post(import.meta.env.VITE_API_URL + "api/users/google-login", {
          token: tokenResponse.access_token,
        })
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          const user = response.data.user;
          if (user.role == "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
          toast.success("Login successful");
        })
        .catch((error) => {
          console.error("Login failed", error);
          toast.error("Login failed. Please check your credentials");
        });
    },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSavedCredentials, setShowSavedCredentials] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");
  const [savedPassword, setSavedPassword] = useState("");

  // When page loads, check if credentials were saved (but don't fill yet)
  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    const storedPassword = localStorage.getItem("rememberedPassword");
    if (storedEmail && storedPassword) {
      setSavedEmail(storedEmail);
      setSavedPassword(storedPassword);
    }
  }, []);

  // Function to fill saved credentials when dropdown is clicked
  function fillSavedCredentials() {
    setEmail(savedEmail);
    setPassword(savedPassword);
    setRememberMe(true);
    setShowSavedCredentials(false);
  }

  // Toggle function
  function togglePassword() {
    setShowPassword(!showPassword);
  }

  // Choose which icon to display
  let passwordIcon;
  if (showPassword) {
    passwordIcon = <FiEyeOff size={20} />;
  } else {
    passwordIcon = <FiEye size={20} />;
  }

  async function login() {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "api/users/login",
        {
          email,
          password,
        },
      );
      localStorage.setItem("token", response.data.token);

      // If remember me is checked, save email and password. Otherwise, remove them.
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      const user = response.data.user;

      if (user.isBlock == true) {
        toast.error("Your account has been blocked");
        return;
      }

      if (user.role == "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      toast.success("Login successful");
    } catch (err) {
      console.error("Login failed", err);
      toast.error("Login failed. Please check your credentials");
    }
  }

  return (
    <div className="flex w-full h-full bg-primary">
      <div className="w-[50%] h-full flex flex-col justify-center items-center">
        {/* Main content */}
        <div className="px-16 text-center">
          {/* Welcome text */}
          <p className="mb-4 text-base tracking-widest uppercase text-accent">
            Welcome to
          </p>

          {/* Brand name */}
          <h1 className="font-bold leading-none tracking-tight text-8xl text-secondary">
            OU
            <span className="text-accent">
              <Link to="/" aria-label="Go to home">
                Events
              </Link>
            </span>
          </h1>

          {/* Simple decorative line */}
          <div className="w-24 h-1.5 bg-accent mx-auto my-10 rounded-full"></div>

          {/* Tagline */}
          <p className="text-3xl font-light text-secondary/80">
            Where Moments Become{" "}
            <span className="italic font-medium text-accent">Memories</span>
          </p>

          {/* Elegant feature words */}
          <div className="flex items-center justify-center gap-5 mt-10 text-base tracking-wide text-secondary/60">
            <span>Connect</span>
            <span className="text-accent">•</span>
            <span>Celebrate</span>
            <span className="text-accent">•</span>
            <span>Create</span>
          </div>

          {/* Description */}
          <p className="max-w-sm mx-auto mt-10 text-base leading-relaxed text-secondary/50">
            Your gateway to extraordinary events at the Open University of Sri
            Lanka
          </p>
        </div>
      </div>
      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[500px] h-[700px] bg-[#fdfbf9] shadow-2xl rounded-3xl ">
          <div className="w-full h-[150px] flex justify-center items-center pt-4">
            <img
              src={logo}
              alt="Logo"
              className="object-contain w-auto h-full"
            />
          </div>
          <div className="text-2xl font-bold text-center text-secondary">
            Welcome to OUEvents
          </div>
          <div className="mt-3 text-sm text-center text-secondary">
            Sign in to continue
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={googleLogin}
              className="w-[400px] h-[40px] bg-white flex items-center border border-gray-300 justify-center text-secondary font-medium rounded-lg hover:bg-gray-50"
            >
              <FcGoogle size={25} className="mr-2" /> Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center">
            <div className="w-[400px] h-[1px] bg-gray-300 my-8"></div>
          </div>

          <div className="text-secondary ml-[50px] text-sm font-medium">
            Email
          </div>
          <div className="flex-col text-sm relative">
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              onFocus={() => {
                if (savedEmail) setShowSavedCredentials(true);
              }}
              onBlur={() => {
                setTimeout(() => setShowSavedCredentials(false), 200);
              }}
              type="email"
              placeholder="you@example.com"
              autoComplete="off"
              className="w-[400px] h-[40px] border bg-white border-gray-300 rounded-lg p-2 mt-2 ml-[50px]"
            />
            {/* Dropdown showing saved email */}
            {showSavedCredentials && (
              <div
                onClick={fillSavedCredentials}
                className="absolute left-[50px] top-[50px] w-[400px] bg-secondary border border-gray-300 rounded-lg shadow-lg p-2 cursor-pointer hover:bg-gray-600 z-10"
              >
                <span className="text-sm text-white m-1">
                  Saved credentials:
                </span>
                <span className="text-sm font-medium text-white">
                  {savedEmail}
                </span>
              </div>
            )}
          </div>

          <div className="text-secondary ml-[50px] mt-4 text-sm font-medium">
            Password
          </div>
          <div className="flex-col text-sm">
            <div className="relative w-[400px] ml-[50px] mt-2">
              <input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full h-[40px] border bg-white border-gray-300 rounded-lg p-2 pr-10"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {passwordIcon}
              </button>
            </div>
          </div>

          <div className="flex items-center ml-[50px] mt-4">
            <div className="w-[50%] flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="w-4 h-4 cursor-pointer accent-secondary"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm cursor-pointer text-secondary"
              >
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="w-[50%] flex items-center justify-end text-sm mr-[50px] text-accent hover:underline cursor-pointer"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={login}
              className="w-[400px] h-[40px] bg-accent/95 flex items-center border border-gray-300 justify-center text-white font-medium rounded-lg hover:bg-accent"
            >
              Sign In
            </button>
          </div>
          <div className="flex justify-center mt-6">
            <p className="text-sm text-secondary">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium cursor-pointer text-accent hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
