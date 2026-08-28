import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addThread } from '../store/slices/threadsSlice';
import { showLoading, hideLoading } from '../store/slices/loadingSlice';

function CreateThreadPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('Judul dan isi thread tidak boleh kosong.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    dispatch(showLoading());
    const result = await dispatch(addThread({ title, body, category }));
    dispatch(hideLoading());
    setIsSubmitting(false);

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    } else {
      setError(result.payload || 'Gagal membuat thread.');
    }
  };

  return (
    <div className="page-container page-container--narrow">
      <button
        type="button"
        className="btn btn--outline btn--back"
        onClick={() => navigate(-1)}
      >
        ← Kembali
      </button>

      <div className="auth-card">
        <h1 className="auth-card__title">Buat Thread Baru</h1>

        {error && (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="thread-title" className="form-label">
              Judul Thread
            </label>
            <input
              id="thread-title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul yang menarik..."
              required
            />
          </div>
          <div className="form-group">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="thread-category" className="form-label">
              Kategori
              {' '}
              <span className="form-label--optional">(opsional)</span>
            </label>
            <input
              id="thread-category"
              type="text"
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="contoh: General, React, JavaScript"
            />
          </div>
          <div className="form-group">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="thread-body" className="form-label">
              Isi Thread
            </label>
            <textarea
              id="thread-body"
              className="form-input"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Tulis isi thread kamu di sini..."
              rows={8}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Membuat Thread...' : 'Buat Thread'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateThreadPage;
