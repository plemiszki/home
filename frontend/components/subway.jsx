import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { sendRequest } from '../actions/index'
import Spinner from './spinner'
import MainMenuButton from './main-menu-button'

class Subway extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      subwayData: []
    };
  }

  componentDidMount() {
    this.props.sendRequest({
      url: '/api/subway',
      method: 'get'
    }).then(() => {
      this.setState({
        fetching: false,
        subwayData: this.props.subwayData
      });
    });
  }

  render() {
    return(
      <div className="subway">
        <div className="container-fluid">
          <div className="row">
            <Spinner visible={ this.state.fetching } />
            <MainMenuButton />
            <div className="col-xs-12">
              <table>
                <thead className={ this.state.fetching ? ' hidden' : '' }>
                  <tr>
                    <th></th>
                    <th className="unimportant">Arrival</th>
                    <th></th>
                    <th>Leave By</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  { this.renderSubwayData() }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderSubwayData() {
    return this.state.subwayData.map((data, index) => {
      return(
        <tr key={ index }>
          <td className="image-container">
            <div className={ `image train-${data.train}` }></div>
          </td>
          <td className="unimportant">
            { data.time }
          </td>
          <td className="unimportant">
            { data.eta_minutes } min
          </td>
          <td>
            { data.leave_at }
          </td>
          <td>
            { data.leave_in } min
          </td>
        </tr>
      )
    })
  }
}

const mapStateToProps = (reducers) => {
  return reducers.standardReducer;
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ sendRequest }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Subway);
