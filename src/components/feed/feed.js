import React, { Component } from 'react';
import PostList from '../feed/PostList';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';


class Feed extends Component {

  state = {
    filter: 'following'
  }

  filter = (e) => {
    this.setState({ filter: e.target.id });
  }

  componentDidUpdate() {
    if (document.getElementById('following') == null) return;
    document.getElementById(this.state.filter).checked = true;
  }

  render() {

    const { posts, users, groups, auth, match } = this.props;
    if (!auth.uid) return <Redirect to='/splash' />


    if (users === undefined || posts === undefined || groups === undefined) return (<div></div>);
    const userId = this.props.auth.uid;

    //get list of users this dude is following and list of groups theyre in
    let usersFollowing = [];
    let usersGroups = [];
    for (const user of users) {
      if (user.id === userId) {
        usersFollowing = user.following;
        usersGroups = user.groups;
        break;
      }
    }

    //get list of users who are in same groups this dude is in
    let usersInGroups = [];
    for (const group of groups) {
      if (usersGroups.includes(group.id)) {
        usersInGroups.push(...group.members);
      }
    }
    usersInGroups = usersInGroups.filter((value, index, self) => { return self.indexOf(value)===index; } );   // remove duplicates

    let postsToDisplay = [];
    switch(this.state.filter) {
      case 'groups':
        postsToDisplay = posts.filter(post => post.authorId != auth.uid && usersInGroups.includes(post.authorId));
        break;
      case 'all':
      	postsToDisplay = posts.filter(post => post.authorId != auth.uid);
      	break;
      case 'following':
      default:
        postsToDisplay = posts.filter(post => usersFollowing.includes(post.authorId));
        break;
    }

    return (
      <div className="feed container">
        <div className="col"> {/* https://youtu.be/hZswcXSd5GA?t=130 */}
          <div className="row">

          <form className="feed-selection-box"><b>FILTER FEED:</b>   
            <div onChange={this.filter}>
            
            <label className="feed-options">
              <input type="radio" id="following" value="following" name="filter-options"/>
              <span>following</span>
            </label>
            
            <label className="feed-options">
              <input type="radio" id="groups" value="groups" name="filter-options"/>
              <span>groups</span>
            </label>

            <label className="feed-options">
              <input type="radio" id="all" value="all" name="filter-options"/>
              <span>all</span>
            </label>

          </div>
          </form>

            <PostList posts={postsToDisplay} users={users} />
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
    groups: state.firestore.ordered.groups,
    auth: state.firebase.auth
  }
}


export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'posts', orderBy: ['createdAt', 'desc'] },
    { collection: 'users' },
    { collection: 'groups' }
  ])
)(Feed);
