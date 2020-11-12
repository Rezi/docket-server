/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');
var Promise = require('bluebird');

module.exports = {
  attributes: {
    email: {
      type: 'email', // checks for a value that is an email address
      required: true, // checks for a value that is not undefined;
      unique: true // database constraint (more on that below)
    },
    password: {
      type: 'string',
      minLength: 6, // must have a minimum length of 6 chars
      required: true,
      protected: true,
      columnName: 'encryptedPassword'
    },
    checklists: {
      type: 'array',
      required: false
    }
    /*   toJSON: function() {
    var obj = this.toObject();
    delete obj.password;
  }, */
  },

  beforeCreate: function(values, cb) {
    bcrypt.hash(values.password, 10, function(err, hash) {
      if (err) return cb(err);
      values.password = hash;
      cb();
    });
  },
  comparePassword: function(password, user) {
    return new Promise(function(resolve, reject) {
      bcrypt.compare(password, user.password, function(err, match) {
        if (err) reject(err);

        if (match) {
          resolve(true);
        } else {
          reject(err);
        }
      });
    });
  }
};
