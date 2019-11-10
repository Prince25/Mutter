import React from 'react'
import styled, { keyframes } from 'styled-components'


const Loading = () => {

  // Create the keyframes - https://codeburst.io/animating-react-components-with-css-and-styled-components-cc5a0585f105
  const animate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
  `;

  const Logo = styled.img`
    width: 25%;
    animation: ${animate} 0.75s linear infinite;
  `;

  return (
      <div className="valing-wrapper center-align">           {/* Align vertically, horizontally */}
        <Logo className="responsive-img" src="/img/logo.png" alt="" />
        <h1>Loading...</h1>
      </div>
    )
}


export default Loading
