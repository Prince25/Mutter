import React from 'react';
import moment from 'moment';

const PostSummary = ({post}) => {

  const rating = post.rating;

  return (

    <div className="card z-depth-0 post-summary">
      <div className="card-content grey-text text-darken-3">
        {/*change STARS to STAR if one star*/}
        <div className="card-title"><b>{post.author}</b> rated song "<b>{post.song}</b>"</div>
        <span className={"fa fa-star " + (rating >= 1 ? 'checked' : '')}></span>
        <span className={"fa fa-star " + (rating >= 2 ? 'checked' : '')}></span>
        <span className={"fa fa-star " + (rating >= 3 ? 'checked' : '')}></span>
        <span className={"fa fa-star " + (rating >= 4 ? 'checked' : '')}></span>
        <span className={"fa fa-star " + (rating >= 5 ? 'checked' : '')}></span>
        <p>{post.comment} </p>
        <p className="grey-text">
          { moment(post.createdAt.toDate()).calendar() }
        </p>
      </div>
    </div>
      
  )
}

export default PostSummary;