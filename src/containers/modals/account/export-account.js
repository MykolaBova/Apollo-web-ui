/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {generateAccountAction} from '../../../actions/account'

import AdvancedSettings from '../../components/advanced-transaction-settings'
import InfoBox from '../../components/info-box'
import {Form, Text, TextArea, Number, Checkbox} from 'react-form';
import crypto from '../../../helpers/crypto/crypto';
import {setBodyModalParamsAction} from "../../../modules/modals";
import {setAlert} from "../../../modules/modals";
import submitForm from "../../../helpers/forms/forms";
import {getAccountDataAction} from "../../../actions/login";
import ModalFooter from '../../components/modal-footer'
import {exportAccountAction} from '../../../actions/account'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import jsPDF from "jspdf";
import QRCode from "qrcode";

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.accountRS,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    setAlert: (type, message) => dispatch(setAlert(type, message)),
    validatePassphrase: (passPhrase) => dispatch(crypto.validatePassphrase(passPhrase)),
    getAccountIdAsyncApl: (passPhrase) => dispatch(crypto.getAccountIdAsyncApl(passPhrase)),
    getAccountDataAction: (reqParams) => dispatch(getAccountDataAction(reqParams)),
});

class ExportAccount extends React.Component {
    constructor(props) {
        super(props);
    };

    state  ={
        tinggi:11.69,
        lebar:'08.27',
    };

    handleFormSubmit = async (values) => {
        const accountKeySeedData = await exportAccountAction(values);

        if (accountKeySeedData) {

            if (!accountKeySeedData.errorCode) {
                // const a = document.createElement('a');
                // a.href = window.URL.createObjectURL(new Blob(accountKeySeedData, {type: 'text/html'}));
                // a.target='_blank';
                // a.download = values.account;
                // a.click();

                this.setState({
                    accountKeySeedData
                })

            } else {
                NotificationManager.error(accountKeySeedData.errorDescription, 'Error', 5000);
            }
        }
    };

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
    };

    generatePDF = (credentials) => {
        // e.preventDefault();

        let doc = new jsPDF({
            // orientation: 'landscape',
            unit: 'in',
            // format: [4, 2]  // tinggi, lebar
            format: [this.state.tinggi, this.state.lebar]
        });

        // TODO: migrate to QR code


        var qrcode;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();


        doc.setFontSize(15);
        doc.text('The apollo wallet`s secret key', 0.5, 0.5);
        doc.setFontSize(10);

        doc.text(`${yyyy}/${mm}/${dd}`, 0.5, 0.8 + (0.3))
        doc.text(`${credentials[0].name}:`, 0.5, 0.8 + (0.3 * 2))
        doc.text(`${credentials[0].value}`, 0.5, 0.8 + (0.3 * 3))

        QRCode.toDataURL(credentials[0].value, function (err, url) {
            doc.addImage( url, 'SVG', 0.5, 1.9, 1.9, 1.9)
        })

        doc.text(`${credentials[1].name}:`, 0.5, 0.8 + (0.3 * 11))
        doc.text(`${credentials[1].value}`, 0.5, 0.8 + (0.3 * 12))

        QRCode.toDataURL(credentials[1].value, function (err, url) {
            doc.addImage( url, 'SVG', 0.5, 4.8, 1.9, 1.9)
        })

        doc.save(`apollo-wallet-secret-key-${credentials[0].value}`)
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({setValue, submitForm, values, addValue, removeValue, getFormState}) => (
                        <form className="modal-form" onSubmit={submitForm}>

                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></a>

                                <div className="form-title">
                                    <p>Export Account</p>
                                </div>
                                <InfoBox info>
                                    Please enter your account credentials.
                                </InfoBox>


                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Account ID
                                    </label>
                                    <div className="col-sm-9">
                                        <Text
                                            className="form-control"
                                            placeholder="Account ID"
                                            field="account"
                                        />
                                    </div>
                                </div>

                                <ModalFooter
                                    setValue={setValue}
                                    getFormState={getFormState}
                                    values={values}
                                />

                                {

                                    this.state && this.state.accountKeySeedData &&
                                    <React.Fragment>
                                        <CopyToClipboard
                                            text={this.state.accountKeySeedData.secretBytes}
                                            onCopy={() => {
                                                NotificationManager.success('The Secret key has been copied to clipboard.')
                                            }}
                                        >
                                            <InfoBox attentionLeft>
                                                Secret Key:  <span className={'itatic'}>{this.state.accountKeySeedData.secretBytes}</span>
                                                <br/>
                                                <br/>
                                                Account ID: <span className={'itatic'}>{this.props.account}</span>
                                                <br/>
                                                <br/>
                                                <a
                                                    className="btn blue static"
                                                    onClick={() => this.generatePDF([
                                                        {
                                                            value: this.props.account,
                                                            name: 'Account ID'
                                                        },
                                                        {
                                                            value: this.state.accountKeySeedData.secretBytes,
                                                            name: 'Secret Key'
                                                        }
                                                    ])}
                                                >
                                                    Print Secret Key
                                                </a>
                                            </InfoBox>
                                        </CopyToClipboard>
                                        <InfoBox info nowrap>
                                            You can delete your account data from this web node completely.
                                            If you delete this account data you will need to import this secret key to login again.
                                            <br/>
                                            Do you wish to delete it?
                                            <br/>
                                            <a
                                                style={{marginTop: 18, marginRight: 18}}
                                                onClick={() => this.props.setBodyModalParamsAction('DELETE_ACCOUNT_FROM_NODE', [
                                                    {
                                                        value: this.props.account,
                                                        name: 'Account ID'
                                                    },
                                                    {
                                                        value: this.state.accountKeySeedData.secretBytes,
                                                        name: 'Secret Key'
                                                    }
                                                ])}
                                                className={'btn danger static'}
                                            >
                                                Yes
                                            </a>
                                            <a
                                                style={{marginTop: 18}}
                                                onClick={() => this.props.closeModal()}
                                                className={'btn success static'}
                                            >
                                                No
                                            </a>

                                        </InfoBox>
                                    </React.Fragment>


                                }

                                <div className="btn-box align-buttons-inside absolute right-conner">
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                    >
                                        Export
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportAccount);
