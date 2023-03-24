import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ProSidebar, SidebarHeader, SidebarContent, Menu } from 'react-pro-sidebar';

class SCSidebar extends Component {
  static propTypes = {
    width: PropTypes.number,
    collapsedWidth: PropTypes.number,
    collapsed: PropTypes.bool,
    header: PropTypes.any,
    children: PropTypes.any,
    onToggle: PropTypes.func,
  };
  static defaultProps = {
    width: 250,
    collapsedWidth: 68,
    collapsed: true,
    onToggle: () => { },
  };
  render() {
    const { width, collapsed, collapsedWidth, onToggle, header, children } = this.props;
    const HeaderWrapper = header ? (<SidebarHeader>{header}</SidebarHeader>) : null;
    const ContentWrapper = children ? (
      <SidebarContent>
        <Menu>{children}</Menu>
      </SidebarContent>
    ) : null;

    return (
      <ProSidebar
        width={width}
        collapsedWidth={collapsedWidth}
        collapsed={collapsed}
        image={false}
        onToggle={() => onToggle()}
      >
        {HeaderWrapper}
        {ContentWrapper}
      </ProSidebar>
    );
  };
};

export default SCSidebar;
