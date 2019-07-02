import React from 'react';
import {connect} from 'react-redux';
import {Form} from 'react-form';
import {NotificationManager} from 'react-notifications';
import InputForm from '../../../../components/input-form';
import CustomSelect from '../../../../components/select';
import InputRange from "../../../../components/input-range";
import {currencyTypes, multiply} from '../../../../../helpers/format';
import {createOffer} from '../../../../../actions/wallet';
import {setBodyModalParamsAction} from '../../../../../modules/modals';
import {ONE_GWEI} from '../../../../../constants';
import {ReactComponent as ArrowRight} from "../../../../../assets/arrow-right.svg";

class BuyForm extends React.Component {
    feeATM = 200000000;
    state = {
        form: null,
        currentCurrency: null,
        wallet: null,
        walletsList: null,
    };

    static getDerivedStateFromProps(props, state) {
        if (props.currentCurrency && (props.currentCurrency.currency !== state.currentCurrency || props.wallet !== state.wallet)) {
            if (state.form && state.form.values) {
                state.form.setAllValues({
                    walletAddress: state.form.values.walletAddress,
                    pairRate: '',
                    offerAmount: '',
                    total: '',
                });
            }

            let walletsList = props.wallet || [];
            walletsList = walletsList.map((wallet) => (
                {
                    value: wallet,
                    label: wallet.address
                }
            ));

            return {
                currentCurrency: props.currentCurrency.currency,
                wallet: props.wallet,
                walletsList,
            };
        }

        return null;
    }

    handleFormSubmit = (values) => {
        if (this.props.wallet) {
            if (values.offerAmount > 0 && values.pairRate > 0) {
                const currency = this.props.currentCurrency.currency;
                if (values.pairRate < 0.000000001) {
                    NotificationManager.error(`Price must be more then 0.000000001 ${currency.toUpperCase()}`, 'Error', 5000);
                    return;
                }
                if (values.offerAmount < 0.001) {
                    NotificationManager.error('You can buy more then 0.001 APL', 'Error', 5000);
                    return;
                }
                if (!values.walletAddress || !values.walletAddress.balances) {
                    NotificationManager.error('Please select wallet address', 'Error', 5000);
                    return;
                }
                const pairRate = multiply(values.pairRate, ONE_GWEI);
                const offerAmount = multiply(values.offerAmount, ONE_GWEI);
                const balanceETH = parseFloat(values.walletAddress.balances[currency]);
                const balanceAPL = (this.props.dashboardAccoountInfo && this.props.dashboardAccoountInfo.unconfirmedBalanceATM) ?
                    parseFloat(this.props.dashboardAccoountInfo.unconfirmedBalanceATM)
                    :
                    parseFloat(this.props.balanceAPL);

                if (balanceETH === 0 || balanceETH < values.total) {
                    NotificationManager.error(`Not enough founds on your ${currency.toUpperCase()} balance.`, 'Error', 5000);
                    return;
                }
                if (!this.props.balanceAPL || balanceAPL === 0 || balanceAPL < this.feeATM) {
                    NotificationManager.error('Not enough founds on your APL balance. You need to pay 2 APL fee.', 'Error', 5000);
                    return;
                }

                const params = {
                    offerType: 0, // BUY
                    pairCurrency: currencyTypes[currency],
                    pairRate,
                    offerAmount,
                    sender: this.props.account,
                    passphrase: this.props.passPhrase,
                    feeATM: this.feeATM,
                    walletAddress: values.walletAddress.address,
                };
                if (this.props.passPhrase) {
                    this.props.createOffer(params);
                    if (this.state.form) {
                        this.state.form.setAllValues({
                            walletAddress: values.walletAddress,
                            pairRate: '',
                            offerAmount: '',
                            total: '',
                        });
                    }
                } else {
                    this.props.setBodyModalParamsAction('CONFIRM_CREATE_OFFER', {
                        params,
                        resetForm: () => this.state.form.setAllValues({
                            walletAddress: values.walletAddress,
                            pairRate: '',
                            offerAmount: '',
                            total: '',
                        })
                    });
                }
            } else {
                NotificationManager.error('Price and amount are required', 'Error', 5000);
            }
        } else {
            this.props.handleLoginModal();
        }
    };

    getFormApi = (form) => {
        this.setState({form})
    };

