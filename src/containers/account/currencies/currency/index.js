/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {getCurrencyTypes} from "../../../../modules/currencies";

const Currency = (props) =>  {
    const {currency, code, type, types, decimals, getTransaction, setBodyModalParamsAction, currentSupply, maxSupply, name} = props;
    const currencyTypes = getCurrencyTypes(type);

    return (
        <tr>
            <td className="blue-link-text">
                <a onClick={() => getTransaction(currency)}>
                    {code}
                </a>
            </td>
            <td>{name}</td>
            <td className="blue-link-text" dangerouslySetInnerHTML={{__html: currencyTypes}}/>
            <td className="align-right">{currentSupply / Math.pow(10, decimals)}</td>
            <td className="align-right">{maxSupply / Math.pow(10, decimals)}</td>
            <td className="align-right">
                <div className="btn-box inline">
                    <Link to={"/exchange-booth/" + code} className="btn primary blue">Exchange</Link>
                    {
                        types.includes('RESERVABLE') &&
                        <a onClick={() => setBodyModalParamsAction('RESERVE_CURRENCY', props)} className="btn primary default">Reserve</a>
                    }
                </div>
            </td>
        </tr>
    )
}


const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(null, mapDispatchToProps)(Currency);