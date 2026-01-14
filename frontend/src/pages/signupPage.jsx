import logo from "../assets/logo.png";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

export default function SignupPage() {
  return (
    <div className="w-full h-full bg-primary flex">
      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[500px] h-[750px] bg-[#fdfbf9] shadow-2xl rounded-3xl">
          <div className="w-full h-[120px] flex justify-center items-center pt-4">
            <img
              src={logo}
              alt="Logo"
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="text-secondary text-2xl font-bold text-center">
            Create Account
          </div>
          <div className="text-secondary text-sm text-center mt-2">
            Sign up to get started
          </div>

          <div className="flex justify-center mt-4">
            <button className="w-[400px] h-[40px] bg-white flex items-center border border-gray-300 justify-center text-secondary font-medium rounded-lg hover:bg-gray-50">
              <FcGoogle size={25} className="mr-2" /> Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center">
            <div className="w-[400px] h-[1px] bg-gray-300 my-6"></div>
          </div>

          <div className="text-secondary ml-[50px] text-sm font-medium">
            Full Name
          </div>
          <div className="flex-col text-sm">
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-[400px] h-[40px] border bg-white border-gray-300 rounded-lg p-2 mt-2 ml-[50px]"
            />
          </div>

          <div className="text-secondary ml-[50px] mt-3 text-sm font-medium">
            Email
          </div>
          <div className="flex-col text-sm">
            <input
              type="email"
              placeholder="you@example.com"
              className="w-[400px] h-[40px] border bg-white border-gray-300 rounded-lg p-2 mt-2 ml-[50px]"
            />
          </div>

          <div className="text-secondary ml-[50px] mt-3 text-sm font-medium">
            Password
          </div>
          <div className="flex-col text-sm">
            <input
              type="password"
              placeholder="Create a password"
              className="w-[400px] h-[40px] border bg-white border-gray-300 rounded-lg p-2 mt-2 ml-[50px]"
            />
          </div>

          <div className="text-secondary ml-[50px] mt-3 text-sm font-medium">
            Confirm Password
          </div>
          <div className="flex-col text-sm">
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-[400px] h-[40px] border bg-white border-gray-300 rounded-lg p-2 mt-2 ml-[50px]"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button className="w-[400px] h-[40px] bg-accent/95 flex items-center border border-gray-300 justify-center text-white font-medium rounded-lg hover:bg-accent">
              Sign Up
            </button>
          </div>

          <div className="flex justify-center mt-4">
            <p className="text-secondary text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-accent hover:underline cursor-pointer font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="w-[50%] h-full flex flex-col justify-center items-center">
        <div className="text-center px-16">
          <p className="text-accent text-base uppercase tracking-widest mb-4">
            Start Your Journey
          </p>
          <h1 className="text-8xl font-bold text-secondary leading-none tracking-tight">
            OU<span className="text-accent">Events</span>
          </h1>
          <div className="w-24 h-1.5 bg-accent mx-auto my-10 rounded-full"></div>
          <p className="text-3xl text-secondary/80 font-light">
            Be Part of Something{" "}
            <span className="text-accent font-medium italic">Amazing</span>
          </p>
          <div className="flex justify-center items-center gap-5 mt-10 text-secondary/60 text-base tracking-wide">
            <span>Discover</span>
            <span className="text-accent">•</span>
            <span>Engage</span>
            <span className="text-accent">•</span>
            <span>Experience</span>
          </div>
          <p className="text-secondary/50 mt-10 text-base max-w-sm mx-auto leading-relaxed">
            Join our community and never miss an event at the Open University of
            Sri Lanka
          </p>
        </div>
      </div>
    </div>
  );
}
