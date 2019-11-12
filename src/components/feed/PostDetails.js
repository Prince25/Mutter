import React from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import moment from 'moment'


const PostDetails = (props) => {

  const { post } = props
 
  if (post) {
    return(
      <div className="container section post-details">
        <div className="card z-depth-0">
          <div className="card-content">
            <span className="card-title">User: { post.author } | Song: { post.song }</span>
            <p>Rating:{ post.rating }</p>
            <p>Comment:{ post.comment }</p>
          </div>
          <div className="card-action grey lighten-4 grey-text">
            <div>Posted by { post.author }</div>
            <div>
              on { moment(post.createdAt.toDate()).format('LLLL') }
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="container center">
        <p>Loading post...</p>
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const posts = state.firestore.data.posts;
  const post = posts ? posts[id] : null;

  return {
    post: post
  };
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'posts' }
  ])
)(PostDetails);
