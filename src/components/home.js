// Home Page: Shows welcome message and notifications of new users

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import styled, { keyframes } from 'styled-components'
import Notifications from './notifications'


class Home extends Component {

  render() {
    // Create the keyframes - https://codeburst.io/animating-react-components-with-css-and-styled-components-cc5a0585f105
    const animate = keyframes`
    0% {
      width: 60%;
    }
    50% {
      width: 55%;
    }
    100% {
      width: 60%;
    }
    `;

    const Logo = styled.img`
      animation: ${animate} 4s linear infinite;
    `;

    const { notifications } = this.props


    return (

      <div className="valing-wrapper center-align">           {/* Align vertically, horizontally */}
        <h1>Welcome to Mutter!</h1>

        <div className="row">
          <div className="col s7">
            <Logo className="responsive-img" src="/img/logo.png" alt="" />
          </div>
        
          <div className="col s5">
            <div className="dashboard container">
              <Notifications notifications={notifications} /> 
            </div>
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    notifications: state.firestore.ordered.notifications
  }
}


export default compose(
  connect(mapStateToProps),
  firestoreConnect([ 
    { collection: 'notifications', limit: 10, orderBy: ['time', 'desc'] }
  ])
)(Home)
