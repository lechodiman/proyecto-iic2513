import React from 'react';
import PropTypes from 'prop-types';

export default function CommentsComponent (props) {
    return (
            <div>
                <div className="card-header purple">
                    <h3>Comments</h3>
                </div>
                <ul className="list-group">
                    {props.comments.map(comment => {
                        return (<ul className="list-group-item">
                            <div className="comment-header">
                                <p className="comment-author">{comment.user}</p>
                                <p className="comment-date">Posted at {comment.createdAt}</p>
                            </div>
                            <p className="comment-body">{comment.comment}</p>
                        </ul>)
                    })}
                </ul>
            </div>
        )
}
