import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/WeatherCont';
import UserComment from './containers/UserProfileCommentCont';

const reactAppContainer = document.getElementById('react-app');
const reactLogin = document.getElementById('react-weather');
const reactUserProfileComment = document.getElementById('userProfileComment-react-app');

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

if (reactUserProfileComment) {
  const render = function render(Component) {
    ReactDOM.render(
      <Component {...reactUserProfileComment.dataset} />,
      document.getElementById('userProfileComment-react-app'),
    );
  };
  render(UserComment);
}
