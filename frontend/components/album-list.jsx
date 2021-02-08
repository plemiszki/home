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
      <>
        <Spinner visible={ this.state.fetching } />
        <div className="album-list">
          <div
            id="random-album"
            className={ this.state.albums.length > 0 ? '' : ' hidden' }
            onClick={ this.clickRandom.bind(this) }>
          </div>
          { this.renderAlbums() }
          <style jsx>{`
              --gap-size: 40px;
              .album-list {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                grid-auto-rows: 1fr;
                grid-gap: var(--gap-size);
                padding: var(--gap-size);
                background-color: black;
              }
              #random-album {
                background-image: url('/static/images/random.svg');
                background-size: 200px;
                background-position: center;
                user-select: none;
              }
              `}</style>
          </div>
      </>
    );
  }

  renderAlbums() {
    return this.state.albums.map((album) => {
      return(
        <div key={ album.id } className="album" onClick={ this.clickAlbum.bind(this, album.id) }>
          <div className="text-container">
            <h1>{ album.name }</h1>
            <p>{ album.artistName }</p>
          </div>
          <style jsx>{`
            --album-padding: 40px;
            .album {
              user-select: none;
              vertical-align: middle;
              display: flex;
              align-items: center;
              background-color: black;
              padding-top: var(--album-padding);
              padding-bottom: var(--album-padding);
              text-align: center;
              border: solid 1px gray;
              vertical-align: middle;
              overflow: hidden;
            }
            .text-container {
              width: 100%;
              word-wrap: break-word;
            }
            h1 {
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
              font-family: 'TeachableSans-Regular';
              font-size: 40px;
              color: white;
              line-height: 50px;
              padding-right: var(--album-padding);
              padding-left: var(--album-padding);
              margin-bottom: 10px;
            }
            p {
              font-family: 'TeachableSans-SemiBold';
              color: green;
              font-size: 30px;
              padding-right: var(--album-padding);
              padding-left: var(--album-padding);
            }
            .album:active {
              background-color: green;
              border: solid 1px black;
            }
            .album:active h1, .album:active p {
              color: black;
            }
          `}</style>
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
