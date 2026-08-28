import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children }) {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="loading-spinner" aria-label="Checking authentication">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
