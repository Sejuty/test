import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SelectPlaceholder extends Component {
  constructor(props) {
    super(props);

    this.onPlaceholderContainerClicked = this.onPlaceholderContainerClicked.bind(this);
  }
  static propTypes = {
    isOpen: PropTypes.bool,
    internalSearch: PropTypes.bool,
    searchable: PropTypes.bool,
    placeholderText: PropTypes.string,
    onPlaceholderClicked: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.array,
      PropTypes.number,
    ]),
  };

  static defaultProps = {
    isOpen: false,
    internalSearch: false,
    searchable: false,
    placeholderText: 'Select an item from list',
    onPlaceholderClicked: () => { },
    value: null,
  };

  onPlaceholderContainerClicked() {
    const { internalSearch, searchable, onPlaceholderClicked } = this.props;

    if (!internalSearch && !searchable) {
      onPlaceholderClicked();
    }
  }

  render() {
    const { placeholderText: defaultPlaceholderTxt, value, label, multiple, isOpen } = this.props;
    let placeholderText = defaultPlaceholderTxt;

    if (!multiple && (value && value[label])) {
      placeholderText = value[label];
    }

    const caretClass = !isOpen ? 'icon-key-arrow-down' : 'icon-key-arrow-up';

    return (
      <div
        className="select-placeholder"
        onClick={this.onPlaceholderContainerClicked}
      >
        <div className="select-placeholder-text">{placeholderText}</div>
        <div className="select-placeholder-caret-box">
          <i className={`${caretClass} sc-select-dropdown-icon`} />
        </div>
      </div>
    );
  };
};

export default SelectPlaceholder;
