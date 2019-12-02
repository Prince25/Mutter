import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import SplashForm from './splashForm'
import styled, { keyframes } from 'styled-components'
import Sound from 'react-sound'


export class Splash extends Component {

  constructor() {
    super()
    this.state = {
      playStatus: Sound.status.PLAYING
    }
  }

  togglePlay() {
    if(this.state.playStatus === Sound.status.PLAYING)
      this.setState({playStatus: Sound.status.PAUSED})
    else
      this.setState({playStatus: Sound.status.PLAYING})
  }
  

  render() {
    const { auth } = this.props;
    if (auth.isLoaded && auth.uid) return <Redirect to='/' /> 

    // Create the keyframes - https://codeburst.io/animating-react-components-with-css-and-styled-components-cc5a0585f105
    const animate = keyframes`
      0%, 50%, 100% {
        transform: rotate(0deg);
      }
      25% {
        transform: rotate(10deg);
      }
      75% {
        transform: rotate(-10deg);
      }
    `;
    
    const Logo = styled.img`
      width: 40%;
      &:hover{
        animation: ${animate} 1s linear infinite;
      }
    `;

    const PaddedBottom = styled.div`
      padding-bottom: 3em;
      min-height: 120%;
    `;


    return (

      <div className="valing-wrapper center-align">           {/* Align vertically, horizontally */}
        <img src="/img/splash-bg.jpg" className="splash" alt="" />
        <div className="container">
          <Logo className="responsive-img" src="/img/logo.png" alt="" />
          <SplashForm />
        </div>
        <PaddedBottom />

        <Sound
          url="/audio/droneLoop.ogv"
          playStatus={this.state.playStatus}
          autoLoad={true}
          loop={true}
        />

        <div className="postBtn">
          <a onClick={() => this.togglePlay()} className="waves-effect waves-light btn yellow darken-4">Mute</a>
        </div>
      </div>
    )
 
  }
}


const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}


export default connect(mapStateToProps)(Splash)
