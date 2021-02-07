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
      if (this.props.album.id !== this.state.album.id) {
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
    }).then(() => {
      this.setState({
        track: this.props.track,
        album: this.props.album,
        songs: this.props.songs
      });
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
        <style jsx>{`
          .now-playing {
            background-color: black;
          }
          h1 {
            width: 90%;
            margin: auto;
            margin-top: 50px;
            text-align: center;
            font-family: 'TeachableSans-Regular';
            font-size: 50px;
            color: white;
            line-height: 80px;
            padding-bottom: 25px;
          }
          p {
            text-align: center;
            font-family: 'TeachableSans-Bold';
            color: green;
            font-size: 40px;
            margin-bottom: 30px;
          }
          .buttons {
            width: 410px;
            margin: auto;
            margin-bottom: 30px;
          }
          img {
            width: 160px;
            height: 160px;
          }
          img:first-of-type {
            margin-right: 80px;
          }
        `}</style>
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
        <style jsx>{`
          table {
            margin: auto;
            font-family: 'TeachableSans-Regular';
            font-size: 40px;
            color: gray;
            border: solid 1px gray;
            border-radius: 10px;
            width: 90%;
            margin-bottom: 30px;
          }
          td {
            padding: 30px 0;
            text-align: center;
          }
          td.playing {
            color: white;
          }
          tr:first-of-type td {
            padding-top: 60px;
          }
          tr:last-of-type td {
            padding-bottom: 60px;
          }
        `}</style>
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
