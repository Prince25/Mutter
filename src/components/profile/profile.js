// import React, { Component } from 'react'
// import './AppNew.css';

// import SpotifyWebApi from 'spotify-web-api-js';
// const spotifyApi = new SpotifyWebApi();



// class profile extends Component {
//   constructor(){
     
//     super();
//     const params = this.getHashParams();
//     const token = params.access_token;
//     if (token) {
//       spotifyApi.setAccessToken(token);
//     }
//     this.state = {
//       loggedIn: token ? true : false,
//       nowPlaying: { name: 'Not Checked', albumArt: '' },
  
//       recentList: { name: ['recenttest','','','',''],
//         albumArtN: ['','','','',''],
//         albumArtL: ['','','','','']},
//       mostRecommendedL: { songname: ['recommendedtest','','','',''],
//         albumArtN: ['','','','',''],
//         albumArtL: ['','','','','']}
//   }}
//   getHashParams() {
//     var hashParams = {};
//     var e, r = /([^&;=]+)=?([^&;]*)/g,
//         q = window.location.hash.substring(1);
//     e = r.exec(q)
//     while (e) {
//        hashParams[e[1]] = decodeURIComponent(e[2]);
//        e = r.exec(q);
//     }
//     return hashParams;
//   }

//   getNowPlaying(){
//     spotifyApi.getMyCurrentPlaybackState()
//       .then((response) => {
//         this.setState({
//           nowPlaying: { 
//               name: response.item.name, 
//               albumArt: response.item.album.images[0].url
//             }
//         });
//       })
//   }

//   getRecentList(){
    
//     spotifyApi.getMyRecentlyPlayedTracks()
//     .then((response)=>{
//      this.setState({
//   recentList:{
//     name: [response.items[0].track.name,
//      response.items[1].track.name,           
//      response.items[2].track.name,
//      response.items[3].track.name,      
//                  response.items[4].track.name],
//     albumArtN:[
//       response.items[0].track.album.name,
//       response.items[1].track.album.name,
//       response.items[2].track.album.name,
//       response.items[3].track.album.name,
//       response.items[4].track.album.name
//         ],
//     albumArtL: [response.items[0].track.album.images[0].url,
//       response.items[1].track.album.images[0].url,
//       response.items[2].track.album.images[0].url,
//       response.items[3].track.album.images[0].url,
//       response.items[4].track.album.images[0].url
//          ]
//   }
//      });
//     })
//   }


//   getMostReommended(){
//   //window.alert(spotifyApi.getRecommendations()); 

//     spotifyApi.getRecommendations().then((response)=>{
//      window.alert(response);
//      window.alert("inside then")
//      this.setState({
//   mostRecommendedL:{
//     songname: [response.tracks[0].name,
//      response.tracks[1].name,        
//      response.tracks[2].name,
//      response.tracks[3].name,   
//                  response.tracks[4].name],
//   //it may need to change for mutiple artists
//     albumArtN:[
//       response.tracks[0].album.artists[0].name,
//       response.tracks[1].album.artists[0].name,        
//       response.tracks[2].album.artists[0].name,
//       response.tracks[3].album.artists[0].name,   
//                   response.tracks[4].album.artists[0].name],
//     albumArtL: [response.tracks[0].images[0].url,
//       response.tracks[1].images[0].url,
//       response.tracks[2].images[0].url,
//       response.tracks[3].images[0].url,
//       response.tracks[4].images[0].url
//          ]
  
//   }
  
//      });
//   window.alert('set state');
//     })
//   window.alert(this.state.mostRecommendedL.songname[0]);
//   window.alert(this.state.mostRecommendedL.albumArtN[0]);
//   window.alert(this.state.mostRecommendedL.albumArtL[0]);

//   }


//   render() {
//     return (
//       <div className="profile">
//         <a href='http://localhost:8888' > Login to Spotify </a>
//         <div>
//           Now Playing: { this.state.nowPlaying.name }
//         </div>
//         <div>
//           <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
//         </div>

//         { this.state.loggedIn &&
//           <button onClick={() => this.getNowPlaying()}>
//             Check Now Playing
//           </button>
//         }
//         { this.state.loggedIn &&
//           <button onClick={() => this.getRecentList()}>
//             Check Recently played
//           </button>
//         }

//   { this.state.loggedIn &&
//           <button onClick={() => this.getMostReommended()}>
//             Check Most Recommended Song
//           </button>
//         }

// {/*showing the most recently song*/}

//   <div>
//      Most Recommended Song: 
//   </div>
//   <div>
//            { this.state.mostRecommendedL.songname[0] }
//      <br/> {this.state.mostRecommendedL.albumArtN[0]}
//         </div>
//   <div>
//           <img src={this.state.mostRecommendedL.albumArtL[0]} style={{ height: 150 }}/>
//         </div>
//   <div>
//            { this.state.mostRecommendedL.songname[1] }
//      <br/> {this.state.mostRecommendedL.albumArtN[1]}
//         </div>
//   <div>
//           <img src={this.state.mostRecommendedL.albumArtL[1]} style={{ height: 150 }}/>
//         </div><div>
//            { this.state.mostRecommendedL.songname[2] }
//      <br/> {this.state.mostRecommendedL.albumArtN[2]}
//         </div>
//   <div>
//           <img src={this.state.mostRecommendedL.albumArtL[2]} style={{ height: 150 }}/>
//         </div><div>
//            { this.state.mostRecommendedL.songname[3] }
//      <br/> {this.state.mostRecommendedL.albumArtN[3]}
//         </div>
//   <div>
//           <img src={this.state.mostRecommendedL.albumArtL[3]} style={{ height: 150 }}/>
//         </div>
//   <div>
//            { this.state.mostRecommendedL.songname[4] }
//      <br/> {this.state.mostRecommendedL.albumArtN[4]}
//         </div>
//   <div>
//           <img src={this.state.mostRecommendedL.albumArtL[4]} style={{ height: 150 }}/>
//         </div>

// {/*end of recently played*/}
//   <div>
//      Recently Played Song 
//   </div>
//   <div>
//            { this.state.recentList.name[0] }{/*not sure if array is ok */}
//      <br/> {this.state.recentList.albumArtN[0]}
//         </div>
//   <div>
//           <img src={this.state.recentList.albumArtL[0]} style={{ height: 150 }}/>
//         </div>
//   <div>
//           { this.state.recentList.name[1] }{/*not sure if array is ok */}
//      <br/>{this.state.recentList.albumArtN[1]}
//         </div>
//   <div>
//           <img src={this.state.recentList.albumArtL[1]} style={{ height: 150 }}/>
//         </div>
//   <div>
//           { this.state.recentList.name[2] }{/*not sure if array is ok */}
//      <br/>{this.state.recentList.albumArtN[2]}
//         </div>
//   <div>
//           <img src={this.state.recentList.albumArtL[2]} style={{ height: 150 }}/>
//         </div>
//   <div>
//           { this.state.recentList.name[3] }{/*not sure if array is ok */}
//      <br/>{this.state.recentList.albumArtN[3]}
//         </div>
//   <div>
//           <img src={this.state.recentList.albumArtL[3]} style={{ height: 150 }}/>
//         </div>
//   <div>
//           { this.state.recentList.name[4] }{/*not sure if array is ok */}
//      <br/>{this.state.recentList.albumArtN[4]}
//         </div>
//   <div>
//           <img src={this.state.recentList.albumArtL[4]} style={{ height: 150 }}/>
//         </div>

//       </div>
//     );
//   }
// }

// export default profile;

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