import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchThreads = createAsyncThunk(
  'threads/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const [threads, users] = await Promise.all([
        api.getAllThreads(),
        api.getAllUsers(),
      ]);
      return { threads, users };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addThread = createAsyncThunk(
  'threads/add',
  async (threadData, { rejectWithValue }) => {
    try {
      const thread = await api.createThread(threadData);
      return thread;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const upVoteThread = createAsyncThunk(
  'threads/upVote',
  async ({ threadId, userId }, { rejectWithValue }) => {
    try {
      await api.upVoteThread(threadId);
      return { threadId, userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const downVoteThread = createAsyncThunk(
  'threads/downVote',
  async ({ threadId, userId }, { rejectWithValue }) => {
    try {
      await api.downVoteThread(threadId);
      return { threadId, userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const neutralVoteThread = createAsyncThunk(
  'threads/neutralVote',
  async ({ threadId, userId }, { rejectWithValue }) => {
    try {
      await api.neutralVoteThread(threadId);
      return { threadId, userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    list: [],
    users: [],
    categoryFilter: '',
    isLoading: false,
    error: null,
  },
  reducers: {
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
    },
    // Optimistic up-vote
    optimisticUpVoteThread: (state, action) => {
      const { threadId, userId } = action.payload;
      const thread = state.list.find((t) => t.id === threadId);
      if (!thread) return;
      const alreadyUp = thread.upVotesBy.includes(userId);
      thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
      if (alreadyUp) {
        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
      } else {
        thread.upVotesBy.push(userId);
      }
    },
    // Optimistic down-vote
    optimisticDownVoteThread: (state, action) => {
      const { threadId, userId } = action.payload;
      const thread = state.list.find((t) => t.id === threadId);
      if (!thread) return;
      const alreadyDown = thread.downVotesBy.includes(userId);
      thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
      if (alreadyDown) {
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
      } else {
        thread.downVotesBy.push(userId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.threads;
        state.users = action.payload.users;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addThread.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      });
  },
});

export const {
  setCategoryFilter,
  optimisticUpVoteThread,
  optimisticDownVoteThread,
} = threadsSlice.actions;

export default threadsSlice.reducer;
