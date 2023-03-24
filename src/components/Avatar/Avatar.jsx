import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isAlphaNumeric } from '../../utils';

const randomColors = [
  '#4A5568',
  '#FC8181',
  '#E53E3E',
  '#F6AD55',
  '#DD6B20',
  '#9C4221',
  '#F6E05E',
  '#D69E2E',
  '#744210',
  '#9AE6B4',
  '#48BB78',
  '#2F855A',
  '#276749',
  '#B2F5EA',
  '#4FD1C5',
  '#319795',
  '#2C7A7B',
  '#63B3ED',
  '#2B6CB0',
  '#667EEA',
  '#434190',
  '#9F7AEA',
  '#6B46C1',
  '#FBB6CE',
  '#ED64A6',
  '#B83280',
  '#702459',
];
const textSize = {
  xs: 'base',
  sm: 'lg',
  md: '2xl',
  lg: '4xl',
};
class SCAvatar extends Component {
  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
    icon: PropTypes.string,
    image: PropTypes.string,
    text: function (props, propName, componentName) {
      const isAlphaNumericText =
        props[propName] && !isAlphaNumeric(props[propName]);
      const isTextGreaterThantwo =
        props[propName] && props[propName].length > 2;
      if (isAlphaNumericText || isTextGreaterThantwo) {
        return new Error(
          `Validation failed in ${componentName}. ${propName} should be alphanumeric or less than 2 chracters.`,
        );
      }
    },
  };
  static defaultProps = {
    size: 'md',
  };
  render() {
    const { text, size, icon, image, alt, className } = this.props;
    const isValidText = text && isAlphaNumeric(text) && text.length <= 2;

    let avatar = null;
    let displayText;

    if (isValidText) {
      displayText = text;
    } else {
      displayText =
        text && text.length > 2 &&
        isAlphaNumeric(text.slice(0, 2)) && text.slice(0, 2);
    }

    if (icon) {
      avatar = <i className={icon} />;
    } else if (image) {
      avatar = (
        <img
          src={image}
          alt={alt ? alt : ''}
        />
      );
    } else {
      let randomColor = randomColors[randomColors.length - 1];

      if (displayText) {
        const code = displayText.length === 1 ? displayText.charCodeAt(0) : displayText.charCodeAt(1);

        if (code > 64 && code < 91) {
          randomColor = randomColors[code - 65];
        } else if (code > 96 && code < 123) {
          randomColor = randomColors[code - 97];
        }
      }

      avatar = !text ? (
        <div
          style={{ backgroundColor: randomColor }}
          className="w-full h-full"
        />
      ) : (
        <div
          style={{ backgroundColor: randomColor }}
          className={`w-full h-full uppercase text-${
            textSize[size]
          } text-white font-bold flex justify-center items-center`}
        >
          {displayText}
        </div>
      );
    }

    const avatarClass = ['sc-avatar', `sc-avatar-${size}`];

    if (className) {
      avatarClass.push(className);
    }

    return <div className={avatarClass.join(' ')}>{avatar}</div>;
  }
}

export default SCAvatar;
