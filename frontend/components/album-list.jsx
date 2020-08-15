import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { sendRequest } from '../actions/index'
import Spinner from './spinner'
import MainMenuButton from './main-menu-button'

const TABS = {
  'NOW PLAYING': 0
};

class AlbumList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      albums: []
    };
  }

  componentDidMount() {
    this.props.sendRequest({
      url: `/api/music/${this.props.category}`,
      method: 'get'
    }).then(() => {
      this.setState({
        fetching: false,
        albums: this.props.albums
      });
    });
  }

  clickRandom() {
    const { albums } = this.state;
    let randomAlbum = albums[Math.floor(Math.random() * albums.length)];
    this.props.sendRequest({
      url: '/api/music/start',
      method: 'post',
      data: {
        albumId: randomAlbum.id,
        track: 1
      }
    }).then(() => {
      this.props.switchTab(TABS['NOW PLAYING']);
    });
  }

  clickAlbum(albumId) {
    this.props.sendRequest({
      url: '/api/music/start',
      method: 'post',
      data: {
        albumId,
        track: 1
      }
    }).then(() => {
      this.props.switchTab(TABS['NOW PLAYING']);
    });
  }

  render() {
    return(
      <div className="album-list">
        <Spinner visible={ this.state.fetching } />
        <div className={ 'link-container' + (this.state.albums.length > 0 ? '' : ' hidden') }>
          <div id="random-album" onClick={ this.clickRandom.bind(this) }></div>
        </div>
        { this.renderAlbums() }
      </div>
    );
  }

  renderAlbums() {
    return this.state.albums.map((album) => {
      return(
        <div key={ album.id } className="link-container" onClick={ this.clickAlbum.bind(this, album.id) }>
          <div className="album">
            <h1>{ album.name }</h1>
            <p>{ album.artistName }</p>
          </div>
        </div>
      );
    });
  }
}

const mapStateToProps = (reducers) => {
  return reducers.standardReducer;
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ sendRequest }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumList);
