import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import SCSidebarHeader from './SidebarHeader';

class SCSidebar extends Component {
  static propTypes = {
    width: PropTypes.string,
    collapsible: PropTypes.bool,
    collapsedWidth: PropTypes.string,
  };
  static defaultProps = {
    width: '225px',
    collapsedWidth: '44px',
    collapsible: false,
  };

  state = {
    isHover: false,
  };

  handleMouseEnter = () => {
    this.setState({ isHover: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHover: false });
  };

  render() {
    const { width, collapsedWidth, collapsible, pinable } = this.props;
    const { isHover } = this.state;

    const sidebarStyle = {
      width: !isHover && collapsible ? collapsedWidth : width,
    };
    const sidebarClasses = `sc-sidebar ${
      !isHover && collapsible ? 'sc-hide-sidebar-content' : ''
    }`;

    const header = this.props.header ? this.props.header : <SCSidebarHeader />;

    const finalHeader = cloneElement(header, {
      collapsible,
      pinable,
    });

    return (
      <div
        style={sidebarStyle}
        className={sidebarClasses}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {finalHeader}
        {this.props.children}
      </div>
    );
  }
}

export default SCSidebar;
