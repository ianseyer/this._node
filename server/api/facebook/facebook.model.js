'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FacebookSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Facebook', FacebookSchema);