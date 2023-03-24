import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getHourMinuteFromTime } from '../../utils/timepickerUtils';
import { useEffect } from 'react';
import { SCTooltip } from '../TooltipTP';
import { SCButton } from '../../components';

const SCTimeRangePicker = ({
  bookedSlots,
  minuteStep,
  hourStart,
  hourEnd,
  handleChange,
  hasError,
  hint,
  startTimeHelpText,
  endTimeHelpText,
  startTime,
  endTime,
  startTimeLabel,
  endTimeLabel,
  startTimeMinuteStart,
  endTimeMinuteStart,
}) => {
  const { hour: startHour, minute: startMinute } = getHourMinuteFromTime(
    startTime,
  );
  const { hour: endHour, minute: endMinute } = getHourMinuteFromTime(endTime);
  const [startTimeHour, setStartTimeHour] = useState(startHour);
  const [startTimeMinute, setStartTimeMinute] = useState(startMinute);
  const [endTimeHour, setEndTimeHour] = useState(endHour);
  const [endTimeMinute, setEndTimeMinute] = useState(endMinute);
  const [hoveredStartHour, setHoveredStartHour] = useState(startHour);
  const [hoveredEndHour, setHoveredEndHour] = useState(endHour);

  // const [isOpen, setIsOpen] = useState(false);
  const [isOpenStartTimeDropdown, setIsOpenStartTimeDropdown] = useState(false);
  const [isOpenEndTimeDropdown, setIsOpenEndTimeDropdown] = useState(false);
  // const timepickerRef = useRef(null);
  const startTimePickerRef = useRef(null);
  const endTimePickerRef = useRef(null);
  const minuteStart = Math.min(startTimeMinuteStart, endTimeMinuteStart);

  // const handleOutsideSelectClickStartTime = useCallback(
  //   event => {
  //     if (!isOpenStartTimeDropdown) return;
  //     if (
  //       startTimePickerRef &&
  //       startTimePickerRef.current.contains(event.target)
  //     )
  //       return;

  //     setIsOpenStartTimeDropdown(false);
  //   },
  //   [isOpenStartTimeDropdown],
  // );

  // useEffect(() => {
  //   document.addEventListener('click', handleOutsideSelectClickStartTime);
  //   return () =>
  //     document.removeEventListener('click', handleOutsideSelectClickStartTime);
  // }, [handleOutsideSelectClickStartTime]);

  // const handleOutsideSelectClickEndTime = useCallback(
  //   event => {
  //     if (!isOpenEndTimeDropdown) return;
  //     if (endTimePickerRef && endTimePickerRef.current.contains(event.target))
  //       return;

  //     setIsOpenEndTimeDropdown(false);
  //   },
  //   [isOpenEndTimeDropdown],
  // );

  // useEffect(() => {
  //   document.addEventListener('click', handleOutsideSelectClickEndTime);
  //   return () =>
  //     document.removeEventListener('click', handleOutsideSelectClickEndTime);
  // }, [handleOutsideSelectClickEndTime]);

  useEffect(() => {
    if (startTime && endTime) {
      const { hour: startHour, minute: startMinute } = getHourMinuteFromTime(
        startTime,
      );
      const { hour: endHour, minute: endMinute } = getHourMinuteFromTime(
        endTime,
      );
      setStartTimeHour(startHour);
      setStartTimeMinute(startMinute);
      setEndTimeHour(endHour);
      setEndTimeMinute(endMinute);
      setHoveredStartHour(startHour);
      setHoveredEndHour(endHour);
    }
  }, [startTime, endTime]);

  const getDefaultMinutes = () => {
    const minutes = [];
    for (let i = minuteStart; i < 60; i++) {
      minutes[i] = false;
    }
    return minutes;
  };

  const getDefaultHours = () => {
    const hours = [];
    for (let i = hourStart; i <= 23; i++) {
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

  const shouldHourDisabled = hMins => {
    let flag = true;
    for (let i = minuteStart; i < 60; i++) {
      if (!hMins[i]) {
        flag = false;
        break;
      }
    }
    return flag;
  };

  const getEnableOrDisableHours = () => {
    const hours = getDefaultHours();
    if (bookedSlots && bookedSlots.length) {
      const clonedBookedSlots = [...bookedSlots];
      clonedBookedSlots.forEach(time => {
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
          const isHourDisabled = endMin === 59;
          hours[startHour] = { is_disabled: isHourDisabled, minutes };
          hours[endHour] = { ...hours[startHour] };
        } else if (diff === 1) {
          let startMinutes = getEnableOrDisableMins(
            hours[startHour].minutes,
            startMin,
            59,
          );
          let endMinutes = getEnableOrDisableMins(
            hours[endHour].minutes,
            minuteStart,
            endMin,
          );
          const isDisabledStartHour = startMin === minuteStart;
          const isDisabledEndHour = endMin === 59;
          hours[startHour] = {
            is_disabled: isDisabledStartHour,
            minutes: startMinutes,
          };
          hours[endHour] = {
            is_disabled: isDisabledEndHour,
            minutes: endMinutes,
          };
        } else {
          let startMinutes = getEnableOrDisableMins(
            hours[startHour].minutes,
            startMin,
            59,
          );
          let endMinutes = getEnableOrDisableMins(
            hours[endHour].minutes,
            minuteStart,
            endMin,
          );
          const isStartHourDisabled = startMin === minuteStart;
          const isEndHourDisabled = endMin === 59;
          hours[startHour] = {
            is_disabled: isStartHourDisabled,
            minutes: startMinutes,
          };
          hours[endHour] = {
            is_disabled: isEndHourDisabled,
            minutes: endMinutes,
          };
          for (let i = startHour + 1; i < endHour; i++) {
            let minutes = getEnableOrDisableMins(
              hours[i].minutes,
              minuteStart,
              59,
            );
            hours[i] = { is_disabled: true, minutes };
          }
        }
      });
      for (let i = 0; i < 24; i++) {
        hours[i] = {
          ...hours[i],
          is_disabled: shouldHourDisabled(hours[i].minutes),
        };
      }
    }

    return [...hours];
  };

  const allHours = getEnableOrDisableHours();
  // console.log(allHours);

  const getFirstEnableMinuteAfterHourSelection = (hr, startMinute) => {
    for (let i = startMinute; i < 60; i++) {
      if (!allHours[hr].minutes[i]) {
        return i;
      }
    }
  };

  const getTimeModel = (hour, minute) => {
    const model = parseInt(hour) * 100 + parseInt(minute);
    return model;
  };

  const addLeadingZero = (n, threshold = 2) => {
    const num = n.toString();
    return num.length < threshold ? `0${num}` : `${num}`;
  };

  const checkValidation = useCallback(
    (startHour, startMinute, endHour, endMinute) => {
      const start = getTimeModel(startHour, startMinute);
      const end = getTimeModel(endHour, endMinute);
      if (start > end) return false;
      if (start === end) return false;
      if (start < end) {
        const diffInHour = endHour - startHour;
        if (diffInHour === 0) {
          for (let i = startMinute; i <= endMinute; i++) {
            if (allHours[startHour].minutes[i]) {
              return false;
            }
          }
        } else if (diffInHour === 1) {
          for (let i = startMinute; i <= 59; i++) {
            if (allHours[startHour].minutes[i]) {
              return false;
            }
          }
          for (let i = endTimeMinuteStart; i <= endMinute; i++) {
            if (allHours[endHour].minutes[i]) {
              return false;
            }
          }
        } else {
          for (let i = startHour + 1; i < endHour; i++) {
            if (allHours[i].is_disabled) {
              return false;
            } else {
              for (let j = startMinute; j <= 59; j++) {
                if (allHours[i].minutes[j]) {
                  return false;
                }
              }
            }
          }
          for (let i = startMinute; i <= 59; i++) {
            if (allHours[startHour].minutes[i]) {
              return false;
            }
          }
          for (let i = endTimeMinuteStart; i <= endMinute; i++) {
            if (allHours[endHour].minutes[i]) {
              return false;
            }
          }
        }
      }
      return true;
    },
    [allHours, endTimeMinuteStart],
  );

  const handleOutsideSelectClickStartTime = useCallback(
    event => {
      if (!isOpenStartTimeDropdown) return;
      if (
        startTimePickerRef &&
        startTimePickerRef.current &&
        startTimePickerRef.current.contains(event.target)
      )
        return;

      setIsOpenStartTimeDropdown(false);
      const isValid = checkValidation(
        startTimeHour,
        startTimeMinute,
        endTimeHour,
        endTimeMinute,
      );
      const startTimeModel = getTimeModel(startTimeHour, startTimeMinute);
      const endTimeModel = getTimeModel(endTimeHour, endTimeMinute);
      if (handleChange) {
        handleChange(startTimeModel, endTimeModel, isValid);
      }
    },
    [
      isOpenStartTimeDropdown,
      checkValidation,
      startTimeHour,
      startTimeMinute,
      endTimeHour,
      endTimeMinute,
      handleChange,
    ],
  );

  useEffect(() => {
    document.addEventListener('click', handleOutsideSelectClickStartTime);
    return () =>
      document.removeEventListener('click', handleOutsideSelectClickStartTime);
  }, [handleOutsideSelectClickStartTime]);

  const handleOutsideSelectClickEndTime = useCallback(
    event => {
      if (!isOpenEndTimeDropdown) return;
      if (
        endTimePickerRef &&
        endTimePickerRef.current &&
        endTimePickerRef.current.contains(event.target)
      )
        return;

      setIsOpenEndTimeDropdown(false);
      const isValid = checkValidation(
        startTimeHour,
        startTimeMinute,
        endTimeHour,
        endTimeMinute,
      );
      const startTimeModel = getTimeModel(startTimeHour, startTimeMinute);
      const endTimeModel = getTimeModel(endTimeHour, endTimeMinute);
      if (handleChange) {
        handleChange(startTimeModel, endTimeModel, isValid);
      }
    },
    [
      isOpenEndTimeDropdown,
      checkValidation,
      startTimeHour,
      startTimeMinute,
      endTimeHour,
      endTimeMinute,
      handleChange,
    ],
  );

  useEffect(() => {
    document.addEventListener('click', handleOutsideSelectClickEndTime);
    return () =>
      document.removeEventListener('click', handleOutsideSelectClickEndTime);
  }, [handleOutsideSelectClickEndTime]);

  const handleTimeChange = (startHour, startMinute, endHour, endMinute) => {
    setStartTimeHour(startHour);
    setStartTimeMinute(startMinute);
    setEndTimeHour(endHour);
    setEndTimeMinute(endMinute);
    setHoveredStartHour(startHour);
    setHoveredEndHour(endHour);

    const isValid = checkValidation(startHour, startMinute, endHour, endMinute);
    const startTimeModel = getTimeModel(startHour, startMinute);
    const endTimeModel = getTimeModel(endHour, endMinute);
    if (handleChange) {
      handleChange(startTimeModel, endTimeModel, isValid);
    }
  };

  const handleStartHourClick = val => {
    const firstEnableMin = getFirstEnableMinuteAfterHourSelection(
      val,
      startTimeMinuteStart,
    );
    const currentStartMinute = firstEnableMin || startTimeMinute;
    const startHour = parseInt(val);
    handleTimeChange(startHour, currentStartMinute, endTimeHour, endTimeMinute);
  };

  const handleStartMinuteClick = val => {
    const startMinute = parseInt(val);
    handleTimeChange(startTimeHour, startMinute, endTimeHour, endTimeMinute);
  };

  const handleEndHourClick = val => {
    const firstEnableMin = getFirstEnableMinuteAfterHourSelection(
      val,
      endTimeMinuteStart,
    );
    const currentEndMinute = firstEnableMin || endTimeMinute;
    const endHour = parseInt(val);
    handleTimeChange(startTimeHour, startTimeMinute, endHour, currentEndMinute);
  };

  const handleEndMinuteClick = val => {
    const endMinute = parseInt(val);
    handleTimeChange(startTimeHour, startTimeMinute, endTimeHour, endMinute);
  };

  const handleStartTimeDropdownClose = () => {
    setIsOpenStartTimeDropdown(false);
  };

  const handleEndTimeDropdownClose = () => {
    setIsOpenEndTimeDropdown(false);
  };

  const getMinuteRows = (
    match,
    incrementBy = 1,
    hoveredHour,
    handleChangeMinute,
    startMinute,
  ) => {
    const rows = [];
    for (let i = startMinute; i < 60; i += incrementBy) {
      const t = addLeadingZero(i);
      const rowClass = `${
        i === match ? 'sc-timepicker-dropdown-row__selected' : ''
      } sc-timepicker-dropdown-row ${
        allHours[hoveredHour].minutes[i]
          ? 'pointer-events-none bg-red-lighter'
          : ''
      }`;

      rows.push(
        <div key={t} className={rowClass} onClick={() => handleChangeMinute(t)}>
          {t}
        </div>,
      );
    }

    return rows;
  };

  const getHourRows = (match, setHoveredHour, handleChangeHour) => {
    const rows = [];

    for (let i = hourStart; i <= hourEnd; i++) {
      const t = addLeadingZero(i);
      const rowClass = `${
        i === match ? 'sc-timepicker-dropdown-row__selected' : ''
      } sc-timepicker-dropdown-row ${
        allHours[i].is_disabled ? 'pointer-events-none bg-red-lighter' : ''
      }`;

      rows.push(
        <div
          key={t}
          className={rowClass}
          onMouseOver={() => setHoveredHour(i)}
          onClick={() => handleChangeHour(i)}
        >
          {t}
        </div>,
      );
    }

    return rows;
  };

  const getStartTimeDropdown = () => {
    const hourRows = getHourRows(
      startTimeHour,
      setHoveredStartHour,
      handleStartHourClick,
    );
    const minuteRows = getMinuteRows(
      startTimeMinute,
      minuteStep,
      hoveredStartHour,
      handleStartMinuteClick,
      startTimeMinuteStart,
    );

    return !isOpenStartTimeDropdown ? null : (
      <div className="sc-timepicker-dropdown flex flex-col">
        <div className="flex h-64">
          <div className="hour-half">{hourRows}</div>
          <div className="minute-half">{minuteRows}</div>
        </div>
        <div className="flex p-2 justify-end">
          <SCButton
            size="sm"
            className="mt-1"
            label="Close"
            action={handleStartTimeDropdownClose}
          />
        </div>
      </div>
    );
  };
  const getEndTimeDropdown = () => {
    const hourRows = getHourRows(
      endTimeHour,
      setHoveredEndHour,
      handleEndHourClick,
    );
    const minuteRows = getMinuteRows(
      endTimeMinute,
      minuteStep,
      hoveredEndHour,
      handleEndMinuteClick,
      endTimeMinuteStart,
    );

    return !isOpenEndTimeDropdown ? null : (
      <div className="sc-timepicker-dropdown flex flex-col">
        <div className="flex h-64">
          <div className="hour-half">{hourRows}</div>
          <div className="minute-half">{minuteRows}</div>
        </div>
        <div className="flex p-2 justify-end">
          <SCButton
            size="sm"
            className="mt-1"
            label="Close"
            action={handleEndTimeDropdownClose}
          />
        </div>
      </div>
    );
  };
  const handleStartTimeLabelClick = () => {
    if (!isOpenStartTimeDropdown) {
      setIsOpenStartTimeDropdown(true);
      setIsOpenEndTimeDropdown(false);
    }
  };
  const handleEndTimeLabelClick = () => {
    if (!isOpenEndTimeDropdown) {
      setIsOpenEndTimeDropdown(true);
      setIsOpenStartTimeDropdown(false);
    }
  };

  // TODO: Need to add scroll selected to top
  const renderStartTimeHelpText = startTimeHelpText.length ? (
    <SCTooltip content={startTimeHelpText}>
      <i className="sc-question text-grey-darker ml-2" />
    </SCTooltip>
  ) : null;
  const renderEndTimeHelpText = endTimeHelpText.length ? (
    <SCTooltip content={endTimeHelpText}>
      <i className="sc-question text-grey-darker ml-2" />
    </SCTooltip>
  ) : null;
  const labelColor = hasError ? 'text-red-light' : 'text-grey-darker';
  const renderHint = hint.length ? (
    <div className={`${labelColor} text-sm mt-2`}>{hint}</div>
  ) : null;
  const timepickerBorder = hasError ? 'border border-red-light' : 'border-none';
  return (
    <div className="flex flex-col w-full items-start">
      <div className="flex w-full">
        <div className="flex flex-col w-full items-start mr-2">
          <div className="flex items-center mb-2">
            <div className={`${labelColor} text-xs font-normal`}>
              {startTimeLabel}
            </div>
            {renderStartTimeHelpText}
          </div>
          <div ref={startTimePickerRef} className="sc-timepicker">
            <div
              className={`sc-timepicker-label ${timepickerBorder}`}
              onClick={handleStartTimeLabelClick}
            >
              {addLeadingZero(startTimeHour)}:{addLeadingZero(startTimeMinute)}
            </div>
            {getStartTimeDropdown()}
          </div>
        </div>
        <div className="flex flex-col w-full items-start">
          <div className="flex items-center mb-2">
            <div className={`${labelColor} text-xs font-normal`}>
              {endTimeLabel}
            </div>
            {renderEndTimeHelpText}
          </div>
          <div ref={endTimePickerRef} className="sc-timepicker">
            <div
              className={`sc-timepicker-label ${timepickerBorder}`}
              onClick={handleEndTimeLabelClick}
            >
              {addLeadingZero(endTimeHour)}:{addLeadingZero(endTimeMinute)}
            </div>
            {getEndTimeDropdown()}
          </div>
        </div>
      </div>
      {renderHint}
    </div>
  );
};

SCTimeRangePicker.propTypes = {
  bookedSlots: PropTypes.array,
  startTime: PropTypes.number,
  endTime: PropTypes.number,
  value: PropTypes.number,
  hourStart: PropTypes.number,
  startTimeMinuteStart: PropTypes.number,
  endTimeMinuteStart: PropTypes.number,
  hourEnd: PropTypes.number,
  minuteStep: PropTypes.oneOf([1, 5, 10, 15, 20, 30]),
  handleChange: PropTypes.func,
  startTimeHelpText: PropTypes.string,
  endTimeHelpText: PropTypes.string,
  startTimeLabel: PropTypes.string,
  endTimeLabel: PropTypes.string,
  hasError: PropTypes.bool,
  hint: PropTypes.string,
};

SCTimeRangePicker.defaultProps = {
  bookedSlots: [],
  startTime: 0,
  endTime: 1,
  hourStart: 0,
  startTimeMinuteStart: 0,
  endTimeMinuteStart: 1,
  hourEnd: 23,
  minuteStep: 1,
  startTimeHelpText: '',
  endTimeHelpText: '',
  startTimeLabel: 'Start time',
  endTimeLabel: 'End time',
  hasError: false,
  hint: '',
};

export default SCTimeRangePicker;