    render() {
        const {currentCurrency: {currency}} = this.props;
        const currencyName = currency.toUpperCase();
        return (
            <Form
                onSubmit={values => this.handleFormSubmit(values)}
                getApi={this.getFormApi}
                render={({
                             submitForm, setValue, values
                         }) => {
                    const balance = values.walletAddress && values.walletAddress.balances[currency];
                    return (
                        <form
                            className="form-group-app d-flex flex-column justify-content-between h-100 mb-0"
                            onSubmit={submitForm}
                        >
                            {this.state.walletsList && !!this.state.walletsList.length && (
                                <div className="form-group mb-3">
                                    <label>
                                        {currencyName} Wallet
                                    </label>
                                    <CustomSelect
                                        className="form-control"
                                        field={'walletAddress'}
                                        defaultValue={this.state.walletsList[0]}
                                        setValue={setValue}
                                        options={this.state.walletsList}
                                    />
                                </div>
                            )}
                            <div className="form-group mb-3">
                                <label>
                                    Price for 1 APL
                                </label>
                                <div className="input-group">
                                    <InputForm
                                        field="pairRate"
                                        type={"float"}
                                        onChange={(price) => {
                                            let amount = values.offerAmount || 0;
                                            if (balance) {
                                                if ((amount * price) > balance) {
                                                    amount = balance / price;
                                                    setValue("range", 100);
                                                    setValue("total", balance);
                                                    setValue("offerAmount", amount);
                                                    return;
                                                } else {
                                                    setValue("range", ((amount * price) * 100 / balance).toFixed(0));
                                                }
                                            }
                                            setValue("total", multiply(amount, price));
                                        }}
                                        setValue={setValue}
                                        disableArrows
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text">{currencyName}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mb-3">
                                <label>
                                    I want to Buy
                                </label>
                                <div
                                    className="input-group">
                                    <InputForm
                                        field="offerAmount"
                                        type={"float"}
                                        onChange={(amount) => {
                                            if (balance) {
                                                if ((amount * values.pairRate) > balance) {
                                                    amount = balance / values.pairRate;
                                                    setValue("range", 100);
                                                    setValue("total", balance);
                                                    setValue("offerAmount", amount);
                                                    return;
                                                } else {
                                                    setValue("range", (amount * 100 / balance).toFixed(0));
                                                }
                                            }
                                            setValue("total", multiply(amount, values.pairRate));
                                        }}
                                        setValue={setValue}
                                        disableArrows
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text">APL</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mb-3">
                                <label>
                                    I will pay
                                </label>
                                <div className="input-group">
                                    <InputForm
                                        field="total"
                                        type={"float"}
                                        setValue={setValue}
                                        disabled/>
                                    <div className="input-group-append">
                                    <span className="input-group-text">
                                        {values.walletAddress && (
                                            <span className={'input-group-info-text'}><i
                                                className="zmdi zmdi-balance-wallet"/>&nbsp;
                                                {values.walletAddress.balances[currency]}&nbsp;</span>
                                        )}
                                        {currencyName}</span>
                                    </div>
                                </div>
                            </div>
                            {values.walletAddress && (
                                <InputRange
                                    field="range"
                                    min={0}
                                    max={100}
                                    disabled={!values.pairRate || values.pairRate === '0' || values.pairRate === ''}
                                    onChange={(amount) => {
                                        const offerAmount = values.pairRate !== '0' ? ((amount * balance) / (100 * values.pairRate)).toFixed(10) : 0;
                                        setValue("offerAmount", offerAmount);
                                        setValue("total", multiply(offerAmount, values.pairRate));
                                    }}
                                />
                            )}
                            <button
                                type={'submit'}
                                className={'btn btn-green btn-lg'}
                            >
                                <span>Buy APL</span>
                                <div className={'btn-arrow'}>
                                    <ArrowRight/>
                                </div>
                            </button>
                        </form>
                    )
                }}/>
        )
    }
}

const mapStateToProps = ({account, dashboard, exchange}) => ({
    account: account.account,
    balanceAPL: account.unconfirmedBalanceATM,
    dashboardAccoountInfo: dashboard.dashboardAccoountInfo,
    passPhrase: account.passPhrase,
    currentCurrency: exchange.currentCurrency,
});

const mapDispatchToProps = dispatch => ({
    createOffer: (params) => dispatch(createOffer(params)),
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BuyForm);