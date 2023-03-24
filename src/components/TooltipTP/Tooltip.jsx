import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { v4 as uuidv4 } from 'uuid';

class SCToolTip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: uuidv4(),
    };
  }

  static propTypes = {
    position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    trigger: PropTypes.oneOf(['click', 'hover']),
    content: PropTypes.oneOfType([PropTypes.string]),
    // TODO
    // autoCloseTime: PropTypes.number,
    variant: PropTypes.oneOf([
      'primary',
      // 'primary-outline',
      // 'success',
      // 'success-outline',
      // 'danger',
      // 'danger-outline',
    ]),
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  };

  static defaultProps = {
    position: 'top',
    trigger: null,
    content: 'Tooltip',
    variant: 'primary',
  };
  //
  // componentDidUpdate() {
  //   ReactTooltip.rebuild();
  // }

  render() {
    const childAttributes = {
      'data-tip': this.props.content,
      'data-for': this.state.id,
    };

    const children = typeof this.props.children === 'string' ? <span
      className='self-start' {...childAttributes}>{this.props.children}</span> : React.Children.map(this.props.children, child => {
      return React.cloneElement(child, childAttributes);
    });

    const event = this.props.trigger === 'click' ? 'click' : null;
    let bgColor;
    switch (this.props.variant) {
      case 'primary':
        bgColor = '#5A57EB';
        break;
      default:
        bgColor = '#5A57EB';
    }
    return (
      <>
        {children}
        <ReactTooltip multiline id={this.state.id} place={this.props.position} event={event} effect='solid'
                      backgroundColor={bgColor} className='react-tooltip break-words max-w-xs'
                      getContent={[() => {
                        return this.props.content;
                      }]} />
      </>
    );
  }
}

export default SCToolTip;
