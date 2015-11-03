'use strict';

var _ = require('lodash');
var Node = require('./node.model');
var Edge = require('../edge/edge.model');
var request = require('request');
var fs = require('fs');
var calculateEdge = require('../edge/edge.builder').calculateEdge

//construct our edges
var createGhostNode = function(id){
  /*
  This checks to see if the node we are making an edge to or from exists in our system. If not, create a "ghost node", aka a node of a user that we know exists, but has not authenticated into our system
  */
  Node.find({id:id}, null, function(err, nodes){
    if(err){console.log(err)}
    if(!nodes){
      Node.create(id, function(err, node){
        if(err){console.log(err)}
        console.log("ghost node: "+node)
        return node;
      })
    }
    else {
      return null
    }
  })
}

// Get list of nodes
exports.index = function(req, res) {
  Node.find(null,{id:true, profile:true},function (err, nodes) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(nodes);
  });
};

// Get a single node
exports.show = function(req, res) {
  Node.find({id:req.params.id}, null, function (err, node) {
    if(err) { return handleError(res, err); }
    if(!node) { return res.status(404).send('Not Found'); }
    console.log(node.profile)
    return res.set('json spaces', 4).type('json').json(node);
  });
};

exports.showPhotos = function(req, res){
  Node.find({id:req.params.id}, {id:true, photos:true}, function(err, node){
    if(err) { return handleError(res, err);}
    if(!node) { return res.status(404).send('Not Found'); }
    console.log(node)
    return res.json(node)
  })
}

exports.showEvents = function(req, res){
  Node.find({id:req.params.id}, {id:true, events:true}, function(err, node){
    if(err) { return handleError(res, err);}
    if(!node) { return res.status(404).send('Not Found'); }
    console.log(node)
    return res.json(node)
  })
}

exports.showLikes = function(req, res){
  Node.find({id:req.params.id}, {id:true, likes:true}, function(err, node){
    if(err) { return handleError(res, err);}
    if(!node) { return res.status(404).send('Not Found'); }
    console.log(node)
    return res.json(node)
  })
}

exports.showPosts = function(req, res){
  Node.find({id:req.params.id}, {id:true, posts:true}, function(err, node){
    if(err) { return handleError(res, err);}
    if(!node) { return res.status(404).send('Not Found'); }
    console.log(node)
    return res.json(node)
  })
}

// Creates a new node in the DB.
exports.create = function(req, res) {
  /* TODO reload everyone's friends lists and recalculate edges
  */
  Node.create(req.body, function(err, node) {
    if(err) { return handleError(res, err); }
    calculateEdge.photos(node)
    calculateEdge.friends(node)
    calculateEdge.posts(node)
    eigen(node.id)
    return res.status(201).json(node);
  });
};

// Updates an existing node in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Node.findById(req.params.id, function (err, node) {
    if (err) { return handleError(res, err); }
    if(!node) { return res.status(404).send('Not Found'); }
    var updated = _.merge(node, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(node);
    });
  });
};

/*
Send a node's photos to our Eigenface parser.
*/
var eigen = function(id){
  Node.find({id:id})
  .then(function(node){
    console.log(node[0].photos)
    var options = {
      uri: 'http://192.168.1.101:55555/new_photos',
      method: 'POST',
      json: node[0].photos
    };
    request(options, function(err, response, body){
      if(err){console.log("ERROR "+err)}
      console.log(body)
    })
  })
}

/*
A route to allow us to trigger our eigen function
*/
exports.eigen = function(req, res){
  console.log(eigen(req.params.id))
}

// Deletes a node from the DB.
exports.destroy = function(req, res) {
  Node.findById(req.params.id, function (err, node) {
    if(err) { return handleError(res, err); }
    if(!node) { return res.status(404).send('Not Found'); }
    node.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
