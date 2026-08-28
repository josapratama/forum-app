import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryFilter } from '../store/slices/threadsSlice';

function CategoryFilter({ categories }) {
  const dispatch = useDispatch();
  const activeFilter = useSelector((state) => state.threads.categoryFilter);

  const handleFilter = (category) => {
    if (activeFilter === category) {
      dispatch(setCategoryFilter(''));
    } else {
      dispatch(setCategoryFilter(category));
    }
  };

  if (categories.length === 0) return null;

  return (
    <div className="category-filter">
      <span className="category-filter__label">Filter:</span>
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`category-filter__btn${activeFilter === cat ? ' category-filter__btn--active' : ''}`}
          onClick={() => handleFilter(cat)}
        >
          {`#${cat}`}
        </button>
      ))}
      {activeFilter && (
        <button
          type="button"
          className="category-filter__btn category-filter__btn--clear"
          onClick={() => dispatch(setCategoryFilter(''))}
        >
          ✕ Hapus Filter
        </button>
      )}
    </div>
  );
}

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CategoryFilter;
