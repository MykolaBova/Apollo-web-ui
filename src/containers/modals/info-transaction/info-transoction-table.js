import React, {Component} from "react";
import {formatTransactionType} from "../../../actions/transactions";
import {connect} from "react-redux";
import {readMessageAction} from '../../../actions/messager/'
import crypto from  '../../../helpers/crypto/crypto';
import {setBodyModalParamsAction} from '../../../modules/modals';
import {Form, Text} from 'react-form';
import {NotificationManager} from 'react-notifications';
import {setAccountPassphrase} from '../../../modules/account';

import CurrencyIssuance from "./table-content/currency-issuance";
import BuyCurrency from "./table-content/exchange-buy";
import SellCurrency from "./table-content/exchange-sell";
import CurrencyTransfer from "./table-content/currency-transfer";
import CurrencyExchangeOffer from "./table-content/publish-exchange-offer";
import ShufflingCreation from "./table-content/shuffling-creation";
import ShufflingRegistarion from "./table-content/shuffling-registration";
import ShufflingVerification from "./table-content/shuffling-verification";
import ShufflingProcessing from "./table-content/shuffling-processing";
import OrdinaryPayment from "./table-content/ordinary-payment";
import PrivatePayment from "./table-content/private-payment";
import TargetDataUpload from "./table-content/target-data-upload";
import AccountProperty from "./table-content/account-property";
import AccountPropertyDelete from "./table-content/account-property-delete";
import AliasDelete from "./table-content/alias-delete";
import VoteCasting from "./table-content/vote-casting";
import ArbitraryMessage from "./table-content/arbitrary-message";
import EffectiveBalanceLeasing from "./table-content/effective-balance-leasing";
import AliasAssignment from "./table-content/alias-assignment";
import AccountInfo from "./table-content/account-info";
import PollCreation from "./table-content/poll-creation";
import AliasSell from "./table-content/alias-sell";
import PhasingVoteCasting from "./table-content/phasing-vote-casting";
import ShufflingRecipients from "./table-content/shuffling-recipients";
import DigitalGoodsDelisting from "./table-content/digital-goods-delisting";
import DigitalGoodsPurchase from "./table-content/digital-goods-purchase";
import DigitalGoodsPriceChange from "./table-content/digital-goods-price-change";
import DigitalGoodsListing from "./table-content/digital-goods-listing";
import DigitalGoodsQuantityChange from "./table-content/digital-goods-quantity-change";
import AssetDelete from "./table-content/asset-delete";
import AssetTransfer from "./table-content/asset-transfer";
import AssetIssuance from "./table-content/asset-issuance";
import AskOrderPlacement from "./table-content/ask-order-placement";
import BigOrderPlacement from "./table-content/big-order-placement";

import CriticalUpdate from "./table-content/critical-update";


class InfoTransactionTable extends Component {

	componentDidMount = async () => {
		const {secretPhrase, transaction} = this.props;
		const isPassphrase = await this.validatePassphrase(secretPhrase);

		this.readMessage({
			transaction:  transaction.transaction,
			passphrase:  !isPassphrase ? secretPhrase : null,
			secretPhrase: isPassphrase  ? secretPhrase : null
		});
	}

	state = {};

	validatePassphrase = async (secretPhrase) => {
		return await this.props.validatePassphrase(secretPhrase);
	}

	readMessage = async (requestParams) => {
		const message = await this.props.readMessageAction(requestParams)

		if (message && message.decryptedMessage && !message.errorCode) {
			this.setState({
				message: message
			})
		} 
	}

	showPrivateTransactions = async ({secretPhrase}) => {
		const {transaction, account} = this.props;

        const isPassPhrease = await this.props.validatePassphrase(secretPhrase);

		const message = await this.props.readMessageAction({
			transaction:  transaction.transaction,
			passphrase:  !isPassPhrease ? secretPhrase : null,
			secretPhrase: isPassPhrease ? secretPhrase : null,
			account
		});

		if (message) {

			if (message.decryptedMessage) {
				this.props.setAccountPassphrase(secretPhrase)
	
				this.setState({
					message
				})
			} else {
				NotificationManager.error('Incorrect Secret Phrase.', 'Error', 5000)
			}
		}
    };

	decryptMessageComponent = () => 
		<div className="modal-form transparent">
			<div className="transparent">
				<div className="input-group-app">
					<div className="row">
						<div className="col-md-9">
							<div className="input-group-app search tabled">
								<Form
									onSubmit={(values) => this.showPrivateTransactions(values)}
									render={({
												submitForm, values, addValue, removeValue, setValue, getFormState
											}) => (
										<form
											style={{
												height: 33,
												"word-break": "normal"
											}}
											className="iconned-input-field"
											onSubmit={submitForm}
										>
											<Text field="secretPhrase" placeholder="Secret phrase" type="password"/>

											<button
												className="input-icon text btn blue static"
											>
												Submit
											</button>
										</form>
									)}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

