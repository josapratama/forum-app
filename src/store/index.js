import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import threadsReducer from './slices/threadsSlice';
import threadDetailReducer from './slices/threadDetailSlice';
import leaderboardReducer from './slices/leaderboardSlice';
import loadingReducer from './slices/loadingSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
    leaderboard: leaderboardReducer,
    loading: loadingReducer,
  },
});

export default store;
