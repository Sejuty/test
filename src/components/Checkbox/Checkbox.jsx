import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SCCheckbox extends Component {
    constructor(props) {
        super(props);

        this.checkboxInputEl = React.createRef();
        this.state = {
            isChecked: props.value || false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.setValue = this.setValue.bind(this);
    }
    static propTypes = {
        value: PropTypes.bool,
        disabled: PropTypes.bool,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
        className: PropTypes.string,
        label: PropTypes.string,
        handleChange: PropTypes.func,
    }
    static defaultProps = {
        disabled: false,
        size: 'md',
        label: '',
        handleChange: () => {}
    }
    setValue(value = false) {
        this.setState({
            isChecked: !!value
        });
    }
    handleChange = () => {
        if (this.checkboxInputEl) {
            this.checkboxInputEl.current.click();
        }
    }
    handleCheckboxChange = (e) => {
        this.setState({
            isChecked: e.target.checked
        });

        this.props.handleChange(e.target.checked);
    }
    getContaienrClass() {
        const containerClass = ['sc-checkbox-container', `sc-checkbox-${this.props.size}`];

        if (this.props.className) {
            containerClass.push(this.props.className);
        }

        if (this.props.disabled) {
            containerClass.push('sc-checkbox-disabled');
        }

        return containerClass.join(' ');
    }
    shouldComponentUpdate(nextProps) {
        if (nextProps.value !== undefined && nextProps.value !== this.state.isChecked) {
            this.setState({
                isChecked: nextProps.value
            });
        }

        return true;
    }
    render() {
        const checkmark = !this.state.isChecked ? null : (
            <i className="checkmark icon-done-outline" />
        );

        return (
            <div
                className={this.getContaienrClass()}
                onClick={this.handleChange}
            >
                <div className="sc-checkbox">
                    <input
                        ref={this.checkboxInputEl}
                        type="checkbox"
                        className="hidden"
                        disabled={this.props.disabled}
                        checked={this.state.isChecked}
                        onChange={this.handleCheckboxChange}
                    />
                    {checkmark}
                </div>
                <span className="sc-checkbox-label">{this.props.label}</span>
            </div>
        );
    }
};

export default SCCheckbox;
