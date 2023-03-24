import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
const classNames = require('classnames');

class SCToolTip extends Component {
  toolTipRef = createRef();
  timeId;

  state = {
    isVisible: false,
  };

  timer = () => setTimeout(() => this.hideTooltip(), this.props.autoCloseTime);

  componentWillUnmount() {
    if (this.props.autoClose)
      clearTimeout(this.timeId);
    document.removeEventListener('click', this.handleTooltipClick);
  }

  showTooltip = () => {
    this.setState({ isVisible: true });
    if (this.props.autoClose)
      this.timeId = this.timer();
    document.addEventListener('click', this.handleTooltipClick);
  };
  hideTooltip = () => {
    this.setState({ isVisible: false });
  };

  handleTooltipClick = evt => {
    if (!this.toolTipRef?.current.contains(evt.target)) {
      this.hideTooltip();
      document.removeEventListener('click', this.handleTooltipClick);
    }
  };

  render() {
    let { isVisible } = this.state;
    const { position, content, children, trigger, variant } = this.props;
    let wrapperProps = {};

    let tipClass = classNames({
      [position]: position,
      on: isVisible,
      off: !isVisible,
    });

    if (trigger === 'click') {
      wrapperProps.onClick = this.showTooltip;
    } else if (trigger === 'hover') {
      wrapperProps.onMouseEnter = this.showTooltip;
      wrapperProps.onMouseLeave = this.hideTooltip;
    }

    const arrowClassName = variant.includes('-outline')
      ? 'sc-tooltip-outline'
      : '';

    return (
      <div className="relative inline-block" ref={this.toolTipRef}>
        <div {...wrapperProps} className="p-1">
          {children}
        </div>
        <div className={`sc-tooltip ${tipClass}`}>
          <div className={`sc-tooltip-arrow sc-tooltip-arrow-${variant}`} />
          <div
            className={`sc-tooltip-label sc-tooltip-${variant} ${arrowClassName}`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    );
  }
}

SCToolTip.propTypes = {
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  trigger: PropTypes.oneOf(['click', 'hover']),
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  autoCloseTime: PropTypes.number,
  autoClose: PropTypes.bool,
  variant: PropTypes.oneOf([
    'primary',
    'primary-outline',
    'success',
    'success-outline',
    'danger',
    'danger-outline',
  ]),
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  tagName: PropTypes.string,
};

SCToolTip.defaultProps = {
  position: 'top',
  trigger: 'click',
  content: 'Tooltip',
  autoCloseTime: 5000,
  variant: 'primary',
  autoClose: false,
};

export default SCToolTip;
