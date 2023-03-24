import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SCLoader extends Component {
    static propTypes = {
        diameter: PropTypes.number.isRequired,
        lineWidth: PropTypes.number.isRequired,
        spinTime: PropTypes.string.isRequired,
        text: PropTypes.string,
        textPosition: PropTypes.oneOf(['left', 'right']),
        textClass: PropTypes.string,
        container: PropTypes.string,
    }
    static defaultProps = {
        spinTime: '2s'
    }
    render() {
        const loaderStyle = {
            width: `${this.props.diameter}px`,
            height: `${this.props.diameter}px`,
            borderWidth: `${this.props.lineWidth}px`,
            animation: `loader-spin ${this.props.spinTime} linear infinite`
        };

        const wrapper = this.props.container ? document.querySelector(this.props.container) : null;
        const containerStyle = {};

        if (wrapper && wrapper === document.body) {
            containerStyle.width = '100vw';
            containerStyle.height = '100vh';
        } else if (wrapper && wrapper !== document.body) {
            containerStyle.width = wrapper.style.width ? parseFloat(wrapper.style.width) : wrapper.clientWidth;
            containerStyle.height = wrapper.style.height ? parseFloat(wrapper.style.height) : wrapper.clientHeight;
        }

        const loaderText = (<span className={this.props.textClass}>{this.props.text}</span>);
        const leftText = this.props.text && this.props.textPosition === 'left' ? loaderText : null;
        const rightText = this.props.text && this.props.textPosition === 'right' ? loaderText : null;

        return (
            <div className="sc-loader-container" style={containerStyle}>
                {leftText}
                <div style={loaderStyle} className="sc-loader" />
                {rightText}
            </div>
        );
    }
}

export default SCLoader;
