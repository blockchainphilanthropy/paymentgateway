import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/factory';
import faker from 'faker';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import incompleteCountDenormalizer from './incompleteCountDenormalizer.js';
import { Lists } from '../lists/lists.js';

class TodosCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.createdAt = ourDoc.createdAt || new Date();
    const result = super.insert(ourDoc, callback);
    incompleteCountDenormalizer.afterInsertTodo(ourDoc);
    return result;
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);
    incompleteCountDenormalizer.afterUpdateTodo(selector, modifier);
    return result;
  }
  remove(selector) {
    const todos = this.find(selector).fetch();
    const result = super.remove(selector);
    incompleteCountDenormalizer.afterRemoveTodos(todos);
    return result;
  }
}

export const Todos = new TodosCollection('Todos');

// Deny all client-side updates since we will be using methods to manage this collection
Todos.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Wallet.schema = new SimpleSchema({
  walletId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  address: {
    type: String,
    max: 100,
  },
  currency: {
    type: String,
    max: 10,
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
  },
});

Wallets.attachSchema(Wallets.schema);

// // TODO This factory has a name - do we have a code style for this?
// //   - usually I've used the singular, sometimes you have more than one though, like
// //   'todo', 'emptyTodo', 'checkedTodo'
// Factory.define('todo', Todos, {
//   listId: () => Factory.get('list'),
//   text: () => faker.lorem.sentence(),
//   createdAt: () => new Date(),
// });

Wallets.helpers({
  wallet() {
    return Wallets.findOne(this.walletId);
  },
});
