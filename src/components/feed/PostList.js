import React from 'react';
import PostSummary from './PostSummary';
import { Link } from 'react-router-dom';


const PostList = ({posts}) => {

  return (
    <div className="post-list section">
      { posts && posts.map(post => {
        return (
          <PostSummary post={post} key={post.id}/>
        )
      })}
    </div>
  )

}

export default PostList;