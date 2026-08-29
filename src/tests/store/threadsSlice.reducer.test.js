/**
 * Unit tests for threadsSlice reducer functions.
 *
 * Skenario pengujian:
 * - setCategoryFilter: mengubah nilai categoryFilter di state
 * - optimisticUpVoteThread: menambahkan userId ke upVotesBy jika belum ada
 * - optimisticUpVoteThread (toggle): menghapus userId dari upVotesBy jika sudah ada
 * - optimisticUpVoteThread (swap down to up): menghapus dari downVotesBy saat up-vote
 * - optimisticDownVoteThread: menambahkan userId ke downVotesBy jika belum ada
 * - optimisticDownVoteThread (toggle): menghapus userId dari downVotesBy jika sudah ada
 * - optimisticDownVoteThread (swap up to down): menghapus dari upVotesBy saat down-vote
 * - fetchThreads.fulfilled: mengisi list dan users dari payload
 * - fetchThreads.pending: set isLoading true
 * - fetchThreads.rejected: set error dan isLoading false
 * - addThread.fulfilled: menambahkan thread baru di awal list
 */

import { describe, it, expect } from 'vitest';
import threadsReducer, {
  setCategoryFilter,
  optimisticUpVoteThread,
  optimisticDownVoteThread,
  fetchThreads, addThread,
} from '../../store/slices/threadsSlice';

const initialState = {
  list: [],
  users: [],
  categoryFilter: '',
  isLoading: false,
  error: null,
};

const makeThread = (overrides = {}) => ({
  id: 'thread-1',
  title: 'Test Thread',
  body: 'Body',
  category: 'react',
  createdAt: '2024-01-01T00:00:00.000Z',
  totalComments: 0,
  upVotesBy: [],
  downVotesBy: [],
  ownerId: 'user-1',
  ...overrides,
});

describe('threadsSlice reducer', () => {
  describe('setCategoryFilter', () => {
    it('should set categoryFilter when dispatched with a category string', () => {
      const nextState = threadsReducer(initialState, setCategoryFilter('react'));
      expect(nextState.categoryFilter).toBe('react');
    });

    it('should reset categoryFilter to empty string when dispatched with empty string', () => {
      const state = { ...initialState, categoryFilter: 'react' };
      const nextState = threadsReducer(state, setCategoryFilter(''));
      expect(nextState.categoryFilter).toBe('');
    });
  });

  describe('optimisticUpVoteThread', () => {
    it('should add userId to upVotesBy when user has not up-voted yet', () => {
      const thread = makeThread({ upVotesBy: [], downVotesBy: [] });
      const state = { ...initialState, list: [thread] };

      const nextState = threadsReducer(
        state,
        optimisticUpVoteThread({ threadId: 'thread-1', userId: 'user-1' }),
      );

      expect(nextState.list[0].upVotesBy).toContain('user-1');
    });

    it('should remove userId from upVotesBy when user has already up-voted (toggle off)', () => {
      const thread = makeThread({ upVotesBy: ['user-1'], downVotesBy: [] });
      const state = { ...initialState, list: [thread] };

      const nextState = threadsReducer(
        state,
        optimisticUpVoteThread({ threadId: 'thread-1', userId: 'user-1' }),
      );

      expect(nextState.list[0].upVotesBy).not.toContain('user-1');
    });

    it('should remove userId from downVotesBy when user switches from down to up vote', () => {
      const thread = makeThread({ upVotesBy: [], downVotesBy: ['user-1'] });
      const state = { ...initialState, list: [thread] };

      const nextState = threadsReducer(
        state,
        optimisticUpVoteThread({ threadId: 'thread-1', userId: 'user-1' }),
      );

      expect(nextState.list[0].downVotesBy).not.toContain('user-1');
      expect(nextState.list[0].upVotesBy).toContain('user-1');
    });

    it('should not change state when threadId does not exist', () => {
      const thread = makeThread({ upVotesBy: [], downVotesBy: [] });
      const state = { ...initialState, list: [thread] };

      const nextState = threadsReducer(
        state,
        optimisticUpVoteThread({ threadId: 'not-exist', userId: 'user-1' }),
      );

      expect(nextState.list[0].upVotesBy).toEqual([]);
    });
  });

  describe('optimisticDownVoteThread', () => {
    it('should add userId to downVotesBy when user has not down-voted yet', () => {
      const thread = makeThread({ upVotesBy: [], downVotesBy: [] });
      const state = { ...initialState, list: [thread] };

      const nextState = threadsReducer(
        state,
        optimisticDownVoteThread({ threadId: 'thread-1', userId: 'user-1' }),
      );

      expect(nextState.list[0].downVotesBy).toContain('user-1');
    });

    it('should remove userId from downVotesBy when user has already down-voted (toggle off)', () => {
      const thread = makeThread({ upVotesBy: [], downVotesBy: ['user-1'] });
      const state = { ...initialState, list: [thread] };

      const nextState = threadsReducer(
        state,
        optimisticDownVoteThread({ threadId: 'thread-1', userId: 'user-1' }),
      );

      expect(nextState.list[0].downVotesBy).not.toContain('user-1');
    });

    it('should remove userId from upVotesBy when user switches from up to down vote', () => {
      const thread = makeThread({ upVotesBy: ['user-1'], downVotesBy: [] });
      const state = { ...initialState, list: [thread] };

      const nextState = threadsReducer(
        state,
        optimisticDownVoteThread({ threadId: 'thread-1', userId: 'user-1' }),
      );

      expect(nextState.list[0].upVotesBy).not.toContain('user-1');
      expect(nextState.list[0].downVotesBy).toContain('user-1');
    });
  });

  describe('fetchThreads extraReducers', () => {
    it('should set isLoading true on fetchThreads.pending', () => {
      const action = { type: fetchThreads.pending.type };
      const nextState = threadsReducer(initialState, action);
      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it('should populate list and users on fetchThreads.fulfilled', () => {
      const threads = [makeThread()];
      const users = [{ id: 'user-1', name: 'Alice' }];
      const action = {
        type: fetchThreads.fulfilled.type,
        payload: { threads, users },
      };
      const nextState = threadsReducer({ ...initialState, isLoading: true }, action);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.list).toEqual(threads);
      expect(nextState.users).toEqual(users);
    });

    it('should set error on fetchThreads.rejected', () => {
      const action = {
        type: fetchThreads.rejected.type,
        payload: 'Network error',
      };
      const nextState = threadsReducer({ ...initialState, isLoading: true }, action);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe('Network error');
    });
  });

  describe('addThread extraReducers', () => {
    it('should prepend the new thread to the list on addThread.fulfilled', () => {
      const existingThread = makeThread({ id: 'thread-old' });
      const newThread = makeThread({ id: 'thread-new' });
      const state = { ...initialState, list: [existingThread] };
      const action = { type: addThread.fulfilled.type, payload: newThread };

      const nextState = threadsReducer(state, action);

      expect(nextState.list[0].id).toBe('thread-new');
      expect(nextState.list).toHaveLength(2);
    });
  });
});
