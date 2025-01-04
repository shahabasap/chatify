import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  name: string | null;
  id: string | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  name: null,
  id: null,
  token: null,
  isAuthenticated: false,
  loading: false,
};

const userDataSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<{ name: string | null, id: string | null, token: string | null }>) => {
      const { name, id, token } = action.payload;
      state.name = name;
      state.id = id;
      state.token = token;
      state.isAuthenticated = !!token;
    },
    clearUserData: (state) => {
      state.name = null;
      state.id = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const selectAuth = (state: { auth: AuthState }) => state.auth;

export const { setUserData, clearUserData, setLoading } = userDataSlice.actions;
export default userDataSlice.reducer;
