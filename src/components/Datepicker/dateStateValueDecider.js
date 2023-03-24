import { parse } from 'date-fns';

export const dateStateValueDecider = (initialDate, givenFormat) => {
  return initialDate
    ? initialDate instanceof Date
      ? initialDate
      : parse(initialDate, givenFormat, new Date())
    : null;
};
