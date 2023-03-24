import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SCTooltip } from '../TooltipTP';

class SCTimepicker extends Component {
  constructor(props) {
    super(props);

    const { hour, minute } = this.getHourMinuteFromProp(props);

    this.state = {
      model: props.value,
      hour: hour,
      minute: minute,
      isOpen: false,
    };

    this.SCTimepickerRef = React.createRef();

    this.showDropdown = this.showDropdown.bind(this);
    this.hideDropdown = this.hideDropdown.bind(this);
    this.handleLabelClick = this.handleLabelClick.bind(this);
    this.handleHourClick = this.handleHourClick.bind(this);
    this.handleMinuteClick = this.handleMinuteClick.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleOutsideSelectClick = this.handleOutsideSelectClick.bind(this);
  }

  static propTypes = {
    value: PropTypes.number,
    hourStart: PropTypes.number,
    minuteStart: PropTypes.number,
    hourEnd: PropTypes.number,
    minuteStep: PropTypes.oneOf([1, 5, 10, 15, 20, 30]),
    handleChange: PropTypes.func,
    helpText: PropTypes.string,
    label: PropTypes.string,
    hasError: PropTypes.bool,
    hint: PropTypes.string,
  };

  static defaultProps = {
    value: 1000,
    hourStart: 0,
    minuteStart: 0,
    hourEnd: 23,
    minuteStep: 5,
    helpText: '',
    label: '',
    hasError: false,
    hint: '',
    handleChange: () => {},
  };

  componentDidMount() {
    document.addEventListener('click', this.handleOutsideSelectClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideSelectClick);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.value !== this.state.model) {
      const { hour, minute } = this.getHourMinuteFromProp(nextProps);
      const model = nextProps.value;

      this.setState({ model, hour, minute });
    }

    return true;
  }

  getHourMinuteFromProp(props) {
    let minute = props.value % 100;
    minute = minute > 59 ? 59 : minute;

    let hour = Math.floor(props.value / 100);
    hour = hour > 23 ? 23 : hour;

    return { hour, minute };
  }

  addLeadingZero(n, threshold = 2) {
    const num = n.toString();
    return num.length < threshold ? `0${num}` : `${num}`;
  }

  showDropdown() {
    this.setState({
      isOpen: true,
    });
  }

  hideDropdown() {
    this.setState({
      isOpen: false,
    });
  }

  handleOutsideSelectClick(event) {
    if (!this.state.isOpen) return;
    if (
      this.SCTimepickerRef &&
      this.SCTimepickerRef.current.contains(event.target)
    )
      return;

    this.hideDropdown();
  }

  handleLabelClick() {
    if (!this.state.isOpen) this.showDropdown();
  }

  handleTimeChange(model, hour, minute) {
    this.setState({ model, hour, minute });
    this.props.handleChange(model);
  }

  handleHourClick(val) {
    const model = parseInt(val) * 100 + parseInt(this.state.minute);
    const hour = parseInt(val);
    this.handleTimeChange(model, hour, this.state.minute);
  }

  handleMinuteClick(val) {
    const model = parseInt(this.state.hour) * 100 + parseInt(val);
    const minute = parseInt(val);
    this.handleTimeChange(model, this.state.hour, minute);
  }

  getMinuteRows(match, incrementBy = 1) {
    const rows = [];
    for (let i = this.props.minuteStart; i < 60; i += incrementBy) {
      const t = this.addLeadingZero(i);
      const rowClass = `${
        i === match ? 'sc-timepicker-dropdown-row__selected' : ''
      } sc-timepicker-dropdown-row`;

      rows.push(
        <div
          key={t}
          className={rowClass}
          onClick={() => this.handleMinuteClick(t)}
        >
          {t}
        </div>,
      );
    }

    return rows;
  }

  getHourRows(match) {
    const rows = [];

    for (let i = this.props.hourStart; i <= this.props.hourEnd; i++) {
      const t = this.addLeadingZero(i);
      const rowClass = `${
        i === match ? 'sc-timepicker-dropdown-row__selected' : ''
      } sc-timepicker-dropdown-row`;

      rows.push(
        <div
          key={t}
          className={rowClass}
          onClick={() => this.handleHourClick(t)}
        >
          {t}
        </div>,
      );
    }

    return rows;
  }

  getTimeDropdown() {
    const hourRows = this.getHourRows(this.state.hour);
    const minuteRows = this.getMinuteRows(
      this.state.minute,
      this.props.minuteStep,
    );

    return !this.state.isOpen ? null : (
      <div className="sc-timepicker-dropdown">
        <div className="hour-half">{hourRows}</div>
        <div className="minute-half">{minuteRows}</div>
      </div>
    );
  }

  render() {
    const renderHelpText = this.props.helpText.length ? (
      <SCTooltip content={this.props.helpText}>
        <i className="sc-question text-grey-darker ml-2" />
      </SCTooltip>
    ) : null;
    const labelColor = this.props.hasError
      ? 'text-red-light'
      : 'text-grey-darker';
    const renderHint = this.props.hint.length ? (
      <div className={`${labelColor} text-xs mt-2`}>{this.props.hint}</div>
    ) : null;
    const timepickerBorder = this.props.hasError
      ? 'border border-red-light'
      : 'border-none';
    return (
      <div className="flex flex-col w-full items-start">
        <div className="flex items-center mb-2">
          <div className={`${labelColor} text-xs font-normal bor`}>
            {this.props.label}
          </div>
          {renderHelpText}
        </div>
        <div ref={this.SCTimepickerRef} className="sc-timepicker">
          <div
            className={`sc-timepicker-label ${timepickerBorder}`}
            onClick={this.handleLabelClick}
          >
            {this.addLeadingZero(this.state.hour)}:
            {this.addLeadingZero(this.state.minute)}
          </div>
          {this.getTimeDropdown()}
        </div>
        {renderHint}
      </div>
    );
  }
}

export default SCTimepicker;
