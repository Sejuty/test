import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SelectedItem extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onRemoveItem: PropTypes.func,
    onClick: PropTypes.func,
  };

  render() {
    return (
      <div onClick={this.props.onClick} className="sc-selected-item">
        <span>{this.props.title}</span>
        <i
          className="sc-selected-close-icon icon-clear"
          onClick={this.props.onRemoveItem}
        />
      </div>
    );
  }
}
export default SelectedItem;