	render() {
		const modalTypeName = formatTransactionType(this.props.constants.transactionTypes[this.props.transaction.type].subtypes[this.props.transaction.subtype].name);
		const {secretPhrase, transaction: {attachment: {message, encryptedMessage}}, passPhrase} = this.props; 

		return (
			<div className="transaction-table-body transparent wrap-collumns">
				{
					this.props.transaction && this.props.constants.transactionTypes &&
					<table>
						<tbody>
						<tr>
							<td>Type:</td>
							<td>{formatTransactionType(this.props.constants.transactionTypes[this.props.transaction.type].subtypes[this.props.transaction.subtype].name)}</td>
						</tr>

						{modalTypeName === "CURRENCY ISSUANCE" && <CurrencyIssuance transaction={this.props.transaction}/>}

						{modalTypeName === "EXCHANGE BUY" && <BuyCurrency transaction={this.props.transaction}/>}

						{modalTypeName === "EXCHANGE SELL" && <SellCurrency transaction={this.props.transaction}/>}

						{modalTypeName === "CURRENCY TRANSFER" && <CurrencyTransfer transaction={this.props.transaction}/>}

						{modalTypeName === "PUBLISH EXCHANGE OFFER" && <CurrencyExchangeOffer transaction={this.props.transaction}/>}

						{modalTypeName === "SHUFFLING CREATION" && <ShufflingCreation transaction={this.props.transaction}/>}

						{modalTypeName === "SHUFFLING REGISTRATION" && <ShufflingRegistarion transaction={this.props.transaction}/>}

						{modalTypeName === "SHUFFLING VERIFICATION" && <ShufflingVerification transaction={this.props.transaction}/>}

						{modalTypeName === "SHUFFLING PROCESSING" && <ShufflingProcessing transaction={this.props.transaction}/>}

						{modalTypeName === "SHUFFLING RECIPIENTS" && <ShufflingRecipients transaction={this.props.transaction}/>}

						{modalTypeName === "ORDINARY PAYMENT" && <OrdinaryPayment transaction={this.props.transaction}/>}

						{modalTypeName === "PRIVATE PAYMENT" && <PrivatePayment transaction={this.props.transaction}/>}

						{modalTypeName === "TAGGED DATA UPLOAD" && <TargetDataUpload transaction={this.props.transaction}/>}

						{modalTypeName === "ACCOUNT PROPERTY" && <AccountProperty transaction={this.props.transaction}/>}

						{modalTypeName === "ACCOUNT PROPERTY DELETE" && <AccountPropertyDelete transaction={this.props.transaction}/>}

						{modalTypeName === "ALIAS DELETE" && <AliasDelete transaction={this.props.transaction}/>}

						{modalTypeName === "VOTE CASTING" && <VoteCasting transaction={this.props.transaction}/>}

						{modalTypeName === "ARBITRARY MESSAGE" && <ArbitraryMessage transaction={this.props.transaction}/>}

						{modalTypeName === "EFFECTIVE BALANCE LEASING" && <EffectiveBalanceLeasing transaction={this.props.transaction}/>}

						{modalTypeName === "ALIAS ASSIGNMENT" && <AliasAssignment transaction={this.props.transaction}/>}

						{modalTypeName === "ACCOUNT INFO" && <AccountInfo transaction={this.props.transaction}/>}

						{modalTypeName === "POLL CREATION" && <PollCreation transaction={this.props.transaction}/>}

						{modalTypeName === "ALIAS SELL" && <AliasSell transaction={this.props.transaction}/>}

						{modalTypeName === "PHASING VOTE CASTING" && <PhasingVoteCasting transaction={this.props.transaction}/>}

						{modalTypeName === "DIGITAL GOODS DELISTING" && <DigitalGoodsDelisting transaction={this.props.transaction}/>}

						{modalTypeName === "DIGITAL GOODS PURCHASE" && <DigitalGoodsPurchase transaction={this.props.transaction}/>}

						{modalTypeName === "DIGITAL GOODS PRICE CHANGE" && <DigitalGoodsPriceChange transaction={this.props.transaction}/>}

						{modalTypeName === "DIGITAL GOODS LISTING" && <DigitalGoodsListing transaction={this.props.transaction}/>}

						{modalTypeName === "DIGITAL GOODS QUANTITY CHANGE" && <DigitalGoodsQuantityChange transaction={this.props.transaction}/>}

						{modalTypeName === "ASSET DELETE" && <AssetDelete transaction={this.props.transaction}/>}

						{modalTypeName === "ASSET TRANSFER" && <AssetTransfer transaction={this.props.transaction}/>}

						{modalTypeName === "ASSET ISSUANCE" && <AssetIssuance transaction={this.props.transaction}/>}

						{modalTypeName === "BID ORDER PLACEMENT" && <BigOrderPlacement transaction={this.props.transaction}/>}

						{modalTypeName === "ASK ORDER PLACEMENT" && <AskOrderPlacement transaction={this.props.transaction}/>}


						{modalTypeName === "CRITICAL UPDATE" && <CriticalUpdate transaction={this.props.transaction}/>}

						{modalTypeName === "IMPORTANT UPDATE" && <CriticalUpdate transaction={this.props.transaction}/>}

						{modalTypeName === "MINOR UPDATE" && <CriticalUpdate transaction={this.props.transaction}/>}

						{
							message && 
							message !== 'undefined' && 
							<tr>
								<td>Public Message:</td>
								<td>{message}</td>
							</tr>
						} 
						{
							encryptedMessage && 
							this.state.message && 
							<tr>
								<td>Decrypted Messgae:</td>
								<td>{this.state.message.decryptedMessage}</td>
							</tr>
						}
						{
							encryptedMessage && 
							!this.state.message && 
							<tr>
								<td>Encrypted Message:</td>
								<td>
									{this.decryptMessageComponent()}
								</td>
							</tr>
						}

						</tbody>
					</table>
				}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	secretPhrase: state.account.passPhrase,
	account: state.account.account,
});

const mapDispatchToProps = dispatch => ({
	readMessageAction : (requestParams) => dispatch(readMessageAction(requestParams)),
	validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
	setAccountPassphrase: (passphrase) => dispatch(setAccountPassphrase(passphrase)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),	
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoTransactionTable);
