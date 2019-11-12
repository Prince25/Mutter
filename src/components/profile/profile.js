import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Redirect } from 'react-router-dom';
import PostList from '../feed/PostList';


export class Profile extends Component {

  render() {

  	const { posts, profile, auth } = this.props;
    if (!auth.uid) return <Redirect to='/splash' />

    return (
      <div className="container">

        {/*Profile Header block*/}
        <div className="profile-header">
        	<p className="profile-name center">{ profile.name }</p>
        </div>

        {/*navbar: mutters (Default active) | # followers | # following*/}
        <div class="btn-group">
  			<button>Mutters</button>
  			<button>Followers</button>
  			<button>Following</button>
		</div>

    	{/*users posts (mutters), or list of users following/followers*/}
        <div id="profile-content">
        	<div className="row">

          <div className="col"> {/* https://youtu.be/hZswcXSd5GA?t=130 */}
            <PostList posts={posts} />
          </div>
 
        </div>
 
        	{/*<p className="center">PROFILE CONTENT</p>*/}
        </div>
      
      </div>
    )
 
  }
}


const mapStateToProps = (state) => {
  return {
    posts: state.firestore.ordered.posts,
    profile: state.firebase.profile,
    auth: state.firebase.auth
  }
}


export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'posts', orderBy: ['createdAt', 'desc'] }
  ])
)(Profile);