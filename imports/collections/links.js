import { Mongo } from 'meteor/mongo';
import validUrl from 'valid-url';
import { check, Match } from 'meteor/check';

Meteor.methods({
  'links.insert': function(url) {
    check(url, Match.Where(url => validUrl.isUri(url)));
    // create token
    const token = Math.random().toString(36).slice(-5);
    // save token to db with input url
    Links.insert({ url, token, clicks: 0 });
  }
});

export const Links = new Mongo.Collection('links');
