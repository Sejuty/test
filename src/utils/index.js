const OBJECT = 'object';
const ALPHANUMERIC_PATTERN = /^[a-z0-9]+$/i;

const nullOrUndefined = val => val === null || val === undefined;

const isNumber = val => {
  return !isNaN(val) && isFinite(val) && typeof val === 'number';
};

const isObject = checkObj => {
  return (
    checkObj && typeof checkObj === 'object' && Object.keys(checkObj).length > 0
  );
};

const isArray = arr => {
  return Array.isArray(arr);
};

const isAlphaNumeric = val => {
  return ALPHANUMERIC_PATTERN.test(val);
};

const range = (start, end) => {
  if (
    nullOrUndefined(start) ||
    !isNumber(start) ||
    nullOrUndefined(end) ||
    !isNumber(end)
  )
    return [];

  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }

  return arr;
};

const deepEqual = (x, y) => {
  if (x === y) {
    return true;
  } else if (
    typeof x == OBJECT &&
    x != null &&
    typeof y == OBJECT &&
    y != null
  ) {
    if (Object.keys(x).length !== Object.keys(y).length) return false;

    for (let prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop])) return false;
      } else return false;
    }

    return true;
  } else return false;
};

// props -> All the props provided to the component
// selectedProps -> All the props that are selected to be used during rendering
const processProps = (props, selectedProps) => {
  // Initialize with the common props
  let finalProps = {
    className: props.className || null,
    "data-tip": props["data-tip"] || null,
    "data-for": props["data-for"] || null
  };

  // Loop through the selected props and see if any value needs to be mapped to a new one
  for (const [key, value] of Object.entries(selectedProps)) {
    let newValue;
    switch(key){
      case 'className':
          newValue = [props.className, selectedProps.className].join(' ').trim()
        break;
      default:
        newValue = value || null;
    }

    finalProps[key] = newValue;
  }

  return finalProps;
}

export {
  range,
  nullOrUndefined,
  isNumber,
  isObject,
  isArray,
  isAlphaNumeric,
  deepEqual,
  processProps,
};
