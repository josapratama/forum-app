/**
 * Unit tests untuk thunk functions di threadDetailSlice.
 *
 * Skenario pengujian:
 * - fetchThreadDetail: berhasil, set thread di state
 * - fetchThreadDetail: gagal, set error di state
 * - addComment: berhasil, comment ditambahkan ke thread.comments
 * - addComment: gagal, dispatch rejected dengan pesan error
 * - upVoteThreadDetail: berhasil, dispatch fulfilled dengan userId
 * - downVoteThreadDetail: berhasil, dispatch fulfilled dengan userId
 * - neutralVoteThreadDetail: berhasil, dispatch fulfilled dengan userId
 * - upVoteComment: berhasil, dispatch fulfilled dengan commentId dan userId
 * - downVoteComment: berhasil, dispatch fulfilled dengan commentId dan userId
 * - neutralVoteComment: berhasil, dispatch fulfilled dengan commentId dan userId
 */

import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import threadDetailReducer, {
  fetchThreadDetail,
  addComment,
  upVoteThreadDetail,
  downVoteThreadDetail,
  neutralVoteThreadDetail,
  upVoteComment,
  downVoteComment,
  neutralVoteComment,
} from '../../store/slices/threadDetailSlice';
import api from '../../api';

vi.mock('../../api', () => ({
  default: {
    getThreadDetail: vi.fn(),
    createComment: vi.fn(),
    upVoteThread: vi.fn(),
    downVoteThread: vi.fn(),
    neutralVoteThread: vi.fn(),
    upVoteComment: vi.fn(),
    downVoteComment: vi.fn(),
    neutralVoteComment: vi.fn(),
  },
}));

const makeStore = () => configureStore({
  reducer: { threadDetail: threadDetailReducer },
});

const makeThread = (overrides = {}) => ({
  id: 'thread-1',
  title: 'Test',
  body: 'Body',
  upVotesBy: [],
  downVotesBy: [],
  comments: [],
  ...overrides,
});

describe('threadDetailSlice thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchThreadDetail', () => {
    it('should set thread in state on successful fetch', async () => {
      const thread = makeThread();
      api.getThreadDetail.mockResolvedValue(thread);

      const store = makeStore();
      await store.dispatch(fetchThreadDetail('thread-1'));

      expect(store.getState().threadDetail.thread).toEqual(thread);
      expect(store.getState().threadDetail.isLoading).toBe(false);
    });

    it('should set error in state on failed fetch', async () => {
      api.getThreadDetail.mockRejectedValue(new Error('Thread not found'));

      const store = makeStore();
      await store.dispatch(fetchThreadDetail('thread-xxx'));

      expect(store.getState().threadDetail.error).toBe('Thread not found');
      expect(store.getState().threadDetail.thread).toBeNull();
    });

    it('should set isLoading true during fetch', () => {
      api.getThreadDetail.mockImplementation(() => new Promise(() => {}));

      const store = makeStore();
      store.dispatch(fetchThreadDetail('thread-1'));

      expect(store.getState().threadDetail.isLoading).toBe(true);
    });
  });

  describe('addComment', () => {
    it('should add new comment to thread.comments on success', async () => {
      const thread = makeThread({ comments: [] });
      const newComment = { id: 'comment-new', content: 'Hello' };
      api.createComment.mockResolvedValue(newComment);

      const store = makeStore();
      // Seed thread via fulfilled action
      store.dispatch({ type: fetchThreadDetail.fulfilled.type, payload: thread });
      await store.dispatch(addComment({ threadId: 'thread-1', content: 'Hello' }));

      const { comments } = store.getState().threadDetail.thread;
      expect(comments).toHaveLength(1);
      expect(comments[0]).toEqual(newComment);
    });

    it('should dispatch rejected on addComment failure', async () => {
      api.createComment.mockRejectedValue(new Error('Unauthorized'));

      const store = makeStore();
      const result = await store.dispatch(addComment({ threadId: 'thread-1', content: 'Hi' }));

      expect(result.type).toBe(addComment.rejected.type);
      expect(result.payload).toBe('Unauthorized');
    });
  });

  describe('upVoteThreadDetail', () => {
    it('should dispatch fulfilled with userId on success', async () => {
      api.upVoteThread.mockResolvedValue({});

      const store = makeStore();
      const result = await store.dispatch(
        upVoteThreadDetail({ threadId: 'thread-1', userId: 'user-1' }),
      );

      expect(result.type).toBe(upVoteThreadDetail.fulfilled.type);
      expect(result.payload).toEqual({ userId: 'user-1' });
    });
  });

  describe('downVoteThreadDetail', () => {
    it('should dispatch fulfilled with userId on success', async () => {
      api.downVoteThread.mockResolvedValue({});

      const store = makeStore();
      const result = await store.dispatch(
        downVoteThreadDetail({ threadId: 'thread-1', userId: 'user-1' }),
      );

      expect(result.type).toBe(downVoteThreadDetail.fulfilled.type);
      expect(result.payload).toEqual({ userId: 'user-1' });
    });
  });

  describe('neutralVoteThreadDetail', () => {
    it('should dispatch fulfilled with userId on success', async () => {
      api.neutralVoteThread.mockResolvedValue({});

      const store = makeStore();
      const result = await store.dispatch(
        neutralVoteThreadDetail({ threadId: 'thread-1', userId: 'user-1' }),
      );

      expect(result.type).toBe(neutralVoteThreadDetail.fulfilled.type);
      expect(result.payload).toEqual({ userId: 'user-1' });
    });

    it('should dispatch rejected on neutralVoteThreadDetail failure', async () => {
      api.neutralVoteThread.mockRejectedValue(new Error('Server error'));

      const store = makeStore();
      const result = await store.dispatch(
        neutralVoteThreadDetail({ threadId: 'thread-1', userId: 'user-1' }),
      );

      expect(result.type).toBe(neutralVoteThreadDetail.rejected.type);
    });
  });

  describe('upVoteComment', () => {
    it('should dispatch fulfilled with commentId and userId on success', async () => {
      api.upVoteComment.mockResolvedValue({});

      const store = makeStore();
      const result = await store.dispatch(
        upVoteComment({ threadId: 'thread-1', commentId: 'comment-1', userId: 'user-1' }),
      );

      expect(result.type).toBe(upVoteComment.fulfilled.type);
      expect(result.payload).toEqual({ commentId: 'comment-1', userId: 'user-1' });
    });
  });

  describe('downVoteComment', () => {
    it('should dispatch fulfilled with commentId and userId on success', async () => {
      api.downVoteComment.mockResolvedValue({});

      const store = makeStore();
      const result = await store.dispatch(
        downVoteComment({ threadId: 'thread-1', commentId: 'comment-1', userId: 'user-1' }),
      );

      expect(result.type).toBe(downVoteComment.fulfilled.type);
      expect(result.payload).toEqual({ commentId: 'comment-1', userId: 'user-1' });
    });
  });

  describe('neutralVoteComment', () => {
    it('should dispatch fulfilled with commentId and userId on success', async () => {
      api.neutralVoteComment.mockResolvedValue({});

      const store = makeStore();
      const result = await store.dispatch(
        neutralVoteComment({ threadId: 'thread-1', commentId: 'comment-1', userId: 'user-1' }),
      );

      expect(result.type).toBe(neutralVoteComment.fulfilled.type);
      expect(result.payload).toEqual({ commentId: 'comment-1', userId: 'user-1' });
    });
  });
});
