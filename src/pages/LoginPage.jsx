import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/authSlice';
import { showLoading, hideLoading } from '../store/slices/loadingSlice';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  useEffect(
    () => () => {
      dispatch(clearError());
    },
    [dispatch],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(showLoading());
    await dispatch(loginUser({ email, password }));
    dispatch(hideLoading());
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-card__title">Masuk ke Forum</h1>
        <p className="auth-card__subtitle">Selamat datang kembali!</p>

        {error && (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="login-email" className="form-label">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@email.com"
              required
            />
          </div>
          <div className="form-group">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="login-password" className="form-label">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={isLoading}
          >
            {isLoading ? 'Memuat...' : 'Masuk'}
          </button>
        </form>

        <p className="auth-card__footer">
          Belum punya akun?
          {' '}
          <Link to="/register">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
