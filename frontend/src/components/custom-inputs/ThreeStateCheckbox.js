import React from "react";
import PropTypes from "prop-types";

// https://github.com/EpkCloud/react-indeterminate-checkbox#readme

class ThreeStateCheckbox extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    status: PropTypes.number,
    onChange: PropTypes.func
  };

  static defaultProps = {
    status: 0
  };

  state = {
    status: this.props.status
  };

  componentDidMount() {
    this.updateElement(this.state.status);
  }

  handleChange(event) {
    event.persist();

    const status = this.state.status;
    if (status < 2) {
      return this.setState({ status: status + 1 }, this.afterSetState);
    }
    return this.setState({ status: 0 }, this.afterSetState);
  }

  afterSetState = () => {
    this.updateElement();
    this.notifyOnChange();
  };

  updateElement() {
    switch (this.state.status) {
    case 1:
      this.el.indeterminate = false;
      this.el.checked = true;
      break;
    case 2:
      this.el.indeterminate = false;
      this.el.checked = false;
      break;
    default:
      this.el.indeterminate = true;
      this.el.checked = false;
      break;
    }
  }

  notifyOnChange() {
    if (this.props.onChange) {
      this.props.onChange(this.props.name, this.state.status);
    }
  }

  render() {
    return (
      <div className="three-state-checkbox">
        <input
          type="checkbox"
          id={this.props.name}
          ref={el => (this.el = el)}
          onChange={e => this.handleChange(e)}
        />
        <label htmlFor={this.props.name}>{this.props.label}</label>
      </div>
    );
  }
}

export default ThreeStateCheckbox;
