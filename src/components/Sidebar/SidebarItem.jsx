import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SCSidebarItem extends Component {
  static propTypes = {
    iconClass: PropTypes.string,
    subIconClass: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
    isFirstLevel: PropTypes.bool,
    isSecondLevel: PropTypes.bool,
  };
  static defaultProps = {
    iconClass: '',
    subIconClass: '',
    title: '',
    isFirstLevel: false,
    isSecondLevel: false,
    onClick: () => {},
  };
  getSidebarIcon() {
    const iconClass = this.props.iconClass
      ? `${this.props.iconClass} sc-sidebar-item-icon`
      : null;
    const icon = iconClass ? <i className={iconClass} /> : null;

    return icon;
  }

  getSidebarSubIcon() {
    const iconClass = this.props.subIconClass
      ? `${this.props.subIconClass} sc-sidebar-item-icon sc-sidebar-dropdown-icon`
      : null;
    const icon = iconClass ? <i className={iconClass} /> : null;

    return icon;
  }

  render() {
    const { isFirstLevel, isSecondLevel } = this.props;

    const classNames = `${
      isFirstLevel
        ? 'sc-dropdown-first-level'
        : isSecondLevel
        ? 'sc-dropdown-second-level'
        : ''
    }`;

    const iconContent = !classNames ? (
      <>
        {this.getSidebarIcon()}
        <span className="sc-sidebar-tittle">{this.props.title}</span>
        {this.getSidebarSubIcon()}
      </>
    ) : (
      <div className={classNames}>
        {this.getSidebarIcon()}
        <span className="sc-sidebar-tittle">{this.props.title}</span>
        {this.getSidebarSubIcon()}
      </div>
    );

    return (
      <div className="sc-sidebar-item" onClick={this.props.onClick}>
        {iconContent}
      </div>
    );
  }
}

export default SCSidebarItem;
