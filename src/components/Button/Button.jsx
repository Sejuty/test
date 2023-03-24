import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { processProps } from '../../utils';

class SCButton extends Component {
  static propTypes = {
    label: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    variant: PropTypes.oneOf([
      'primary',
      'primary-outline',
      'success',
      'success-outline',
      'danger',
      'danger-outline',
    ]).isRequired,
    size: PropTypes.oneOf(['auto', 'sm', 'md', 'lg', 'xl']).isRequired,
    action: PropTypes.func.isRequired,
  };
  static defaultProps = {
    variant: 'primary',
    size: 'md',
    className: '',
    action: () => {},
  };
  render() {
    const btnClasses = [
      'sc-btn',
      `sc-btn-${this.props.variant}`,
      this.props.className,
      `sc-btn-${this.props.size}`,
    ].join(' ');
    const btnChildren = this.props.children
      ? this.props.children
      : this.props.label
      ? this.props.label
      : null;

    const finalProps = processProps(this.props, {
      className: btnClasses,
      onClick: this.props.action,
      disabled: this.props.disabled,
    });

    return <button {...finalProps}>{btnChildren}</button>;
  }
}

export default SCButton;
