import logo from "../assets/logo.png";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "api/users/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", response.data.token); // Store login token in local storage

      const user = response.data.user;
      if (user.role == "admin") {
        navigate("/admin");
      } else {
        navigate("/"); // navigate to homepage
      }
      toast.success("Login successful");
    } catch (err) {
      console.error("Login failed", err);
      toast.error("Login failed. Please check your credentials");
    }
  }

  return (
    <div className="w-full h-full bg-primary flex">
      <div className="w-[50%] h-full flex flex-col justify-center items-center">
        {/* Main content */}
        <div className="text-center px-16">
          {/* Welcome text */}
          <p className="text-accent text-base uppercase tracking-widest mb-4">
            Welcome to
          </p>

          {/* Brand name */}
          <h1 className="text-8xl font-bold text-secondary leading-none tracking-tight">
            OU<span className="text-accent">Events</span>
          </h1>

          {/* Simple decorative line */}
          <div className="w-24 h-1.5 bg-accent mx-auto my-10 rounded-full"></div>

          {/* Tagline */}
          <p className="text-3xl text-secondary/80 font-light">
            Where Moments Become{" "}
            <span className="text-accent font-medium italic">Memories</span>
          </p>

          {/* Elegant feature words */}
          <div className="flex justify-center items-center gap-5 mt-10 text-secondary/60 text-base tracking-wide">
            <span>Connect</span>
            <span className="text-accent">•</span>
            <span>Celebrate</span>
            <span className="text-accent">•</span>
            <span>Create</span>
          </div>

          {/* Description */}
          <p className="text-secondary/50 mt-10 text-base max-w-sm mx-auto leading-relaxed">
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
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="text-secondary text-2xl font-bold text-center">
            Welcome to OUEvents
          </div>
          <div className="text-secondary text-sm text-center mt-3">
            Sign in to continue
          </div>
          <div className="flex justify-center mt-6">
            <button className="w-[400px] h-[40px] bg-white flex items-center border border-gray-300 justify-center text-secondary font-medium rounded-lg hover:bg-gray-50">
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
          <div className="flex-col text-sm">
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              placeholder="you@example.com"
              className="w-[400px] h-[40px] border bg-white border-gray-300 rounded-lg p-2 mt-2 ml-[50px]"
            />
          </div>

          <div className="text-secondary ml-[50px] mt-4 text-sm font-medium">
            Password
          </div>
          <div className="flex-col text-sm">
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              placeholder="Enter your password"
              className="w-[400px] h-[40px] border bg-white border-gray-300 rounded-lg p-2 mt-2 ml-[50px]"
            />
          </div>

          <div className="flex items-center ml-[50px] mt-4">
            <div className="w-[50%] flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="w-4 h-4 accent-secondary cursor-pointer"
              />
              <label
                htmlFor="rememberMe"
                className="text-secondary text-sm ml-2 cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <div className="w-[50%] flex items-center justify-end text-sm mr-[50px] text-accent hover:underline cursor-pointer">
              Forgot Password?
            </div>
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
            <p className="text-secondary text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-accent hover:underline cursor-pointer font-medium"
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
