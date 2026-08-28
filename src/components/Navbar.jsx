import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import Avatar from './Avatar';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <Link to="/">💬 Forum Diskusi</Link>
      </div>
      <div className="navbar__links">
        <Link to="/">Threads</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </div>
      <div className="navbar__auth">
        {user ? (
          <>
            <div className="navbar__user">
              <Avatar src={user.avatar} name={user.name} size="sm" />
              <span className="navbar__username">{user.name}</span>
            </div>
            <button type="button" className="btn btn--outline" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn--outline">Login</Link>
            <Link to="/register" className="btn btn--primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
