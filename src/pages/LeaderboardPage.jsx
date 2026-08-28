import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../components/Avatar';
import { fetchLeaderboards } from '../store/slices/leaderboardSlice';
import { showLoading, hideLoading } from '../store/slices/loadingSlice';

function LeaderboardPage() {
  const dispatch = useDispatch();
  const { list, isLoading, error } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    const load = async () => {
      dispatch(showLoading());
      await dispatch(fetchLeaderboards());
      dispatch(hideLoading());
    };
    load();
  }, [dispatch]);

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  return (
    <div className="page-container page-container--narrow">
      <div className="page-header">
        <h1 className="page-title">🏆 Leaderboard</h1>
        <p className="page-subtitle">Pengguna paling aktif di forum</p>
      </div>

      {isLoading && (
        <div className="loading-spinner" aria-label="Loading leaderboard">
          <div className="spinner" />
        </div>
      )}

      {error && (
        <div className="alert alert--error">{error}</div>
      )}

      {!isLoading && list.length > 0 && (
        <div className="leaderboard">
          {list.map((item, index) => (
            <div
              key={item.user.id}
              className={`leaderboard-item ${index < 3 ? 'leaderboard-item--top' : ''}`}
            >
              <span className="leaderboard-item__rank">{getMedal(index)}</span>
              <div className="leaderboard-item__user">
                <Avatar src={item.user.avatar} name={item.user.name} size="md" />
                <span className="leaderboard-item__name">{item.user.name}</span>
              </div>
              <div className="leaderboard-item__score">
                <span className="leaderboard-item__score-value">{item.score}</span>
                <span className="leaderboard-item__score-label">poin</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LeaderboardPage;
