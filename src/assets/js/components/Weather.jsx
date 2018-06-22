import React from 'react';
import PropTypes from 'prop-types';

export default function Post(props) {
  return (
    <div className="weather-container ">
    	<div className="card-header blue-grey">
    		<h3>Weather</h3>
    	</div>
      <p>{props.tem} º Celsius</p>
      <button className="btn btn-green refresh-weather" onClick={props.onNewPost}>Checkout the weather</button>
    </div>
  );
}

Post.propTypes = {
  tem: PropTypes.number.isRequired,
  onNewPost: PropTypes.func.isRequired,
};
