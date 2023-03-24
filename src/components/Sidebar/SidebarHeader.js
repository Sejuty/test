import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SidebarHeader extends Component {
  render() {
    const {
      children,
      headerClass,
      pinClass,
      onClick,
      pinable,
      collapsible,
      pinPosition,
    } = this.props;

    const headerClassName = `sc-sidebar-header ${
      headerClass ? headerClass : ''
    } ${pinPosition === 'right' ? 'flex-row' : 'flex-row-reverse'}`;

    const pinClassName = `sc-sidebar-pin ${!collapsible ? 'sc-pinable' : ''} ${
      pinClass ? pinClass : ''
    }`;

    const hasChildren = children ? children : null;

    const pinableButton = pinable ? (
      <div className={pinClassName} onClick={onClick} />
    ) : null;

    return (
      <div className={headerClassName}>
        {hasChildren}
        {pinableButton}
      </div>
    );
  }
}

SidebarHeader.propTypes = {
  onClick: PropTypes.func,
  headerClass: PropTypes.string,
  pinClass: PropTypes.string,
  pinPosition: PropTypes.string,
  pinable: PropTypes.bool,
  collapsible: PropTypes.bool,
};

SidebarHeader.defaultProps = {
  headerClass: '',
  pinClass: '',
  onClick: () => {},
  pinPosition: 'right',
  pinable: false,
  collapsible: false,
};

export default SidebarHeader;
