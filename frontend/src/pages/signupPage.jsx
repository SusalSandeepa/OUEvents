import logo from "../assets/logo.png";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

export default function SignupPage() {
  return (
    <div className="flex w-full h-full bg-primary">
      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[500px] h-[750px] bg-[#fdfbf9] shadow-2xl rounded-3xl">
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
