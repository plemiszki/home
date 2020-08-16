import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { sendRequest } from '../actions/index'
import { Link, Redirect } from 'react-router-dom'
import { Common } from 'handy-components'
import MainMenuButton from './main-menu-button'

class Tabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTabIndex: 0
    };
  }

  switchTab(index) {
    this.setState({
      selectedTabIndex: index
    });
  }

  render() {
    const tab = this.props.tabs[this.state.selectedTabIndex];
    const { Component, props } = tab;
    return(
      <div className="tabs">
        <nav className={ this.props.hidden ? 'no-border' : '' }>
          <MainMenuButton />
          { this.renderTabs() }
        </nav>
        <section className="tab-component">
          <Component
            context={ this.props.context }
            switchTab={ this.switchTab.bind(this) }
            { ...props }
          />
        </section>
      </div>
    );
  }

  renderTabs() {
    if (!this.props.hidden) {
      const { selectedTabIndex } = this.state;
      return this.props.tabs.map((tab, index) => {
        const finalTab = (index === (this.props.tabs.length - 1));
        let styles = {
          backgroundImage: `url(/static/images/${tab.image}.svg)`
        };
        return(
          <div
            key={ index }
            className={ `tab ${selectedTabIndex === index ? 'selected' : ''} ${(finalTab && index >= 2) ? 'no-bottom-border' : ''}` }
            style={ styles }
            onClick={ this.switchTab.bind(this, index) }
          ></div>
        );
      });
    }
  }
}

const mapStateToProps = (reducers) => {
  return reducers.standardReducer;
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ sendRequest }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
