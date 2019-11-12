
/* 
  Based on the tutorial:
  https://www.youtube.com/playlist?list=PL4cUxeGkcC9iWstfXntcj8f-dFZ4UtlN3
*/


import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navbar from './components/layout/navbar'
import Dashboard from './components/dashboard/dashboard'
import ProjectDetails from './components/project/projectDetails'
import SignIn from './components/auth/signin'
import SignUp from './components/auth/signup'
import CreateProject from './components/project/createProject'
import Discover from './components/discover/discover'
import Groups from './components/groups/groups'
import Feed from './components/feed/feed'
import Profile from './components/profile/profile'


class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path='/' component={Dashboard} />        
            <Route path='/signin' component={SignIn} />
            <Route path='/signup' component={SignUp} />
            <Route path='/discover' component={Discover} />
            <Route path='/groups' component={CreateProject} />    
            <Route path='/feed' component={Feed} />
            <Route path='/profile' component={Profile} />
            <Route path='/project/:id' component={ProjectDetails} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }

}

export default App;
