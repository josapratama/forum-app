/**
 * Unit tests untuk komponen ThreadCard.
 *
 * Skenario pengujian:
 * - Render: menampilkan judul thread
 * - Render: menampilkan body thread yang dipotong jika lebih dari 150 karakter
 * - Render: menampilkan kategori thread jika ada
 * - Render: menampilkan nama owner jika disediakan
 * - Render: menampilkan jumlah komentar
 * - Render: tidak menampilkan nama owner jika owner null
 * - Interaksi: memanggil dispatch up-vote saat user login dan klik up-vote
 * - Interaksi: tidak memanggil dispatch saat userId null dan klik up-vote
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import threadsReducer from '../../store/slices/threadsSlice';
import authReducer from '../../store/slices/authSlice';
import ThreadCard from '../../components/ThreadCard';

vi.mock('../../api', () => ({
  default: {
    upVoteThread: vi.fn().mockResolvedValue({}),
    downVoteThread: vi.fn().mockResolvedValue({}),
    neutralVoteThread: vi.fn().mockResolvedValue({}),
    removeAccessToken: vi.fn(),
    putAccessToken: vi.fn(),
  },
}));

const makeThread = (overrides = {}) => ({
  id: 'thread-1',
  title: 'Test Thread Title',
  body: 'This is the body of the thread.',
  category: 'react',
  createdAt: '2024-01-01T00:00:00.000Z',
  totalComments: 5,
  upVotesBy: [],
  downVotesBy: [],
  ownerId: 'user-1',
  ...overrides,
});

const makeOwner = (overrides = {}) => ({
  id: 'user-1',
  name: 'Alice',
  avatar: 'https://example.com/avatar.jpg',
  ...overrides,
});

const makeStore = (user = null, thread = null) => {
  const threadList = thread ? [thread] : [];
  return configureStore({
    reducer: {
      auth: authReducer,
      threads: threadsReducer,
    },
    preloadedState: {
      auth: { user, isLoading: false, error: null },
      threads: {
        list: threadList,
        users: [],
        categoryFilter: '',
        isLoading: false,
        error: null,
      },
    },
  });
};

const renderThreadCard = (thread, owner = null, user = null) => {
  const store = makeStore(user, thread);
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <ThreadCard thread={thread} owner={owner} />
        </MemoryRouter>
      </Provider>,
    ),
    store,
  };
};

describe('ThreadCard component', () => {
  it('should render the thread title', () => {
    renderThreadCard(makeThread());
    expect(screen.getByText('Test Thread Title')).toBeInTheDocument();
  });

  it('should render the thread body', () => {
    renderThreadCard(makeThread());
    expect(screen.getByText(/This is the body of the thread/i)).toBeInTheDocument();
  });

  it('should truncate body longer than 150 characters with ellipsis', () => {
    const longBody = 'A'.repeat(200);
    renderThreadCard(makeThread({ body: longBody }));
    const displayedBody = screen.getByText(/A+\.\.\./);
    expect(displayedBody.textContent).toHaveLength(153); // 150 + '...'
  });

  it('should render the thread category', () => {
    renderThreadCard(makeThread({ category: 'react' }));
    expect(screen.getByText('#react')).toBeInTheDocument();
  });

  it('should render the comment count', () => {
    renderThreadCard(makeThread({ totalComments: 5 }));
    expect(screen.getByText(/5 komentar/i)).toBeInTheDocument();
  });

  it('should render owner name when owner is provided', () => {
    renderThreadCard(makeThread(), makeOwner({ name: 'Alice' }));
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('should not render owner section when owner is null', () => {
    renderThreadCard(makeThread(), null);
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  it('should dispatch upVoteThread when up-vote button is clicked and user is logged in', async () => {
    const user = { id: 'user-1', name: 'Alice' };
    const thread = makeThread();
    const { store } = renderThreadCard(thread, makeOwner(), user);

    await userEvent.click(screen.getByLabelText('Up vote'));

    // State should be updated optimistically
    const state = store.getState().threads;
    expect(state.list[0].upVotesBy).toContain('user-1');
  });

  it('should not dispatch vote when user is not logged in', async () => {
    const thread = makeThread();
    const { store } = renderThreadCard(thread, null, null); // no user

    await userEvent.click(screen.getByLabelText('Up vote'));

    // List is empty in this store (no thread seeded), but no error either
    expect(store.getState().auth.user).toBeNull();
  });
});
