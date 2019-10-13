import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ChangeCase from 'change-case'
import { Common, Details } from 'handy-components'
import HandyTools from 'handy-tools'
import { createEntity } from '../actions/index'

class NewEntity extends React.Component {

  constructor(props) {
    super(props);
    let obj = {
      fetching: false,
      [this.props.entityName]: HandyTools.deepCopy(this.props.initialEntity),
      errors: []
    };
    if (this.props.staticData) {
      Object.assign(obj, this.props.staticData);
    }
    this.state = obj;
  }

  componentDidMount() {
    HandyTools.setUpNiceSelect({ selector: '.admin-modal select', func: Details.changeField.bind(this, this.changeFieldArgs()) });
  }

  clickAdd(e) {
    let entityNamePlural = this.props.entityNamePlural || `${this.props.entityName}s`;
    let directory = HandyTools.convertToUnderscore(entityNamePlural);
    e.preventDefault();
    this.setState({
      fetching: true
    });
    this.props.createEntity({
      directory,
      entityName: this.props.entityName,
      entity: this.state[this.props.entityName]
    }, entityNamePlural).then(() => {
      if (this.props.redirect) {
        window.location.pathname = `/${directory}/${this.props[this.props.entityName].id}`;
      } else {
        this.props.callback(this.props[this.props.responseKey || entityNamePlural]);
      }
    }, () => {
      this.setState({
        fetching: false,
        errors: this.props.errors
      });
    });
  }

  changeFieldArgs() {
    return {
      allErrors: Errors,
      errorsArray: this.state.errors
    }
  }

  render() {
    return(
      <div className="component admin-modal">
        <form className="white-box">
          { Common.renderSpinner(this.state.fetching) }
          { Common.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          { this.renderFields() }
          <input type="submit" className={ "btn" + Common.renderDisabledButtonClass(this.state.fetching) } value={ this.props.buttonText || `Add ${ChangeCase.titleCase(this.props.entityName)}` } onClick={ this.clickAdd.bind(this) } />
        </form>
      </div>
    );
  }

  renderFields() {
    switch (this.props.entityName) {
      case 'album':
        return([
          <div key="1" className="row">
            { Details.renderField.bind(this)({ columnWidth: 6, entity: 'album', property: 'artistName', columnHeader: 'Artist' }) }
            { Details.renderField.bind(this)({ columnWidth: 6, entity: 'album', property: 'name', columnHeader: 'Album' }) }
          </div>
        ]);
    }
  }
}

const mapStateToProps = (reducers) => {
  return reducers.standardReducer;
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ createEntity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewEntity);
