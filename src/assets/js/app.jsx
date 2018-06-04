import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/WeatherCont';

const reactAppContainer = document.getElementById('react-app');
const reactLogin = document.getElementById('react-weather');

if (reactAppContainer) {
  const render = function render(Component) {
    ReactDOM.render(
      <Component />,
      document.getElementById('react-app'),
    );
  };

  render(App);
}

if (reactLogin) {
  const render = function render(Component) {
    ReactDOM.render(
      <Component {...reactLogin.dataset} />,
      document.getElementById('react-weather'),
    );
  };

  render(App);
}
