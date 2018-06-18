import React, { Component } from 'react';
import CommentsComponent from '../components/CommentsComponent';

export default class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.userId,
            comments: [],
            currentItem: '',
            isLoading: false,
            apiGetPath: props.apiGetPath,
            apiPostPath: props.apiPostPath,
        }
    }

    async componentDidMount() {
        // GET request to get previous comments
        let getUrl = this.state.apiGetPath + this.state.userId;
        const response = await fetch(getUrl, {
          method: 'GET',
          credentials: 'same-origin',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
        });
        const json = await response.json();
        const comments = json.comments;
        this.setState({
          comments: comments,
        });
    }

    onHandleChange(event) {
        this.setState({currentItem: event.target.value})
    }

    async onHandleSubmit(event) {
        // Fetch to user api, this should change depending on the comment section
        event.preventDefault();
        this.setState({isLoading: true});
        let postUrl = this.state.apiPostPath + this.state.userId;
        const response = await fetch(postUrl, {
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
          currentItem: '',
          comments: [...this.state.comments, { user: json.user, comment: json.message, createdAt: json.createdAt }],
          isLoading: false
        });
    }



    render() {
      if (this.props.currentUser){
        return (
            <div>
                <CommentsComponent comments={this.state.comments}/>
                <form onSubmit={this.onHandleSubmit.bind(this)}>
                    <textarea value={this.state.currentItem} onChange={this.onHandleChange.bind(this)} name="comment"></textarea>
                    <button className="btn btn-green">Comment</button>
                </form>

            </div>
            )
    }else{
      return (
          <div>
              <CommentsComponent comments={this.state.comments}/>
          </div>
          )
  }
}
}
