import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchLeaderboards = createAsyncThunk(
  'leaderboard/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const leaderboards = await api.getLeaderboards();
      return leaderboards;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchLeaderboards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default leaderboardSlice.reducer;
