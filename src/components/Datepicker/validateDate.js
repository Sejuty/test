import { isValid } from 'date-fns';
import ParseDate from 'date-fns/parse';

export const validateDate = (date, givenFormat) => {
  if (
    date &&
    !(date instanceof Date) &&
    !isValid(ParseDate(date, givenFormat, new Date()))
  ) {
    throw new Error(
      'Invalid date format given. Expected ' +
        givenFormat +
        '. Given: ' +
        date,
    );
  }
};
