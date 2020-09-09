import React, { Component } from 'react'

const SLEEP_TIME = 1000 * 60 * 60;

class WakeButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sleeping: false
    };
  }

  clickButton() {
    this.setState({
      sleeping: false
    });
    this.resetSleepTimer();
  }

  resetSleepTimer() {
    setTimeout(() => {
      this.setState({
        sleeping: true
      });
    }, SLEEP_TIME);
  }

  render() {
    if (this.state.sleeping) {
      return(
        <div className="wake-button" onClick={ this.clickButton.bind(this) }></div>
      );
    } else {
      return(
        <div></div>
      );
    }
  }
}

export default WakeButton;
