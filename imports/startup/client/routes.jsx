import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import i18n from 'meteor/universe:i18n';

// route components
import AppContainer from '../../ui/containers/AppContainer.jsx';
import StorePageContainer from '../../ui/containers/StorePageContainer.jsx';
import ExchangePageContainer from '../../ui/containers/ExchangePageContainer.jsx';
import TransactionPageContainer from '../../ui/containers/TransactionPageContainer.jsx';
import PricePageContainer from '../../ui/containers/PricePageContainer.jsx';
import WalletPageContainer from '../../ui/containers/WalletPageContainer.jsx';
import CheckoutPageContainer from '../../ui/containers/CheckoutPageContainer.jsx';
import AuthPageSignIn from '../../ui/pages/AuthPageSignIn.jsx';
import AuthPageJoin from '../../ui/pages/AuthPageJoin.jsx';
import NotFoundPage from '../../ui/pages/NotFoundPage.jsx';

i18n.setLocale('en');

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <Route path="stores/:id" component={StorePageContainer} />
      <Route path="exchanges/:id" component={ExchangePageContainer} />
      <Route path="transactions/:id" component={TransactionPageContainer} />
      <Route path="checkouts/:id" component={CheckoutPageContainer} />
      <Route path="prices/:id" component={PricePageContainer} />
      <Route path="wallets/:id" component={WalletPageContainer} />
      <Route path="signin" component={AuthPageSignIn} />
      <Route path="join" component={AuthPageJoin} />
      <Route path="*" component={NotFoundPage} />
    </Route>
  </Router>
);
