/**
 * Unit tests untuk threadDetailSlice reducer.
 *
 * Skenario pengujian:
 * - clearThreadDetail: mereset thread dan error menjadi null
 * - optimisticUpVoteDetail: menambah userId ke upVotesBy thread detail
 * - optimisticUpVoteDetail (toggle): menghapus userId jika sudah ada
 * - optimisticUpVoteDetail (swap): menghapus dari downVotesBy saat up-vote
 * - optimisticDownVoteDetail: menambah userId ke downVotesBy thread detail
 * - optimisticDownVoteDetail (toggle): menghapus userId jika sudah ada
 * - optimisticUpVoteComment: menambah userId ke upVotesBy comment
 * - optimisticUpVoteComment (toggle): menghapus userId dari upVotesBy comment jika sudah ada
 * - optimisticDownVoteComment: menambah userId ke downVotesBy comment
 * - optimisticDownVoteComment (swap): menghapus dari upVotesBy saat down-vote comment
 * - fetchThreadDetail.pending: set isLoading true dan thread null
 * - fetchThreadDetail.fulfilled: set thread dari payload
 * - fetchThreadDetail.rejected: set error dari payload
 * - addComment.fulfilled: menambahkan comment ke thread.comments
 */

import { describe, it, expect } from 'vitest';
import threadDetailReducer, {
  clearThreadDetail,
  optimisticUpVoteDetail,
  optimisticDownVoteDetail,
  optimisticUpVoteComment,
  optimisticDownVoteComment,
} from '../../store/slices/threadDetailSlice';
import { fetchThreadDetail, addComment } from '../../store/slices/threadDetailSlice';

const initialState = {
  thread: null,
  isLoading: false,
  error: null,
};

