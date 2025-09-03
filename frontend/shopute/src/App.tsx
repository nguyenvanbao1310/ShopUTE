import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
// import ForgotPassword from "./pages/ForgotPassword";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOtp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/verify-otp" element={<VerifyOTP/>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
