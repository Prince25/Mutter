import React from 'react';
import PostSummary from './PostSummary';


const PostList = ({posts, users}) => {
  return (
    <div style={{paddingTop: '0'}} className="post-list section">
      { posts && posts.map(post => {
        return (
          <PostSummary post={post} users={users} key={post.id}/>
        )
      })}
    </div>
  )
}


export default PostList;