/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header'
import {connect} from 'react-redux';
import {getBlocksAction} from "../../../actions/blocks";
import {getAllCurrenciesAction} from "../../../actions/currencies";
import {getTransactionAction} from "../../../actions/transactions";
import {setBodyModalParamsAction} from "../../../modules/modals";
import Currency from './currency';
import {BlockUpdater} from "../../block-subscriber";
import classNames from "classnames";
import uuid from "uuid";
import {getExchangesAction} from "../../../actions/exchange-booth";

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getBlocksAction : (requestParams) => dispatch(getBlocksAction(requestParams)),
    getTransactionAction : (type, data) => dispatch(getTransactionAction(type, data)),
    getAllCurrenciesAction: (reqParams) => dispatch(getAllCurrenciesAction(reqParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    getExchanges: currency => dispatch(getExchangesAction(currency)),
});

class Currencies extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            firstIndex: 0,
            lastIndex: 14,
            currencies: null
        };
    }

    componentWillMount() {
        this.getCurrencie({
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
    }

    listener = data => {
        this.getCurrencie({
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
    };

    getExchanges = async currency => {
        const exchanges = (await this.props.getExchanges(currency)).exchanges;

        if (exchanges) {
            this.setState({
                executedExchanges: exchanges
            })
        }
    };

    componentDidMount() {
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    }

    onPaginate = (page) => {
        this.setState({
            page: page,
            account: this.props.account,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        }, () => {
            this.getCurrencie({
                account: this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex: this.state.lastIndex
            })
        });
    };

    getCurrencie = async (reqParams) => {
        const allCurrencies = await this.props.getAllCurrenciesAction(reqParams);

        if (allCurrencies) {
            this.setState({
                currencies: allCurrencies.currencies
            })
        }
    };

    getTransaction = async (data) => {
        const reqParams = {
            transaction: data,
            account: this.props.account
        };

        const transaction = await this.props.getTransactionAction(reqParams);
        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction);
        }
    };

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Currencies'}
                />
                <div className="page-body container-fluid">
                    {
                        this.state.currencies &&
                        <div className="transaction-table">
                            <div className="transaction-table-body">
                                <table>
                                    <thead>
                                    <tr>
                                        <td>Code</td>
                                        <td>Name</td>
                                        <td>Type</td>
                                        <td className="align-right">Current Supply</td>
                                        <td className="align-right">Max Supply</td>
                                        <td className="align-right">Actions</td>
                                    </tr>
                                    </thead>
                                    <tbody key={uuid()}>
                                    {
                                        this.state.currencies &&
                                        this.state.currencies.map((el, index) => {
                                            return (
                                                <Currency
                                                    key={uuid()}
                                                    {...el}
                                                    getTransaction={this.getTransaction}
                                                />
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>
                                {
                                    this.state.currencies &&
                                    <div className="btn-box">
                                        <a
                                            className={classNames({
                                                'btn' : true,
                                                'btn-left' : true,
                                                'disabled' : this.state.page <= 1
                                            })}
                                            onClick={this.onPaginate.bind(this, this.state.page - 1)}
                                        > Previous</a>
                                        <div className='pagination-nav'>
                                            <span>{this.state.firstIndex + 1}</span>
                                            <span>&hellip;</span>
                                            <span>{this.state.lastIndex + 1}</span>
                                        </div>
                                        <a
                                            onClick={this.onPaginate.bind(this, this.state.page + 1)}
                                            className={classNames({
                                                'btn' : true,
                                                'btn-right' : true,
                                                'disabled' : this.state.currencies.length < 15
                                            })}
                                        >Next</a>
                                    </div>
                                }
                            </div>
                        </div> ||
                        <div className={'loader-box'}>
                            <div className="ball-pulse">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    }

                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Currencies);