/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData, setBodyModalParamsAction, setAlert} from '../../../modules/modals';
import {sendTransactionAction} from '../../../actions/transactions';
import {calculateFeeAction} from "../../../actions/forms";
import crypto from  '../../../helpers/crypto/crypto';

import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";

import ModalBody             from '../../components/modals/modal-body';

import NumericInputComponent from '../../components/form-components/textual-input';
import AccountRSInput        from '../../components/form-components/account-rs';


class LeaseBalance extends React.Component {
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

    handleFormSubmit = async (values) => {
        this.props.processForm(values, 'leaseBalance', 'Product has been listed!', () => {
			this.props.setBodyModalParamsAction(null, {});
			NotificationManager.success('Lease has been submitted!', null, 5000);
		});
    }

    render() {
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Lease Your Balance'}
                isAdvanced={true}
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Lease Balance'}
				idGroup={'lease-balance-modal-'}
            >
                <AccountRSInput
                    label={'Recipient'}
                    field={'recipient'}
                    placeholder={'Recipient'}
                    defaultValue={(this.props.modalData && this.props.modalData.recipient) ? this.props.modalData.recipient : ''}                    
                />
                <NumericInputComponent
                    label={'Period'}
                    field={'period'}
                    placeholder={'Period'}
                />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.account,
    publicKey: state.account.publicKey
});

const mapDispatchToProps = dispatch => ({
    setAlert: (status, message) => dispatch(setAlert(status, message)),
    setModalData: (data) => dispatch(setModalData(data)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    sendTransaction: (requestParams) => dispatch(sendTransactionAction(requestParams)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    sendLeaseBalance: (requestParams) => dispatch(crypto.sendLeaseBalance(requestParams)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    calculateFeeAction: (requestParams) => dispatch(calculateFeeAction(requestParams))
});

export default connect(mapStateToProps, mapDispatchToProps)(LeaseBalance);
