// Links to show when user is signed in

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { signOut } from '../../store/actions/authActions'


class SignedInLinks extends Component {
   
  render() {
    const { auth, profile, users } = this.props
    
    const uid = auth && auth.isLoaded ? auth.uid : null
    const curUser = users ? users.filter(user => user.id === uid)[0] : null
    var token = curUser ? curUser.spotify_token : null
    if (!token) token = ''
    const imageUrl = profile && profile.isLoaded && profile.imageUrl ? profile.imageUrl : null

    return (
      <ul className="right">
        <li><NavLink to={'/discover/' + token}>Discover</NavLink></li>
        <li><NavLink to='/groups'>Groups</NavLink></li>
        <li><NavLink to='/feed'>Feed</NavLink></li>
        <li><NavLink to={'/profile/' + uid} id = 'profile_btn' className='btn btn-floating pink lighten-1'>
          <img src={imageUrl} alt="" className="circle responsive-img" />
        </NavLink></li>
        <li><a href='/splash' onClick={this.props.signOut}>Log Out</a></li>
      </ul>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    users: state.firestore.ordered.users
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([ { collection: 'users' } ])
)(SignedInLinks)