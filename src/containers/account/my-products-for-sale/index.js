/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { connect } from 'react-redux';
import MarketplaceTableItem from '../marketplace/marketplace-table-item';
import SiteHeader from  '../../components/site-header'
import {setBodyModalParamsAction } from "../../../modules/modals";
import {BlockUpdater} from "../../block-subscriber/index";

import CustomTable from '../../components/tables/table';

import {getDGSGoodsAction} from "../../../actions/marketplace";

class MyProductsForSale extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            page: 1,
            firstIndex: 0,
            lastIndex: 15,
            getDGSGoods: []
        };
    }

    componentDidMount() {
        this.getDGSGoods({
            seller: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
        BlockUpdater.on("data", data => {
            console.warn("height in dashboard", data);
            console.warn("updating dashboard");
            this.getDGSGoods({
                seller: this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            });
        });
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    componentWillReceiveProps(newState) {
        this.setState({
            ...newState
        }, () => {
            this.getDGSGoods({
                PublicKey: this.state.publicKey,
                seller: this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            });
        });
    }

    onPaginate (page) {
        let reqParams = {
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15
        };

        this.setState(reqParams, () => {
            this.getDGSGoods(reqParams)
        });
    }

    getDGSGoods = async (reqParams) => {
        const getDGSGoods = await this.props.getDGSGoodsAction(reqParams);

        if (getDGSGoods) {
            this.setState({
                ...this.state,
                getDGSGoods: getDGSGoods.goods
            })
        }
    };

    render () {

        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'My products for sale'}
                >
                    <button
                        type={'button'}
                        className="btn btn-green btn-sm"
                        onClick={() => this.props.setBodyModalParamsAction('LIST_PRODUCT_FOR_SALE', {})}
                    >
                        List product for sale
                    </button>
                </SiteHeader>
                <div className="page-body container-fluid">
                    <CustomTable 
                        header={[
                            {
                                name: 'Name',
                                alignRight: false
                            },{
                                name: 'Quantity',
                                alignRight: true
                            },{
                                name: 'Price',
                                alignRight: true
                            },{
                                name: 'Actions',
                                alignRight: true
                            }
                        ]}
                        emptyMessage={'No products found.'}
                        page={this.state.page}
                        className={'mb-3'}
                        TableRowComponent={MarketplaceTableItem}
                        tableData={this.state.getDGSGoods}
                        isPaginate
                        previousHendler={this.onPaginate.bind(this, this.state.page - 1)}
                        nextHendler={this.onPaginate.bind(this, this.state.page + 1)}
                        itemsPerPage={15}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account,

    // modals
    modalData: state.modals.modalData
});

const initMapDispatchToProps = dispatch => ({
    getDGSGoodsAction: (reqParams) => dispatch(getDGSGoodsAction(reqParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(
    mapStateToProps,
    initMapDispatchToProps
)(MyProductsForSale);
