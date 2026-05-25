import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AuthState, AuthUser, LoginResponse } from './types';

const TOKEN_KEY = 'workshop_access_token';

function persistToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
}

function removeToken() {
  if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isHydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login success — persists token to localStorage
    setCredentials(state, action: PayloadAction<LoginResponse>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isHydrated = true;
      persistToken(action.payload.accessToken);
    },
    // Called after /auth/me succeeds on app load (token was valid)
    setAuthenticatedUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // Called once on app mount — restores token from localStorage (or null if missing)
    hydrateAuth(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
      state.isHydrated = true;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      removeToken();
    },
  },
});

export const { setCredentials, setAuthenticatedUser, hydrateAuth, logout } =
  authSlice.actions;
export default authSlice.reducer;
