// src/pages/Register.tsx
import { FC } from "react";

const Register: FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden w-[900px] mt-2 mb-2">
        {/* Left Side */}
        <div className="flex flex-col items-center justify-center p-10 bg-green-100">
          <img
            src="/img/background-laptop.png"
            alt="Background-Laptop-Study"
            className="w-full max-w-[1200px] h-auto"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            LAPTOP-UTESHOP
          </h2>
          <p className="text-gray-600 text-center max-w-xs">
            Experience Performance and Reliability with LAPTOP-UTESHOP"
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-center p-6">
          {/* Tiêu đề ở giữa phía trên */}
          <h2 className="text-2xl font-bold mb-2 text-center text-gray-700">
            Laptop <span className="text-green-600">Store</span>
          </h2>

          {/* First name */}
          <label className="text-gray-700 text-sm mb-1">First name</label>
          <input
            type="text"
            placeholder="First name"
            className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {/* Last name */}
          <label className="text-gray-700 text-sm mb-1">Last name</label>
          <input
            type="text"
            placeholder="Last name"
            className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* Email */}
          <label className="text-gray-700 text-sm mb-1">Email</label>
          <input
            type="email"
            placeholder="email"
            className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {/* Phone Number */}
          <label className="text-gray-700 text-sm mb-1">Phone Number</label>
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* Password */}
          <label className="text-gray-700 text-sm mb-1">Password</label>
          <input
            type="password"
            placeholder="********"
            className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* Confirm Password */}
          <label className="text-gray-700 text-sm mb-1">Confirm Password</label>
          <input
            type="password"
            placeholder="********"
            className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          

          {/* Sign up button */}
          <button className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition mb-2">
            Create account
          </button>

          {/* Divider */}
          <div className="flex items-center mb-2">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-2 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <button className="flex items-center justify-center gap-2 border py-3 rounded-lg hover:bg-gray-100 transition">
            <img
              src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>

          {/* Link to Login */}
          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="#" className="text-green-600 font-medium hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
