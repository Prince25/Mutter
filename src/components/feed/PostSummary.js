import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';


const PostSummary = ({post, users}) => {

  const rating = post.rating;
  const user = users && post ? users.filter(user => user.id === post.authorId)[0] : null

  return (

    <div className="card z-depth-0 post-summary">
      <div className="card-content grey-text text-darken-3">
        <div className="card-title">
          <Link to={'/profile/' + post.authorId} className='btn btn-floating light-blue lighten-1'>
            <img src={user ? user.imageUrl: null} alt="" className="circle responsive-img" />
          </Link>
          <Link to={'/profile/' + post.authorId} >
            <b> {post.author} </b>
          </Link>
          rated song "<b><a href={post.url ? post.url : null}>{post.song}</a></b>"
        </div>
        <span className={"fa fa-star " + (rating >= 1 ? 'checked' : '')}></span>
        <span className={"fa fa-star " + (rating >= 2 ? 'checked' : '')}></span>
        <span className={"fa fa-star " + (rating >= 3 ? 'checked' : '')}></span>
        <span className={"fa fa-star " + (rating >= 4 ? 'checked' : '')}></span>
        <span className={"fa fa-star " + (rating >= 5 ? 'checked' : '')}></span>
        <p>{post.comment} </p>
        <p className="grey-text">
          { moment(post.createdAt.toDate()).format('LLLL') }
        </p>
      </div>
    </div>
      
  )
}


export default PostSummary;