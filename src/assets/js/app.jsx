import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/WeatherCont';
import Comments from './containers/Comments';
import Search from './containers/Search';

const reactAppContainer = document.getElementById('react-app');
const reactLogin = document.getElementById('react-weather');
const reactUserCommentsContainer = document.getElementById('user-comments-app');
const reactPlaceCommentsContainer = document.getElementById('place-comments-app');
const reactRouteCommentsContainer = document.getElementById('route-comments-app');
const reactGroupCommentsContainer = document.getElementById('group-comments-app');
const reactSearchContainer = document.getElementById('route-search-app');

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

if (reactUserCommentsContainer) {
  ReactDOM.render(
    <Comments {...reactUserCommentsContainer.dataset} />,
    reactUserCommentsContainer,
  );
}

if (reactPlaceCommentsContainer) {
  ReactDOM.render(
    <Comments {...reactPlaceCommentsContainer.dataset} />,
    reactPlaceCommentsContainer,
  );
}

if (reactRouteCommentsContainer) {
  ReactDOM.render(
    <Comments {...reactRouteCommentsContainer.dataset} />,
    reactRouteCommentsContainer,
  );
}

if (reactGroupCommentsContainer) {
  ReactDOM.render(
    <Comments {...reactGroupCommentsContainer.dataset} />,
    reactGroupCommentsContainer,
  );
}

if (reactSearchContainer) {
  ReactDOM.render(
    <Search {...reactSearchContainer.dataset} />,
    reactSearchContainer,
  );
}
