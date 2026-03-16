import React from "react";
import { sendRequest } from "handy-components";

class NowPlaying extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      album: {},
      songs: [],
      track: null,
    };
  }

  componentDidMount() {
    sendRequest("/api/music/now_playing").then((response) => {
      this.setState({
        track: response.track,
        album: response.album || {},
        songs: response.songs || [],
        interval: window.setInterval(this.checkStatus.bind(this), 1000),
      });
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  checkStatus() {
    sendRequest("/api/music/now_playing").then((response) => {
      if ((response.album || {}).id !== this.state.album.id) {
        document.getElementById("tab-component").scrollTop = 0;
      }
      this.setState({
        track: response.track,
        album: response.album || {},
        songs: response.songs || [],
      });
    });
  }

  clickPlay() {
    if (this.state.track === 0) {
      sendRequest("/api/music/start", {
        method: "POST",
        data: { track: 1, albumId: this.state.album.id },
      }).then((response) => {
        this.setState({
          track: response.track,
          album: response.album,
          songs: response.songs,
        });
      });
    }
  }

  clickStop() {
    if (this.state.track !== 0) {
      sendRequest("/api/music/stop", { method: "POST" }).then((response) => {
        this.setState({
          track: response.track,
          album: response.album,
          songs: response.songs,
        });
      });
    }
  }

  clickSong(track) {
    this.setState({ track });
    sendRequest("/api/music/start", {
      method: "POST",
      data: { albumId: this.state.album.id, track },
    }).then((response) => {
      this.setState({
        track: response.track,
        album: response.album,
        songs: response.songs || [],
      });
    });
  }

  render() {
    let { album } = this.state;
    return (
      <div className="now-playing">
        <h1>{album.name}</h1>
        <p>{album.artistName}</p>
        <div className="buttons">
          <img
            src={`/static/images/play-button-${this.state.track === 0 ? "gray" : "white"}.svg`}
            onClick={this.clickPlay.bind(this)}
          />
          <img
            src={`/static/images/stop-button-${this.state.track === 0 ? "white" : "gray"}.svg`}
            onClick={this.clickStop.bind(this)}
          />
        </div>
        {this.renderSongs()}
        <style jsx>{`
          .now-playing {
            background-color: black;
            touch-action: pan-y;
          }
          h1 {
            width: 90%;
            margin: auto;
            margin-top: 50px;
            text-align: center;
            font-family: "TeachableSans-Regular";
            font-size: 50px;
            color: white;
            line-height: 80px;
            padding-bottom: 25px;
          }
          p {
            text-align: center;
            font-family: "TeachableSans-Bold";
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
    return (
      <table>
        <tbody>
          {this.state.songs.map((song, index) => {
            return (
              <tr key={index} onClick={this.clickSong.bind(this, index + 1)}>
                <td
                  className={index === this.state.track - 1 ? "playing" : ""}
                  data-track={index}
                >
                  {song}
                </td>
              </tr>
            );
          })}
        </tbody>
        <style jsx>{`
          table {
            margin: auto;
            font-family: "TeachableSans-Regular";
            font-size: 40px;
            color: gray;
            border: solid 1px gray;
            border-radius: 10px;
            width: 90%;
            margin-bottom: 30px;
          }
          tr {
            touch-action: pan-y;
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

export default NowPlaying;
