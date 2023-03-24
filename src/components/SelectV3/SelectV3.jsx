import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SCSelectPlaceholder from './Placeholder.jsx';
import SCSelectDropdownList from './SelectDropdownList.jsx';

class SCSelectV3 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: props.options || [],
      isOpen: false,
      selectedItem: null,
    };

    this.SCSelectRef = React.createRef();
    this.setModel = this.setModel.bind(this);
    this.handleOutsideSelectClick = this.handleOutsideSelectClick.bind(this);
    this.setDropdownVisibility = this.setDropdownVisibility.bind(this);
    this.onPlaceholderClicked = this.onPlaceholderClicked.bind(this);
  }

  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.array,
      PropTypes.number,
    ]),
    options: PropTypes.array,
    allowEmpty: PropTypes.bool,
    closeOnSelect: PropTypes.bool,
    disabled: PropTypes.bool,
    groupSelect: PropTypes.bool,
    internalSearch: PropTypes.bool,
    multiple: PropTypes.bool,
    searchable: PropTypes.bool,
    disabledItemKey: PropTypes.string,
    groupLabel: PropTypes.string,
    groupValues: PropTypes.string,
    trackBy: PropTypes.string,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf('</>')
    ]),
    hint: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf('</>')
    ]),
    customLabel: PropTypes.func,
    onSelect: PropTypes.func,
  };
  static defaultProps = {
    value: null,
    options: [],
    allowEmpty: false,
    closeOnSelect: true,
    disabled: false,
    groupSelect: false,
    internalSearch: false,
    multiple: false,
    searchable: false,
    disabledItemKey: '$isDisabled',
    groupLabel: 'group_title',
    groupValues: 'group_value',
    trackBy: 'id',
    placeholder: 'Select an item from list',
    label: 'name',
    id: 'id',
    title: 'Select Item',
    hint: null,
    customLabel: () => 'Custom Label',
    onSelect: () => {},
  };

  componentDidMount() {
    document.addEventListener('click', this.handleOutsideSelectClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideSelectClick);
  }

  handleOutsideSelectClick(event) {
    if (!this.state.isOpen) return;
    if (this.SCSelectRef && this.SCSelectRef.current.contains(event.target))
      return;

    this.setDropdownVisibility(false);
  }

  setModel(item) {
    const { closeOnSelect, onSelect, trackBy } = this.props;
    const selectedItem = item && item[trackBy] ? { ...item } : item;

    this.setState({
      selectedItem,
    });

    if (closeOnSelect) {
      this.setDropdownVisibility(false);
    }
    
    onSelect(selectedItem);
  }

  setDropdownVisibility(isVisible) {
    this.setState({
      isOpen: isVisible
    });
  }

  onPlaceholderClicked() {
    const { isOpen } = this.state;
    this.setDropdownVisibility(!isOpen);
  }  

  render() {
    const { placeholder, options, value, disabledItemKey, label, trackBy, multiple, title, groupSelect, groupLabel, groupValues, hint } = this.props;
    const { isOpen } = this.state;

    const hintEl = !hint ? null : (
      <div className="sc-select-v3-hint">{hint}</div>
    );

    return (
      <div className="sc-select-v3-container" ref={this.SCSelectRef}>
        <div className="sc-select-v3-title">{title}</div>
        <div className="sc-select-v3-main">
          <SCSelectPlaceholder
            placeholderText={placeholder}
            multiple = {multiple}
            isOpen={isOpen}
            value={value}
            label={label}
            onPlaceholderClicked={this.onPlaceholderClicked}
          />
          {hintEl}
          <SCSelectDropdownList
            isOpen={isOpen}
            trackBy={trackBy}
            label={label}
            value={value}
            disabledItemKey={disabledItemKey}
            groupSelect={groupSelect}
            groupLabel={groupLabel}
            groupValues={groupValues}
            options={options}
            onItemClicked={item => this.setModel(item)}
          />
        </div>
      </div>
    );
  }
}

export default SCSelectV3;
