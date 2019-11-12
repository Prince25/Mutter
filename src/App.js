
/* 
  Based on the tutorial:
  https://www.youtube.com/playlist?list=PL4cUxeGkcC9iWstfXntcj8f-dFZ4UtlN3
*/


import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Navbar from './components/layout/navbar'
import Dashboard from './components/dashboard/dashboard'
import ProjectDetails from './components/project/projectDetails'
import CreateProject from './components/project/createProject'
import Discover from './components/discover/discover'
import Groups from './components/groups/groups'
import GroupDetails from './components/groups/groupDetails'
import Feed from './components/feed/feed'
import Profile from './components/profile/profile'
import Splash from './components/layout/splash/splash'
import Loading from './loading'


class App extends Component {

  state = { isLoading: true }

  // Ensures the no other componenet loads before the Navbar
  componentWillReceiveProps() {
    this.setState({isLoading: false})
  }

  render() {

    const { auth } = this.props
    const showNavbar = (auth.isLoaded && auth.uid) ? <Navbar /> : <Redirect to='/splash' />

    return (
      this.state.isLoading ? <Loading /> :
      <BrowserRouter>
        <div className="App">
          { showNavbar }
          <Switch>
            <Route exact path='/'       component={Dashboard} />        {/* change to discover.js once implemented */}
            <Route path='/splash'       component={Splash} />
            <Route path='/groups'       component={Groups} />           
            <Route path='/group/:id'    component={GroupDetails} />           
            <Route path='/feed'         component={Feed} />
            <Route path='/profile'      component={Profile} />
            <Route path='/project/:id'  component={ProjectDetails} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
}

export default connect(mapStateToProps)(App);
