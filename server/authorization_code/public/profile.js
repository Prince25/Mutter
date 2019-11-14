import React, { Component } from 'react'
import './AppNew.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();


// export class Profile extends Component {

//   render() {

//     return (
//       <div className="container">
//         <p>profile1</p>
//       </div>
//     )
 
//   }
// }

// export default Profile

class Profile extends Component {
  constructor(){
     
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false
      
  }
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  render() {
    return (
      <div className="Profile">
        <a href='http://localhost:8888' > Login to Spotify </a>
        
      </div>
    );
  }
}

export default Profile;