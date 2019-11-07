// Links to show when user is signed out

// Links to show when user is signed in

import React from 'react';
import { NavLink } from 'react-router-dom'


const SignedOutLinks = () => {
  return (
    <ul className="right">
      <li><NavLink to='/signup'>Signup</NavLink></li>
      <li><NavLink to='/signin'>Login</NavLink></li>
    </ul>
  )
}


export default SignedOutLinks