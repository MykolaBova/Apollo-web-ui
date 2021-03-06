/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from "react";
import {connect} from "react-redux";
import {ONE_APL} from '../../../../constants';

class ExchangeItem extends React.Component {
    render() {
        const {setBlockInfo, ...exchange} = this.props;

        return (
            <tr>
                <td className="blue-link-text"><a onClick={setBlockInfo.bind(this, 'INFO_BLOCK', exchange.height)}>{exchange.height}</a></td>
                <td>

                    {
                        exchange.subtype === 5 ? 'buy' : 'sell'
                    }
                </td>
                <td className="align-right">{(parseInt(exchange.units) / Math.pow(10, this.props.decimals)).toFixed(8)}</td>
                <td className="align-right">{((exchange.rateATM / ONE_APL) * Math.pow(10, this.props.decimals)).toFixed(2)}</td>
                <td className="align-right">{(((parseInt(exchange.units) / Math.pow(10, this.props.decimals))) * ((exchange.rateATM / ONE_APL))* Math.pow(10, this.props.decimals)).toFixed(2)}</td>
            </tr>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeItem);
