### General TODOs:

[![Join the chat at https://gitter.im/blockchainphilanthropy/paymentgateway](https://badges.gitter.im/blockchainphilanthropy/paymentgateway.svg)](https://gitter.im/blockchainphilanthropy/paymentgateway?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
*   Concept of admin/support roles with access
*   Finish UI components
*   Update routes
*   Fixtures to start demo
*   test coverage

## UI:
### Landing page:
  Vendor sign up and pricing options  
  Pricing: free tier, per transaction, per month  
  Non-MVP service possibilities: 
*   marketing collateral - logos about accepting/prefering virtual currencies
*   cold wallet auto transfers from exchange??
*   cold wallet monitoring/transaction reporting
*   convert to common virtual currency (externally use changelly/shapeshift for now)
*   convert to fiat (needs partner exchange)
*   invoice generation
*   subscription escrow services
*   api to scanners for reporting
*   wallet/fund balancing and management
*   enhanced transaction api to report currency pricing time, etc. for donation tax management

### Vendor landing page:
*  Menu: 
  *  Store ids
    *  Store id list
    *  Add store id
  *  Transactions
    *  Manual entry
    *  Transaction list
*  Exchange list (add/edit exchange link)
*  Cold Wallet (list/add/edit)
*  Recent transactions table
*  Totals in wallets/currencies/transactions??
*  Documentation

### Manual/test transaction page:
*  Display generated nonce
*  Display user id
*  Form:
  *  dropdown store id
  *  customer id
  *  string for vendor internal transaction id
  *  currency of price
  *  price
  *  currency to convert
  *  dropdown exchange
*  Display cold wallets
*  Display converted price
*  Button for explicit save/new

### Display transaction page:
*  Display: 
  *  generated nonce
  *  user id/store id
  *  customer id
  *  currency of price
  *  price
  *  currency to convert
  *  converted price
  *  target wallet
  *  currency pair ratio
  *  exchanges queried
  *  exchange query timestamp
  *  transaction state (void, cancelled, expired, created, partial_unconfirmed, parital_confirmed, unconfirmed, confirmed, overpaid_confirmed)
  *  cancel button

### Display transaction list page:
*  Display user id
*  Form:
  *  Optional select store id
  *  Optional select wallet address
  *  Optional date range
  *  Optional pagination
*  Display table of transactions (sort on store id, wallet, times, value, etc.)
  *  nonce, transaction id(detail link), time initiated, time started, time verified, state cancel button
  *  export to csv button

### Add exchange login
*  Display table of exchange accounts
*  Form
  *  dropdown supported exchanges/wallets
  *  api key/login
  *  password
  *  2f??
  *  select which currencies to trade
  *  options to generate wallets per transaction
  *  **warn if exchange already has a login**
*  Test access

### List/Add cold wallet
*  **warn that we do not currently monitor transactions to cold wallets**
*  Table listing cold wallets by currency with edit link
*  Add Form:
  *  select currency
  *  wallet string
  *  preferred/round robin

### store id list
*  Display table of store ids, keys and add/edit link

### add/edit store id
*  Form: store name
*  Display key
*  Display password
*   Form:
  *  select currencies to accept
  *  select exchanges/wallets to transfer to
  *  select exchanges for pricing
  *  pricing by average, best, worst offer
  *  conversion fixed fee source currency
  *  conversion fixed fee target currency
  *  conversion percentage fee source currency
  *  conversion percentage fee target currency
  *  activate changelly/shapeshift/conversion offers for unselected currencies
  *  update cache (5 min fixed for now)

### Pricing test
*  Display table of currencies supported by known exchanges, count of exchanges per currency
*  Form:
  *  source price
  *  optional: select store id (fills out below defaults/limits)
  *  select source currency
  *  select target currency
  *  pricing by average, best, worst offer
  *  conversion fixed fee source currency
  *  conversion fixed fee target currency
  *  conversion percentage fee source currency
  *  conversion percentage fee target currency
*  Display target price
*  **similar to store id, but actively testable and no transaction**

### Checkout Landing Page
*  Display
  *  transaction id
  *  Source Price/Currency
  *  Target Price/Currency
  *  Wallet (and QR)
  *  Status
    
### OpenAPI/Swagger:
*  nonce generate (store key/pass)
*  price (store key/pass, price, source currency, target currency)
  *  value (target currency), update time
*  createTransaction (nonce, id, store key/pass, price, source currency, target currency)
  *  returns price, wallet, link to checkout landing page
*  reportTransaction (nonce, store key/pass)
  *  returns status, verification time, start time, initiated time, value (target currency)
*  reportTransactionById (id, store key/pass)
  *  returns status, verification time, start time, initiated time, value (target currency) 
      for first nonce with id

```yaml
swagger: "2.0"
info:
  description: this is a payment request to through Payment Gateway
  title: Swagger Payment Gateway
  version: "1.0.0"
  
host: api.sandbox.transactions.blockchainphilanthropy.foundation
basePath: /v1/payway
schemes: [ https ]

definitions:

  # Request body object
  Payment:
    type: object
    properties:
      intent:
        type: string
      payer:
        $ref: "#/definitions/Payer"
      transactions:
        type: array
        items:
          $ref: "#/definitions/Transaction"

  Payer:
    type: object
    properties:
      payment_method:
        type: string
        example: payment

  Transaction:
    type: object
    properties:
      ... # TODO

```
      
CLI:  
meteor cli  
  --exchanges file.yml