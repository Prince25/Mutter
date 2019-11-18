import React, { Component } from 'react';
import PostList from '../feed/PostList';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';


class Feed extends Component {
  
  render() {

    const { posts, users, auth } = this.props;
    if (!auth.uid) return <Redirect to='/splash' />

    return (
      <div className="feed container">
        <div className="row">

          <div className="col"> {/* https://youtu.be/hZswcXSd5GA?t=130 */}
            <PostList posts={posts} users={users} />
          </div>
 
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    posts: state.firestore.ordered.posts,
    users: state.firestore.ordered.users,
    auth: state.firebase.auth
  }
}


export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'posts', orderBy: ['createdAt', 'desc'] },
    { collection: 'users' }
  ])
)(Feed);
