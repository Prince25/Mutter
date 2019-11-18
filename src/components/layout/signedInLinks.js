// Links to show when user is signed in

import React from 'react';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/authActions'


const SignedInLinks = (props) => {
  
  const { profile, auth } = props
  const uid = auth.isLoaded ? auth.uid : null
  const imageUrl = profile.isLoaded && profile.imageUrl ? profile.imageUrl : null
  
  return (
  
    <ul className="right">
      <li><NavLink to='/'>Discover</NavLink></li>
      <li><NavLink to='/groups'>Groups</NavLink></li>
      <li><NavLink to='/feed'>Feed</NavLink></li>
      <li><NavLink to={'/profile/' + uid} className='btn btn-floating pink lighten-1'>
        <img src={imageUrl} alt="" className="circle responsive-img" />
      </NavLink></li>
      <li><a href='/splash' onClick={props.signOut}>Log Out</a></li>
    </ul>
  )
}


const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}


export default connect(null, mapDispatchToProps)(SignedInLinks)