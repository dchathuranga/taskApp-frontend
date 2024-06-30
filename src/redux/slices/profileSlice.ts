import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ProfileState {
  username: string;
  email: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProfileState = {
  username: '',
  email: '',
  status: 'idle',
  error: null,
};

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (userId: string) => {
  const response = await axios.get(`/api/profile/${userId}`);
  return response.data;
});

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData: { userId: string; username: string; email: string }) => {
    const response = await axios.put(`/api/profile/${profileData.userId}`, {
      username: profileData.username,
      email: profileData.email,
    });
    return response.data;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<{ username: string; email: string }>) => {
        state.status = 'succeeded';
        state.username = action.payload.username;
        state.email = action.payload.email;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Could not fetch profile';
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<{ username: string; email: string }>) => {
        state.status = 'succeeded';
        state.username = action.payload.username;
        state.email = action.payload.email;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Could not update profile';
      });
  },
});

export default profileSlice.reducer;
