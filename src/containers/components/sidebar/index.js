/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { NavLink, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Scrollbars} from 'react-custom-scrollbars';
import classNames from 'classnames'
import {setModalType} from '../../../modules/modals';
import * as routes from './routesMenu';
import ApolloLogo from '../../../assets/new_apl_icon_black.svg';
import './Sidebar.scss';

const mapStateToProps = state => ({
	modalType: state.modals.modalType,
    settings: state.accountSettings,
    notifications: state.account.notifications
});

const mapDispatchToProps = dispatch => ({
	setModalType: (modalType) => dispatch(setModalType(modalType))
});

class Sidebar extends React.Component {
	submenuRef = React.createRef();
	menuRef = React.createRef();
	state = {
		isHover: false,
		isMenuCollapsed: false,
		activeMenu: null,
	};

	componentDidMount() {
		document.addEventListener('touchstart', this.handleMenuTouchOut);
	}

	componentWillUnmount() {
		document.removeEventListener('touchstart', this.handleMenuTouchOut);
	}

	handleMenuMouseOver = () => {
		this.setState({
			isHover: true
		});
	};

	handleMenuMouseOut = (event) => {
		this.setState({
			isHover: false
		});
	};

	handleMenuTouchOut = (event) => {
		if (this.menuRef && this.menuRef.contains && !this.menuRef.contains(event.target) &&
			this.submenuRef && !this.submenuRef.contains(event.target)) {
			this.setState({
				isHover: false
			});
		}
	};

	handleMenuCollapse = () => {
		this.setState({
			...this.state,
			isMenuCollapsed: !this.state.isMenuCollapsed
		})
	};

	createNav = ({className, to, icon, label}) => {
		return <NavLink
			exact={true}
			className={`text ${this.getNavLinkClass(className)}`}
			activeClassName="active"
			to={to}>{label}<i className={`zmdi ${icon} left`}/>
		</NavLink>
	};

	createItemMenu = ({to, className, icon, label}) => {
		return this.state.activeMenu === to
		? (this.createNav({to, className, icon, label}))
		: (<div onClick={() => this.hanldeActive(to)} className={`text ${this.getNavLinkClass(className)}`}>
			{label}<i className={`zmdi ${icon} left`}/>
		</div>)
	}

	createAdditionalNav = ({id, modalType, label}) => {
		return <li className={`text`}>
			<a id={id} onClick={this.props.setModalType.bind(this, modalType)}>{label}</a>
			<i className="zmdi zmdi-case left"/>
		</li>
	};

	createMenu = menu => {
		let allRoutes = menu.className instanceof Array ? menu.className : [menu.className];
		allRoutes = allRoutes.concat(menu.children.map(opt => opt.to));
		return <li className={`active-menu ${this.getNavLinkClass(allRoutes)}`}>
			{this.createItemMenu(menu)}
			<>
				{menu.children.map(opt => this.createNav(opt))}
				{menu.additionalChildren && this.createAdditionalNav(menu.additionalChildren)}
			</>
		</li>
	};

	hanldeActive = (activeMenu) => {this.setState({activeMenu})};
	
	getNavLinkClass = (path) => {
		const routes = path instanceof Array ? path : [path];
		if(routes.some(i => window.location.pathname === i)) return 'active';
		else if(routes.some(i => this.state.activeMenu === i)) return 'open';
		return ''
	};

	render() {
		return (
			<Scrollbars
				renderView={props => <div {...props} className="track-content-view"/>}
				renderTrackHorizontal={props => <div {...props} className="track-horizontal"/>}
				renderTrackVertical={props => <div {...props} className="track-vertical"/>}
				className={classNames({
					"menu-bar": true,
					"collapsed": this.state.isMenuCollapsed,
					"hover": this.state.isHover
				})}
			>
				<div
					className="menu-bar-container"
					id={'sidebar-menu'}
				>
					<div>
						<Link
							onMouseOver={this.handleMenuMouseOver}
							onMouseOut={this.handleMenuMouseOut}
							className="site-logo"
							to="/"
						>
							<img src={ApolloLogo} atl='' />
						</Link>
						<nav
							className={"header-nav"}
							onMouseOver={this.handleMenuMouseOver}
							onMouseOut={this.handleMenuMouseOut}
						>
							<ul>
								{Object.keys(routes).map(rout => this.createMenu(routes[rout]))}
							</ul>
						</nav>
						<a
							className={classNames({
								"collapse-button": true,
								"active": this.state.isMenuCollapsed
							})}
							onClick={this.handleMenuCollapse}
						>
							<i className="zmdi zmdi-chevron-right left"/>
						</a>
					</div>
				</div>
			</Scrollbars>
		);
	}
}

export default connect(mapStateToProps,	mapDispatchToProps)(Sidebar);
