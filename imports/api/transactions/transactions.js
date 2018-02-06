import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/factory';
import faker from 'faker';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import incompleteCountDenormalizer from './incompleteCountDenormalizer.js';

class TransactionCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.createdAt = ourDoc.createdAt || new Date();
    const result = super.insert(ourDoc, callback);
    incompleteCountDenormalizer.afterInsertTransaction(ourDoc);
    return result;
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);
    incompleteCountDenormalizer.afterUpdateTransactions(selector, modifier);
    return result;
  }
  remove(selector) {
    const transactions = this.find(selector).fetch();
    const result = super.remove(selector);
    incompleteCountDenormalizer.afterRemoveTodos(transactions);
    return result;
  }
}

export const Transactions = new TransactionCollection('Transactions');

// Deny all client-side updates since we will be using methods to manage this collection
Transactions.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Transaction.schema = new SimpleSchema({
  transactionId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  storeId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  userNonce: {
    type: String,
    max: 100,
  },
  userCustomerId: {
    type: String,
    max: 100,
  },
  ccxtNonce: {
    type: String,
    max: 100,
  },
  requiredValue: {
    type: Number,
    decimal: true,
  },
  transferedValue: {
    type: Number,
    decimal: true,
  },
  wallet: {
    type: String,
    max: 100,
  },
  exchangesQueried: {
    type: [String],
    max: 100,
  },
  currencyPair: {
    type: String,
    max: 100,
  },
  currencyCalc: {
    type: String, //(average, max, min)
    max: 100,
  },
  currencyMarkupPCNT: {
    type: String,
    max: 100,
  },
  currencyMarkupFLAT: {
    type: String,
    max: 100,
  },
  quotedAt: {
    type: Date,
    denyUpdate: true,
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
  },
  deadline: {
    type: Date,
  },
  state: {
    type: String,
    max: 50,
    defaultValue: 'void', //(void, cancelled, expired, created, partial_unconfirmed, parital_confirmed, unconfirmed, confirmed, overpaid_confirmed)
  },
});

Transactions.attachSchema(Transactions.schema);

Transactions.helpers({
  transaction() {
    return Transactions.findOne(this.transactionId);
  },
});
