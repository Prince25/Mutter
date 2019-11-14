import React, { Component } from 'react';
import PostList from '../feed/PostList';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';


class Feed extends Component {
  
  render() {

    const { posts, auth } = this.props;
    if (!auth.uid) return <Redirect to='/splash' />

    return (
      <div className="feed container">
        <div className="row">

          <div className="col"> {/* https://youtu.be/hZswcXSd5GA?t=130 */}
            <PostList posts={posts} />
          </div>
 
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    posts: state.firestore.ordered.posts,
    auth: state.firebase.auth
  }
}


export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'posts', orderBy: ['createdAt', 'desc'] }
  ])
)(Feed);
