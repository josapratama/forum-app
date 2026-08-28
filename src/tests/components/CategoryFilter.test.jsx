/**
 * Unit tests untuk komponen CategoryFilter.
 *
 * Skenario pengujian:
 * - Render: tidak merender apapun jika categories kosong
 * - Render: menampilkan semua kategori sebagai tombol
 * - Render: menampilkan label "Filter:"
 * - Interaksi: mengubah activeFilter saat tombol kategori diklik
 * - Interaksi: menampilkan tombol "Hapus Filter" saat ada filter aktif
 * - Interaksi: menghapus filter saat tombol "Hapus Filter" diklik
 * - Interaksi: menonaktifkan filter saat kategori yang sama diklik ulang (toggle)
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import threadsReducer from '../../store/slices/threadsSlice';
import CategoryFilter from '../../components/CategoryFilter';

const makeStore = (categoryFilter = '') =>
  configureStore({
    reducer: { threads: threadsReducer },
    preloadedState: {
      threads: {
        list: [],
        users: [],
        categoryFilter,
        isLoading: false,
        error: null,
      },
    },
  });

const renderWithStore = (categories, categoryFilter = '') => {
  const store = makeStore(categoryFilter);
  const result = render(
    <Provider store={store}>
      <CategoryFilter categories={categories} />
    </Provider>,
  );
  return { ...result, store };
};

describe('CategoryFilter component', () => {
  it('should render nothing when categories array is empty', () => {
    const { container } = renderWithStore([]);
    expect(container.firstChild).toBeNull();
  });

  it('should render "Filter:" label', () => {
    renderWithStore(['react', 'javascript']);
    expect(screen.getByText('Filter:')).toBeInTheDocument();
  });

  it('should render all category buttons', () => {
    renderWithStore(['react', 'javascript', 'redux']);

    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('#javascript')).toBeInTheDocument();
    expect(screen.getByText('#redux')).toBeInTheDocument();
  });

  it('should update store categoryFilter when a category button is clicked', async () => {
    const { store } = renderWithStore(['react', 'javascript']);

    await userEvent.click(screen.getByText('#react'));

    expect(store.getState().threads.categoryFilter).toBe('react');
  });

  it('should show "Hapus Filter" button when there is an active filter', () => {
    renderWithStore(['react', 'javascript'], 'react');

    expect(screen.getByText(/Hapus Filter/i)).toBeInTheDocument();
  });

  it('should clear categoryFilter when "Hapus Filter" button is clicked', async () => {
    const { store } = renderWithStore(['react', 'javascript'], 'react');

    await userEvent.click(screen.getByText(/Hapus Filter/i));

    expect(store.getState().threads.categoryFilter).toBe('');
  });

  it('should toggle off filter when same category is clicked again', async () => {
    const { store } = renderWithStore(['react', 'javascript'], 'react');

    await userEvent.click(screen.getByText('#react'));

    expect(store.getState().threads.categoryFilter).toBe('');
  });
});
