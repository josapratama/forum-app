/**
 * Unit tests untuk authSlice dan loadingSlice reducer.
 *
 * Skenario pengujian authSlice:
 * - logout: mengubah user menjadi null
 * - clearError: mengubah error menjadi null
 * - loginUser.pending: set isLoading true dan error null
 * - loginUser.fulfilled: set user dari payload dan isLoading false
 * - loginUser.rejected: set error dari payload dan isLoading false
 * - registerUser.pending: set isLoading true
 * - registerUser.fulfilled: set isLoading false
 * - registerUser.rejected: set error dari payload
 * - fetchOwnProfile.fulfilled: set user dari payload
 * - fetchOwnProfile.rejected: set user null
 *
 * Skenario pengujian loadingSlice:
 * - showLoading: set isLoading true
 * - hideLoading: set isLoading false
 */

import { describe, it, expect, vi } from 'vitest';
import authReducer, { logout, clearError } from '../../store/slices/authSlice';
import { loginUser, registerUser, fetchOwnProfile } from '../../store/slices/authSlice';
import loadingReducer, { showLoading, hideLoading } from '../../store/slices/loadingSlice';

// Mock api module agar removeAccessToken tidak melempar error
vi.mock('../../api', () => ({
  default: {
    removeAccessToken: vi.fn(),
    putAccessToken: vi.fn(),
    login: vi.fn(),
    getOwnProfile: vi.fn(),
    register: vi.fn(),
  },
}));

const authInitialState = {
  user: null,
  isLoading: false,
  error: null,
};

const loadingInitialState = {
  isLoading: false,
};

describe('authSlice reducer', () => {
  describe('logout', () => {
    it('should set user to null when logout is dispatched', () => {
      const state = { ...authInitialState, user: { id: 'user-1', name: 'Alice' } };
      const nextState = authReducer(state, logout());
      expect(nextState.user).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should set error to null when clearError is dispatched', () => {
      const state = { ...authInitialState, error: 'Some error' };
      const nextState = authReducer(state, clearError());
      expect(nextState.error).toBeNull();
    });
  });

  describe('loginUser extraReducers', () => {
    it('should set isLoading true and error null on loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const nextState = authReducer({ ...authInitialState, error: 'old error' }, action);
      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it('should set user and isLoading false on loginUser.fulfilled', () => {
      const user = { id: 'user-1', name: 'Alice' };
      const action = { type: loginUser.fulfilled.type, payload: user };
      const nextState = authReducer({ ...authInitialState, isLoading: true }, action);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.user).toEqual(user);
    });

    it('should set error and isLoading false on loginUser.rejected', () => {
      const action = { type: loginUser.rejected.type, payload: 'Invalid credentials' };
      const nextState = authReducer({ ...authInitialState, isLoading: true }, action);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe('Invalid credentials');
    });
  });

  describe('registerUser extraReducers', () => {
    it('should set isLoading true on registerUser.pending', () => {
      const action = { type: registerUser.pending.type };
      const nextState = authReducer(authInitialState, action);
      expect(nextState.isLoading).toBe(true);
    });

    it('should set isLoading false on registerUser.fulfilled', () => {
      const action = { type: registerUser.fulfilled.type, payload: {} };
      const nextState = authReducer({ ...authInitialState, isLoading: true }, action);
      expect(nextState.isLoading).toBe(false);
    });

    it('should set error on registerUser.rejected', () => {
      const action = { type: registerUser.rejected.type, payload: 'Email already taken' };
      const nextState = authReducer(authInitialState, action);
      expect(nextState.error).toBe('Email already taken');
    });
  });

  describe('fetchOwnProfile extraReducers', () => {
    it('should set user on fetchOwnProfile.fulfilled', () => {
      const user = { id: 'user-1', name: 'Alice' };
      const action = { type: fetchOwnProfile.fulfilled.type, payload: user };
      const nextState = authReducer(authInitialState, action);
      expect(nextState.user).toEqual(user);
    });

    it('should set user to null on fetchOwnProfile.rejected', () => {
      const state = { ...authInitialState, user: { id: 'user-1' } };
      const action = { type: fetchOwnProfile.rejected.type };
      const nextState = authReducer(state, action);
      expect(nextState.user).toBeNull();
    });
  });
});

describe('loadingSlice reducer', () => {
  it('should set isLoading to true when showLoading is dispatched', () => {
    const nextState = loadingReducer(loadingInitialState, showLoading());
    expect(nextState.isLoading).toBe(true);
  });

  it('should set isLoading to false when hideLoading is dispatched', () => {
    const state = { isLoading: true };
    const nextState = loadingReducer(state, hideLoading());
    expect(nextState.isLoading).toBe(false);
  });

  it('should return initial state when no action matches', () => {
    const nextState = loadingReducer(undefined, { type: '@@INIT' });
    expect(nextState).toEqual(loadingInitialState);
  });
});
