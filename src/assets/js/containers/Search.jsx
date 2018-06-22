import React, { Component } from 'react';
import SearchComponent from '../components/SearchComponent';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.pageLimit = 5;
    this.search = '';
    this.state = {
      places: [],
      show: [],
      placePath: props.placePath,
      editPlacePath: props.editPlacePath,
      deletePlacePath: props.deletePlacePath,
      loading: false,
      page: 1,
      maxPage: undefined,
      admin: Boolean(props.admin),
    };

    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.getListForPage = this.getListForPage.bind(this);
    this.onHandleChange = this.onHandleChange.bind(this);
  }

  async componentDidMount() {
    this.setState({ loading: true });
    const getUrl = '/api/place/';
    const response = await fetch(getUrl, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    const places = json.places;
    const show = places;
    const maxPage = Math.max(1, Math.ceil(places.length / this.pageLimit));
    this.setState({
      loading: false, places, show, page: 1, maxPage,
    });
  }

  onHandleChange(event) {
    const searchTerm = this.search.value.toLowerCase().trim();

    this.setState({ loading: true });

    let show;

    if (searchTerm) {
      show = this.state.places.filter(place => place.name.toLowerCase().includes(searchTerm));
    } else {
      show = this.state.places;
    }

    const maxPage = Math.max(1, Math.ceil(show.length / this.pageLimit));

    this.setState({
      loading: false, show, page: 1, maxPage,
    });
  }

  previousPage() {
    const page = this.state.page - 1;
    this.setState({ page });
  }

  nextPage() {
    const page = this.state.page + 1;
    this.setState({ page });
  }

  getListForPage() {
    return this.state.show.slice((this.state.page - 1) * this.pageLimit, this.state.page * this.pageLimit);
  }

  render() {
    return (
      <div>
        <form className="search-container">
          <div className="input-field search-field">
            <input
              type="text"
              placeholder="Search..."
              ref={input => this.search = input}
              onChange={this.onHandleChange}
            />
          </div>
          <p>{this.state.query}</p>
        </form>

        <SearchComponent
          places={this.getListForPage(this.state.show)}
          placePath={this.state.placePath}
          editPlacePath={this.state.placePath}
          deletePlacePath={this.state.deletePlacePath}
          previousPage={this.previousPage}
          nextPage={this.nextPage}
          admin={this.state.admin}
          previous={this.state.page > 1}
          next={this.state.page < this.state.maxPage}
        />
      </div>
    );
  }
}
