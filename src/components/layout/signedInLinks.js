// Links to show when user is signed in

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { signOut } from '../../store/actions/authActions'


class SignedInLinks extends Component {
   
  render() {
    const { auth, profile, curUser } = this.props

    var token = curUser ? curUser.spotify_token : null
    if (!token) token = ''
    const imageUrl = profile && profile.isLoaded && profile.imageUrl ? profile.imageUrl : null

    return (
      <ul className="right">
        <li><NavLink to={'/discover/' + token} id = 'discover_btn'>Discover</NavLink></li>
        <li><NavLink to='/groups'>Groups</NavLink></li>
        <li><NavLink to='/feed'>Feed</NavLink></li>
        <li><NavLink to={'/profile/' + auth.uid} id = 'profile_btn' className='btn btn-floating pink lighten-1'>
          <img src={imageUrl} alt="" className="img-fit circle responsive-img" />
        </NavLink></li>
        <li><a href='/splash' onClick={this.props.signOut}>Log Out</a></li>
      </ul>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    curUser: state.firestore.ordered.curUser
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props) => {
    if (!props.auth.uid) return []
    return [ 
      { collection: 'users', where: [ ['id', '==', props.auth.uid] ], storeaAs: 'curUser' }]
    })
)(SignedInLinks)