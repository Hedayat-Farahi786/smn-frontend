import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService, User, ApiError } from "../../services/api";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.login(credentials);
      localStorage.setItem("token", response.token);
      return response;
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Login failed";
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: {
      username: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      title?: string;
      address?: string;
      address2?: string;
      city?: string;
      country?: string;
      zipcode?: string;
      phone?: string;
      isCompany?: boolean;
      company?: string;
      vatNumber?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.register(userData);
      localStorage.setItem("token", response.token);
      return response;
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Registration failed";
      return rejectWithValue(message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      // apiService may be mocked locally; this call will either return a
      // User or throw an ApiError if unauthenticated.
      const user = await apiService.getCurrentUser();
      return user;
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to get user";
      return rejectWithValue(message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    profileData: {
      firstName?: string;
      lastName?: string;
      username?: string;
      title?: string;
      address?: string;
      address2?: string;
      city?: string;
      country?: string;
      zipcode?: string;
      phone?: string;
      isCompany?: boolean;
      company?: string;
      vatNumber?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.updateProfile(profileData);
      return response.user;
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Profile update failed";
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.token = null;
        localStorage.removeItem("token");
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
