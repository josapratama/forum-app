import React from 'react';
import PropTypes from 'prop-types';

function Avatar({ src = null, name, size = 'md' }) {
  const sizeClass = `avatar avatar--${size}`;
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  return <img src={src || fallback} alt={name} className={sizeClass} />;
}

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default Avatar;
