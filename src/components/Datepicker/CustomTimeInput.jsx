import React from 'react';

const CustomTimeInput = ({ date, value, onChange }) => {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ border: 'solid 1px #5A57EB' }}
      className={'datepicker-time-input'}
    />
  );
};

export default CustomTimeInput;
