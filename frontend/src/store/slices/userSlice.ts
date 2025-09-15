import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService, User, ApiError } from "../../services/api";

interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const users = await apiService.getUsers();
      return users;
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to fetch users";
      return rejectWithValue(message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId: string, { rejectWithValue }) => {
    try {
      const user = await apiService.getUserById(userId);
      return user;
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to fetch user";
      return rejectWithValue(message);
    }
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
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
      role?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const user = await apiService.createUser(userData);
      return user;
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to create user";
      return rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (
    { userId, userData }: { userId: string; userData: Partial<User> },
    { rejectWithValue }
  ) => {
    try {
      const user = await apiService.updateUser(userId, userData);
      return user;
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to update user";
      return rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      await apiService.deleteUser(userId);
      return userId;
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to delete user";
      return rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedUser } = userSlice.actions;
export default userSlice.reducer;
