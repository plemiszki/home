import React, { Component } from 'react'

class MainMenuButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <div className="main-menu-button-container" onClick={ () => { window.location.href = '/' } }>
        <div className="menu-button"></div>
      </div>
    );
  }
}

export default MainMenuButton;
