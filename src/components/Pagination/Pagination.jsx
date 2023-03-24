import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SCSelect, SCButton } from '../../components';
import { range } from '../../utils';

class SCPagination extends Component {
    static propTypes = {
        total: PropTypes.number.isRequired,
        page: PropTypes.number.isRequired,
        size: PropTypes.number.isRequired,
        sizes: PropTypes.arrayOf(PropTypes.number).isRequired,
        onPageChange: PropTypes.func.isRequired,
        className: PropTypes.string,
        pageClass: PropTypes.string,
    }
    static defaultProps = {
        total: 0,
        page: 1,
        size: 10,
        sizes: [5, 10, 20, 50],
        onPageChange: () => {},
    }
    
    goToPage(page = 1, size = this.props.size) {
        this.props.onPageChange(page, size);
    }
    render() {
        const { total, page, size } = this.props;
        const pages = Math.ceil(total / size) || 1;
        const start = (page - 1) * size + 1;
        const last = (page - 1) * size + size;
        const end = last > total ? total : last;
        

        const firstPage = (
            <SCButton
                size="auto"
                className={`sc-pagination-number${page === 1 ? ' is-active' : ''}`}
                action={() => this.goToPage(1)}
            >1</SCButton>);
        const lastPage = page === 1 && page === pages ? null
            : (
                <SCButton
                    size="auto"
                    className={`sc-pagination-number${page === pages ? ' is-active' : ''}`}
                    action={() => this.goToPage(pages)}
                >{pages}</SCButton>
            );

        let middlePagesRange = range(page - 1, page + 1);
        middlePagesRange = middlePagesRange.filter(mPage => mPage > 1 && mPage < pages);
        
        const middlePages = middlePagesRange.map(mPage => {
            return (
                <SCButton
                    size="auto"
                    className={`sc-pagination-number${mPage === page ? ' is-active' : ''}`}
                    key={`page-${mPage}`}
                    action={() => this.goToPage(mPage)}
                >{mPage}</SCButton>
            );
        });

        const splitter = (<span className="ml-2 mr-4 text-primary">...</span>);
        const leftSplitter = middlePagesRange[0] > 2 ? splitter : null;
        const rightSplitter = middlePagesRange[middlePagesRange.length - 1] + 1 < pages ? splitter : null;

        const onPageSizeSelected = (selected) => {
            this.goToPage(1, selected);
        };

        return (
            <div className="sc-pagination-container flex-col items-center xl:flex-row xl:justify-items-start">
                <div className="sc-pagination-size-selector mb-4 xl:mb-0">
                    <div className="flex">
                        <span className="leading-loose">Show &nbsp;</span>
                        <SCSelect
                            value={this.props.size}
                            options={this.props.sizes}
                            allowEmpty={false}
                            placeholder=""
                            className="xl:flex-1 mx-2"
                            onSelect={onPageSizeSelected}
                        />
                    </div>
                    <span className="leading-loose">&nbsp; Items per page</span>
                </div>
                <div className="sc-pagination-numbers">
                    <div className="flex text-grey">
                        <SCButton
                            size="auto"
                            className="sc-pagination-number"
                            action={() => this.goToPage(page - 1)}
                            disabled={page === 1}
                        >
                            <i className="icon-key-arrow-left" />
                            <span className="uppercase">Prev</span>
                        </SCButton>
                        {firstPage}
                        {leftSplitter}
                        {middlePages}
                        {rightSplitter}
                        {lastPage}
                        <SCButton
                            size="auto"
                            className="sc-pagination-number"
                            action={() => this.goToPage(page + 1)}
                            disabled={page === pages}
                        >
                            <span className="uppercase">Next</span>
                            <i className="icon-key-arrow-right" />
                        </SCButton>
                    </div>

                    <div className="mt-4 flex w-full justify-center">
                        <span>Showing</span>
                        <span className="sc-number-range">{start !== end ? `${start} - ${end}` : start}</span>
                        <span>of</span>
                        <span className="sc-number-range">{this.props.total}</span>
                        <span>items</span>
                    </div>
                </div>
            </div>
        );
    }
};

export default SCPagination;
