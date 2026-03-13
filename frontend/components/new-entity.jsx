import React from "react";
import { snakeCase, titleCase } from "change-case";
import { Common, Details, createEntity, deepCopy, setUpNiceSelect } from "handy-components";

class NewEntity extends React.Component {
  constructor(props) {
    super(props);
    let obj = {
      fetching: false,
      [this.props.entityName]: deepCopy(this.props.initialEntity),
      errors: [],
    };
    if (this.props.staticData) {
      Object.assign(obj, this.props.staticData);
    }
    this.state = obj;
  }

  componentDidMount() {
    setUpNiceSelect({
      selector: ".admin-modal select",
      func: Details.changeField.bind(this, this.changeFieldArgs()),
    });
  }

  clickAdd(e) {
    let entityNamePlural =
      this.props.entityNamePlural || `${this.props.entityName}s`;
    let directory = snakeCase(entityNamePlural);
    e.preventDefault();
    this.setState({ fetching: true });
    createEntity({
      directory,
      entityName: this.props.entityName,
      entity: this.state[this.props.entityName],
    }).then(
      (response) => {
        if (this.props.redirect) {
          window.location.pathname = `/${directory}/${response[this.props.entityName].id}`;
        } else {
          this.props.callback(response[this.props.responseKey || entityNamePlural]);
        }
      },
      (errors) => {
        this.setState({
          fetching: false,
          errors,
        });
      },
    );
  }

  changeFieldArgs() {
    return {
      allErrors: Errors,
      errorsArray: this.state.errors,
    };
  }

  render() {
    return (
      <div className="handy-component admin-modal">
        <form className="white-box">
          {Common.renderSpinner(this.state.fetching)}
          {Common.renderGrayedOut(this.state.fetching, -36, -32, 5)}
          {this.renderFields()}
          <input
            type="submit"
            className={
              "btn" + Common.renderDisabledButtonClass(this.state.fetching)
            }
            value={
              this.props.buttonText ||
              `Add ${titleCase(this.props.entityName)}`
            }
            onClick={this.clickAdd.bind(this)}
          />
        </form>
      </div>
    );
  }

  renderFields() {
    switch (this.props.entityName) {
      case "album":
        return [
          <div key="1" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 6,
              entity: "album",
              property: "artistName",
              columnHeader: "Artist",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 6,
              entity: "album",
              property: "name",
              columnHeader: "Album",
            })}
          </div>,
        ];
    }
  }
}

export default NewEntity;
