import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SCTooltip } from '../../components';

class SCInput extends Component {
  constructor(props) {
    super(props);
    this.inputEl = React.createRef();
    this.state = {
      model: props.value,
    };

    this.onLegendClick = this.onLegendClick.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.setValue = this.setValue.bind(this);
  }
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    inputClass: PropTypes.string,
    type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'phone'])
      .isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    placeholder: PropTypes.string,
    helpText: PropTypes.string,
    hint: PropTypes.string,
    readOnly: PropTypes.bool,
    hasError: PropTypes.bool,
    handleFocus: PropTypes.func,
    handleBlur: PropTypes.func,
    handleChange: PropTypes.func,
  };
  static defaultProps = {
    type: 'text',
    value: '',
    helpText: '',
    readOnly: false,
    hasError: false,
    handleChange: () => {},
    handleFocus: () => {},
    handleBlur: () => {},
  };
  onLegendClick(e) {
    if (this.inputEl && !this.props.readOnly) {
      this.inputEl.current.focus(e);
    }
  }
  onValueChange(e) {
    this.setState({
      model: e.target.value,
    });
    this.props.handleChange(e);
  }
  setValue(val = '') {
    this.setState({
      model: val,
    });
  }
  shouldComponentUpdate(nextProps) {
    if (nextProps.value !== this.state.model) {
      this.setState({
        model: nextProps.value,
      });
    }

    return true;
  }
  render() {
    const containerClass = ['sc-input-container'];

    if (this.props.className) {
      containerClass.push(this.props.className);
    }

    if (this.props.hasError) {
      containerClass.push('sc-input-error');
    }

    const inputLabel = !this.props.id ? (
      <legend onClick={this.onLegendClick}>{this.props.label}</legend>
    ) : (
      <label htmlFor={this.props.id}>{this.props.label}</label>
    );

    const renderHelpText = 
      this.props.helpText.length ? (
        <SCTooltip id="help-text-tooltip" content={this.props.helpText}>
          <i className="sc-question text-grey-darker ml-2" />
        </SCTooltip>
      ) : null;

    return (
      <div className={containerClass.join(' ')}>
        <div className="flex">
          {inputLabel}
          {renderHelpText}
        </div>
        <input
          ref={this.inputEl}
          id={this.props.id}
          name={this.props.name}
          className={this.props.inputClass}
          type={this.props.type}
          placeholder={this.props.placeholder}
          readOnly={this.props.readOnly}
          value={this.state.model}
          onChange={this.onValueChange}
          onFocus={this.props.handleFocus}
          onBlur={this.props.handleBlur}
        />
        <span className="sc-input-hint">{this.props.hint}</span>
      </div>
    );
  }
}

export default SCInput;