const makeComment = (overrides = {}) => ({
  id: 'comment-1',
  content: 'Test comment',
  upVotesBy: [],
  downVotesBy: [],
  owner: { id: 'user-1', name: 'Alice' },
  createdAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
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

describe('threadDetailSlice reducer', () => {
  describe('clearThreadDetail', () => {
    it('should reset thread and error to null', () => {
      const state = {
        thread: makeThread(),
        isLoading: false,
        error: 'Some error',
      };
      const nextState = threadDetailReducer(state, clearThreadDetail());
      expect(nextState.thread).toBeNull();
      expect(nextState.error).toBeNull();
    });
  });

  describe('optimisticUpVoteDetail', () => {
    it('should add userId to thread upVotesBy when not yet up-voted', () => {
      const state = { ...initialState, thread: makeThread() };
      const nextState = threadDetailReducer(state, optimisticUpVoteDetail({ userId: 'user-1' }));
      expect(nextState.thread.upVotesBy).toContain('user-1');
    });

    it('should remove userId from thread upVotesBy when already up-voted (toggle off)', () => {
      const state = { ...initialState, thread: makeThread({ upVotesBy: ['user-1'] }) };
      const nextState = threadDetailReducer(state, optimisticUpVoteDetail({ userId: 'user-1' }));
      expect(nextState.thread.upVotesBy).not.toContain('user-1');
    });

    it('should remove userId from downVotesBy when switching from down to up vote', () => {
      const state = {
        ...initialState,
        thread: makeThread({ upVotesBy: [], downVotesBy: ['user-1'] }),
      };
      const nextState = threadDetailReducer(state, optimisticUpVoteDetail({ userId: 'user-1' }));
      expect(nextState.thread.downVotesBy).not.toContain('user-1');
      expect(nextState.thread.upVotesBy).toContain('user-1');
    });

    it('should do nothing if thread is null', () => {
      const nextState = threadDetailReducer(initialState, optimisticUpVoteDetail({ userId: 'user-1' }));
      expect(nextState.thread).toBeNull();
    });
  });

  describe('optimisticDownVoteDetail', () => {
    it('should add userId to thread downVotesBy when not yet down-voted', () => {
      const state = { ...initialState, thread: makeThread() };
      const nextState = threadDetailReducer(state, optimisticDownVoteDetail({ userId: 'user-1' }));
      expect(nextState.thread.downVotesBy).toContain('user-1');
    });

    it('should remove userId from downVotesBy when already down-voted (toggle off)', () => {
      const state = { ...initialState, thread: makeThread({ downVotesBy: ['user-1'] }) };
      const nextState = threadDetailReducer(state, optimisticDownVoteDetail({ userId: 'user-1' }));
      expect(nextState.thread.downVotesBy).not.toContain('user-1');
    });

    it('should remove userId from upVotesBy when switching from up to down vote', () => {
      const state = {
        ...initialState,
        thread: makeThread({ upVotesBy: ['user-1'], downVotesBy: [] }),
      };
      const nextState = threadDetailReducer(state, optimisticDownVoteDetail({ userId: 'user-1' }));
      expect(nextState.thread.upVotesBy).not.toContain('user-1');
      expect(nextState.thread.downVotesBy).toContain('user-1');
    });
  });

  describe('optimisticUpVoteComment', () => {
    it('should add userId to comment upVotesBy when not yet up-voted', () => {
      const comment = makeComment();
      const state = { ...initialState, thread: makeThread({ comments: [comment] }) };

      const nextState = threadDetailReducer(
        state,
        optimisticUpVoteComment({ commentId: 'comment-1', userId: 'user-1' }),
      );

      expect(nextState.thread.comments[0].upVotesBy).toContain('user-1');
    });

    it('should remove userId from comment upVotesBy when already up-voted (toggle off)', () => {
      const comment = makeComment({ upVotesBy: ['user-1'] });
      const state = { ...initialState, thread: makeThread({ comments: [comment] }) };

      const nextState = threadDetailReducer(
        state,
        optimisticUpVoteComment({ commentId: 'comment-1', userId: 'user-1' }),
      );

      expect(nextState.thread.comments[0].upVotesBy).not.toContain('user-1');
    });

    it('should remove userId from comment downVotesBy when switching to up vote', () => {
      const comment = makeComment({ upVotesBy: [], downVotesBy: ['user-1'] });
      const state = { ...initialState, thread: makeThread({ comments: [comment] }) };

      const nextState = threadDetailReducer(
        state,
        optimisticUpVoteComment({ commentId: 'comment-1', userId: 'user-1' }),
      );

      expect(nextState.thread.comments[0].downVotesBy).not.toContain('user-1');
      expect(nextState.thread.comments[0].upVotesBy).toContain('user-1');
    });
  });

  describe('optimisticDownVoteComment', () => {
    it('should add userId to comment downVotesBy when not yet down-voted', () => {
      const comment = makeComment();
      const state = { ...initialState, thread: makeThread({ comments: [comment] }) };

      const nextState = threadDetailReducer(
        state,
        optimisticDownVoteComment({ commentId: 'comment-1', userId: 'user-1' }),
      );

      expect(nextState.thread.comments[0].downVotesBy).toContain('user-1');
    });

    it('should remove userId from comment upVotesBy when switching from up to down vote', () => {
      const comment = makeComment({ upVotesBy: ['user-1'], downVotesBy: [] });
      const state = { ...initialState, thread: makeThread({ comments: [comment] }) };

      const nextState = threadDetailReducer(
        state,
        optimisticDownVoteComment({ commentId: 'comment-1', userId: 'user-1' }),
      );

      expect(nextState.thread.comments[0].upVotesBy).not.toContain('user-1');
      expect(nextState.thread.comments[0].downVotesBy).toContain('user-1');
    });
  });

  describe('fetchThreadDetail extraReducers', () => {
    it('should set isLoading true and thread null on fetchThreadDetail.pending', () => {
      const state = { ...initialState, thread: makeThread() };
      const action = { type: fetchThreadDetail.pending.type };
      const nextState = threadDetailReducer(state, action);
      expect(nextState.isLoading).toBe(true);
      expect(nextState.thread).toBeNull();
    });

    it('should set thread on fetchThreadDetail.fulfilled', () => {
      const thread = makeThread();
      const action = { type: fetchThreadDetail.fulfilled.type, payload: thread };
      const nextState = threadDetailReducer({ ...initialState, isLoading: true }, action);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.thread).toEqual(thread);
    });

    it('should set error on fetchThreadDetail.rejected', () => {
      const action = { type: fetchThreadDetail.rejected.type, payload: 'Thread not found' };
      const nextState = threadDetailReducer({ ...initialState, isLoading: true }, action);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe('Thread not found');
    });
  });

  describe('addComment extraReducers', () => {
    it('should push new comment to thread.comments on addComment.fulfilled', () => {
      const thread = makeThread({ comments: [] });
      const newComment = makeComment({ id: 'comment-new' });
      const state = { ...initialState, thread };
      const action = { type: addComment.fulfilled.type, payload: newComment };

      const nextState = threadDetailReducer(state, action);

      expect(nextState.thread.comments).toHaveLength(1);
      expect(nextState.thread.comments[0].id).toBe('comment-new');
    });
  });
});
