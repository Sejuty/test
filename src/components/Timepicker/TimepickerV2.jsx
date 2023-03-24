import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getHourMinuteFromTime } from '../../utils/timepickerUtils';
import { useEffect } from 'react';

const SCTimepickerV2 = ({
  startTime,
  endTime,
  value,
  bookedSlots,
  minuteStart,
  minuteStep,
  hourStart,
  hourEnd,
  handleChange,
}) => {
  const { hour: hr, minute } = getHourMinuteFromTime(value);
  const [model, setModel] = useState(value);
  const [hour, setHour] = useState(hr);
  const [min, setMin] = useState(minute);

  const [isOpen, setIsOpen] = useState(false);
  const [hoveredHour, setHoveredHour] = useState(hr);
  const timepickerRef = useRef(null);

  const handleOutsideSelectClick = useCallback(
    event => {
      if (!isOpen) return;
      if (timepickerRef && timepickerRef.current.contains(event.target)) return;

      setIsOpen(false);
    },
    [isOpen],
  );

  useEffect(() => {
    document.addEventListener('click', handleOutsideSelectClick);
    return () =>
      document.removeEventListener('click', handleOutsideSelectClick);
  }, [handleOutsideSelectClick]);

  useEffect(() => {
    if (value) {
      const { hour, minute } = getHourMinuteFromTime(value);
      setModel(value);
      setHour(hour);
      setMin(minute);
    }
  }, [value]);

  const getDefaultMinutes = () => {
    const minutes = [];
    for (let i = 1; i < 60; i++) {
      minutes[i] = false;
    }
    return minutes;
  };

  const getDefaultHours = () => {
    const hours = [];
    for (let i = 0; i <= 23; i++) {
      hours[i] = { is_disabled: false, minutes: getDefaultMinutes() };
    }
    return hours;
  };

  const getEnableOrDisableMins = (defaultMins, start, end) => {
    const mins = [...defaultMins];
    for (let i = start; i <= end; i++) {
      mins[i] = true;
    }
    return mins;
  };

  const getEnableOrDisableHours = () => {
    const hours = getDefaultHours();
    bookedSlots.forEach(time => {
      const { hour: startHour, minute: startMin } = getHourMinuteFromTime(
        time.start_time,
      );
      const { hour: endHour, minute: endMin } = getHourMinuteFromTime(
        time.end_time,
      );
      let diff = endHour - startHour;
      if (diff === 0) {
        let minutes = getEnableOrDisableMins(
          hours[startHour].minutes,
          startMin,
          endMin,
        );
        hours[startHour] = { is_disabled: false, minutes };
        hours[endHour] = { ...hours[startHour] };
      } else if (diff === 1) {
        let startMinutes = getEnableOrDisableMins(
          hours[startHour].minutes,
          startMin,
          59,
        );
        let endMinutes = getEnableOrDisableMins(
          hours[endHour].minutes,
          0,
          endMin,
        );
        hours[startHour] = { is_disabled: false, minutes: startMinutes };
        hours[endHour] = { is_disabled: false, minutes: endMinutes };
      } else {
        let startMinutes = getEnableOrDisableMins(
          hours[startHour].minutes,
          startMin,
          59,
        );
        let endMinutes = getEnableOrDisableMins(
          hours[endHour].minutes,
          0,
          endMin,
        );
        hours[startHour] = { is_disabled: false, minutes: startMinutes };
        hours[endHour] = { is_disabled: false, minutes: endMinutes };

        for (let i = startHour; i < endHour; i++) {
          let minutes = getEnableOrDisableMins(hours[i].minutes, startMin, 59);
          hours[i] = { is_disabled: true, minutes };
        }
      }
    });

    return hours;
  };

  const allHours = getEnableOrDisableHours();

  const getFirstEnableMinuteAfterHourSelection = hr => {
    for (let i = 1; i < 60; i++) {
      if (!allHours[hr].minutes[i]) {
        return i;
      }
    }
  };

  const addLeadingZero = (n, threshold = 2) => {
    const num = n.toString();
    return num.length < threshold ? `0${num}` : `${num}`;
  };

  const handleTimeChange = (model, hour, minute) => {
    setModel(model);
    setHour(hour);
    setMin(minute);
    if (handleChange) {
      handleChange(model);
    }
  };

  const handleHourClick = val => {
    const currentMinute = getFirstEnableMinuteAfterHourSelection(val);
    const model = parseInt(val) * 100 + parseInt(currentMinute);
    const hour = parseInt(val);
    handleTimeChange(model, hour, currentMinute);
  };

  const handleMinuteClick = val => {
    const model = parseInt(hour) * 100 + parseInt(val);
    const minute = parseInt(val);
    handleTimeChange(model, hour, minute);
  };

  const getMinuteRows = (match, incrementBy = 1) => {
    const rows = [];
    for (let i = minuteStart; i < 60; i += incrementBy) {
      const t = addLeadingZero(i);
      const rowClass = `${
        i === match ? 'sc-timepicker-dropdown-row__selected' : ''
      } sc-timepicker-dropdown-row ${
        allHours[hoveredHour].minutes[i]
          ? 'pointer-events-none bg-grey-dark'
          : ''
      }`;

      rows.push(
        <div key={t} className={rowClass} onClick={() => handleMinuteClick(t)}>
          {t}
        </div>,
      );
    }

    return rows;
  };

  const getHourRows = match => {
    const rows = [];

    for (let i = hourStart; i <= hourEnd; i++) {
      const t = addLeadingZero(i);
      const rowClass = `${
        i === match ? 'sc-timepicker-dropdown-row__selected' : ''
      } sc-timepicker-dropdown-row ${
        allHours[i].is_disabled ? 'pointer-events-none bg-grey-dark' : ''
      }`;

      rows.push(
        <div
          key={t}
          className={rowClass}
          onMouseOver={() => setHoveredHour(i)}
          onClick={() => handleHourClick(i)}
        >
          {t}
        </div>,
      );
    }

    return rows;
  };

  const getTimeDropdown = () => {
    const hourRows = getHourRows(hour);
    const minuteRows = getMinuteRows(min, minuteStep);

    return !isOpen ? null : (
      <div className="sc-timepicker-dropdown flex">
        <div className="hour-half">{hourRows}</div>
        <div className="minute-half ml-4">{minuteRows}</div>
      </div>
    );
  };

  const handleLabelClick = () => {
    if (!isOpen) setIsOpen(true);
  };

  // Test Case: 1. Check whether selected time is within or not 2. star time should be less than end time

  return (
    <div className="flex flex-col w-full items-start">
      {/* <div className="flex items-center mb-2">
          <div className={`${labelColor} text-xs font-normal bor`}>
            {this.props.label}
          </div>
          {renderHelpText}
        </div> */}
      <div className="flex items-center w-full">
        <div ref={timepickerRef} className="sc-timepicker flex-1">
          <div className={`sc-timepicker-label`} onClick={handleLabelClick}>
            {addLeadingZero(hour)}:{addLeadingZero(min)}
          </div>
          {getTimeDropdown()}
        </div>
        <div>---</div>
        <div ref={timepickerRef} className="sc-timepicker flex-1">
          <div className={`sc-timepicker-label`} onClick={handleLabelClick}>
            {addLeadingZero(hour)}:{addLeadingZero(min)}
          </div>
          {getTimeDropdown()}
        </div>
      </div>
      {/* {renderHint} */}
    </div>
  );
};

SCTimepickerV2.propTypes = {
  bookedSlots: PropTypes.array,
  startTime: PropTypes.number,
  endTime: PropTypes.number,
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

SCTimepickerV2.defaultProps = {
  bookedSlots: [
    { start_time: 100, end_time: 105 },
    { start_time: 110, end_time: 210 },
    { start_time: 300, end_time: 600 },
    { start_time: 700, end_time: 730 },
  ],
  startTime: 1000,
  endTime: 1200,
  value: 300,
  hourStart: 0,
  minuteStart: 0,
  hourEnd: 23,
  minuteStep: 1,
  helpText: '',
  label: '',
  hasError: false,
  hint: '',
};

export default SCTimepickerV2;
