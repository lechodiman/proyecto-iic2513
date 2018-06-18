import React from 'react';
import PropTypes from 'prop-types';
import faker from 'faker';

export default function SearchComponent(props) {
  if (!props.places.length) {
    return (
      <div className="place-container">
        <p>No results</p>
      </div>);
  }

  return (
    <div>
      {props.places.map(place => (
        <div className="place-container" key={`${faker.random.uuid()}`} >
          <h3 className="place-name"><a className="btn btn-green" href={props.placePath + place.id}> {place.name} </a></h3>
          <h4 className="place-location">{`Location ${place.location}`}</h4>
          {props.admin ? (
            <div>
              <a className="btn btn-blue" href={`${props.editPlacePath + place.id}/edit`}>Edit</a>
              <form action={props.deletePlacePath + place.id} method="POST">
                <input type="hidden" name="_method" value="delete" />
                <input className="btn btn-red" type="submit" value="Delete" />
              </form>
            </div>
          ) : (
            <div />
          )}
        </div>
        ))}

      <div className="place-container">
        {props.previous ? (
          <button className="btn btn-blue" onClick={props.previousPage}>Previous</button>
        ) : (
          <div />
        )}
        {props.next ? (
          <button className="btn btn-blue" onClick={props.nextPage}>Next</button>
        ) : (
          <div />
        )}
      </div>

    </div>
  );
}

SearchComponent.propTypes = {
  places: PropTypes.arrayOf(PropTypes.object).isRequired,
  placePath: PropTypes.string.isRequired,
  editPlacePath: PropTypes.string.isRequired,
  deletePlacePath: PropTypes.string.isRequired,
  previousPage: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,
  admin: PropTypes.bool.isRequired,
  previous: PropTypes.bool.isRequired,
  next: PropTypes.bool.isRequired,
};
