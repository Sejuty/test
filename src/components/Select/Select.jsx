import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { isObject, nullOrUndefined } from '../../utils';
import SelectedItem from './SelectedItem.jsx';
import { debounce } from '../../utils/throttle';
import { SCTooltip } from '../../components';

class SCSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: props.options || [],
      isOpen: false,
      selectedItem: !this.isItemInOptions(props.value) ? null : props.value,
      searchValue: !this.isItemInOptions(props.value)
        ? ''
        : isObject(props.value)
        ? props.value[props.label]
        : props.value,
      disableSelectedItem: props.disableSelectedItem,
    };

    this.SCSelectRef = React.createRef();
    this.arr = [];

    this.showDropdown = this.showDropdown.bind(this);
    this.hideDropdown = this.hideDropdown.bind(this);
    this.handleItemSelect = this.handleItemSelect.bind(this);
    this.handleSelectorClick = this.handleSelectorClick.bind(this);
    this.handleOutsideSelectClick = this.handleOutsideSelectClick.bind(this);
    this.handleSearchKey = this.handleSearchKey.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleThrottledSearch = debounce(
      this.filterOption,
      props.throttleTime,
      {
        leading: true,
        maxWait: props.throttleTime,
        trailing: false,
      },
    );
  }

  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.array,
      PropTypes.number,
    ]),
    options: PropTypes.array,
    trackBy: PropTypes.string,
    label: PropTypes.string,
    title: PropTypes.string,
    placeholder: PropTypes.string,
    emptyText: PropTypes.string,
    throttleTime: PropTypes.number,
    closeOnSelect: PropTypes.bool,
    allowEmpty: PropTypes.bool,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    searchable: PropTypes.bool,
    onSelect: PropTypes.func,
    handleSearch: PropTypes.func,
    handleFocus: PropTypes.func,
    handleBlur: PropTypes.func,
    helpText: PropTypes.string,
    disableSelectedItem: PropTypes.bool,
  };
  static defaultProps = {
    options: [],
    trackBy: 'id',
    label: 'value',
    placeholder: 'Select an item from list',
    emptyText: 'No data found!',
    helpText: '',
    closeOnSelect: true,
    allowEmpty: true,
    disabled: false,
    multiple: false,
    searchable: false,
    loading: true,
    throttleTime: 500,
    onSelect: () => {},
    handleSearch: () => {},
    handleFocus: () => {},
    handleBlur: () => {},
    disableSelectedItem: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (state.searchValue && state.searchValue.length > 0) {
      return {
        options: state.options,
      };
    }

    if (props.options !== state.options) {
      return {
        options: props.options,
      };
    }

    return null;
  }

  componentDidMount() {
    document.addEventListener('click', this.handleOutsideSelectClick);
  }

  componentDidUpdate(prevProps) {
    const { value, multiple } = this.props;
    const isSame = prevProps.value === value;
    if (multiple && !isSame) {
      this.setState({
        selectedItem: value,
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    const { value: nextValue } = nextProps;
    const { value: propValue } = this.props;
    const { selectedItem } = this.state;

    const getDerivedValue = item => {
      if (nullOrUndefined(item)) return null;
      if (isObject(item)) return item[this.props.trackBy];

      return item;
    };

    const derivedNextValue = getDerivedValue(nextValue);
    const derivedPropValue = getDerivedValue(propValue);

    if (derivedNextValue === derivedPropValue) return true;

    const derivedStateValue = getDerivedValue(selectedItem);
    const valueToSet =
      derivedStateValue === derivedNextValue ? null : nextValue;

    this.setState({
      selectedItem: valueToSet,
    });

    if (!this.props.multiple && this.props.searchable) {
      this.setState({
        searchValue: isObject(valueToSet)
          ? valueToSet[this.props.label]
          : valueToSet || '',
      });
    }

    return true;
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideSelectClick);
  }

  showDropdown() {
    this.setState({
      isOpen: true,
    });
  }

  hideDropdown() {
    this.setState({
      isOpen: false,
    });
  }

  handleSingleSelectItem(option, e) {
    const { searchable, label } = this.props;
    const isValidOption = this.isItemInOptions(option);
    const sameAsCurrent = this.matchesSelected(option);
    const selectedItem =
      isValidOption && sameAsCurrent && this.props.allowEmpty ? null : option;
    let searchKey;
    this.setState({
      selectedItem,
    });

    if (searchable) {
      if (selectedItem && isObject(selectedItem)) {
        searchKey = selectedItem[label];
      } else if (selectedItem) {
        searchKey = selectedItem;
      } else {
        searchKey = '';
      }
      this.setState({
        searchValue: searchKey,
        options: searchKey === '' ? this.props.options : this.state.options,
      });
    }

    if (this.props.closeOnSelect) {
      this.hideDropdown();
    }

    this.props.onSelect(selectedItem, e);
  }

  handleMultipleSelectItem(option, e) {
    const { trackBy } = this.props;
    this.arr = this.state.selectedItem ? this.state.selectedItem : [];
    const index =
      this.arr && this.arr.length > 0
        ? this.arr.findIndex(i =>
            isObject(i) ? i[trackBy] === option[trackBy] : i === option,
          )
        : -1;
    if (index >= 0) {
      this.arr.splice(index, 1);
    } else {
      this.arr.push(option);
    }

    this.setState({
      selectedItem: this.arr,
    });

    if (this.props.closeOnSelect) {
      this.hideDropdown();
    }

    this.props.onSelect(this.arr, e);
  }

  handleItemSelect(option, e) {
    if (this.props.multiple) {
      this.handleMultipleSelectItem(option, e);
    } else {
      this.handleSingleSelectItem(option, e);
    }
  }

  handleSelectorClick(e) {
    const { multiple, searchable, options } = this.props;
    if (this.state.isOpen) {
      this.hideDropdown();
    } else {
      this.showDropdown();
      if (
        multiple &&
        searchable &&
        this.state.selectedItem &&
        this.state.selectedItem.length > 0
      ) {
        this.setState({
          searchValue: '',
          options,
        });
      }
    }
  }

  handleOutsideSelectClick(event) {
    if (!this.state.isOpen) return;
    if (this.SCSelectRef && this.SCSelectRef.current.contains(event.target))
      return;

    this.hideDropdown();
  }

  handleRemoveItem(item) {
    this.arr = this.state.selectedItem ? this.state.selectedItem : [];
    this.arr =
      this.arr && this.arr.length > 0 && this.arr.filter(i => i !== item);
    this.hideDropdown();

    this.setState({
      selectedItem: this.arr.length > 0 ? this.arr : null,
    });

    this.props.onSelect(this.arr);
  }

  handleSearchClick() {
    this.setState({
      isOpen: true,
    });
  }

  filterOption(val) {
    const newOption =
      val &&
      this.props.options.filter(o =>
        isObject(o)
          ? o[this.props.label].toLowerCase().includes(val.toLowerCase())
          : o.toString().toLowerCase() === val.toLowerCase(),
      );
    this.setState({
      options: newOption,
    });
  }

  handleSearchKey(e) {
    this.setState({
      searchValue: e.target.value,
    });
    if (e.target.value.length === 0) {
      this.setState({
        options: this.props.options,
      });
    } else {
      this.handleThrottledSearch(e.target.value);
    }
    this.props.handleSearch(e.target.value);
  }

  isItemInOptions(option) {
    const { options, trackBy, multiple } = this.props;

    if (nullOrUndefined(option)) return false;

    if (multiple) {
      return isObject(option)
        ? options.find(
            o => option && option.map(opt => o[trackBy] === opt[trackBy]),
          )
        : options.find(o => o === option);
    }

    return isObject(option)
      ? options.find(o => o[trackBy] === option[trackBy])
      : options.find(o => o === option);
  }

  matchesSelected(option) {
    const { selectedItem } = this.state;
    const { trackBy } = this.props;

    if (!selectedItem) return false;

    return isObject(option)
      ? option[trackBy] === selectedItem[trackBy]
      : option === selectedItem;
  }

  getDropdownCheckmark(option) {
    const { trackBy } = this.props;
    const checkmark = <i className="icon-done-outline" />;
    this.arr = this.state.selectedItem;
    const index =
      this.arr && this.arr.length > 0
        ? this.arr.findIndex(i =>
            isObject(i) ? i[trackBy] === option[trackBy] : i === option,
          )
        : -1;
    if (this.props.multiple) {
      return index >= 0 ? checkmark : null;
    }
    return this.matchesSelected(option) ? checkmark : null;
  }

  getDropdownItems() {
    if (this.state.options && this.state.options.length > 0) {
      return this.state.options.map((option, index) => {
        const { trackBy, label } = this.props;
        const key = isObject(option) ? option[trackBy] : `${option}-${index}`;
        const optionLabel = isObject(option) ? option[label] : option;
        const checkmark = this.getDropdownCheckmark(option);
        const itemClass = checkmark
          ? 'sc-select-dropdown-item sc-select-dropdown-item-selected'
          : 'sc-select-dropdown-item';

        return (
          <div
            key={key}
            className={`${itemClass} ${this.state.disableSelectedItem &&
              this.matchesSelected(option) &&
              ' opacity-50'}`}
            onClick={e => {
              if (
                this.state.disableSelectedItem &&
                this.matchesSelected(option)
              ) {
                if (this.props.closeOnSelect) {
                  this.hideDropdown();
                }
              } else {
                this.handleItemSelect(option, e);
              }
            }}
          >
            <span>{optionLabel}</span>
            {this.getDropdownCheckmark(option)}
          </div>
        );
      });
    }
    return <div className="sc-empty-text">{this.props.emptyText}</div>;
  }

  renderMultipleSelectedItem = items => {
    const { label, trackBy } = this.props;
    return items.map((item, index) => {
      const key = isObject(item) ? item[trackBy] : index;
      const title = isObject(item) ? item[label] : item;
      return (
        <SelectedItem
          key={key}
          title={title}
          onRemoveItem={() => this.handleRemoveItem(item)}
        />
      );
    });
  };

  getMultipleSelectedItemsPlaceHolder() {
    const { placeholder, value } = this.props;
    const { selectedItem } = this.state;

    if (selectedItem && selectedItem.length > 0 && value && value.length > 0) {
      return this.renderMultipleSelectedItem(value);
    } else if (selectedItem && selectedItem.length > 0) {
      return this.renderMultipleSelectedItem(selectedItem);
    }
    return <span>{placeholder}</span>;
  }

  getSinglePlaceholderText() {
    const { label, options, placeholder, trackBy, value } = this.props;
    const { selectedItem } = this.state;

    if (selectedItem) {
      return isObject(selectedItem) ? selectedItem[label] : selectedItem;
    }

    if (selectedItem && value) {
      if (isObject(value)) {
        const matchedOption = options.find(
          opt => opt[trackBy] === value[trackBy],
        );
        return matchedOption[label];
      }

      return value;
    }

    return placeholder;
  }

  getPlaceHolderText() {
    const { multiple } = this.props;
    return multiple ? (
      this.getMultipleSelectedItemsPlaceHolder()
    ) : (
      <span>{this.getSinglePlaceholderText()}</span>
    );
  }

  getShowSearchBody() {
    const { searchable, multiple } = this.props;
    const selectDropdown = this.state.isOpen ? (
      <div className="sc-select-dropdown">{this.getDropdownItems()}</div>
    ) : null;
    if (searchable && multiple && this.state.isOpen) {
      return (
        <div className="sc-select-search-wrapper">
          <input
            autoFocus
            onClick={this.handleSearchClick}
            value={this.state.searchValue}
            onChange={this.handleSearchKey}
            onFocus={this.props.handleFocus}
            onBlur={this.props.handleBlur}
            className="sc-select-search"
            placeholder={this.props.placeholder}
          />
          {selectDropdown}
        </div>
      );
    } else if (
      (!multiple && searchable) ||
      (multiple && searchable && !this.state.selectedItem)
    ) {
      return (
        <div className="sc-select-search-wrapper">
          <input
            autoFocus
            onClick={this.handleSearchClick}
            value={this.state.searchValue}
            onChange={this.handleSearchKey}
            onFocus={this.props.handleFocus}
            onBlur={this.props.handleBlur}
            className="sc-select-search"
            placeholder={this.props.placeholder}
          />
          {selectDropdown}
        </div>
      );
    }
  }

  render() {
    const { searchable, className, title } = this.props;
    const { isOpen, selectedItem } = this.state;

    const selectClass = className
      ? `sc-select-container ${className}`
      : 'sc-select-container';

    const selectDropdown = isOpen ? (
      <div className="sc-select-dropdown">{this.getDropdownItems()}</div>
    ) : null;

    const dropDownIcon = `${
      isOpen ? 'icon-key-arrow-up' : 'icon-key-arrow-down'
    } sc-select-dropdown-icon`;

    const dropdownText = title ? (
      <div className="sc-select-title">{title}</div>
    ) : null;

    const shouldShowPlaceholder = !searchable || (searchable && !isOpen);
    const scrollClass =
      selectedItem && selectedItem.length > 0 ? 'overflow-y-auto h-full' : '';
    const renderHelpText = this.props.helpText.length ? (
      <SCTooltip id="help-text-tooltip" content={this.props.helpText}>
        <i className="sc-question text-grey-darker ml-2" />
      </SCTooltip>
    ) : null;

    return (
      <div className={selectClass} ref={this.SCSelectRef}>
        <div className="flex">
          {dropdownText}
          {renderHelpText}
        </div>
        <div className="sc-selector" onClick={this.handleSelectorClick}>
          {shouldShowPlaceholder ? (
            <div className={`sc-select-placeholder ${scrollClass}`}>
              {this.getPlaceHolderText()}
            </div>
          ) : (
            this.getShowSearchBody()
          )}
          <i className={dropDownIcon} />
        </div>
        <div>{!searchable && selectDropdown}</div>
      </div>
    );
  }
}

export default SCSelect;
