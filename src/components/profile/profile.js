import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Redirect } from 'react-router-dom';
import PostList from '../feed/PostList';


export class Profile extends Component {

	state = {
		display: 'mutters'
	};

  handleClick = (e) => {
  	this.setState({
  		display: e.target.id
  	});
  }

  getContent = () => {
  	switch(this.state.display) {
  		case 'mutters':
  			const { posts } = this.props;
  			return (
  				<div className="row">
          			<div className="col">
            			<PostList posts={posts} />
         	 		</div>
        		</div>
  			);
  			break;
  		case 'followers':
  			return (
  				<div className="collection followers">
    				<a href="#!" className="collection-item">John Adams</a>
	    			<a href="#!" className="collection-item">Paul Revere</a>
	    			<a href="#!" className="collection-item">George Washington</a>
    				<a href="https://google.com" className="collection-item">Thomas Jefferson</a>
    				<a href="#!" className="collection-item">Barack Obama</a>
    				<a href="#!" className="collection-item">Bill Clinton</a>
  				</div>
  			);
  			break;
  		case 'following':
  			return (
  				<div className="collection followers">
    				<a href="#!" className="collection-item">John Adams</a>
	    			<a href="#!" className="collection-item">Paul Revere</a>
	    			<a href="#!" className="collection-item">George Washington</a>
    				<a href="https://google.com" className="collection-item">Thomas Jefferson</a>
    				<a href="#!" className="collection-item">Barack Obama</a>
    				<a href="#!" className="collection-item">Bill Clinton</a>
  				</div>
  			);
  			break;
  		default:
  			break;
  	}
  }

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
        <div className="btn-group">
  			<button onClick={this.handleClick} id="mutters">Mutters</button>
  			<button onClick={this.handleClick} id="followers">Followers</button>
  			<button onClick={this.handleClick} id="following">Following</button>
		</div>

    	{/*users posts (mutters), or list of users following/followers*/}
    	<div id="profile-content">
    		{this.getContent() }    	
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