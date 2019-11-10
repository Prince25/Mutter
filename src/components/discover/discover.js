import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'


export class Discover extends Component {

  render() {
    const { auth } = this.props
    if (!auth.uid) return <Redirect to='/splash' />
    
    return (
      <div className="container">
        <p>discover</p>
      </div>
    )
 
  }
}


const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}


export default connect(mapStateToProps)(Discover)