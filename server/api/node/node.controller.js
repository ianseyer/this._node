'use strict';

var _ = require('lodash');
var Node = require('./node.model');
var Edge = require('../edge/edge.model');
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

var dumpToEigen = function(photos){
  /*
  Upon a new node being created, send that node's photos over to our EigenFace parser for analysis
  */
  var EigenURL = "";


}
exports.calculateEdge = {
  //define how we traverse each node edge
  friends: function(node){
    //our friends edge travesal.
    //the simplest: simply fetch each id in the list and add it in.
    if(node.friends.data){
      for(child in node.friends.data){
        child = node[child]
        Edge.create({
          to: child.id,
          from: node.id,
          type: "friend",
          meta: []
        })
        .then()
        .catch(function(err){
          console.log(err)
        })
      }
    }
  },
  photos: function(node){
    //traverse photos
    //build their tags, comments, and likes edges
    for(var child_index = 0; child_index < node.photos[0].length; child_index++){
      var photo = node.photos[0][child_index]
      console.log(photo.tags)
      if(photo.tags && photo.tags.data){
        for(var tag_index = 0; tag_index < photo.tags.data.length; tag_index++){
          tag = photo.tags.data[tag_index]
          createGhostNode(tag.id)
          Edge.create({
            to: tag.id,
            from: node.id,
            type: "tag",
            meta: tag
          }, function(err, edge){
            if(err){console.log(err)}
            console.log(edge)
          })
        }
      }
      if(photo.comments.data){
        for(var comment_index = 0; comment_index < photo.comments.data.length; comment_index++){
          comment = photo.comments.data[comment_index]
          createGhostNode(comment.from.id)
          Edge.create({
            to: comment.from.id,
            from: node.id,
            type: "comment",
            meta: comment
          })
          .then()
          .catch(function(err){
            console.log(err);
          })
        }
      }
      if(photo.likes.data){
        for(var like_index = 0; like_index < photo.likes.data.length; like_index++){
          like = photo.likes.data[like_index]
          createGhostNode(like.id)
          Edge.create({
            to: like.id,
            from: node.id,
            type: "like",
            meta: like
          })
        }
      }
    }
  },
  posts: function(node){
    console.log(node.posts[0].length);
    //grab all our posts
    //grab their¡¡ comments, likes, and message_tags
    for( var i = 0; i < node.posts[0].length; i++) {
    // for(child in node.posts[0]){
      var post = node.posts[0][i];
      // console.log(child)
      if(post.comments && post.comments.data){
        for(var comment_index = 0; comment_index < post.comments.data.length; comment_index++){
          var comment = post.comments.data[comment_index]
          createGhostNode(comment.from.id)
          Edge.create({
            to: comment.from.id,
            from: node.id,
            type: "comment",
            meta: comment
          }, function(err, edge){
            if(err){console.log(err)}
          })
        }
      }
      if(post.likes && post.likes.data){
        for(var like_index = 0; like_index < post.likes.data.length; like_index++){
          var like = post.likes.data[like_index]
          createGhostNode(like.id)
          Edge.create({
            to: like.id,
            from: node.id,
            type: "like",
            meta: like
          }, function(err, edge){
            if(err){console.log(err)}
          })
        }
      }
      if(post.message_tags && post.message_tags.data){
        for(var message_tag_index = 0; message_tag_index < post.message_tags.data.length; message_tag_index++){
          var message_tag = post.message_tags.data[message_tag_index]
          createGhostNode(message_tag.id)
          Edge.create({
            to: message_tag.id,
            from: node.id,
            type: "message tag",
            meta: message_tag
          }, function(err, edge){
            if(err){console.log(err)};
          })
        }
      }
    }
  },
  likes: function(node){
  },
  comments: function(node){}
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
    return res.json(node);
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
    dumpToEigen(node.photos)
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
