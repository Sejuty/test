import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectDropdownListItem from './SelectDropdownListItem.jsx';

class SelectDropdownList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredOptions: [],
    };

    this.DropdownListRef = React.createRef();
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.array,
      PropTypes.number,
    ]),
    options: PropTypes.array,
    groupSelect: PropTypes.bool,
    isOpen: PropTypes.bool,
    multiple: PropTypes.bool,
    disabledItemKey: PropTypes.string,
    groupLabel: PropTypes.string,
    groupValues: PropTypes.string,
    trackBy: PropTypes.string,
    label: PropTypes.string,
    onItemClicked: PropTypes.func,
  };

  static defaultProps = {
    value: null,
    options: [],
    isOpen: false,
    groupSelect: true,
    multiple: false,
    disabledItemKey: '$isDisabled',
    groupLabel: 'name',
    groupValues: 'sources',
    trackBy: 'id',
    label: 'name',
    onItemClicked: () => {},
  };

  handleItemClick(e, item) {
    const { multiple, value, trackBy, onItemClicked } = this.props;

    if (!multiple) {
      const modelHasValue = value && value[trackBy];
      let model = null;
      
      // Set a model when
      // 1. Select has no value
      // 2. Has a value which doesn't match with item
      if (!modelHasValue || (modelHasValue && value[trackBy] !== item[trackBy])) {
        model = { ...item };
      }
      onItemClicked(model);
    }
  }

  itemMapFunc(item, itemIndex) {
    const { trackBy, label, value, disabledItemKey } = this.props;

    return (
      <SelectDropdownListItem
        role="presentation"
        key={`item-${trackBy}-${itemIndex}`}
        item={item}
        disabledItemKey={disabledItemKey}
        trackBy={trackBy}
        label={label}
        value={value}
        onItemClicked={e => this.handleItemClick(e, item)}
      />
    );
  }

  groupMapFunc(group, groupIndex) {
    const { groupLabel, groupValues } = this.props;
      const groupLabelTxt = group[groupLabel];
      const groupValueItems = group[groupValues].map((item, itemIndex) => this.itemMapFunc(item, itemIndex));

      return (
        <div
          key={`group-${groupIndex + 1}`}
          className="group-item"
        >
          <div className="group-item-label">{groupLabelTxt}</div>
          {groupValueItems}
        </div>
      );
  }

  render() {
    const { options, groupSelect, isOpen } = this.props;

    if (!isOpen) {
      return null;
    }
    
    const list = !groupSelect ?
      options.map((item, itemIndex) => this.itemMapFunc(item, itemIndex)) :
      options.map((group, groupIndex) => this.groupMapFunc(group, groupIndex));

    return (
      <div className="select-dropdown-list" ref={this.DropdownListRef}>
        {list}
      </div>
    );
  }
}

export default SelectDropdownList;
