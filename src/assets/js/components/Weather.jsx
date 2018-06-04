import React from 'react';
import PropTypes from 'prop-types';

export default function Post(props) {
  return (
    <div>
      <button onClick={props.onNewPost}>Checkout the weather</button>
      <h4>{props.tem} º Celsius</h4>
    </div>
  );
}

Post.propTypes = {
  tem: PropTypes.number.isRequired,
  onNewPost: PropTypes.func.isRequired,
};
