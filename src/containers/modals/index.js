import React from 'react';
import {connect} from 'react-redux';
import {setMopalType} from '../../modules/modals';
import classNames from 'classnames';

// Modals
import PrivateTransactions from "./private-transaction";
import SendApollo from "./send-apollo";
import SendApolloPrivate from "./send-apollo-private";
import Issue from "./issue"
import InfoTransaction from './info-transaction/info-transaction';
import InfoLedgerTransaction from './info-ledger-transaction';
import InfoBlock from './info-block';


// Account
import InfoAccount from './account/account';


// Aliases
import EditAlias     from './aliases/edit-alias';
import SellAlias     from './aliases/sell-alias';
import TransferAlias from './aliases/transfer-alias';
import DeleteAlias   from './aliases/delete-alias';




class ModalWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }

        this.handleModal = this.handleModal.bind(this);
    }

    handleModal(e) {
        const modalWindow = document.querySelector('.modal-window');

        if (Object.values(modalWindow.classList).indexOf('active') !== -1) {

            if (!e.target.closest('.modal-window .modal-box')) {
                modalWindow.classList.remove('active');
                setTimeout(() => {
                    this.props.setMopalType(null);

                }, 300);
            }

        } else {
            modalWindow.classList.add('active');
        }
    }

    render() {
        return (
            <div
                onClick={(e) => this.handleModal(e)}
                className={classNames({
                    "modal-window" : true,
                    "active": this.props.modalType
                })}
            >
                {this.props.modalType === 'INFO_TRANSACTION'        && <InfoTransaction       />}
                {this.props.modalType === 'INFO_LEDGER_TRANSACTION' && <InfoLedgerTransaction />}
                {this.props.modalType === 'INFO_BLOCK'              && <InfoBlock             />}
                {this.props.modalType === 'PrivateTransactions'     && <PrivateTransactions   />}
                {this.props.modalType === 'SEND_APOLLO'             && <SendApollo            />}
                {this.props.modalType === 'SEND_APOLLO_PRIVATE'     && <SendApolloPrivate     />}
                {this.props.modalType === 'ISSUE'                   && <Issue                 />}


                {/*Account*/}
                {this.props.modalType === 'INFO_ACCOUNT'            && <InfoAccount           />}


                {/*aliases */}
                {this.props.modalType === 'EDIT_ALIAS'              && <EditAlias             />}
                {this.props.modalType === 'SELL_ALIAS'              && <SellAlias             />}
                {this.props.modalType === 'TRANSFER_ALIAS'          && <TransferAlias         />}
                {this.props.modalType === 'DELETE_ALIAS'            && <DeleteAlias           />}


            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalType: state.modals.modalType
});

const mapDispatchToProps = dispatch => ({
    setMopalType : (modalType) => dispatch(setMopalType(modalType))
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalWindow)