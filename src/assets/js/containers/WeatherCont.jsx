import React, { Component } from 'react';
import postsService from '../services/weather';
import PostComponent from '../components/Weather';


export default class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tem: 0,
      l: props.placeLocation,
    };
    this.fetchNewPost = this.fetchNewPost.bind(this);
  }

  componentDidMount() {
    this.fetchNewPost();
  }

  async fetchNewPost() {
    this.setState({ loading: true });
    const newPost = await postsService.getWeather(this.l);
    this.setState({ tem: Math.round(newPost.main.temp - 273.15), loading: false });
  }

  render() {
    if (this.state.loading) {
      return <p>Loading....</p>;
    }

    return (
      <PostComponent
        tem={this.state.tem}
        onNewPost={this.fetchNewPost}
      />
    );
  }
}
