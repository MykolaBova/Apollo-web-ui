import React from 'react';
import {connect} from 'react-redux';
import TransactionItem from "./TransactionItem";
import ContentLoader from "../../components/content-loader";

const MyTransactions = ({dashboardTransactions}) => (
    <div className={`card`}>
        <div className="card-title card-title-tabs card-title-lg bg-primary">
            <div className={'title'}>My Transactions</div>
            <div className={'title-tabs-section'}>
                <span className={'tab active'}>Recent</span>
            </div>
        </div>
        <div className="card-body">
            {dashboardTransactions ? (
                dashboardTransactions.map((el, index) => (
                    <TransactionItem
                        key={`transaction-item-${index}`}
                        {...el}
                    />
                ))
            ) : (
                <ContentLoader white noPaddingOnTheSides/>
            )}
        </div>
    </div>
);

const mapStateToProps = state => ({
    dashboardTransactions: state.dashboard.dashboardTransactions,
});

export default connect(mapStateToProps)(MyTransactions)