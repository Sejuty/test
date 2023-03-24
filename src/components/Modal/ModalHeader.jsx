import React, { Component } from 'react';
import PropTypes from 'prop-types';

const CLOSE_BUTTON_POSITION = {
  LEFT: 'left',
  RIGHT: 'right',
};

class SCModalHeader extends Component {
  static propTypes = {
    showCloseButton: PropTypes.bool,
    closeButtonPosition: PropTypes.oneOf([
      CLOSE_BUTTON_POSITION.LEFT,
      CLOSE_BUTTON_POSITION.RIGHT,
    ]),
    onCloseBtnClick: PropTypes.func,
  };
  static defaultProps = {
    showCloseButton: true,
    closeButtonPosition: CLOSE_BUTTON_POSITION.LEFT,
    onCloseBtnClick: () => {},
  };
  render() {
    const closeIcon = !this.props.showCloseButton ? null : (
      <span className="sc-modal-close" onClick={this.props.onCloseBtnClick}>
        <i className="icon-clear" />
      </span>
    );

    const leftCloseBtn =
      this.props.closeButtonPosition === CLOSE_BUTTON_POSITION.LEFT
        ? closeIcon
        : null;
    const rightCloseBtn =
      this.props.closeButtonPosition === CLOSE_BUTTON_POSITION.RIGHT
        ? closeIcon
        : null;
    const headerContentClass = this.props.className
      ? `sc-modal-header-content ${this.props.className}`
      : 'sc-modal-header-content';

    return (
      <header className="sc-modal-header">
        {leftCloseBtn}
        <span className={headerContentClass}>{this.props.children}</span>
        {rightCloseBtn}
      </header>
    );
  }
}

export default SCModalHeader;
