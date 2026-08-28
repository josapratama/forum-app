/**
 * Unit tests untuk thunk functions di authSlice.
 *
 * Skenario pengujian:
 * - loginUser: berhasil, simpan token dan set user dari profile
 * - loginUser: gagal, dispatch rejected dengan pesan error
 * - registerUser: berhasil, dispatch fulfilled
 * - registerUser: gagal, dispatch rejected dengan pesan error
 * - fetchOwnProfile: berhasil, set user dari payload
 * - fetchOwnProfile: gagal, set user menjadi null
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginUser, registerUser, fetchOwnProfile } from '../../store/slices/authSlice';
import api from '../../api';

vi.mock('../../api', () => ({
  default: {
    login: vi.fn(),
    register: vi.fn(),
    getOwnProfile: vi.fn(),
    putAccessToken: vi.fn(),
    removeAccessToken: vi.fn(),
  },
}));

const makeStore = () =>
  configureStore({
    reducer: { auth: authReducer },
  });

describe('authSlice thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should set user in state on successful login', async () => {
      const mockToken = 'mock-token-123';
      const mockUser = { id: 'user-1', name: 'Alice', email: 'alice@example.com' };
      api.login.mockResolvedValue(mockToken);
      api.putAccessToken.mockImplementation(() => {});
      api.getOwnProfile.mockResolvedValue(mockUser);

      const store = makeStore();
      await store.dispatch(loginUser({ email: 'alice@example.com', password: 'password123' }));

      const state = store.getState().auth;
      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
      expect(api.putAccessToken).toHaveBeenCalledWith(mockToken);
    });

    it('should set error in state on failed login', async () => {
      api.login.mockRejectedValue(new Error('Email or password is wrong'));

      const store = makeStore();
      await store.dispatch(loginUser({ email: 'wrong@example.com', password: 'wrong' }));

      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.error).toBe('Email or password is wrong');
      expect(state.isLoading).toBe(false);
    });

    it('should set isLoading true during login process', () => {
      api.login.mockImplementation(() => new Promise(() => {})); // never resolves

      const store = makeStore();
      store.dispatch(loginUser({ email: 'alice@example.com', password: 'password' }));

      const state = store.getState().auth;
      expect(state.isLoading).toBe(true);
    });
  });

  describe('registerUser', () => {
    it('should dispatch fulfilled and keep isLoading false on successful register', async () => {
      const mockUser = { id: 'user-new', name: 'Bob' };
      api.register.mockResolvedValue({ user: mockUser });

      const store = makeStore();
      const result = await store.dispatch(
        registerUser({ name: 'Bob', email: 'bob@example.com', password: 'password123' }),
      );

      expect(result.type).toBe(registerUser.fulfilled.type);
      expect(store.getState().auth.isLoading).toBe(false);
    });

    it('should set error in state on failed register', async () => {
      api.register.mockRejectedValue(new Error('Email already in use'));

      const store = makeStore();
      await store.dispatch(
        registerUser({ name: 'Bob', email: 'existing@example.com', password: 'pass' }),
      );

      const state = store.getState().auth;
      expect(state.error).toBe('Email already in use');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('fetchOwnProfile', () => {
    it('should set user in state on successful profile fetch', async () => {
      const mockUser = { id: 'user-1', name: 'Alice' };
      api.getOwnProfile.mockResolvedValue(mockUser);

      const store = makeStore();
      await store.dispatch(fetchOwnProfile());

      expect(store.getState().auth.user).toEqual(mockUser);
    });

    it('should set user to null on failed profile fetch', async () => {
      api.getOwnProfile.mockRejectedValue(new Error('Unauthorized'));

      const store = makeStore();
      await store.dispatch(fetchOwnProfile());

      expect(store.getState().auth.user).toBeNull();
    });

    it('should set isLoading true during fetch and false after', async () => {
      const mockUser = { id: 'user-1', name: 'Alice' };
      api.getOwnProfile.mockResolvedValue(mockUser);

      const store = makeStore();
      const promise = store.dispatch(fetchOwnProfile());

      expect(store.getState().auth.isLoading).toBe(true);
      await promise;
      expect(store.getState().auth.isLoading).toBe(false);
    });
  });
});
