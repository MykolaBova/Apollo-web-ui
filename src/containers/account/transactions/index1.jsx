/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useEffect, useCallback, useMemo, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { NotificationManager } from 'react-notifications';
import {
  getTransactionsAction, getTransactionAction, getPrivateTransactionAction,
} from '../../../actions/transactions';
import {
  setModalCallback, setBodyModalParamsAction, setModalType,
} from '../../../modules/modals';
import { BlockUpdater } from '../../block-subscriber/index';
import SiteHeader from '../../components/site-header';
import Transaction from './transaction';
import CustomTable from '../../components/tables/table';

export default function Transactions() {
  const dispatch = useDispatch();

  const { account } = useSelector(state => state.account);

  const [page, setPage] = useState(1);
  const [firstIndex, setFirstIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(15);
  const [type, setType] = useState(null);
  const [subtype, setSubtype] = useState(null);
  const [requestType, setRequestType] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [isUnconfirmed, setIsUnconfirmed] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const [isError, setIsError] = useState(null);
  const [isPrivate, setIsPrivate] = useState(null);
  const [isPhassing, setIsPhassing] = useState(null);
  const [passphrase, setPassphrase] = useState(null);

  const getUnconfirmedTransactionsTransactions = useCallback(async requestParams => {
    const params = requestParams;
    if (isAll) {
      delete params.account;
    }

    const unconfirmedTransactions = await dispatch(getTransactionsAction(params));

    if (unconfirmedTransactions) {
      setIsUnconfirmed(true);
      setTransactions(unconfirmedTransactions.unconfirmedTransactions);
      // todo: need to check
      setIsAll(!!isAll || false);
    }
  }, [dispatch, isAll]);

  // ! not used
  // const getTransaction = useCallback(async requestParams => {
  //   const transaction = await dispatch(getTransactionAction(requestParams));
  //   dispatch(setBodyModalParamsAction('INFO_TRANSACTION', transaction));
  // }, [dispatch]);

  // ! not used
  // const setTransactionInfo = useCallback((modalType, data, isPrivate) => {
  //   if (isPrivate) {
  //     getTransaction({
  //       account,
  //       transaction: data,
  //       passphrase: this.state.passphrase.passphrase || null,
  //       secretPhrase: this.state.passphrase.secretPhrase || null,
  //     });
  //   } else {
  //     getTransaction({
  //       account,
  //       transaction: data,
  //     });
  //   }
  // }, []);

  const getTransactions = useCallback(async (requestParams, all) => {
    const params = requestParams;
    delete params.requestType;

    if (!isUnconfirmed && !isPhassing) {
      const currTransactions = await dispatch(getTransactionsAction(params));

      if (currTransactions) {
        if (!currTransactions.errorCode) {
          setTransactions(currTransactions.transactions);
          setIsUnconfirmed(false);
          setIsError(false);
          if (currTransactions.serverPublicKey && !isPrivate) {
            setIsPrivate(true);
            // ! should be callBack
            NotificationManager.success('You are watching private transactions.', null, 900000);
          }
        } else if (!isError) {
          setIsError(true);
          // ! should be callBack
          NotificationManager.error(currTransactions.errorDescription, 'Error', 900000);
        }
      }
    }

    if (isUnconfirmed) {
      params.requestType = requestType;
      getUnconfirmedTransactionsTransactions(params, all);
    }

    if (isPhassing) {
      params.requestType = requestType;

      const newTransactions = await dispatch(getTransactionsAction(params));

      if (newTransactions) {
        setTransactions(newTransactions.transactions);
      }
    }
  }, [
    dispatch, getUnconfirmedTransactionsTransactions, isError,
    isPhassing, isPrivate, isUnconfirmed, requestType,
  ]);

  const getPrivateTransactions = useCallback(data => {
    let reqParams = {
      type,
      account,
      firstIndex,
      lastIndex,
      requestType,
    };

    if (data) {
      if (Object.values(data)[0]) {
        reqParams = {
          ...reqParams,
          ...data,
        };
        setPassphrase(data);
        // ! should be callBack
        getTransactions(reqParams);
      } else {
        getTransactions(reqParams);
      }
    }
  }, [account, firstIndex, getTransactions, lastIndex, requestType, type]);

  const updateTransactionsData = useCallback(newState => {
    // todo: check
    this.setState({ ...newState }, () => {
      getPrivateTransactions({ ...passphrase });
    });
  }, []);

  const onPaginate = useCallback(newPage => {
    const reqParams = {
      type,
      account,
      page: newPage,
      firstIndex: newPage * 15 - 15,
      lastIndex: newPage * 15,
      requestType,
      ...passphrase,
    };

    this.setState(reqParams, () => {
      getTransactions(reqParams, isAll);
    });
  }, []);

  const handleTransactionFilters = useCallback((currType, currSubtype, currRequestType, all) => {
    const next = () => {
      setType(currType);
      setSubtype(currSubtype);
      setPage(1);
      setFirstIndex(0);
      setLastIndex(15);
      setRequestType(currRequestType);
      // ! should be callBack
      getTransactions({
        type,
        account,
        firstIndex: 0,
        lastIndex: 15,
        requestType,
        ...passphrase,
      }, all);
      // });
    };

    if (requestType === 'getUnconfirmedTransactions') {
      setIsUnconfirmed(true);
      setIsPhassing(false);
      setIsAll(!!all || false);
      // todo: need to check
      next();
    } else if (requestType === 'getAccountPhasedTransactions') {
      setIsPhassing(true);
      setIsUnconfirmed(false);
      setType(null);
      setSubtype(null);
      // todo: need to check
      next();
    } else {
      this.setState({
        isUnconfirmed: false,
        isPhassing: false,
      }, () => {
        next();
      });
    }
  }, []);

  const AboveTabeComponentItem = useMemo((label, handler, activeCondition) => (
    <div
      className={classNames({
        btn: true,
        filter: true,
        active: activeCondition,
      })}
      onClick={() => handleTransactionFilters(handler, null)}
    >
      {label}
    </div>
  ), []);

  const AboveTabeComponent = useMemo(() => (
    <div className="transactions-filters">
      <div className="top-bar">
        {AboveTabeComponentItem('All types', null, type !== 0 && !type && !subtype && !isPhassing && !isUnconfirmed)}
        {AboveTabeComponentItem(<i className="zmdi zmdi-card" />, 0, type === 0 && !subtype && !isPhassing)}
        {AboveTabeComponentItem(<i className="zmdi zmdi-email" />, 1, type === 1 && !subtype)}
        {AboveTabeComponentItem(<i className="zmdi zmdi-equalizer" />, 2, type === 2 && !subtype)}
        {AboveTabeComponentItem(<i className="zmdi zmdi-shopping-cart" />, 3, type === 3 && !subtype)}
        {AboveTabeComponentItem(<i className="zmdi zmdi-lock" />, 4, type === 4 && !subtype)}
        {AboveTabeComponentItem(<i className="zmdi zmdi-balance" />, 5, type === 5 && !subtype)}
        {AboveTabeComponentItem(<i className="zmdi zmdi-cloud" />, 6, type === 6 && !subtype)}
        {AboveTabeComponentItem(<i className="zmdi zmdi-shuffle" />, 7, type === 7 && !subtype)}
        {AboveTabeComponentItem(<i className="zmdi zmdi-help" />, 8, type === 8 && !subtype)}
        <div
          className={classNames({
            btn: true,
            filter: true,
            active: isUnconfirmed && !isAll,
          })}
          onClick={() => {
            handleTransactionFilters(null, null, 'getUnconfirmedTransactions', false);
          }}
        >
          Unconfirmed (account)
        </div>
        <div
          className={classNames({
            btn: true,
            filter: true,
            active: isPhassing,
          })}
          onClick={() => handleTransactionFilters(null, null, 'getAccountPhasedTransactions')}
        >
          Phasing
        </div>
        <div
          className={classNames({
            btn: true,
            filter: true,
            active: isUnconfirmed && isAll,
          })}
          onClick={() => handleTransactionFilters(null, null, 'getUnconfirmedTransactions', true)}
        >
          All Unconfirmed
        </div>

      </div>
    </div>
  ), [AboveTabeComponentItem, handleTransactionFilters, isAll, isPhassing, isUnconfirmed, subtype, type]);

  useEffect(() => {
    getTransactions({
      type,
      account,
      firstIndex,
      lastIndex,
      requestType,
    });
    dispatch(setModalCallback(getPrivateTransactions));
    BlockUpdater.on('data', data => {
      console.warn('height in dashboard', data);
      console.warn('updating dashboard');
      updateTransactionsData();
    });

    return () => {
      BlockUpdater.removeAllListeners('data');
    };
  }, []);

  useEffect(() => {
    updateTransactionsData(newState);
  }, []);

  return (
    <div className="page-content">
      <SiteHeader
        pageTitle="Transactions"
      >
        <button
          type="button"
          className={classNames({
            'btn btn-green btn-sm': true,
            disabled: isPrivate,
          })}
          onClick={() => {
            dispatch(setModalType('PrivateTransactions'));
          }}
        >
          Show private transactions
        </button>
      </SiteHeader>
      <div className="page-body container-fluid">
        <div className="my-transactions">
          {this.AboveTabeComponent()}
          <CustomTable
            header={[
              {
                name: 'Date',
                alignRight: false,
              }, {
                name: 'Type',
                alignRight: false,
              }, {
                name: 'Amount',
                alignRight: true,
              }, {
                name: 'Fee',
                alignRight: true,
              }, {
                name: 'Account',
                alignRight: false,
              }, {
                name: 'Phasing',
                alignRight: true,
              }, {
                name: 'Height',
                alignRight: true,
              }, {
                name: 'Confirmations',
                alignRight: true,
              },
            ]}
            keyField="ledgerId"
            className="no-min-height mb-3"
            emptyMessage="No transactions found."
            TableRowComponent={Transaction}
            passProps={{
              secretPhrase: this.state.secretPhrase || this.state.passphrase,
              isUnconfirmed: this.state.isUnconfirmed,
            }}
            tableData={this.state.transactions}
            isPaginate
            page={this.state.page}
            previousHendler={() => this.onPaginate(this.state.page - 1)}
            nextHendler={() => this.onPaginate(this.state.page + 1)}
            itemsPerPage={15}
          />
        </div>
      </div>
    </div>
  );
}
