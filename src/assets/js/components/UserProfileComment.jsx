import React from 'react';
import PropTypes from 'prop-types';
import faker from 'faker';

export default function TodoList(props) {
  return (
    <div className="comment">
      <ul>
        { props.items.map(item => <div><li key={`${faker.random.uuid()}`}>{item.comment}</li> <li>Posted at {item.createdAt} by {item.user} </li></div>)}
      </ul>
    </div>
  );
}

