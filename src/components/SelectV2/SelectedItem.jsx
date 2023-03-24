import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SelectedItem extends Component {
  static propTypes = {
    trackBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    item: PropTypes.oneOfType([PropTypes.object, PropTypes.object]),
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onRemoveItem: PropTypes.func,
    onClick: PropTypes.func,
    multiple: PropTypes.bool,
    isDisabled: PropTypes.bool,
    // disabledValue: PropTypes.oneOfType([
    //   PropTypes.string,
    //   PropTypes.object,
    //   PropTypes.array,
    //   PropTypes.number,
    // ]),
  };

  render() {

    return (
      // <div onClick={this.props.onClick} className='sc-selected-item'>
        <div onClick={this.props.onClick} className={`sc-selected-item ${this.props.isDisabled ? 'bg-black' : ''}`}>
        <span
          className={
            this.props.multiple === true
              ? 'multiple-placeholder-item-text'
              : 'single-placeholder-item-text'
          }
        >
          {this.props.title}
        </span>
        <i
          // className={`$()`}"sc-selected-close-icon icon-clear"
          className={`${this.props.isDisabled ? ' ' : ' sc-selected-close-icon icon-clear'}`}
          onClick={this.props.onRemoveItem}
        />
      </div>
    );
  }
}

export default SelectedItem;
