import React from "react";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
// import ForgotPassword from "./pages/ForgotPassword";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOtp";
import CategoryPage from "./components/home/CategoryPage";
import ProductDetail from "./components/home/ProductDetail";
import AccountLayout from "./pages/account/AccountLayout";
import Profile from "./pages/account/Profile";
import Address from "./pages/account/Address";
import ChangePassword from "./pages/account/ChangePassword";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        <Route path="/" element={<Home />} />
         <Route path="/account" element={<AccountLayout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="address" element={<Address />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/home" element={<Home />} />
        <Route path="/categories/:categoryId" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
