/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Exchanges } from '../exchanges/exchanges.js';

Meteor.publish('exchanges', function exchanges() {
  if (!this.userId) {
    return this.ready();
  }

  return Exchanges.find({
    userId: this.userId,
  }, {
    fields: Exchanges.fields,
  });
});