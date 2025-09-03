import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Profile } from "../types/user";
import axios from "axios";

export interface User extends Profile {
  id: number;
  role: string;
}

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  pendingRegToken: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  pendingRegToken: null,
};

// Async thunk login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    try {
      const response = await axios.post("http://localhost:8088/api/login", {
        email,
        password,
      });
      return response.data; // { token, user }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    payload: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      password: string;
      confirmPassword: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await axios.post(
        "http://localhost:8088/api/register",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      // BE trả { message, regToken }
      return res.data as { message: string; regToken: string };
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Register failed";
      // In lỗi chi tiết ra console
      console.error("[registerUser] error:", msg, err?.response?.data || err);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const verifyRegisterOtp = createAsyncThunk(
  "auth/verifyRegisterOtp",
  async ({ regToken, otp }: { regToken: string; otp: Number }, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:8088/api/verify-otp", {
        regToken,
        otp,
      });
      return res.data as { message: string; user: any };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Verify OTP failed"
      );
    }
  }
);

export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (email: string, thunkAPI) => {
    try {
      const res = await axios.post(
        "http://localhost:8088/api/auth/forgot-password",
        { email }
      );
      return res.data.message;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Send OTP failed"
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }: { email: string; otp: string }, thunkAPI) => {
    try {
      const res = await axios.post(
        "http://localhost:8088/api/auth/forgot-password/verify-otp",
        {
          email,
          otp,
        }
      );
      return res.data.resetToken;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Verify OTP failed"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    { resetToken, newPassword }: { resetToken: string; newPassword: string },
    thunkAPI
  ) => {
    try {
      const res = await axios.post(
        "http://localhost:8088/api/auth/forgot-password/reset",
        {
          resetToken,
          newPassword,
        }
      );
      return res.data.message;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Reset password failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // REGISTER (send OTP)
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.pendingRegToken = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRegToken = action.payload.regToken; // lưu regToken để verify
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.pendingRegToken = null;
        // In lỗi ra console ở reducer (debug nhanh giao diện)
        console.error("[registerUser.rejected]:", action.payload);
      })

      // VERIFY OTP (register)
      .addCase(verifyRegisterOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyRegisterOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.pendingRegToken = null; 
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(verifyRegisterOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Thêm các case cho forgot password
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
