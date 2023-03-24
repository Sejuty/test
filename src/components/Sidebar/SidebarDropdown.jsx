import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SCSidebarItem from './SidebarItem.jsx';

class SidebarDropdown extends Component {
  static propTypes = {
    isToggle: PropTypes.bool,
    dropdownTitle: PropTypes.string,
    subIconClass: PropTypes.string,
    iconClass: PropTypes.string,
    isFirstLevel: PropTypes.bool,
  };

  static defaultProps = {
    subIconClass: 'icon-arrow-right',
  };

  state = {
    isToggle: false,
  };

  handleCollapse = () => {
    this.setState(prevState => ({
      isToggle: !prevState.isToggle,
    }));
  };

  render() {
    const {
      subIconClass,
      dropdownTitle,
      iconClass,
      children,
      isFirstLevel,
    } = this.props;
    const { isToggle } = this.state;

    const classNames = `sc-dropdown ${isToggle ? 'show' : ''}`;

    return (
      <>
        <SCSidebarItem
          title={dropdownTitle}
          iconClass={iconClass}
          subIconClass={`${subIconClass} ${
            isToggle ? 'transform rotate-90' : ''
          }`}
          onClick={this.handleCollapse}
          isFirstLevel={isFirstLevel}
        />
        <div className={classNames}>{children}</div>
      </>
    );
  }
}

export default SidebarDropdown;
