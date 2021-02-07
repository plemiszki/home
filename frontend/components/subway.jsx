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
        subwayData: this.props.subwayData,
        interval: window.setInterval(this.refresh.bind(this), 15000)
      });
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  refresh() {
    this.props.sendRequest({
      url: '/api/subway',
      method: 'get'
    }).then(() => {
      this.setState({
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
            <div className="col-xs-12">
              <table className={ this.state.fetching ? ' hidden' : 'headers-table' }>
                <thead>
                  <tr>
                    <th></th>
                    <th className="arrival-header unimportant">Arrival</th>
                    <th className="leave-header">Leave By</th>
                  </tr>
                </thead>
              </table>
              <table className="data-table">
                <tbody>
                  { this.renderSubwayData() }
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <style jsx>{`
          .subway {
            width: 100%;
            height: 100%;
          }
          --image_column_width: 200px;
          --time_column_width: 200px;
          --countdown_column_width: 200px;
          --leave_header_width: calc(var(--time_column_width) + var(--countdown_column_width));
          table {
            width: 100%;
            font-size: 50px;
            color: white;
          }
          .unimportant {
            color: gray;
          }
          th {
            padding-top: 30px;
            padding-bottom: 30px;
          }
          th:first-of-type {
            width: var(--image_column_width);
          }
          .leave-header {
            width: var(--leave_header_width);
          }
        `}</style>
      </div>
    );
  }

  renderSubwayData() {
    return this.state.subwayData.map((data, index) => {
      return(
        <tr key={ index }>
          <td className="image-column">
            <div className={ `image train-${data.train}` }></div>
          </td>
          <td className="unimportant time-column">
            { data.time }
          </td>
          <td className="unimportant countdown-column">
            { data.eta_minutes } min
          </td>
          <td className="spacer"></td>
          <td className="time-column">
            { data.leave_at }
          </td>
          <td className="countdown-column">
            { data.leave_in } min
          </td>
          <style jsx>{`
            .unimportant {
              color: gray;
            }
            .image-column {
              text-align: left;
              width: var(--image_column_width);
            }
            .time-column {
              width: var(--time_column_width);
            }
            .countdown-column {
              width: var(--countdown_column_width);
            }
            .image {
              display: inline-block;
              --image_size: 120px;
              width: var(--image_size);
              height: var(--image_size);
              margin-top: 20px;
              margin-bottom: 20px;
            }
            // http://subspotting.nyc/assets/img/line-icons/F.svg
            .train-Q {
              background-image: url('/static/images/subway-line-Q.svg')
            }
            .train-B {
              background-image: url('/static/images/subway-line-B.svg')
            }
            .train-F {
              background-image: url('/static/images/subway-line-F.svg')
            }
          `}</style>
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
