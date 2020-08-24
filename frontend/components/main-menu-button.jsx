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
      </div>
    );
  }
}

export default MainMenuButton;
