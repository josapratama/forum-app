import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchThreadDetail = createAsyncThunk(
  'threadDetail/fetch',
  async (threadId, { rejectWithValue }) => {
    try {
      const thread = await api.getThreadDetail(threadId);
      return thread;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addComment = createAsyncThunk(
  'threadDetail/addComment',
  async ({ threadId, content }, { rejectWithValue }) => {
    try {
      const comment = await api.createComment({ threadId, content });
      return comment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const upVoteThreadDetail = createAsyncThunk(
  'threadDetail/upVote',
  async ({ threadId, userId }, { rejectWithValue }) => {
    try {
      await api.upVoteThread(threadId);
      return { userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const downVoteThreadDetail = createAsyncThunk(
  'threadDetail/downVote',
  async ({ threadId, userId }, { rejectWithValue }) => {
    try {
      await api.downVoteThread(threadId);
      return { userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const neutralVoteThreadDetail = createAsyncThunk(
  'threadDetail/neutralVote',
  async ({ threadId, userId }, { rejectWithValue }) => {
    try {
      await api.neutralVoteThread(threadId);
      return { userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const upVoteComment = createAsyncThunk(
  'threadDetail/upVoteComment',
  async ({ threadId, commentId, userId }, { rejectWithValue }) => {
    try {
      await api.upVoteComment({ threadId, commentId });
      return { commentId, userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const downVoteComment = createAsyncThunk(
  'threadDetail/downVoteComment',
  async ({ threadId, commentId, userId }, { rejectWithValue }) => {
    try {
      await api.downVoteComment({ threadId, commentId });
      return { commentId, userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const neutralVoteComment = createAsyncThunk(
  'threadDetail/neutralVoteComment',
  async ({ threadId, commentId, userId }, { rejectWithValue }) => {
    try {
      await api.neutralVoteComment({ threadId, commentId });
      return { commentId, userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: {
    thread: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearThreadDetail: (state) => {
      state.thread = null;
      state.error = null;
    },
    // Optimistic thread vote
    optimisticUpVoteDetail: (state, action) => {
      if (!state.thread) return;
      const { userId } = action.payload;
      const alreadyUp = state.thread.upVotesBy.includes(userId);
      state.thread.downVotesBy = state.thread.downVotesBy.filter((id) => id !== userId);
      if (alreadyUp) {
        state.thread.upVotesBy = state.thread.upVotesBy.filter((id) => id !== userId);
      } else {
        state.thread.upVotesBy.push(userId);
      }
    },
    optimisticDownVoteDetail: (state, action) => {
      if (!state.thread) return;
      const { userId } = action.payload;
      const alreadyDown = state.thread.downVotesBy.includes(userId);
      state.thread.upVotesBy = state.thread.upVotesBy.filter((id) => id !== userId);
      if (alreadyDown) {
        state.thread.downVotesBy = state.thread.downVotesBy.filter((id) => id !== userId);
      } else {
        state.thread.downVotesBy.push(userId);
      }
    },
    // Optimistic comment vote
    optimisticUpVoteComment: (state, action) => {
      if (!state.thread) return;
      const { commentId, userId } = action.payload;
      const comment = state.thread.comments.find((c) => c.id === commentId);
      if (!comment) return;
      const alreadyUp = comment.upVotesBy.includes(userId);
      comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
      if (alreadyUp) {
        comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
      } else {
        comment.upVotesBy.push(userId);
      }
    },
    optimisticDownVoteComment: (state, action) => {
      if (!state.thread) return;
      const { commentId, userId } = action.payload;
      const comment = state.thread.comments.find((c) => c.id === commentId);
      if (!comment) return;
      const alreadyDown = comment.downVotesBy.includes(userId);
      comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
      if (alreadyDown) {
        comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
      } else {
        comment.downVotesBy.push(userId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreadDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.thread = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.thread = action.payload;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        if (state.thread) {
          state.thread.comments.push(action.payload);
        }
      });
  },
});

export const {
  clearThreadDetail,
  optimisticUpVoteDetail,
  optimisticDownVoteDetail,
  optimisticUpVoteComment,
  optimisticDownVoteComment,
} = threadDetailSlice.actions;

export default threadDetailSlice.reducer;
