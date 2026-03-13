import React from "react";
import { sendRequest } from "handy-components";
import { Navigate } from "react-router-dom";
import { Common } from "handy-components";

class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempF: null,
      tempC: null,
    };
  }

  componentDidMount() {
    sendRequest("/api/indoor_temp").then((response) => {
      this.setState({
        tempF: response.tempF,
        tempC: response.tempC,
        interval: window.setInterval(this.refresh.bind(this), 15000),
      });
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  refresh() {
    sendRequest("/api/indoor_temp").then((response) => {
      this.setState({
        tempF: response.tempF,
        tempC: response.tempC,
      });
    });
  }

  render() {
    if (this.state.redirectTo) {
      return <Navigate to={this.state.redirectTo} />;
    }
    return (
      <div className="main-menu">
        <div className="inner">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-6">
                <div
                  className="menu-icon music"
                  onClick={Common.changeState.bind(
                    this,
                    "redirectTo",
                    "/music",
                  )}
                ></div>
              </div>
              <div className="col-xs-6">
                <div
                  className="menu-icon subway"
                  onClick={Common.changeState.bind(
                    this,
                    "redirectTo",
                    "/subway",
                  )}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            "temperature-container" + (this.state.tempF ? "" : " hidden")
          }
        >
          <p>
            Indoor Temp: <span id="temp-f">{this.state.tempF}</span> &#176;F (
            <span id="temp-c">{this.state.tempC}</span> &#176;C)
          </p>
        </div>
        <style jsx>{`
          .main-menu {
            width: 100%;
            height: 100%;
          }
          .inner {
            position: absolute;
            top: calc(50% - 200px);
            width: 100%;
          }
          .temperature-container {
            position: absolute;
            bottom: 20px;
            width: 100%;
            text-align: center;
            font-family: "TeachableSans-Bold";
            font-size: 40px;
          }
          .menu-icon {
            display: block;
            width: 350px;
            height: 350px;
            margin: auto;
          }
          .music {
            background-image: url("/static/images/music-note.svg");
            background-size: 100%;
          }
          .subway {
            background-image: url("/static/images/subway.svg");
          }
        `}</style>
      </div>
    );
  }
}

export default MainMenu;
