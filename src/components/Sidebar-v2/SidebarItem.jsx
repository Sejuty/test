import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MenuItem } from 'react-pro-sidebar';

class SCSidebarItem extends Component {
  constructor(props) {
    super(props);
    this.itemEl = React.createRef();
  }

  static propTypes = {
    icon: PropTypes.any,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    active: PropTypes.bool,
  };

  static defaultProps = {
    icon: null,
    title: '',
    active: false,
  };

  render() {
    const { active, icon, title } = this.props;

    return (
      <MenuItem ref={this.itemEl} icon={icon} active={active}>
        {title}
      </MenuItem>
    );
  }
}

export default SCSidebarItem;
