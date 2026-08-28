import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ThreadCard from '../components/ThreadCard';
import CategoryFilter from '../components/CategoryFilter';
import { fetchThreads } from '../store/slices/threadsSlice';
import { showLoading, hideLoading } from '../store/slices/loadingSlice';

function HomePage() {
  const dispatch = useDispatch();
  const {
    list: threads,
    users,
    categoryFilter,
    isLoading,
  } = useSelector((state) => state.threads);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const load = async () => {
      dispatch(showLoading());
      await dispatch(fetchThreads());
      dispatch(hideLoading());
    };
    load();
  }, [dispatch]);

  const categories = useMemo(() => {
    const cats = threads.map((t) => t.category).filter(Boolean);
    return [...new Set(cats)];
  }, [threads]);

  const filteredThreads = useMemo(() => {
    if (!categoryFilter) return threads;
    return threads.filter((t) => t.category === categoryFilter);
  }, [threads, categoryFilter]);

  const getUserById = (ownerId) => users.find((u) => u.id === ownerId) || null;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Forum Diskusi</h1>
        {user && (
          <Link to="/create" className="btn btn--primary">
            + Buat Thread
          </Link>
        )}
      </div>

      <CategoryFilter categories={categories} />

      {isLoading && (
        <div className="loading-spinner" aria-label="Loading threads">
          <div className="spinner" />
        </div>
      )}

      {!isLoading && filteredThreads.length === 0 && (
        <div className="empty-state">
          <p>Belum ada thread. Jadilah yang pertama membuat diskusi!</p>
        </div>
      )}

      <div className="threads-list">
        {filteredThreads.map((thread) => (
          <ThreadCard
            key={thread.id}
            thread={thread}
            owner={getUserById(thread.ownerId)}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
