import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/slices/authSlice';
import { showLoading, hideLoading } from '../store/slices/loadingSlice';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(
    () => () => {
      dispatch(clearError());
    },
    [dispatch],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(showLoading());
    const result = await dispatch(registerUser({ name, email, password }));
    dispatch(hideLoading());
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/login');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-card__title">Daftar Akun</h1>
        <p className="auth-card__subtitle">Bergabung dengan komunitas kami!</p>

        {error && (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="reg-name" className="form-label">
              Nama
            </label>
            <input
              id="reg-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap kamu"
              required
            />
          </div>
          <div className="form-group">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="reg-email" className="form-label">
              Email
            </label>
            <input
              id="reg-email"
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
            <label htmlFor="reg-password" className="form-label">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              minLength={6}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={isLoading}
          >
            {isLoading ? 'Memuat...' : 'Daftar'}
          </button>
        </form>

        <p className="auth-card__footer">
          Sudah punya akun?
          {' '}
          <Link to="/login">Masuk</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
