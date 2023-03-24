import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SCModalHeader from './ModalHeader.jsx';
import SCModalBody from './ModalBody.jsx';

class SCModal extends Component {
    constructor(props) {
        super(props);

        this.SCModalContentRef = React.createRef();

        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleModalClick = this.handleModalClick.bind(this);
        this.handleModalKeyDown = this.handleModalKeyDown.bind(this);
    }
    static propTypes = {
        show: PropTypes.bool,
        variant: PropTypes.oneOf(['black', 'white', 'grey']),
        disableOutsideClick: PropTypes.bool,
        animation: PropTypes.oneOf(['fade', 'zoom', 'top', 'bottom']),
        onModalOpen: PropTypes.func,
        onModalClose: PropTypes.func,
        children: function (props, propName, componentName) {
            const prop = props[propName];
        
            let error = null

            React.Children.forEach(prop, function (child) {
                if (child.type !== SCModalHeader || child.type !== SCModalBody) {
                    error = new Error('`' + componentName + '` children should be of type `SCModalHeader` or `SCModalBody`.');
                }
            });

            return error;
          }
    }
    static defaultProps = {
        disableOutsideClick: false,
        variant: 'grey',
        animation: 'zoom',
        onModalOpen: () => {},
        onModalClose: () => {},
    }
    state = {
        isVisible: !!this.props.isVisible
    }
    showModal() {
        this.setState({
            isVisible: true
        });

        this.props.onModalOpen();
    }
    closeModal() {
        this.setState({
            isVisible: false
        });

        this.props.onModalClose();
    }
    handleModalClick(event) {
        let mouseDrag = false;
        let mouseClick = false;
        let dbClicked = false;

        if (!this.state.isVisible || this.props.disableOutsideClick) return;

        if (this.SCModalContentRef && this.SCModalContentRef.current.contains(event.target)) {
            return;
        }

        document.addEventListener('mousedown', e => { mouseClick = true; });
        document.addEventListener('mousemove', e => { mouseDrag = true; });
        document.addEventListener('dblclick', e => { dbClicked = true; });
        document.addEventListener('mouseup', e => { 
            if(dbClicked) {
              return
            }
            if(mouseClick && !mouseDrag && !dbClicked) {
              this.closeModal();
            } 
            mouseDrag = false;
            mouseClick = false;
            dbClicked = false;
        });
        this.closeModal();
    }
    handleModalKeyDown(event) {
        if (this.state.isVisible && (event.key === 'Escape' || event.keyCode === 27 || event.which === 27)) {
            this.closeModal();
        }
    }
    componentDidMount() {
        document.addEventListener('keydown', this.handleModalKeyDown);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleModalKeyDown);
    }
    shouldComponentUpdate(nextProps) {
        if (nextProps.hasOwnProperty('show') && nextProps.show !== this.state.isVisible) {
            this.setState({
                isVisible: nextProps.show,
            });
        }

        return true;
    }
    render() {
        const header = this.props.header ? this.props.header : <SCModalHeader />;
        const body = this.props.body ? this.props.body : <SCModalBody />;
        const mainModalClass = `sc-modal ${this.state.isVisible ? 'sc-modal-visible' : 'sc-modal-hidden'} sc-modal-${this.props.variant}`;
        const finalHeader = React.cloneElement(header, { onCloseBtnClick: this.closeModal });

        return (
            <div
                className={mainModalClass}
                onMouseDown={this.handleModalClick}
            >
                <div
                    className={`sc-modal-content sc-modal-animate-${this.props.animation}`}
                    ref={this.SCModalContentRef}
                >
                    {finalHeader}
                    {body}
                </div>
            </div>
        );
    }
}

export default SCModal;
