// Home Page: Redirects to Discover if User already has spotify token, otherwise profile

import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import styled, { keyframes } from 'styled-components'


class Home extends Component {

  state = {
    redirect: false
  }

  componentDidMount() {
    this.id = setTimeout(() => this.setState({ redirect: true }), 3000)
  }

  componentWillUnmount() {
    clearTimeout(this.id)
  }

  render() {
    // Create the keyframes - https://codeburst.io/animating-react-components-with-css-and-styled-components-cc5a0585f105
    const animate = keyframes`
    0% {
      width: 20%;
    }
    50% {
      width: 23%;
    }
    100% {
      width: 20%;
    }
    `;

    const Logo = styled.img`
      animation: ${animate} 4s linear infinite;
    `;

    const { auth, users } = this.props
    const uid = auth && auth.isLoaded ? auth.uid : null
    const curUser = users ? users.filter(user => user.id === uid)[0] : null
    var token = curUser ? curUser.spotify_token : null
    if (!token) token = ''

    const redirectTo = (token === '' && uid) ? '/profile/' + uid : '/discover/' + token
    
    return this.state.redirect ? 
      <Redirect to={redirectTo} /> :

      <div className="valing-wrapper center-align">           {/* Align vertically, horizontally */}
        <h1>Welcome to Mutter!</h1>
        <Logo className="responsive-img" src="/img/logo.png" alt="" />
      </div>
  }
}


const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    users: state.firestore.ordered.users
  }
}


export default compose(
  connect(mapStateToProps),
  firestoreConnect([ { collection: 'users' } ])
)(Home)
