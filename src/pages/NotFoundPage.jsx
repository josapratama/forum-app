import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h1 style={{ fontSize: '6rem', margin: 0 }}>404</h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>
        Halaman tidak ditemukan
      </p>
      <Link to="/" className="btn btn--primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
        Kembali ke Beranda
      </Link>
    </div>
  );
}

export default NotFoundPage;
