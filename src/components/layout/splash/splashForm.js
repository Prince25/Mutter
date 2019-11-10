import React, { Component } from 'react'
import SignUp from './signup'
import SignIn from './signin'
import styled from 'styled-components'


export class SplashForm extends Component {

  state = {
    signup: false,
    signin: true
  }

  switch = (word) => {
    var signup, signin;
    if(word === "signup") {
      signup = true; signin = false;
    }
    else {
      signin = true; signup = false;
    }
    return this.setState( {signin: signin, signup: signup} )  
  }
  

  render() {

    // https://www.styled-components.com/docs/basics
    // https://materializecss.com/color.html
    // https://materializecss.com/icons.html

    const Button = styled.button` 
      font-size: 1em;
      margin-left: 20px;
      margin-right: 20px;
      padding: 0.6em 1em;
      border: 2px solid palevioletred;
      border-radius: 5px;
    `;

    const InFocused = styled(Button)`
      color: ${this.state.signin ? "palevioletred" : "white"};
      background: ${this.state.signin ? "white" : "palevioletred"};
      border-radius: ${this.state.signin ? "1.2em" : ""};
    `;

    const UpFocused = styled(Button)`
      color: ${this.state.signup ? "palevioletred" : "white"};
      background: ${this.state.signup ? "white" : "palevioletred"};
      border-radius: ${this.state.signup ? "1.2em" : ""};
    `;

    return (
      <div>
        <UpFocused as="a" className="waves-effect" onClick={ this.switch.bind(null, "signup")}>
          <i className="material-icons left">add</i>
          Sign Up
        </UpFocused>
        
        <InFocused as="a" className="waves-effect" onClick={ this.switch.bind(null, "signin")}>
          <i className="material-icons left">music_note</i>
          Sign In
        </InFocused>

        { this.state.signup ? <SignUp /> : null}
        { this.state.signin ? <SignIn /> : null}
      </div>
    )
  }
}


export default SplashForm