import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ChangeCase from 'change-case'
import { Common, Details } from 'handy-components'
import HandyTools from 'handy-tools'
import { sendRequest } from '../actions/index'
import MainMenuButton from './main-menu-button'

class NowPlaying extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      album: {},
      songs: [],
      trackPlaying: 1
    };
  }

  componentDidMount() {
    let albumId = window.location.href.split('/')[window.location.href.split('/').length - 1]
    this.props.sendRequest({
      url: `/api/albums/${albumId}`,
      method: 'get'
    }).then(() => {
      this.setState({
        fetching: false,
        album: this.props.album,
        songs: this.props.songs
      });
    });
    window.setInterval(this.checkStatus.bind(this), 1000);
  }

  checkStatus() {
    this.props.sendRequest({
      url: '/api/status',
      method: 'get'
    }).then((response) => {
      let message = { response };
      if (message === 'next track') {
        this.setState({
          trackPlaying: this.state.trackPlaying + 1
        });
      } else if (message === '') {
        window.location.pathname = `/music/play/${response.albumId}`;
      }
    });
  }

  clickSong(track) {
    this.setState({
      trackPlaying: track
    });
    this.props.sendRequest({
      url: '/api/play_song',
      method: 'post',
      data: {
        track: track
      }
    });
  }

  render() {
    return(
      <div className="now-playing">
        <MainMenuButton />
        <a className="back-arrow">
          <img src="/static/images/green-arrow.png" onClick={ () => { window.location.href = `/music/${this.state.album.categoryName}` } } />
        </a>
        <h2>Playing</h2>
        <h1>{ this.state.album.name }</h1>
        <p>{ this.state.album.artistName }</p>
        { this.renderSongs() }
      </div>
    );
  }

  renderSongs() {
    return(
      <table>
        <tbody>
          { this.state.songs.map((song, index) => {
            return(
              <tr key={ index } onClick={ this.clickSong.bind(this, index + 1) }>
                <td className={ index === (this.state.trackPlaying - 1) ? 'playing' : '' } data-track={ index }>{ song }</td>
              </tr>
            );
          }) }
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (reducers) => {
  return reducers.standardReducer;
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ sendRequest }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NowPlaying);
