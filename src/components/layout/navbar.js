// https://react-bootstrap.github.io/components/navbar/

import React from 'react';
import { Link } from 'react-router-dom'
import SignedInLinks from './signedInLinks'
import { connect } from 'react-redux'
import styled from 'styled-components'


const Navbar = (props) => {

  const { auth, profile } = props
  const links = <SignedInLinks profile={profile} auth={auth} />

  const Logo = styled.img`
    width: 60px;
    height: 60px;
    margin: 5px;
  `;
  
  return (
    <nav className="nav-wrapper light-blue lighten-1">
      <div className="container">
        <Link to='/' className="brand-logo">
          <Logo src="/img/logo.png" alt="" className="circle responsive-img" />
        </Link>
        {auth.isLoaded && links}
      </div>
    </nav>
  )
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
}


export default connect(mapStateToProps)(Navbar)