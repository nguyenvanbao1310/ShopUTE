// src/pages/Login.tsx
import { FC } from "react";

const Login: FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden w-[900px]">
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
            Experience Performance and Reliability with LAPTOP-UTESHOP
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-center p-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
            Laptop <span className="text-green-600">Store</span>
          </h2>

          {/* Username */}
          <label className="text-gray-700 text-sm mb-1">Email</label>
          <input
            type="text"
            placeholder="email"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* Password */}
          <label className="text-gray-700 text-sm mb-1">Password</label>
          <input
            type="password"
            placeholder="********"
            className="w-full p-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <a href="#" className="text-sm text-green-600 mb-6 hover:underline">
            Forgot password?
          </a>

          {/* Sign in button */}
          <button className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition mb-4">
            Sign in
          </button>

          {/* Divider */}
          <div className="flex items-center mb-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-2 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Google Sign in */}
          <button className="flex items-center justify-center gap-2 border py-3 rounded-lg hover:bg-gray-100 transition">
            <img
              src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>

          {/* Register */}
          <p className="text-sm text-center text-gray-600 mt-6">
            Are you new?{" "}
            <a href="#" className="text-green-600 font-medium hover:underline">
              Create an Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
