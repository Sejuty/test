import React, { Component } from 'react';

class SCModalBody extends Component {
    render() {
        const bodyClass = this.props.className ? `sc-modal-body ${this.props.className}` : 'sc-modal-body';

        return (
            <div className={bodyClass}>{this.props.children}</div>
        );
    }
}

export default SCModalBody;
