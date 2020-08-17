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
      track: null
    };
  }

  componentDidMount() {
    this.props.sendRequest({
      url: '/api/music/now_playing',
      method: 'get'
    }).then(() => {
      this.setState({
        fetching: false,
        track: this.props.track,
        album: this.props.album || {},
        songs: this.props.songs,
        interval: window.setInterval(this.checkStatus.bind(this), 1000)
      });
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  checkStatus() {
    this.props.sendRequest({
      url: '/api/music/now_playing',
      method: 'get'
    }).then(() => {
      console.log('state album id: ', this.state.album.id);
      console.log('props album id: ', this.props.album.id);
      if (this.props.album.id !== this.state.album.id) {
        console.log('new album!');
        document.getElementById('tab-component').scrollTop = 0;
      }
      this.setState({
        track: this.props.track,
        album: this.props.album || {},
        songs: this.props.songs
      });
    });
  }

  clickPlay() {
    if (this.state.track === 0) {
      this.props.sendRequest({
        url: '/api/music/start',
        method: 'post',
        data: {
          track: 1,
          albumId: this.state.album.id
        }
      }).then(() => {
        this.setState({
          fetching: false,
          track: this.props.track,
          album: this.props.album,
          songs: this.props.songs
        });
      });
    }
  }

  clickStop() {
    if (this.state.track !== 0) {
      this.props.sendRequest({
        url: '/api/music/stop',
        method: 'post'
      }).then(() => {
        this.setState({
          fetching: false,
          track: this.props.track,
          album: this.props.album,
          songs: this.props.songs
        });
      });
    }
  }

  clickSong(track) {
    this.setState({
      track
    });
    this.props.sendRequest({
      url: '/api/music/start',
      method: 'post',
      data: {
        albumId: this.state.album.id,
        track
      }
    });
  }

  render() {
    let { album, track } = this.state;
    return(
      <div className="now-playing">
        <h1>{ album.name }</h1>
        <p>{ album.artistName }</p>
        <div className="buttons">
          <img src={ `/static/images/play-button-${this.state.track === 0 ? 'gray' : 'white'}.svg` } onClick={ this.clickPlay.bind(this) } />
          <img src={ `/static/images/stop-button-${this.state.track === 0 ? 'white' : 'gray'}.svg` } onClick={ this.clickStop.bind(this) } />
        </div>
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
                <td className={ index === (this.state.track - 1) ? 'playing' : '' } data-track={ index }>{ song }</td>
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
