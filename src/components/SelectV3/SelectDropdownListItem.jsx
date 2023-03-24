import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SelectDropdownListItem extends Component {
  constructor(props) {
    super(props);
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  static propTypes = {
    disabledItemKey: PropTypes.string,
    trackBy: PropTypes.string,
    label: PropTypes.string,
    item: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.array,
      PropTypes.number,
    ]),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.array,
      PropTypes.number,
    ]),
    onItemClicked: PropTypes.func,
  };

  static defaultProps = {
    disabledItemKey: '$isDisabled',
    trackBy: 'id',
    label: 'value',
    item: null,
    value: null,
    onItemClicked: () => { },
  };

  handleItemClick(e) {
    const { item, disabledItemKey, onItemClicked } = this.props;

    if (disabledItemKey && item[disabledItemKey]) {
      return;
    }

    onItemClicked(e, item);
  };

  render() {
    const { trackBy, label, disabledItemKey, item, value } = this.props;
    const hasTrackBy = trackBy && trackBy.length > 0;
    const hasLabel = label && label.length > 0;
    const hasItem = hasTrackBy && item && item[trackBy];

    if (!hasTrackBy || !hasLabel || !hasItem) {
      return null;
    }

    const itemMatchesValue = value && value[trackBy] && value[trackBy] === item[trackBy];
    const checkmark = itemMatchesValue ? (<i className="icon-done-outline" />) : null;
    const itemClasses = ['select-dropdown-list-item'];

    if (itemMatchesValue) {
      itemClasses.push('select-dropdown-list-item-selected');
    }

    if (item[disabledItemKey]) {
      itemClasses.push('select-dropdown-list-item-disabled');
    }

    return (
      <div
        className={itemClasses.join(' ')}
        onClick={this.handleItemClick}
      >
        <div className="select-dropdown-list-item-label">{item[label]}</div>
        <div className="select-dropdown-list-item-action">
          {checkmark}
        </div>
      </div>
    );
  };
};

export default SelectDropdownListItem;
