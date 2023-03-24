import React, { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import differenceInDays from 'date-fns/differenceInDays';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import { SCTooltip } from '../TooltipTP';
import CustomHeader from './CustomHeader.jsx';
import CustomTimeInput from './CustomTimeInput.jsx';
import 'react-datepicker/dist/react-datepicker.css';
import { validateDate } from './validateDate.js';
import { dateStateValueDecider } from './dateStateValueDecider';
import customDayContents from './CustomDayContents.jsx';

const SCDatepicker = ({
  disableLabel,
  selectsRange,
  containerClass,
  inputClass,
  title,
  helpText,
  startDate,
  endDate,
  minDate,
  maxDate,
  givenFormat,
  displayFormat,
  isClearable,
  placeholder,
  renderCustomHeader,
  closeOnScroll,
  showTimeInput,
  elementType,
  maxDaysLimit,
  onSelect,
  disabledKeyboardNavigation,
}) => {
  registerLocale('en');
  setDefaultLocale('en');

  const [hasError, setHasError] = useState(false);
  const [hint, setHint] = useState('');

  const datesToValidate = [startDate, endDate, minDate, maxDate];
  datesToValidate.forEach(date => validateDate(date, givenFormat));

  //Date States
  const [dateStart, setDateStart] = useState(
    dateStateValueDecider(startDate, givenFormat),
  );
  const [dateEnd, setDateEnd] = useState(
    dateStateValueDecider(endDate, givenFormat),
  );
  const [dateMin, setDateMin] = useState(
    dateStateValueDecider(minDate, givenFormat),
  );
  const [dateMax, setDateMax] = useState(
    dateStateValueDecider(maxDate, givenFormat),
  );
  const [dateRange, setDateRange] = useState([dateStart, dateEnd]);
  const [dateToStartForRange, dateToEnd] = dateRange;
  const [openDatePicker, setOpenDatePicker] = useState(false);
  // const [shouldCloseOnSelect, setShouldCloseOnSelect] = useState(!selectsRange);

  useEffect(() => {
    setDateStart(dateStateValueDecider(startDate, givenFormat));
  }, [givenFormat, startDate]);

  useEffect(() => {
    setDateEnd(dateStateValueDecider(endDate, givenFormat));
  }, [endDate, givenFormat]);

  useEffect(() => {
    setDateRange([dateStart, dateEnd]);
  }, [dateStart, dateEnd]);

  useEffect(() => {
    setDateMin(dateStateValueDecider(minDate, givenFormat));
  }, [givenFormat, minDate]);
  useEffect(() => {
    setDateMax(dateStateValueDecider(maxDate, givenFormat));
  }, [givenFormat, maxDate]);

  //Process classes
  const containerClasses = [
    elementType === 'button'
      ? 'sc-select-container'
      : 'sc-select-container mr-4 mt-4 mb-4 ',
  ];
  if (containerClass) {
    containerClasses.push(containerClass);
  }
  if (hasError) {
    containerClasses.push('sc-select-error ');
  }
  const inputClasses = [
    elementType === 'input'
      ? 'sc-selector pl-2'
      : 'sc-btn sc-date-range-picker-btn-lg',
  ];
  if (inputClass) {
    inputClasses.push(inputClass);
  }

  if (elementType === 'button') {
    if (dateRange[0] && dateRange[1]) {
      inputClasses.push(' sc-btn-primary ');
    } else {
      inputClasses.push(' sc-btn-primary-outline ');
    }
  }

  //Process labels and titles
  const titleLabel = title ? (
    <div className="sc-select-title">{title}</div>
  ) : null;
  const renderHelpText = helpText.length ? (
    <SCTooltip id="help-text-tooltip" content={helpText}>
      <i className="sc-question text-grey-darker ml-2" />
    </SCTooltip>
  ) : null;
  const labelColor = hasError ? 'text-red-light' : 'text-grey-darker';
  const renderHint = hint.length ? (
    <div className={`${labelColor} text-xs mt-1`}>{hint}</div>
  ) : null;

  // const dropDownIcon = 'icon-key-arrow-up';

  //Handle Actions
  const handleDatePickerClick = e => {
    e.preventDefault();
    setOpenDatePicker(!openDatePicker);
  };

  const handleOnBlur = event => {
    setOpenDatePicker(false);
  };

  const sendUpdateToParent = (update, e) => {
    const data = {
      error: null,
      errorMessage: '',
      data: update,
    };
    onSelect && onSelect(data, e);
  };

  const onChangeDate = (update, e) => {
    if (
      selectsRange &&
      maxDaysLimit &&
      update[1] &&
      update[0] &&
      maxDaysLimit > 0 &&
      differenceInDays(update[1], update[0]) + 1 > maxDaysLimit
    ) {
      setHasError(true);
      setHint('Select maximum days of ' + maxDaysLimit);
      setOpenDatePicker(true);
      return;
    }
    setHasError(false);
    setHint('');
    // setShouldCloseOnSelect(true);

    // if (selectsRange && maxDaysLimit && maxDaysLimit > 0 && update[0]) {
    //   const maximumDateToSet = new Date(update[0]);
    //   maximumDateToSet.setDate(maximumDateToSet.getDate() + maxDaysLimit);
    //   setDateMax(maximumDateToSet);
    // }

    if (selectsRange && (!update[1] || !update[0])) {
      setOpenDatePicker(true);
    } else {
      setOpenDatePicker(false);
    }
    if (!selectsRange) {
      setDateStart(update);
    } else {
      setDateRange(update);
    }

    sendUpdateToParent(update, e);
  };

  // const onChangeManualInput = date => {
  //   // setDateStart(date);
  //   // setOpenDatePicker(false);
  // };

  const CustomInput = forwardRef(({ value, onClick, onChange }, ref) => (
    <div onClick={handleDatePickerClick}>
      {elementType !== 'button' ? (
        <input
          value={value}
          onChange={e => onChangeDate(e.target.value)}
          // style={{ border: 'solid 1px blue' }}
          type="text"
          className={inputClasses.join(' ')}
          placeholder={placeholder}
        />
      ) : (
        <button
          className={inputClasses.join(' ')}
          onChange={e => onChangeDate(e.target.value)}
        >
          {value ? value : placeholder}
        </button>
      )}

      {/*<span>📅</span>*/}
    </div>
  ));

  //Process extra props dynamically
  const extraProps = {};
  if (renderCustomHeader) {
    extraProps['renderCustomHeader'] = CustomHeader;
  }
  if (showTimeInput) {
    extraProps['showTimeInput'] = showTimeInput;
    extraProps['customTimeInput'] = <CustomTimeInput />;
  }
  if (minDate || dateMin) {
    extraProps['minDate'] = dateMin;
  }
  if (maxDate || dateMax) {
    extraProps['maxDate'] = dateMax;
  }

  return (
    <div className={containerClasses.join(' ')}>
      {!disableLabel ? (
        <div className="flex items-center mb-2">
          {titleLabel}
          {renderHelpText}
        </div>
      ) : null}

      {/*<div*/}
      {/*  className={'sc-selector'}*/}
      {/*  onClick={handleDatePickerClick}*/}
      {/*  // onBlur={handleOnBlur}*/}
      {/*>*/}

      {/*</div>*/}
      {/*<label onClick={handleDatePickerClick}>*/}
      <DatePicker
        dateFormat={displayFormat}
        closeOnScroll={closeOnScroll}
        selected={selectsRange ? dateToStartForRange : dateStart}
        startDate={selectsRange ? dateToStartForRange : null}
        endDate={dateToEnd}
        selectsRange={selectsRange}
        onChange={(update, e) => onChangeDate(update, e)}
        // onBlur={handleOnBlur}
        onClickOutside={handleOnBlur}
        open={openDatePicker}
        placeholderText={placeholder}
        onKeyDown={e => {
          e.preventDefault();
        }}
        isClearable={isClearable}
        className={inputClasses.join(' ')}
        locale={'en'}
        // renderCustomHeader = {() => <div></div>}
        renderDayContents={customDayContents}
        // dayClassName={handleOnBlur}
        shouldCloseOnSelect={false}
        customInput={<CustomInput />}
        disabledKeyboardNavigation={disabledKeyboardNavigation}
        {...extraProps}
      >
        {hasError && renderHint && (
          <div
            className={'text-center font-bold mb-2'}
            style={{
              textAlign: 'center',
            }}
          >
            {renderHint}
          </div>
        )}
      </DatePicker>
      {/*<span onClick={handleDatePickerClick}>📅</span>*/}
      {renderHint}
    </div>
  );
};

SCDatepicker.defaultProps = {
  disableLabel: false,
  className: '',
  title: 'Date',
  helpText: 'Pick a date',
  showTimeInput: false,
  selectsRange: false,
  startDate: null,
  endDate: null,
  minDate: null,
  maxDate: null,
  givenFormat: 'dd/MM/yyyy',
  displayFormat: 'MMM d yyyy',
  selected: new Date(),
  isClearable: false,
  placeholderText: 'Select a Date',
  closeOnScroll: true,
  renderCustomHeader: true,
  elementType: 'input',
  onSelect: () => {},
  maxDaysCounts: null,
  disabledKeyboardNavigation: true,
};

SCDatepicker.propTypes = {
  disableLabel: PropTypes.bool,
  className: PropTypes.string,
  inputClass: PropTypes.string,
  title: PropTypes.string,
  helpText: PropTypes.string,
  showTimeInput: PropTypes.bool,
  selectsRange: PropTypes.bool,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  isClearable: PropTypes.bool,
  placeholderText: PropTypes.string,
  givenFormat: PropTypes.string,
  displayFormat: PropTypes.string,
  closeOnScroll: PropTypes.bool,
  renderCustomHeader: PropTypes.bool,
  elementType: PropTypes.string,
  maxDaysCounts: PropTypes.number,
  onSelect: PropTypes.func,
};

export default SCDatepicker;
