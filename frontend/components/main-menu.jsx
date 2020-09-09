import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { sendRequest } from '../actions/index'
import { Redirect } from 'react-router-dom'
import { Common } from 'handy-components'
import WakeButton from './wake-button'

class MainMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tempF: null,
      tempC: null
    };
  }

  componentDidMount() {
    this.props.sendRequest({
      url: '/api/indoor_temp',
      method: 'get'
    }).then(() => {
      let { tempF, tempC } = this.props;
      this.setState({
        tempF,
        tempC
      });
    });
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect push to={ this.state.redirectTo } />;
    }
    return(
      <div className="main-menu">
        <div className="inner">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-6">
                <div className="menu-icon music" onClick={ Common.changeState.bind(this, 'redirectTo', '/music') }></div>
              </div>
              <div className="col-xs-6">
                <div className="menu-icon subway" onClick={ Common.changeState.bind(this, 'redirectTo', '/subway') }></div>
              </div>
            </div>
          </div>
        </div>
        <div className={ 'temperature-container' + (this.state.tempF ? '' : ' hidden') }>
          <p>Indoor Temp: <span id="temp-f">{ this.state.tempF }</span> &#176;F (<span id="temp-c">{ this.state.tempC }</span> &#176;C)</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (reducers) => {
  return reducers.standardReducer;
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ sendRequest }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
