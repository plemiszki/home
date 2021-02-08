import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { sendRequest } from '../actions/index'
import { Link, Redirect } from 'react-router-dom'
import { Common } from 'handy-components'
import MainMenuButton from './main-menu-button'

const TAB_HEIGHT = 176;

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
    const { tabs } = this.props;
    const tab = tabs[this.state.selectedTabIndex];
    const emptyTabSpaces = Math.max(3 - tabs.length, 0);
    const beneathTabsHeight = TAB_HEIGHT * emptyTabSpaces;
    const { Component, props } = tab;
    return(
      <div className="tabs">
        <nav className={ this.props.hidden ? 'no-border' : '' }>
          <MainMenuButton showBorder={ !this.props.hidden } />
          { this.renderTabs() }
          <div className="beneath-tabs" style={ { height: beneathTabsHeight } }></div>
        </nav>
        <section id="tab-component">
          <Component
            context={ this.props.context }
            switchTab={ this.switchTab.bind(this) }
            { ...props }
          />
        </section>
        <style jsx>{`
          --nav_width: 263px;
          --radius: 5px;
          --image_size: 110px;
          --tab_size: 176px;
          --border: solid 3px white;
          nav {
            display: inline-block;
            vertical-align: top;
            width: var(--nav_width);
            text-align: right;
            height: 100%;
            overflow: scroll;
          }
          nav::-webkit-scrollbar {
            display: none;
          }
          nav:not(.no-border) .beneath-tabs {
            border-right: var(--border);
          }
          #tab-component {
            display: inline-block;
            position: relative;
            width: calc(100% - var(--nav_width));
            height: 100%;
            overflow: scroll;
          }
          #tab-component::-webkit-scrollbar {
            display: none;
          }
        `}</style>
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
          <div key={index}>
            <div
              className={ `tab ${selectedTabIndex === index ? 'selected' : ''} ${(finalTab && index >= 2) ? 'no-bottom-border' : ''}` }
              style={ styles }
              onClick={ this.switchTab.bind(this, index) }
            ></div>
            <style jsx>{`
              .tab {
                display: inline-block;
                box-sizing: border-box;
                text-align: right;
                width: var(--tab_size);
                height: var(--tab_size);
                background-position: center;
                background-size: var(--image_size);
              }
              .tab.selected {
                border-top: var(--border);
                border-left: var(--border);
                border-bottom: var(--border);
                border-top-left-radius: var(--radius);
                border-bottom-left-radius: var(--radius);
                background-position-x: calc(50% - 3px);
              }
              .tab.no-bottom-border {
                border-bottom-color: black;
              }
              .tab:not(.selected) {
                border-right: var(--border);
              }
            `}</style>
          </div>
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
