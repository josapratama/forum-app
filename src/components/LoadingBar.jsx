import React from 'react';
import { useSelector } from 'react-redux';

function LoadingBar() {
  const isLoading = useSelector((state) => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <div className="loading-bar-container" aria-label="Loading" role="progressbar">
      <div className="loading-bar" />
    </div>
  );
}

export default LoadingBar;
