import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
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
// Gửi OTP, server trả về message: string
export const sendOtp = createAsyncThunk<string, string>(
  "auth/sendOtp",
  async (email, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:8088/api/auth/forgot-password", { email });
      return res.data.message as string;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Send OTP failed");
    }
  }
);

// Verify OTP, server trả về resetToken: string
export const verifyOtp = createAsyncThunk<string, { email: string; otp: string }>(
  "auth/verifyOtp",
  async ({ email, otp }, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:8088/api/auth/forgot-password/verify-otp", {
        email,
        otp,
      });
      return res.data.resetToken as string;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Verify OTP failed");
    }
  }
);

// Reset password, server trả về message: string
export const resetPassword = createAsyncThunk<string, { resetToken: string; newPassword: string }>(
  "auth/resetPassword",
  async ({ resetToken, newPassword }, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:8088/api/auth/forgot-password/reset", {
        resetToken,
        newPassword,
      });
      return res.data.message as string;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Reset password failed");
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
      })
      .addCase(loginUser.rejected, (state, action) => {
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
