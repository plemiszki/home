import React, { Component } from 'react'

const SLEEP_TIME = 1000 * 60 * 10;

class WakeButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sleeping: false
    };
    this.resetSleepTimer();
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
        <>
          <div className="wake-button" onClick={ this.clickButton.bind(this) }></div>
          <style jsx>{`
            .wake-button {
              position: absolute;
              width: 100%;
              height: 100%;
              z-index: 10;
            }
          `}</style>
        </>
      );
    } else {
      return(
        <div></div>
      );
    }
  }
}

export default WakeButton;
