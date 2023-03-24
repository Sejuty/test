import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SCTooltip } from '../../components';
import { processProps } from '../../utils';

function setInitialState(state, defaultValue, trueValue) {
  if (state !== undefined && state.toString() && state.toString().length)
    return state === trueValue;
  else if (
    defaultValue !== undefined &&
    defaultValue.toString() &&
    defaultValue.toString().length
  )
    return defaultValue === trueValue;
  else return state === trueValue;
}

class SCSwitch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      trueValue: this.props.trueValue,
      falseValue: this.props.falseValue,
      isEnabled: setInitialState(
        this.props.value,
        this.props.defaultValue,
        this.props.trueValue,
      ),
    };

    this.onChange = this.onChange.bind(this);
  }
  static propTypes = {
    disabled: PropTypes.bool,
    trueValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    falseValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    defaultValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    className: PropTypes.string,
    handleChange: PropTypes.func,
    disabledMessage: PropTypes.string,
    disabledTooltipId: PropTypes.string,
  };
  static defaultProps = {
    disabled: false,
    trueValue: true,
    falseValue: false,
    // value: false,
    defaultValue: true,
    handleChange: () => {},
    disabledMessage: '',
    disabledTooltipId: 'tooltip',
  };

  onChange(e) {
    const newVal = e.target.checked
      ? this.state.trueValue
      : this.state.falseValue;

    let valForSet;

    if (
      this.props.value !== undefined &&
      this.props.value.toString() &&
      this.props.value.toString().length
    ) {
      valForSet = this.props.value === this.props.trueValue;
    } else if (
      this.props.defaultValue !== undefined &&
      this.props.defaultValue.toString() &&
      this.props.defaultValue.toString().length
    ) {
      valForSet = e.target.checked;
    } else {
      valForSet = this.props.value === this.props.trueValue;
    }

    this.setState({
      isEnabled: valForSet,
    });

    this.props.handleChange(newVal);
  }
  setValue(val = false) {
    this.setState({
      isEnabled: !!val,
    });
  }

  shouldComponentUpdate(nextProps) {
    const nextPropsVal = nextProps.value === this.state.trueValue;

    if (nextPropsVal !== this.state.isEnabled) {
      this.setState({
        isEnabled: nextPropsVal,
      });
    }

    return true;
  }

  render() {
    const switchClass = ['sc-switch'];

    if (this.props.className) switchClass.push(this.props.className);

    if (this.props.disabled) switchClass.push('sc-switch-disabled');

    const tooltipMessage =
      this.props.disabled && this.props.disabledMessage
        ? this.props.disabledMessage
        : null;

    const finalProps = processProps(this.props, {
      className: switchClass.join(' '),
    });

    const switch_ = (
      <label {...finalProps}>
        <input
          type="checkbox"
          checked={this.state.isEnabled}
          onChange={this.onChange}
          disabled={this.props.disabled}
          className="sc-switch-input"
        />
        <span className="sc-switch-slider"></span>
      </label>
    );

    return tooltipMessage ? (
      <SCTooltip
        id={this.props.disabledTooltipId}
        content={tooltipMessage}
        position="top"
        variant="primary"
      >
        {switch_}
      </SCTooltip>
    ) : (
      switch_
    );
  }
}

export default SCSwitch;
