import React from 'react';
import { background } from '@storybook/theming';

const CustomDayContents = (day, date) => {
  const tooltipText = `${date}`;
  return <span title={tooltipText} className={''} style={background}>{day}</span>;
};

export default CustomDayContents;
