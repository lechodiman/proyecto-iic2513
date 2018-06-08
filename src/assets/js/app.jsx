import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/WeatherCont';
import Comments from './containers/Comments';

const reactAppContainer = document.getElementById('react-app');
const reactLogin = document.getElementById('react-weather');
const reactCommentsContainer = document.getElementById('user-comments-app');


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

if (reactCommentsContainer) {
  ReactDOM.render(
      <Comments {...reactCommentsContainer.dataset} />,
    reactCommentsContainer)
}
