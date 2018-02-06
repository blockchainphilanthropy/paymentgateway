import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'; // XXX: SESSION
import { Exchanges } from '../../api/exchanges/exchanges.js';
import { Stores } from '../../api/stores/stores.js';
import { Wallets } from '../../api/wallets/wallets.js';
import { Transactions } from '../../api/transactions/transactions.js';
import { Prices } from '../../api/prices/prices.js';
import UserMenu from '../components/UserMenu.jsx';
import ListExchange from '../components/ListExchange.jsx';
import ListStore from '../components/ListStore.jsx';
import ListWallet from '../components/ListWallet.jsx';
import ListTransaction from '../components/ListTransaction.jsx';
import LanguageToggle from '../components/LanguageToggle.jsx';
import ConnectionNotification from '../components/ConnectionNotification.jsx';
import Loading from '../components/Loading.jsx';

const CONNECTION_ISSUE_TIMEOUT = 5000;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      showConnectionIssue: false,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({ showConnectionIssue: true });
    }, CONNECTION_ISSUE_TIMEOUT);
  }

  componentWillReceiveProps({ loading, children }) {
    // redirect / to a exchange once exchanges are ready
    if (!loading && !children) {
      const exchange = Exchanges.findOne();
      this.context.router.replace(`/exchanges/${exchange._id}`);
    }
  }

  toggleMenu(menuOpen = !Session.get('menuOpen')) {
    Session.set({ menuOpen });
  }

  logout() {
    Meteor.logout();

    this.context.router.push(`join`);

  }

  render() {
    const { showConnectionIssue } = this.state;
    const {
      user,
      connected,
      loading,
      exchanges,
      stores,
      wallets,
      transactions,
      menuOpen,
      children,
      location,
    } = this.props;

    // eslint-disable-next-line react/jsx-no-bind
    const closeMenu = this.toggleMenu.bind(this, false);

    // clone route components with keys so that they can
    // have transitions
    const clonedChildren = children && React.cloneElement(children, {
      key: location.pathname,
    });

    return (
      <div id="container" className={menuOpen ? 'menu-open' : ''}>
        <section id="menu">
          <LanguageToggle />
          <UserMenu user={user} logout={this.logout} />
          <ListExchange exchanges={exchanges} />
          <ListStore stores={stores} />
          <ListWallet wallets={wallets} />
          <ListTransaction transactions={transactions} />
        </section>
        {showConnectionIssue && !connected
          ? <ConnectionNotification />
          : null}
        <div className="content-overlay" onClick={closeMenu} />
        <div id="content-container">
          <ReactCSSTransitionGroup
            transitionName="fade"
            transitionEnterTimeout={200}
            transitionLeaveTimeout={200}
          >
            {loading
              ? <Loading key="loading" />
              : clonedChildren}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  user: React.PropTypes.object,      // current meteor user
  connected: React.PropTypes.bool,   // server connection status
  loading: React.PropTypes.bool,     // subscription status
  menuOpen: React.PropTypes.bool,    // is side menu open?
  exchanges: React.PropTypes.array,      // all exchanges of the current user
  stores: React.PropTypes.array,      // all stores of the current user
  prices: React.PropTypes.array,      // all prices visible to the current user
  wallets: React.PropTypes.array,      // all wallets of the current user
  children: React.PropTypes.element, // matched child route component
  location: React.PropTypes.object,  // current router location
  params: React.PropTypes.object,    // parameters of the current route
};

App.contextTypes = {
  router: React.PropTypes.object,
};
