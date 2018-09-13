import React from 'react';
import uuid from 'uuid';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';
import {getTransactionAction} from "../../../../actions/transactions";
import {getOrderInfoAction} from "../../../../actions/open-orders";
import NRS from "../../../../helpers/util/utils"
class OrderItem extends React.Component {

    state = {
        orderInfo: {}
    };

    getTransactionInfo = async transaction => {
        return await this.props.getTransactionAction({
            transaction,
            random: Math.random()
        })
    };

    componentDidMount() {
        this.getOrderInfo();
    }

    getOrderInfo = () => {
        this.props.getOrderInfo(this.props.order.asset).then(res => {
            console.warn("order", res);
            this.setState({
                orderInfo: res ? res : {}
            })
        });
    };

    render() {
        const {orderInfo} = this.state;
        return (
            <tr key={uuid()}>
                <td className="align-left blue-link-text"
                    onClick={async () => this.props.setBodyModalParamsAction('INFO_TRANSACTION', {})}>{orderInfo.name}</td>
                <td className="align-left">{NRS.formatQuantity(orderInfo.quantityATU, orderInfo.decimals)}</td>
                {/*<td>{NRS.formatOrderPricePerWholeATU(orderInfo.priceATM === undefined ? 0 :orderInfo.priceATM, orderInfo.decimals === undefined ? 0 : orderInfo.decimals)}</td>*/}
                <td>{this.props.order.priceATM}</td>
                <td>{this.props.order.priceATM * NRS.formatQuantity(orderInfo.quantityATU, orderInfo.decimals)}</td>
                <td>{orderInfo.quantityATU}</td>

                {/*<td className="align-right">{this.props.delete.quantityATU}</td>*/}
            </tr>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    getTransactionAction: (reqParams) => dispatch(getTransactionAction(reqParams)),
    getOrderInfo: order => dispatch(getOrderInfoAction(order)),
});

export default connect(null, mapDispatchToProps)(OrderItem);