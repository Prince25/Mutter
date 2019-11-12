import React from 'react';
import moment from 'moment';

const PostSummary = ({post}) => {
  
  return (

    <div className="card z-depth-0 post-summary">
      <div className="card-content grey-text text-darken-3">
        <div className="card-title"><b>{post.author}</b> RATED SONG <b>{post.song}</b>: {post.rating} STARS</div>
        <p>{post.comment} </p>
        <p className="grey-text">
          { moment(post.createdAt.toDate()).calendar() }
        </p>
      </div>
    </div>
      
  )
}

export default PostSummary;