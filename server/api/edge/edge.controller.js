'use strict';

var _ = require('lodash');
var Edge = require('./edge.model');
var Node = require('../node/node.model')
var calculateEdge = require('../node/node.controller').calculateEdge;

// Get list of edges
exports.index = function(req, res) {
  Edge.find(function (edges, err) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(edges);
  });
};
// Get a single edge
exports.findTo = function(req, res) {
  Edge.find({to:req.params.id})
  .then(function (edge, err) {
    if(err) { res.json(err) }
    if(!edge) { return res.status(404).send('Not Found'); }
    return res.json(edge);
  });
};

exports.findToType = function(req, res) {
  Edge.find({to:req.params.id, type: req.params.type})
  .then(function(edges){
    return res.json(edges)
  })
}

// Creates a new edge in the DB.
exports.create = function(req, res) {
  Edge.findOne({to:req.body.to, from:req.body.to, type:req.body.type, meta:req.body.meta})
  .then(function(edge){
    if(!edge){
      Edge.create(req.body, function(err, edge) {
        if(err) { return handleError(res, err); }
        return res.status(201).json(edge);
      });
    }
  })
};

exports.build = function(req, res) {
  Node.find()
  .then(function(nodes){
    console.log(nodes)
    for(var index = 0; index<nodes.length; index++){
      var node = nodes[index]
      calculateEdge.photos(node)
      calculateEdge.friends(node)
      calculateEdge.posts(node)
    }
    return res.send('thanks')
  })
}

// Updates an existing edge in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Edge.findById(req.params.id, function (err, edge) {
    if (err) { return handleError(res, err); }
    if(!edge) { return res.status(404).send('Not Found'); }
    var updated = _.merge(edge, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(edge);
    });
  });
};

// Deletes a edge from the DB.
exports.destroy = function(req, res) {
  Edge.findById(req.params.id, function (err, edge) {
    if(err) { return handleError(res, err); }
    if(!edge) { return res.status(404).send('Not Found'); }
    edge.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
