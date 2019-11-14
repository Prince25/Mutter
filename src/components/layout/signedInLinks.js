// Links to show when user is signed in

import React from 'react';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/authActions'


const SignedInLinks = (props) => {
  return (
    <ul className="right">
      <li><NavLink to='/discover'>Discover</NavLink></li>
      <li><NavLink to='/groups'>Groups</NavLink></li>
      <li><NavLink to='/feed'>Feed</NavLink></li>
      <li><NavLink to='/profile' className='btn btn-floating pink lighten-1'>
        { props.profile.initials }
      </NavLink></li>
      <li><a href='/' onClick={props.signOut}>Log Out</a></li>
    </ul>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}

export default connect(null, mapDispatchToProps)(SignedInLinks)