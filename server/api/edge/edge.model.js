'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var EdgeSchema = new Schema({
  to: String,
  from: String,
  type: String,
  meta: Object
});

module.exports = mongoose.model('Edge', EdgeSchema);
