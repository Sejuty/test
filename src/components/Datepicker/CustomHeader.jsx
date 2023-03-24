import React from 'react';
import { getMonth, getYear } from 'date-fns';
import range from 'lodash/range';

const CustomHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => {
  const years = range(1990, getYear(new Date()) + 1, 1);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return (
    <div
      className="datepicker-header"
      style={{
        margin: 10,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className={'mr-2'}
      >
        {'<'}
      </button>
      <select
        className={'mr-2 text-center'}
        value={getYear(date)}
        onChange={({ target: { value } }) => changeYear(value)}
      >
        s
        {years.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        className={'mr-2  text-center'}
        value={months[getMonth(date)]}
        onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
      >
        {months.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
        {'>'}
      </button>
      {/*<div></div>*/}
      {/*<button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className={'sc-btn'}>*/}
      {/*  {'Clear'}*/}
      {/*</button>*/}
      {/*<button type="button" className="react-datepicker__close-icon" aria-label="Close" tabIndex="-1"></button>*/}
    </div>
  );
};

export default CustomHeader;
