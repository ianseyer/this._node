module.exports = {
  'SCHEMA': {
      photos: {
      fields:['id','album','link','likes','comments'],
      edges:[]
    },
       albums: {
      fields:['id', 'can_upload', 'count', 'cover_photo', 'created_time', 'description', 'event', 'from', 'link', 'location', 'name', 'place', 'privacy', 'type', 'updated_time'],
      edges:['tags, likes, comments']
    },
       events: {
      fields:['id', 'category', 'cover', 'description', 'type', 'name', 'owner', 'place', 'attending_count', 'declined_count', 'maybe_count'],
      edges:['admins', 'attending', 'declined', 'maybe', 'noreply', 'roles', 'comments', 'photos', 'picture', 'videos']
    },
       groups: {
      fields:['id', 'cover', 'description', 'email', 'icon', 'link', 'member_request_count', 'name', 'owner', 'parent', 'privacy', 'updated_time'],
      edges:[]
    },
      posts: {
      fields:['id', 'admin_creator', 'application', 'call_to_action', 'caption', 'created_time', 'description', 'feed_targeting', 'from', 'icon', 'is_hidden', 'is_published', 'link', 'message', 'message_tags', 'name', 'object_id', 'picture', 'place', 'privacy', 'properties',' shares', 'source', 'status_type', 'story', 'story_tags', 'targeting', 'to', 'type', 'updated_time', 'with_tags'],
      edges:[]
    },
      status: {
      fields:['id', 'event', 'from', 'message', 'place', 'updated_time'],
      edges:[]
    },
      videos: {
      fields:['id', 'created_time', 'description', 'embed_html', 'format', 'from', 'icon', 'is_instagram_eligible', 'length', 'status', 'source', 'updated_time' ,'privacy', 'permalink_url', 'event', 'place', 'backdated_time', 'backdated_time_granularity', 'picture'],
      edges: []
    }
  },
  'USER':{
    name:'user',
    fields:['id', 'about', 'age_range', 'bio', 'birthday', 'context', 'currency', 'devices', 'education', 'email', 'favorite_athletes', 'favorite_team', 'first_name', 'gender', 'hometown', 'inspirational_people', 'install_type', 'installed', 'interested_in', 'is_shared_login', 'is_verified', 'languages', 'last_name', 'link', 'location', 'locale', 'meeting_for', 'middle_name', 'name', 'name_format', 'payment_pricepoints', 'test_group', 'political', 'relationship_status', 'religion', 'security_settings', 'significant_other', 'sports', 'quotes', 'third_party_id', 'timezone', 'token_for_business', 'updated_time', 'shared_login_upgrad_required_by', 'verified', 'video_upload_limits', 'viewer_can_send_gift', 'website', 'work', 'public_key', 'cover', 'albums'],
    edges:['events', 'groups', 'likes', 'photos', 'picture']
  }
}
