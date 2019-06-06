import React, {Component} from 'react';
import classNames from 'classnames';
import {Link} from 'react-router-dom';
import {Form, Text} from 'react-form';
import {NotificationManager} from "react-notifications";
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from '../../../../modules/modals';

import IconndeButton from '../iconned-button';
import CurrentAccountIcon from '../current-account/current-account-icon';
import MobieMenu from '../mobile-menu/';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {getTransactionAction} from "../../../../actions/transactions";
import {getBlockAction} from "../../../../actions/blocks";
import {getAccountInfoAction} from "../../../../actions/account";


class UserBox extends Component {
    refSearchInput = React.createRef();
    state = {};

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.state.searching && this.refSearchInput && !this.refSearchInput.current.contains(event.target)) {
            this.setState({
                searching: false
            });
        }
    };

    setSearchStateToActive = (form) => {
        clearInterval(this.searchInterval);
        if (!this.state.searching) {
            this.setState({searching: true});
        } else {
            if (form.value) this.handleSearchind(form);
        }
    };

    handleSearchind = async (values) => {
        if (!this.state.isSearching) {
            this.setState({
                isSearching: true
            });

            const transaction = this.props.getTransactionAction({transaction: values.value});
            const block = this.props.getBlockAction({block: values.value});
            const account = this.props.getAccountInfoAction({account: values.value});

            Promise.all([transaction, block, account])
                .then((data) => {
                    const transaction = data[0];
                    const block = data[1];
                    const account = data[2];

                    const modals = ['INFO_TRANSACTION', 'INFO_BLOCK', 'INFO_ACCOUNT'];

                    const result = [transaction, block, account].find((el, index) => {
                        if (el) {
                            if (index < 2) {
                                this.props.setBodyModalParamsAction(modals[index], el);
                                return el
                            } else {
                                if (el.account) {
                                    this.props.setBodyModalParamsAction(modals[index], el.account);
                                    return el
                                }
                            }
                        }
                    });

                    if (!result) {
                        NotificationManager.error('Invalid search properties.', null, 5000);
                    }

                    this.setState({
                        isSearching: false
                    })

                });
        }
    };


    render() {
        const {setBodyModalType, setBodyModalParamsAction, menuShow, showMenu, closeMenu} = this.props;

        return (
            (
                <div className={classNames({
                    "user-search-box": true,
                    "searching": this.state.searching
                })}>
                    {/*TODO : fix site header search animation*/}
                    <Link className="logo" to={"/"}>
                        <img src="https://apollowallet.org/apollo-logo.svg"/>
                    </Link>
                    <div
                        className={`burger-mobile ${menuShow ? "menu-open" : ""}`}
                        onClick={showMenu}
                    >
                        <div className="line"/>
                    </div>
                    <div className={`mobile-nav ${menuShow ? "show" : ""}`}>
                        <MobieMenu closeMenu={closeMenu}/>
                    </div>
                    <div
                        className={classNames({
                            'search-bar': true,
                        })}
                    >
                        <Form
                            onSubmit={values => this.handleSearchind(values)}
                            render={({submitForm, getFormState}) => (
                                <form onSubmit={submitForm}>
                                    <div ref={this.refSearchInput}>
                                        <Text
                                            field={'value'}
                                            className={"searching-window"}
                                            type="text"
                                            placeholder="Enter Transaction/Account ID/Block ID"
                                        />
                                    </div>

                                    <div className="user-account-actions">
                                        <CopyToClipboard
                                            text={this.props.accountRS}
                                            onCopy={() => {
                                                NotificationManager.success('The account has been copied to clipboard.')
                                            }}
                                        >
                                            <a
                                                className="user-account-rs"
                                            >
                                                {this.props.accountRS}
                                            </a>
                                        </CopyToClipboard>

                                        <IconndeButton
                                            id={'open-send-apollo-modal-window'}
                                            icon={<i className="zmdi zmdi-balance-wallet"/>}
                                            action={() => setBodyModalParamsAction('SEND_APOLLO')}
                                        />

                                        <IconndeButton
                                            id={'open-settings-window'}
                                            icon={<i className="zmdi zmdi stop zmdi-settings"/>}
                                            action={() => setBodyModalType('SETTINGS_BODY_MODAL')}
                                        />

                                        <IconndeButton
                                            id={'open-about-apollo'}
                                            icon={<i className="zmdi zmdi-help"/>}
                                            action={() => setBodyModalParamsAction('GENERAL_INFO')}
                                        />
                                        {
                                            window.innerWidth > 768 &&
                                            <IconndeButton
                                                id={'open-search-transaction'}
                                                icon={<i className="zmdi zmdi-search"/>}
                                                action={() => this.setSearchStateToActive(getFormState().values)}
                                            />
                                        }

                                    </div>
                                </form>
                            )}
                        />

                    </div>
                    <div className="user-box"
                         onClick={(e) => setBodyModalType('ACCOUNT_BODY_MODAL', e)}
                    >
                        <CurrentAccountIcon/>
                    </div>
                </div>
            )
        )
    }
}

const mapStateToProps = state => ({
    accountRS: state.account.accountRS,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, values) => dispatch(setBodyModalParamsAction(type, values)),
    getTransactionAction: transaction => dispatch(getTransactionAction(transaction)),
    getBlockAction: (data) => dispatch(getBlockAction(data)),
    getAccountInfoAction: (account) => dispatch(getAccountInfoAction(account)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserBox)