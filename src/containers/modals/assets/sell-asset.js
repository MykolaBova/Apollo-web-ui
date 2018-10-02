/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import InputForm from '../../components/input-form';
import {Form, Text} from 'react-form';

import AccountRS from '../../components/account-rs';
import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";

class SellAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false
        }

    }

    handleFormSubmit = async(values) => {

        values = {
            ...values,
            asset: this.props.modalData.assetInfo.asset,
            priceOrder: this.props.modalData.priceATM * (100000000 / Math.pow(10, this.props.modalData.assetInfo.decimals)),
            quantityOrder: (this.props.modalData.quantityATU * Math.pow(10, this.props.modalData.assetInfo.decimals))
        };

        this.setState({
            isPending: true
        })

        const res = await this.props.submitForm( values, 'placeAskOrder');
        if (res.errorCode) {
            this.setState({
                isPending: false
            })
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('The sell order has been submitted!', null, 5000);
        }
    };

    // getAsset = async  () => {
    //     const asset = await this.props.
    // }

    handleAdvancedState = () => {
        if (this.state.advancedState) {
            this.setState({
                ...this.props,
                advancedState: false
            })
        } else {
            this.setState({
                ...this.props,
                advancedState: true
            })
        }
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({ submitForm, values, addValue, removeValue, setValue, getFormState }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            {
                                this.props.modalData &&
                                <div className="form-group-app">
                                    <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                    <div className="form-title">
                                        <p>Confirm Order (Sell)</p>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Order Description
                                        </label>
                                        <div className="col-sm-9">
                                            <p>Sell {this.props.modalData.quantityATU} {this.props.modalData.assetName} assets at {this.props.modalData.total / this.props.modalData.quantityATU} Apollo each.</p>
                                            <Text defaultValue={this.props.modalData.assetName} type="hidden" field={'name'}/>
                                            <Text defaultValue={this.props.modalData.assetID} type="hidden" field={'asset'}/>
                                            <Text defaultValue={this.props.modalData.quantityATU} placeholder={'Quantity'} type="hidden" field={'quantityATU'}/>

                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Total
                                        </label>
                                        <div className="col-sm-9">
                                            <p>{this.props.modalData.total} Apollo</p>
                                            <Text
                                                defaultValue={this.props.modalData.assetName}
                                                placeholder={'Quantity'}
                                                type="hidden"
                                                field={'quantityATU'}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Fee
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent">
                                            <InputForm
                                                field="feeATM"
                                                defaultValue={this.props.modalData.assetName}
                                                placeholder="Amount"
                                                type={"float"}
                                                setValue={setValue}/>
                                            <div className="input-group-append">
                                                <span className="input-group-text">Apollo</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Secret Phrase
                                        </label>
                                        <div className="col-sm-9">
                                            <Text className="form-control" field="secretPhrase" placeholder="Secret Phrase" type={'password'}/>
                                        </div>
                                    </div>

                                    {/*<AdvancedSettings
                                        setValue={setValue}
                                        getFormState={getFormState}
                                        values={values}
                                        advancedState={this.state.advancedState}
                                    />*/}

                                    <div className="btn-box align-buttons-inside absolute right-conner">

                                        {
                                            !!this.state.isPending ?
                                                <div
                                                    style={{
                                                        width: 56.25
                                                    }}
                                                    className="btn btn-right blue round round-bottom-right"
                                                >
                                                    <div className="ball-pulse">
                                                        <div></div>
                                                        <div></div>
                                                        <div></div>
                                                    </div>
                                                </div> :
                                                <button

                                                    type="submit"
                                                    name={'closeModal'}
                                                    className="btn btn-right blue round round-bottom-right"
                                                >
                                                    Sell
                                                </button>
                                        }
                                        <a onClick={() => this.props.closeModal()} className="btn btn-right round round-top-left">Cancel</a>
                                    </div>
                                    {/*<div className="btn-box align-buttons-inside absolute left-conner">
                                        <a
                                            onClick={this.handleAdvancedState}
                                            className="btn btn-left round round-bottom-left round-top-right"
                                        >
                                            {this.state.advancedState ? "Basic" : "Advanced"}
                                        </a>
                                    </div>*/}
                                </div>
                            }
                        </form>
                    )}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SellAsset);
