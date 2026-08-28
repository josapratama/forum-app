import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import threadsReducer from '../store/slices/threadsSlice';
import CategoryFilter from '../components/CategoryFilter';

/**
 * Komponen CategoryFilter menampilkan tombol-tombol filter kategori thread.
 * Komponen ini terhubung ke Redux store untuk membaca dan mengubah categoryFilter.
 */
export default {
  title: 'Components/CategoryFilter',
  component: CategoryFilter,
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const store = configureStore({
        reducer: { threads: threadsReducer },
        preloadedState: {
          threads: {
            list: [],
            users: [],
            categoryFilter: context.args.activeFilter || '',
            isLoading: false,
            error: null,
          },
        },
      });
      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
};

export const Default = {
  args: {
    categories: ['react', 'javascript', 'redux', 'typescript'],
    activeFilter: '',
  },
};

export const WithActiveFilter = {
  args: {
    categories: ['react', 'javascript', 'redux', 'typescript'],
    activeFilter: 'react',
  },
};

export const FewCategories = {
  args: {
    categories: ['general', 'random'],
    activeFilter: '',
  },
};

export const Empty = {
  args: {
    categories: [],
    activeFilter: '',
  },
};
