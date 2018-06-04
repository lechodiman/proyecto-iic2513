import React, { Component } from 'react';
import TodoList from '../components/UserProfileComment';

export default class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItem: '',
      items: [],
      idProfile: props.idProfile,
      user: '',
      createdAt: '',
      comment: '',
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    this.setState({ currentItem: event.target.value });
  }

  async onSubmit(event) {
    event.preventDefault();
    const response = await fetch(`/api/user/profile/${this.state.idProfile}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment: this.state.currentItem }),
    });
    const json = await response.json();
    this.setState({
      user: json.user,
      comment: json.message,
      createdAt: json.createdAt,
      currentItem: '',
      items: [...this.state.items, { user: json.user, comment: json.message, createdAt: json.createdAt }],
    });
  }

  render() {
    return (
      <div>
        <TodoList items={this.state.items} />
        <form onSubmit={this.onSubmit}>
          <input value={this.state.currentItem} onChange={this.onChange} />
          <button className="btn btn-blue" >Submit</button>
        </form>
      </div>
    );
  }
}
