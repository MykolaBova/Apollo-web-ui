import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import InfoBox from '../../components/info-box'
import {Form, Text} from 'react-form';

import AccountRS from '../../components/account-rs';
import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";

class BuyAsset extends React.Component {
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

        console.log(values);

        this.props.submitForm(null, null, values, 'transferAsset')
            .done((res) => {
                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, 'Error', 5000)
                } else {
                    this.props.setBodyModalParamsAction(null, {});
                    NotificationManager.success('Transfer asset request has been submitted!', null, 5000);
                }
            })
    };

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
        console.log(this.props.modalData);
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({ submitForm, values, addValue, removeValue, setValue }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            {
                                this.props.modalData &&
                                <div className="form-group">
                                    <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                    <div className="form-title">
                                        <p>Buy Asset</p>
                                    </div>
                                    <div className="input-group display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Asset</label>
                                            </div>
                                            <div className="col-md-9">
                                                <Text defaultValue={this.props.modalData.assetName} type="hidden" field={'name'}/>
                                                <Text defaultValue={this.props.modalData.assetID} type="hidden" field={'asset'}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Recipient</label>
                                            </div>
                                            <div className="col-md-9">
                                                <AccountRS
                                                    field={'recipient'}
                                                    setValue={setValue}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Quantity</label>
                                            </div>
                                            <div className="col-md-9">
                                                <Text placeholder={'Quantity'} type="text" field={'quantityATU'}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Fee</label>
                                            </div>
                                            <div className="col-md-9">
                                                <Text placeholder={'Amount'} type="text" field={'feeATM'}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Secret Phrase</label>
                                            </div>
                                            <div className="col-md-9">
                                                <Text placeholder={'Secret Phrase'} type="password" field={'secretPhrase'}/>
                                            </div>
                                        </div>
                                    </div>

                                    <AdvancedSettings advancedState={this.state.advancedState}/>

                                    <div className="btn-box align-buttons-inside absolute right-conner">
                                        <button
                                            type="submit"
                                            name={'closeModal'}
                                            className="btn btn-right blue round round-bottom-right"
                                        >
                                            Buy
                                        </button>
                                        <a onClick={() => this.props.closeModal()} className="btn btn-right round round-top-left">Cancel</a>
                                    </div>
                                    <div className="btn-box align-buttons-inside absolute left-conner">
                                        <a
                                            onClick={this.handleAdvancedState}
                                            className="btn btn-left round round-bottom-left round-top-right"
                                        >
                                            Advanced
                                        </a>
                                    </div>
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
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BuyAsset);