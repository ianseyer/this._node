'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NodeSchema = new Schema({
  email: String,
  name: String,
  meta: Object,

  //facebook data
  id: String,
  profile: Object,
  photos: Array,
  albums: Array,
  events: Array,
  groups: Array,
  posts: Array,
  status: Array,
  videos: Array,
  likes: Array,
  picture: Object
});

module.exports = mongoose.model('Node', NodeSchema);
