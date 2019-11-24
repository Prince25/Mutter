import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Redirect } from 'react-router-dom';
import PostList from '../feed/PostList';
import UserList from './UserList';
import styled from 'styled-components'
import UploadPicture from './uploadPicture'

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
      ownProfile: false,
      following: true
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

  handleClick = (e) => {
  	if (e.target.id === '' || e.target.id === this.state.display) return;
  	document.getElementById(this.state.display).innerHTML = this.state.display;
  	this.setState({
  		display: e.target.id
  	});
  	document.getElementById(e.target.id).innerHTML = "<b><u>"+e.target.id+"</u><b>";
  }

  getContent = () => {
    const { posts, users } = this.props;
  	switch(this.state.display) {
  		case 'Mutters':
				const myPosts = (posts != null && this.user ? posts.filter(post => post.authorId === this.user.id) : []);
				 
  			return (
  				<div>
						<PostList posts={myPosts} />
					</div>
  			);
  			
  		case 'Followers':
  			return (
					<div className="collection followers">
						<UserList users={users} />
					</div>
  			);
  			
  		case 'Following':
  			return (
  				<div className="collection followers">
    				<UserList users={users} />
  				</div>
  			);
				
  		default:
  			break;
  	}
  }

  getButton = () => {
    const { following, ownProfile } = this.state;
    
    if (ownProfile) return (<div></div>);

    let color = following ? "red" : "green accent-4";

    return (
      <button className={"waves-effect waves-red btn "+color} onClick={
        () => this.setState({ following: !following })}>
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
							<div className="col s6 center">
								<a href='http://localhost:8888' className="waves-effect waves-light btn center yellow darken-4">Login to Spotify</a>
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
					<button onClick={this.handleClick} id="Mutters"><b><u>Mutters</u></b></button>
					<button onClick={this.handleClick} id="Followers">Followers</button>
					<button onClick={this.handleClick} id="Following">Following</button>
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


export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'posts', orderBy: ['createdAt', 'desc'] },
    { collection: 'users' }
  ])
)(Profile);
