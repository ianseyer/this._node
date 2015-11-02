'use strict';

var _ = require('lodash');
var Facebook = require('./facebook.model');
var Node = require('../node/node.model'),
  edgeBuilder = require('../node/node.controller').calculateEdge,
  http = require('http'),
  SCHEMA = require('./schema'),
  graph = require('fbgraph')

exports.auth = function(req, res){
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
      "client_id":     process.env.FB_ID,
      "redirect_uri":  "http://thisnode.herokuapp.com/api/facebooks/callback",
      "scope":         ['public_profile', 'user_friends', 'user_photos', 'email', 'user_events', 'user_hometown', 'user_photos', 'user_posts', 'user_likes', 'user_relationships']
    });

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
    } else {  //req.query.error == 'access_denied'
      res.send('access denied');
    }
    return;
  }


  // we'll send that and get the access token
  build(req, res);
}
exports.build = function(req, res){
  graph.authorize({
      "client_id":      process.env.FB_ID,
      "redirect_uri":   "http://thisnode.herokuapp.com/api/facebooks/callback",
      "client_secret":  process.env.FB_SECRET,
      "code":           req.query.code
  }, function (err, facebookRes) {
    var buildNode = new Promise(function(fulfill, reject){
      graph.get('me?fields=picture.type(large),name,birthday,bio,work,education', function(err, data){
        if(err){reject(err)}
        Node.findOne({id:data.id}, function(err, result){
          if(err){reject(err)}
          if(result == null){
            Node.create({id: data.id}, function(err, newNode){
              if(err){reject(err)}
              fulfill(newNode)
            })
          }
          else {
            fulfill(result)
          }
        })
      })
    })

    buildNode
    .then(function(node){
      var node = node;
      if(node != undefined){
        var loadUser = function(){
          graph.get('/me?limit=50&fields=picture,email,name,gender,age_range', ['picture'], function(err, results){
            if(err){console.log(err)}
            // console.log(results)
            node.profile = results
            node.save(function(err, result){
              if(err){console.log(err)}
            })
          })
        }
        var loadEvents = function(){
          graph.get('/me/events?limit=50', SCHEMA.SCHEMA['events'].fields, function(err, results){
            if(err){console.log(err)}
            for(var index in results){
              node.events.push(results[index])
              node.save(function(err){
                if(err){console.log(err)}
              })
            }
          })
        }
        var loadLikes = function(){
          graph.get('/me/likes', SCHEMA.SCHEMA['likes'].fields, function(err, results){
            if(err){console.log(err)}
            // console.log(results)
            for(var index in results){
              node.likes.push(results[index])
              node.save(function(err){
                if(err){console.log(err)}
              })
            }
          })
        }
        var loadFriends = function(){
          graph.get('/me/friends?limit=200', function(err, results){
            if(err){console.log(err)}
            // console.log(results)
            for(var index in results){
              node.likes.push(results[index])
              node.save(function(err){
                if(err){console.log(err)}
              })
            }
            edgeBuilder.friends(node)
          })
        }
        var loadPosts = function(){
          graph.get('/me/posts?limit=50&fields=id,message,message_tags,comments,likes,created_time', function(err, results){
            if(err){console.log(err)}
            for(var index in results){
              node.posts.push(results[index])
              node.save(function(err){
                if(err){console.log(err)}
              })
            }
            edgeBuilder.posts(node)
          })
        }
        var loadPhotos = function(){
          graph.get('/me/photos?limit=50&fields=id,album,likes,comments,tags,images', function(err, results){
            if(err){console.log(err)}
            for(var index in results){
              node.photos.push(results[index])
            }
            // console.log(node.photos)
            node.save(function(err){
              if(err){console.log(err)}
            })
            .then(function(node){
              edgeBuilder.photos(node);
            })
          })
        }
        loadUser()
        loadPhotos()
        loadPosts()
        loadEvents()
      }
      else {
        console.log("Something went wrong, node not found.")
      }
    })
    .catch(function(err){
      res.json(err)
    })
  })
}

function handleError(res, err) {
  return res.status(500).send(err);
}
