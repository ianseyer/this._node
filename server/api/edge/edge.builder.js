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
