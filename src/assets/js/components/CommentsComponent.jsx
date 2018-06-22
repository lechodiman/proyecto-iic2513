import React from 'react';
import PropTypes from 'prop-types';
import faker from 'faker';

export default function CommentsComponent (props) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return (
            <div>
                <div className="card-header purple">
                    <h3>Comments</h3>
                </div>
                <ul className="list-group">
                    {props.comments.map(comment => {
                        return (<ul className="list-group-item" key={`${faker.random.uuid()}`}>
                            <div className="comment-header">
                                <p className="comment-author">{comment.user}</p>
                                <p className="comment-date">Posted at { new Date(comment.createdAt).toLocaleDateString("en-US", options)}</p>
                            </div>
                            <p className="comment-body">{comment.comment}</p>
                        </ul>)
                    })}
                </ul>
            </div>
        )
}

CommentsComponent.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object),
};

