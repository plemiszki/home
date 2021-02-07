import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Common } from 'handy-components'

class MainMenuButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect push to={ this.state.redirectTo } />;
    }
    return(
      <div className="main-menu-button-container" onClick={ Common.changeState.bind(this, 'redirectTo', '/') }>
        <div className="menu-button"></div>
        <style jsx>{`
            .main-menu-button-container {
              box-sizing: content-box;
              background-color: black;
              padding: 40px 0;
              width: 260px;
              height: 160px;
              text-align: center;
            }
            .menu-button {
              display: inline-block;
              width: 160px;
              height: 160px;
              border-radius: 100%;
              background-image: url('/static/images/grid.svg');
              background-color: white;
              background-size: 60%;
              background-position: 50%;
            }
        `}</style>
      </div>
    );
  }
}

export default MainMenuButton;
