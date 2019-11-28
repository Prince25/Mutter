import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Redirect } from 'react-router-dom';
import PostList from '../feed/PostList';
import UserList from './UserList';
import styled from 'styled-components';
import UploadPicture from './uploadPicture';
import { followUser, unfollowUser } from '../../store/actions/authActions';

// import './AppNew.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();


export class Profile extends Component {

	constructor(){
    super();
    const params = this.getHashParams();
		const token = params.access_token;
		this.user = null
    if (token) {
      spotifyApi.setAccessToken(token);
    }

    this.state = {
			loggedIn: token ? true : false,
			display: 'Mutters',
      following: false
		}
	}
	
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  componentDidUpdate() {
    const { auth, users, match } = this.props;
    const { following } = this.state;

    const currUserId = match.params.id;
    const ownUserId = auth.uid;

    if (users === undefined) {
      console.log('users currently undefined');
      return;
    }

    for (const user of users) {
      if (user.id === ownUserId) {
        let isFollowing = user.following.includes(currUserId);
        if (following !== isFollowing) {
          this.setState({ following: !following });
        }
        break;
      }
    }
  }

  handleNavClick = (e) => {
  	if (e.target.id === '' || e.target.id === this.state.display) return;
  	document.getElementById(this.state.display).innerHTML = this.state.display;
  	this.setState({
  		display: e.target.id
  	});
  	document.getElementById(e.target.id).innerHTML = "<b><u>"+e.target.id+"</u><b>";
  }

  getContent = () => {
    const { posts, users, match } = this.props;
  	switch(this.state.display) {
  		case 'Mutters':
				const myPosts = (posts != null && this.user ? posts.filter(post => post.authorId === this.user.id) : []);
				 
  			return (
  				<div>
						<PostList posts={myPosts} users={users} />
					</div>
  			);
  			
  		case 'Followers':

        if (users === undefined) return (<div></div>);

        //get list of users this dude is following
        let followers = [];
        for (const user of users) {
          if (user.id === match.params.id) {
            followers = user.followers;
            break;
          }
        }

        const myFollowers = users.filter(user => followers.includes(user.id));

  			return (
					<div className="collection followers">
						<UserList users={myFollowers} />
					</div>
  			);
  			
  		case 'Following':

        if (users === undefined) return (<div></div>);

        //get list of users this dude is following
        let following = [];
        for (const user of users) {
          if (user.id === match.params.id) {
            following = user.following;
            break;
          }
        }

        const myFollowing = users.filter(user => following.includes(user.id));

  			return (
  				<div className="collection followers">
    				<UserList users={myFollowing} />
  				</div>
  			);
				
  		default:
  			break;
  	}
  }

  handleFollowClick = () => {
    const { following, ownProfile } = this.state;
    const currUserId = this.props.match.params.id;
    const ownUserId = this.props.auth.uid;

    if (!following) 
      this.props.followUser(ownUserId, currUserId);
    else
      this.props.unfollowUser(ownUserId, currUserId);

    this.setState({ following: !following });
  }

  getButton = () => {
    const { following, ownProfile } = this.state;
    const currUserId = this.props.match.params.id;
    const ownUserId = this.props.auth.uid;
    
    if (currUserId === ownUserId) return (<div></div>);

    let color = following ? "red" : "green accent-4";

    return (
      <button className={"waves-effect waves-red btn "+color} onClick={this.handleFollowClick} >
        <i className="material-icons left">{ this.state.following ? "remove" : "add" }
        </i>{ this.state.following ? "Unfollow" : "Follow" }
      </button>
    );
  }
	
  render() {
		const { auth, users, match } = this.props;
		if (!auth.uid) return <Redirect to='/splash' />

		this.user = users && match ? users.filter(user => user.id === match.params.id)[0] : null
	
		const imageUrl = this.user ? this.user.imageUrl : null
		const ProfileImg = styled.img`
			width: 100px;
			max-height: 100px;
			margin-top: 5px;
			margin-bottom: 0;
			vertical-align: text-bottom;
		`;

		const Form = styled.form`
			background-color: light-grey;
			padding: 5px;
			padding-bottom: 1px;
			margin-top: 5px;
			margin-bottom: 5px;
			vertical-align: middle;
			line-height: 14px;
		`;

    return (
      <div className="container">
				{ auth.uid && this.user && auth.uid === this.user.id ?
					<Form>
						<div className="row">
							<div id = 'spotify' className="col s6 center">
								<a href='http://localhost:8888' className="waves-effect waves-light btn center yellow darken-4">Connect Spotify</a>
							</div>
							<div className="col s6">
							<UploadPicture uId={auth.uid} /> 
							</div>
						</div>
					</Form>
					: null }
				

        {/*Profile Header block*/}
        <div className="profile-header">

            <div className="left-align">
              { this.getButton() }
            </div>

						<div className="center-align">
							<a href={imageUrl} ><ProfileImg src={imageUrl} alt="" className="circle responsive-img" /> </a>
							<p className="profile-name">{ this.user ? this.user.name : null }</p>
						</div>

				</div>


        {/*navbar: mutters (Default active) | # followers | # following*/}
        <div className="btn-group">
					<button onClick={this.handleNavClick} id="Mutters"><b><u>Mutters</u></b></button>
					<button onClick={this.handleNavClick} id="Followers">Followers</button>
					<button onClick={this.handleNavClick} id="Following">Following</button>
				</div>


				{/*users posts (mutters), or list of users following/followers*/}
				<div id="profile-content">
					{this.getContent() }    	
				</div>


				{ auth.uid && this.user && auth.uid === this.user.id ?
					<div className="postBtn">
						<Link to="/newpost" className="btn-floating btn-large waves-effect waves-light yellow darken-4"><i className="material-icons">add</i></Link>
					</div> : null }
      
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    posts: state.firestore.ordered.posts,
    auth: state.firebase.auth,
    users: state.firestore.ordered.users
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    followUser: (uId, followingId) => dispatch(followUser(uId, followingId)),
    unfollowUser: (uId, followingId) => dispatch(unfollowUser(uId, followingId))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'posts', orderBy: ['createdAt', 'desc'] },
    { collection: 'users' }
  ])
)(Profile);