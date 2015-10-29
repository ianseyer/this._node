/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Facebook = require('./facebook.model');

exports.register = function(socket) {
  Facebook.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Facebook.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('facebook:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('facebook:remove', doc);
}