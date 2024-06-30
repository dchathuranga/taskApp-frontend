import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api, { ApiResponse } from '../../api/apiService';
import { clearToken, setToken } from '../../utils/tokenUtils';
import { AxiosResponse } from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  status: {
    loading: boolean;
    message: string;
  }
  isAuthenticated: boolean;
  user: User;
}

const initialState: AuthState = {
  status: {
    loading: false,
    message: '',
  },
  isAuthenticated: false,
  user: {
    id: '',
    name: '',
    email: '',
  },
};

export interface ISignUpData {
  username: string;
  email: string;
  password: string;
}

export interface ISignUpResponse {
  _id: string;
  username: string;
  email: string;
  token: string;
}

export const signUp = createAsyncThunk<
  ISignUpResponse,
  ISignUpData,
  {
    rejectValue: string;
  }
>(
  'auth/signUp',
  async (data: ISignUpData, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<ApiResponse<ISignUpResponse>> = await api.post('auth/register', data);
      setToken(response.data.data.token);
      return response.data.data;
    } catch (error) {
      clearToken();
      return rejectWithValue('Failed to sign up');
    }
  }
);

export interface ISignInData {
  email: string;
  password: string;
}

export interface ISignInResponse {
  _id: string;
  username: string;
  email: string;
  token: string;
}

export const signIn = createAsyncThunk<
  ISignInResponse,
  ISignInData,
  {
    rejectValue: string;
  }
>(
  'auth/signIn',
  async (data: ISignInData, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<ApiResponse<ISignInResponse>> = await api.post('auth/login', data);
      setToken(response.data.data.token);
      return response.data.data;
    } catch (error) {
      clearToken();
      return rejectWithValue('Failed to sign in');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = {
        id: '',
        name: '',
        email: '',
      };
      clearToken();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUp.pending, (state) => {
      state.status.loading = true;
    });
    builder.addCase(signUp.fulfilled, (state, action: PayloadAction<ISignUpResponse>) => {
      const { _id, username, email } = action.payload;
      state.status.loading = false;
      state.user = {
        id: _id,
        name: username,
        email,
      };
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.status.loading = false;
      state.status.message = 'login failed'; 
    });
    builder.addCase(signIn.pending, (state) => {
      state.status.loading = true;
    });
    builder.addCase(signIn.fulfilled, (state, action: PayloadAction<ISignInResponse>) => {
      const { _id, username, email } = action.payload;
      state.status.loading = false;
      state.user = {
        id: _id,
        name: username,
        email,
      };
      state.isAuthenticated = true;
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.status.loading = false;
      state.status.message = 'Signin failed';
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
