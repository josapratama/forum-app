/**
 * Unit tests untuk thunk functions di threadsSlice.
 *
 * Skenario pengujian:
 * - fetchThreads: berhasil, dispatch fulfilled dengan threads dan users
 * - fetchThreads: gagal, dispatch rejected dengan pesan error
 * - addThread: berhasil, dispatch fulfilled dengan thread baru
 * - addThread: gagal, dispatch rejected dengan pesan error
 * - upVoteThread: berhasil, dispatch fulfilled dengan threadId dan userId
 * - downVoteThread: berhasil, dispatch fulfilled dengan threadId dan userId
 * - neutralVoteThread: berhasil, dispatch fulfilled dengan threadId dan userId
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import threadsReducer, {
  fetchThreads,
  addThread,
  upVoteThread,
  downVoteThread,
  neutralVoteThread,
} from '../../store/slices/threadsSlice';
import api from '../../api';

vi.mock('../../api', () => ({
  default: {
    getAllThreads: vi.fn(),
    getAllUsers: vi.fn(),
    createThread: vi.fn(),
    upVoteThread: vi.fn(),
    downVoteThread: vi.fn(),
    neutralVoteThread: vi.fn(),
  },
}));

const makeStore = () =>
  configureStore({
    reducer: { threads: threadsReducer },
  });

describe('threadsSlice thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchThreads', () => {
    it('should dispatch fulfilled with threads and users on success', async () => {
      const threads = [{ id: 'thread-1', title: 'Test' }];
      const users = [{ id: 'user-1', name: 'Alice' }];
      api.getAllThreads.mockResolvedValue(threads);
      api.getAllUsers.mockResolvedValue(users);

      const store = makeStore();
      await store.dispatch(fetchThreads());

      const state = store.getState().threads;
      expect(state.list).toEqual(threads);
      expect(state.users).toEqual(users);
      expect(state.isLoading).toBe(false);
    });

    it('should dispatch rejected with error message on failure', async () => {
      api.getAllThreads.mockRejectedValue(new Error('Network error'));
      api.getAllUsers.mockResolvedValue([]);

      const store = makeStore();
      await store.dispatch(fetchThreads());

      const state = store.getState().threads;
      expect(state.error).toBe('Network error');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('addThread', () => {
    it('should dispatch fulfilled and prepend new thread to list on success', async () => {
      const newThread = { id: 'thread-new', title: 'New Thread' };
      api.createThread.mockResolvedValue(newThread);

      const store = makeStore();
      await store.dispatch(addThread({ title: 'New Thread', body: 'body', category: 'react' }));

      const state = store.getState().threads;
      expect(state.list[0]).toEqual(newThread);
    });

    it('should dispatch rejected with error message on failure', async () => {
      api.createThread.mockRejectedValue(new Error('Unauthorized'));

      const store = makeStore();
      const result = await store.dispatch(addThread({ title: 'x', body: 'x', category: 'x' }));

      expect(result.type).toBe(addThread.rejected.type);
      expect(result.payload).toBe('Unauthorized');
    });
  });

  describe('upVoteThread', () => {
    it('should dispatch fulfilled with threadId and userId on success', async () => {
      api.upVoteThread.mockResolvedValue({});

      const store = makeStore();
      const result = await store.dispatch(
        upVoteThread({ threadId: 'thread-1', userId: 'user-1' }),
      );

      expect(result.type).toBe(upVoteThread.fulfilled.type);
      expect(result.payload).toEqual({ threadId: 'thread-1', userId: 'user-1' });
    });

    it('should dispatch rejected on API failure', async () => {
      api.upVoteThread.mockRejectedValue(new Error('Vote error'));

      const store = makeStore();
      const result = await store.dispatch(
        upVoteThread({ threadId: 'thread-1', userId: 'user-1' }),
      );

      expect(result.type).toBe(upVoteThread.rejected.type);
    });
  });

  describe('downVoteThread', () => {
    it('should dispatch fulfilled with threadId and userId on success', async () => {
      api.downVoteThread.mockResolvedValue({});

      const store = makeStore();
      const result = await store.dispatch(
        downVoteThread({ threadId: 'thread-1', userId: 'user-1' }),
      );

      expect(result.type).toBe(downVoteThread.fulfilled.type);
      expect(result.payload).toEqual({ threadId: 'thread-1', userId: 'user-1' });
    });
  });

  describe('neutralVoteThread', () => {
    it('should dispatch fulfilled with threadId and userId on success', async () => {
      api.neutralVoteThread.mockResolvedValue({});

      const store = makeStore();
      const result = await store.dispatch(
        neutralVoteThread({ threadId: 'thread-1', userId: 'user-1' }),
      );

      expect(result.type).toBe(neutralVoteThread.fulfilled.type);
      expect(result.payload).toEqual({ threadId: 'thread-1', userId: 'user-1' });
    });
  });
});
