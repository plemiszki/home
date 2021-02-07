import React, { Component } from 'react'

class Spinner extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.props.visible) {
      return(
        <>
          <img className="white-spinner" src="/static/images/white-spinner.gif" />
          <style jsx>{`
            img {
              position: absolute;
              left: calc(50% - (326px / 2));
              top: calc(50% - (244.5px / 2));
              height: 244.5px;
              width: 326px;
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

export default Spinner;
