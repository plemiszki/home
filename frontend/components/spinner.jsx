import React, { Component } from 'react'

class Spinner extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.props.visible) {
      return(
        <img className="white-spinner" src="/static/images/white-spinner.gif" />
      );
    } else {
      return(
        <div></div>
      );
    }
  }
}

export default Spinner;
