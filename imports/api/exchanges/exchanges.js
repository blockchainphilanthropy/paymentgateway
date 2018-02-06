import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/factory';
import faker from 'faker';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import incompleteCountDenormalizer from './incompleteCountDenormalizer.js';
import { Exchanges } from '../exchanges/exchanges.js';

class ExchangesCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.createdAt = ourDoc.createdAt || new Date();
    const result = super.insert(ourDoc, callback);
    incompleteCountDenormalizer.afterInsertExchange(ourDoc);
    return result;
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);
    incompleteCountDenormalizer.afterUpdateExchange(selector, modifier);
    return result;
  }
  remove(selector) {
    const exchanges = this.find(selector).fetch();
    const result = super.remove(selector);
    incompleteCountDenormalizer.afterRemoveExchanges(exchanges);
    return result;
  }
}

export const Exchanges = new ExchangesCollection('Exchanges');

// Deny all client-side updates since we will be using methods to manage this collection
Exchanges.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Exchanges.schema = new SimpleSchema({
  exchangeId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  ccxtId: {
    type: String,
    max: 100,
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
  },
  timeout: {
    type: Number,
  },
  rateLimit: {
    type: Number,
  },
  userAgent: {
    type: String,
    max: 100,
  },
  verbose: {
    type: Boolean,
    defaultValue: false,
  },
  currencies: {
    type: [String],
    max: 10,
  },
  proxy: {
    type: String,
    max: 200,
  },
  apiKey: {
    type: String,
    max: 100,
  },
  secret: {
    type: String,
    max: 100,
  },
  password: {
    type: String,
    max: 100,
  },
  uid: {
    type: String,
    max: 100,
  },
});

Exchanges.attachSchema(Exchanges.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Exchanges.fields = {
  exchangeId: 1,
  userId: 1,
  ccxtId: 1,
  createdAt: 1,
  timeout: 1,
  rateLimit: 1,
  userAgent: 1,
  verbose: 1,
  currencies: 1,
  proxy: 1,
  apiKey: 1,
  secret: 1,
  password: 1,
  uid: 1,
};

// // TODO This factory has a name - do we have a code style for this?
// //   - usually I've used the singular, sometimes you have more than one though, like
// //   'todo', 'emptyTodo', 'checkedTodo'
// Factory.define('exchange', Exchanges, {
//   listId: () => Factory.get('list'),
//   text: () => faker.lorem.sentence(),
//   createdAt: () => new Date(),
// });

Exchange.helpers({
  exchange() {
    return Exchanges.findOne(this.exchangeId);
  },
});
