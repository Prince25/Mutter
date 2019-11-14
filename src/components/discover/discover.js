import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

// import './Search.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();
var request = require('request');

const AppConfig = require('../config/app');
const AuthConfig = require('../config/auth');
var querystring = require('querystring');
const redirect_uri = AppConfig.HOST;
const client_id = AuthConfig.CLIENT_ID;
const client_secret = AuthConfig.CLIENT_SECRET;

var tempaccess=''

class Discover extends Component {
  constructor(){
     
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      access_token :'',
      refresh_token :'',
      searchvalue : {searchinput :''},
      searchloading : false,
      message:'',
      loggedIn: token ? true : false,
      checkclicked: {ClickSearchArtist: false, ClickSearchAlbum: false, ClickSearchTrack: false,
                     ClickNowPlaying: false, ClickRecommended: false, ClickHottest: false, ClickRecent: false},
      nowPlaying: { name: 'Not Checked', albumArt: '' },
  
      recentList: { name: ['','','','',''],
                    albumArtN: ['','','','',''],
                    albumArtL: ['','','','','']},
      mostRecommendedL: { songname: ['','','','',''],
                          albumArtN: ['','','','',''],
                          albumArtL: ['','','','','']},
      hottestL: { SongName: ['','','','',''],
                          ArtistName: ['','','','',''],
                          AlbumImage: ['','','','','']},
      searchingArtistL: { ArtistName: ['','','','',''],
                          ArtistImage: ['','','','','']},
      searchingAlbumL:  { ArtistName: ['','','','',''],
                          AlbumName: ['','','','',''],
                          AlbumImage:['','','','','']},
      searchingTrackL:  { SongName: ['','',''],
                          ArtistName: ['','',''],
                          AlbumImage:['','','']}
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    //var delayInMilliseconds = 200; //1 second
    const query = event.target.value;
    //window.alert("changing");
    var q = query;
    
    //setTimeout(function() {}, delayInMilliseconds);
    if(query){
    this.setState({searchvalue:{searchinput : query},
                   searchloading : true});
    //window.alert("event target value is " +q);
    //window.alert("the search value is " +this.state.searchvalue.searchartistvalue);
    }
  }

  handleSubmit(event) {
  	//this.setState({searchvalue: event.target.value});
    window.alert('A name was submitted: ' + this.state.searchvalue);
    event.preventDefault();
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

  getaccesstoken()
  {
    tempaccess = spotifyApi.getAccessToken();
    //window.alert(tempaccess);
  }

  getNowPlaying(){
    this.state.checkclicked.ClickNowPlaying = true;
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        if (response == '' || response.item.name == null) {
          this.setState({
          nowPlaying: { 
              name: "Not playing a song", 
              albumArt: ''
            }
          });
          return;
        }
        else {
          this.setState({
            nowPlaying: { 
                name: response.item.name, 
                albumArt: response.item.album.images[0].url
              }
          });
        }
      })
  }

  getRecentList(){
    this.state.checkclicked.ClickRecent = true;
    spotifyApi.getMyRecentlyPlayedTracks()
    .then((response)=>{
      this.setState({
        recentList:{
          name: [response.items[0].track.name,
           response.items[1].track.name,           
           response.items[2].track.name,
           response.items[3].track.name,      
           response.items[4].track.name],
          albumArtN:[
            response.items[0].track.album.name,
            response.items[1].track.album.name,
            response.items[2].track.album.name,
            response.items[3].track.album.name,
            response.items[4].track.album.name
              ],
          albumArtL: [response.items[0].track.album.images[0].url,
            response.items[1].track.album.images[0].url,
            response.items[2].track.album.images[0].url,
            response.items[3].track.album.images[0].url,
            response.items[4].track.album.images[0].url
               ]
        }
      });
    })
  }
  
  changeArtist(bodydata)
  {
    this.setState({
            searchingArtistL: { 
                ArtistName: [bodydata.artists.items[0].name,
                              bodydata.artists.items[1].name,
                              bodydata.artists.items[2].name,
                              bodydata.artists.items[3].name,
                              bodydata.artists.items[4].name ],
                ArtistImage: [bodydata.artists.items[0].images[0].url,
                               bodydata.artists.items[1].images[0].url,
                               bodydata.artists.items[2].images[0].url,
                               bodydata.artists.items[3].images[0].url,
                               bodydata.artists.items[4].images[0].url]
              }
          });

  }

  changeAlbum(bodydata)
  {
    this.setState({
            searchingAlbumL: { 
                ArtistName: [bodydata.albums.items[0].artists[0].name,
                              bodydata.albums.items[1].artists[0].name,
                              bodydata.albums.items[2].artists[0].name,
                              bodydata.albums.items[3].artists[0].name,
                              bodydata.albums.items[4].artists[0].name,],
    AlbumName : [bodydata.albums.items[0].name,
                              bodydata.albums.items[1].name,
                              bodydata.albums.items[2].name,
                              bodydata.albums.items[3].name,
                              bodydata.albums.items[4].name,],
                AlbumImage: [bodydata.albums.items[0].images[0].url,
                               bodydata.albums.items[1].images[0].url,
                               bodydata.albums.items[2].images[0].url,
                               bodydata.albums.items[3].images[0].url,
                               bodydata.albums.items[4].images[0].url]
              }
          });

  }

  changeTrack(bodydata)
  {
    this.setState({
            searchingTrackL: { 
                ArtistName: [bodydata.tracks.items[0].artists[0].name,
                              bodydata.tracks.items[1].artists[0].name,
            bodydata.tracks.items[2].artists[0].name],
    SongName  : [bodydata.tracks.items[0].name,
                              bodydata.tracks.items[1].name,
                              bodydata.tracks.items[2].name],
                AlbumImage: [bodydata.tracks.items[0].album.images[0].url,
                               bodydata.tracks.items[1].album.images[0].url,
                               bodydata.tracks.items[2].album.images[0].url]
              }
          });

  }

  changeRecommandation(bodydata)
  {
    this.setState({
        mostRecommendedL:{
          songname: [bodydata.tracks[0].name,
           bodydata.tracks[1].name,        
           bodydata.tracks[2].name,
           bodydata.tracks[3].name,   
           bodydata.tracks[4].name],
        //it may need to change for mutiple artists
          albumArtN:[
            bodydata.tracks[0].album.artists[0].name,
            bodydata.tracks[1].album.artists[0].name,        
            bodydata.tracks[2].album.artists[0].name,
            bodydata.tracks[3].album.artists[0].name,   
            bodydata.tracks[4].album.artists[0].name],
          albumArtL: [bodydata.tracks[0].album.images[0].url,
            bodydata.tracks[1].album.images[0].url,
            bodydata.tracks[2].album.images[0].url,
            bodydata.tracks[3].album.images[0].url,
            bodydata.tracks[4].album.images[0].url]
        }
      });

  }

  changeHottest(bodydata)
  {
    this.setState({
         hottestL: { 
                ArtistName: [bodydata.tracks.items[0].track.artists[0].name,
                                      bodydata.tracks.items[1].track.artists[0].name,
                                      bodydata.tracks.items[2].track.artists[0].name,
                                      bodydata.tracks.items[3].track.artists[0].name,
                                      bodydata.tracks.items[4].track.artists[0].name],
                SongName  : [bodydata.tracks.items[0].track.name,
                                        bodydata.tracks.items[1].track.name,
                                        bodydata.tracks.items[2].track.name,
                                        bodydata.tracks.items[3].track.name,
                                        bodydata.tracks.items[4].track.name],
                AlbumImage: [bodydata.tracks.items[0].track.album.images[0].url,
                                        bodydata.tracks.items[1].track.album.images[0].url,
                                        bodydata.tracks.items[2].track.album.images[0].url,
                                        bodydata.tracks.items[3].track.album.images[0].url,
                                        bodydata.tracks.items[4].track.album.images[0].url]
              }
          });
  }


  getSearchArtist()
  {
    this.getaccesstoken();
    if (this.state.searchvalue.searchinput == '') {
      return;
    }
    this.state.checkclicked.ClickSearchArtist = true;
    var searchartisturl = 'https://api.spotify.com/v1/search?q=' + this.state.searchvalue.searchinput + '&type=artist&limit=5';
    var options3 = {
          url: searchartisturl,
          headers: { 'Authorization': 'Bearer ' + tempaccess},
          json: true
        };
    var feed = this;
        request.get(options3, function(error, response, body) {
        feed.changeArtist(body);

        });
  };

  getSearchAlbum()
  {
    this.getaccesstoken();
    if (this.state.searchvalue.searchinput == '') {
      return;
    }
    this.state.checkclicked.ClickSearchAlbum = true;
    var searchalbumurl = 'https://api.spotify.com/v1/search?q=' + this.state.searchvalue.searchinput + '&type=album&limit=5';
    var options3 = {
          url: searchalbumurl,
          headers: { 'Authorization': 'Bearer ' + tempaccess},
          json: true
        };
    var feed = this;
        request.get(options3, function(error, response, body) {
        feed.changeAlbum(body);

        });
      };

  getSearchTrack()
  {
    this.getaccesstoken(); 
    if (this.state.searchvalue.searchinput == '') {
      return;
    }
    this.state.checkclicked.ClickSearchTrack = true;  
    var searchtrackurl = 'https://api.spotify.com/v1/search?q=' + this.state.searchvalue.searchinput + '&type=track&limit=3';
    var options3 = {
          url: searchtrackurl,
          headers: { 'Authorization': 'Bearer ' + tempaccess},
          json: true
        };
    var feed = this;
        request.get(options3, function(error, response, body) {
        feed.changeTrack(body);

        });
  };

  getHottestSong()
  {
    this.getaccesstoken();
    this.state.checkclicked.ClickHottest = true;
    var globaltop50url = 'https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF';
    var options3 = {
          url: globaltop50url,
          headers: { 'Authorization': 'Bearer ' + tempaccess},
          json: true
        };
    var feed = this;
        request.get(options3, function(error, response, body) {
        feed.changeHottest(body);

        });
  };

  
  printsearch(){
    window.alert(this.state.searchvalue.searchartistvalue);
  }

  getMostReommended()
  {
    this.getaccesstoken();
    this.state.checkclicked.ClickRecommended = true; 
    var options = {
         url: 'https://api.spotify.com/v1/me/top/artists?limit=1',
         headers: { 'Authorization': 'Bearer ' + tempaccess },
         json: true
     };
    var feed = this;
    request.get(options, function(error, response, body) {
              
        var topartists = body.items[0].id;
        var recommendedurl ='https://api.spotify.com/v1/recommendations?limit=5&market=US&seed_artists=' + topartists + '&min_energy=0.4&min_popularity=50';
        var options3 = {
            url: recommendedurl,
            headers: { 'Authorization': 'Bearer ' + tempaccess },
            json: true
        };
        
        request.get(options3, function(error, response, body) {
            feed.changeRecommandation(body);
        });
    });
  }


  render() {
  	const {searchvalue} = this.state;
    return (
      <div className="container">
        <div>
        <label className="searchartists-label" htmlFor = "searchartists_input">
              <p>Fill your search content below:</p>
              <input type="text"
                   name ="searchvalue" 
                   value={searchvalue.searchartistvalue}
                   id= "searchartists_input" 
                   onChange={this.handleChange}
               />
               <i className="fa fa-search search-icon" aria-hidden="true"/>
        </label>
        </div>
        <div className="searchbuttons">
        { 
          <button onClick={() => this.getSearchArtist()}>
            SearchByArtist
          </button>
        }
        { 
          <button onClick={() => this.getSearchAlbum()}>
            SearchByAlbum
          </button>
        }
        { 
          <button onClick={() => this.getSearchTrack()}>
            SearchByTrack
          </button>
        }
        </div>
        <div className="checkbuttons">
        {
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        }
        { 
          <button onClick={() => this.getRecentList()}>
            Check Recently played
          </button>
        }

  		{ 
          <button onClick={() => this.getMostReommended()}>
            Check Most Recommended Song
          </button>
        }
        { 
          <button onClick={() => this.getHottestSong()}>
            Hottest Song
          </button>
        }
        </div>
        { this.state.checkclicked.ClickNowPlaying && <div className="nowplay">
          Now Playing: { this.state.nowPlaying.name }
          <br/><img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
        </div>
        }

        { (this.state.checkclicked.ClickSearchArtist || this.state.checkclicked.ClickSearchAlbum || this.state.checkclicked.ClickSearchTrack) && <div className="largefont">
        <hr style={{
            
            backgroundColor: "pink",
            height: 3
        }}/>
        <p>Search Results</p>
        </div>
        }

        { (this.state.checkclicked.ClickSearchArtist || this.state.checkclicked.ClickSearchAlbum || this.state.checkclicked.ClickSearchTrack) && <div className="totresults">
        { this.state.checkclicked.ClickSearchArtist && <div className="results1"> The Searched Artists: 
        <br/>Artist Name: {this.state.searchingArtistL.ArtistName[0]}
        <br/>Artist image:  
        <br/><img src={this.state.searchingArtistL.ArtistImage[0]} style={{ height: 150 }}/>
        <br/>Artist Name: {this.state.searchingArtistL.ArtistName[1]}
        <br/>Artist image:  
        <br/><img src={this.state.searchingArtistL.ArtistImage[1]} style={{ height: 150 }}/>
        <br/>Artist Name: {this.state.searchingArtistL.ArtistName[2]}
        <br/>Artist image:  
        <br/><img src={this.state.searchingArtistL.ArtistImage[2]} style={{ height: 150 }}/>
        <br/>Artist Name: {this.state.searchingArtistL.ArtistName[3]}
        <br/>Artist image:  
        <br/><img src={this.state.searchingArtistL.ArtistImage[3]} style={{ height: 150 }}/>
        <br/>Artist Name: {this.state.searchingArtistL.ArtistName[4]}
        <br/>Artist image:  
        <br/><img src={this.state.searchingArtistL.ArtistImage[4]} style={{ height: 150 }}/>
        </div>
        }

        { this.state.checkclicked.ClickSearchAlbum && <div className="results2"> The Searched Albums: 
        <br/>Artist Name: {this.state.searchingAlbumL.ArtistName[0]}
        <br/>Album Name: {this.state.searchingAlbumL.AlbumName[0]}
        <br/>Album image:  
        <br/><img src={this.state.searchingAlbumL.AlbumImage[0]} style={{ height: 150 }}/>
        <br/>Artist Name: {this.state.searchingAlbumL.ArtistName[1]}
        <br/>Album Name: {this.state.searchingAlbumL.AlbumName[1]}
        <br/>Album image:  
        <br/><img src={this.state.searchingAlbumL.AlbumImage[1]} style={{ height: 150 }}/>
        <br/>Artist Name: {this.state.searchingAlbumL.ArtistName[2]}
        <br/>Album Name: {this.state.searchingAlbumL.AlbumName[2]}
        <br/>Album image:  
        <br/><img src={this.state.searchingAlbumL.AlbumImage[2]} style={{ height: 150 }}/>
        <br/>Artist Name: {this.state.searchingAlbumL.ArtistName[3]}
        <br/>Album Name: {this.state.searchingAlbumL.AlbumName[3]}
        <br/>Album image:  
        <br/><img src={this.state.searchingAlbumL.AlbumImage[3]} style={{ height: 150 }}/>
        <br/>Artist Name: {this.state.searchingAlbumL.ArtistName[4]}
        <br/>Album Name: {this.state.searchingAlbumL.AlbumName[4]}
        <br/>Album image:  
        <br/><img src={this.state.searchingAlbumL.AlbumImage[4]} style={{ height: 150 }}/>
        </div>
        } 

        { this.state.checkclicked.ClickSearchTrack && <div className="results3"> The Searched Tracks: 
        <br/>Artist Name: {this.state.searchingTrackL.ArtistName[0]}
        <br/>Song Name: {this.state.searchingTrackL.SongName[0]}
        <br/>Album image:  
        <br/><img src={this.state.searchingTrackL.AlbumImage[0]} style={{ height: 150 }}/>
        <br/>Artist Name: {this.state.searchingTrackL.ArtistName[1]}
        <br/>Song Name: {this.state.searchingTrackL.SongName[1]}
        <br/>Album image:  
        <br/><img src={this.state.searchingTrackL.AlbumImage[1]} style={{ height: 150 }}/>
        <br/>Artist Name: {this.state.searchingTrackL.ArtistName[2]}
        <br/>Song Name: {this.state.searchingTrackL.SongName[2]}
        <br/>Album image:  
        <br/><img src={this.state.searchingTrackL.AlbumImage[2]} style={{ height: 150 }}/>
        </div>
        }
        </div>
        }

        { (this.state.checkclicked.ClickRecent || this.state.checkclicked.ClickRecommended || this.state.checkclicked.ClickHottest) &&<div className="largefont">
        <hr style={{
            
            backgroundColor: "pink",
            height: 3
        }}/>
        </div>
        }


        { (this.state.checkclicked.ClickRecent || this.state.checkclicked.ClickRecommended || this.state.checkclicked.ClickHottest) && <div className="totresults">
         { this.state.checkclicked.ClickRecent && <div className="results1"> 
          <div className="largefont2">Recent:</div> 
          <br/>Song Name: { this.state.recentList.name[0] }
          <br/>Album Name:  {this.state.recentList.albumArtN[0]}
          <br/>Album image:     
          <br/><img src={this.state.recentList.albumArtL[0]} style={{ height: 150 }}/>
              
          <br/> Song Name: { this.state.recentList.name[1] }
          <br/>Album Name: {this.state.recentList.albumArtN[1]}
          <br/>Album image:    
          <br/>     <img src={this.state.recentList.albumArtL[1]} style={{ height: 150 }}/>
              
          <br/> Song Name: { this.state.recentList.name[2] }
          <br/>Album Name: {this.state.recentList.albumArtN[2]}
          <br/>Album image:  
          <br/>     <img src={this.state.recentList.albumArtL[2]} style={{ height: 150 }}/>
              
          <br/> Song Name: { this.state.recentList.name[3] }
          <br/>Album Name: {this.state.recentList.albumArtN[3]}
          <br/>Album image: 
          <br/>     <img src={this.state.recentList.albumArtL[3]} style={{ height: 150 }}/>
              
          <br/> Song Name: { this.state.recentList.name[4] }
          <br/>Album Name: {this.state.recentList.albumArtN[4]}
          <br/>Album image:     
          <br/>     <img src={this.state.recentList.albumArtL[4]} style={{ height: 150 }}/>
        </div>
        }

        { this.state.checkclicked.ClickRecommended && <div className="results2">
          <div className="largefont2">Recommended:</div> 
          <br/>Song Name: { this.state.mostRecommendedL.songname[0] }
          <br/>Album Name: {this.state.mostRecommendedL.albumArtN[0]}
          <br/>Album image: 
          <br/><img src={this.state.mostRecommendedL.albumArtL[0]} style={{ height: 150 }}/>
          <br/>Song Name: { this.state.mostRecommendedL.songname[1] }
          <br/>Album Name: {this.state.mostRecommendedL.albumArtN[1]}
          <br/>Album image: 
          <br/><img src={this.state.mostRecommendedL.albumArtL[1]} style={{ height: 150 }}/>
          <br/>Song Name: { this.state.mostRecommendedL.songname[2] }
          <br/>Album Name: {this.state.mostRecommendedL.albumArtN[2]}
          <br/>Album image: 
          <br/><img src={this.state.mostRecommendedL.albumArtL[2]} style={{ height: 150 }}/>
          <br/>Song Name: { this.state.mostRecommendedL.songname[3] }
          <br/>Album Name: {this.state.mostRecommendedL.albumArtN[3]}
          <br/>Album image: 
          <br/><img src={this.state.mostRecommendedL.albumArtL[3]} style={{ height: 150 }}/>
          <br/>Song Name: { this.state.mostRecommendedL.songname[4] }
          <br/>Album Name: {this.state.mostRecommendedL.albumArtN[4]}
          <br/>Album image: 
          <br/><img src={this.state.mostRecommendedL.albumArtL[4]} style={{ height: 150 }}/>
        </div>
        }

        { this.state.checkclicked.ClickHottest && <div className="results3"> 
            <div className="largefont2">Global Hottest:</div>
            <br/>Artist Name: {this.state.hottestL.ArtistName[0]}
            <br/>Song Name: {this.state.hottestL.SongName[0]}
            <br/>Album image:  
            <br/><img src={this.state.hottestL.AlbumImage[0]} style={{ height: 150 }}/>
            <br/>Artist Name: {this.state.hottestL.ArtistName[1]}
            <br/>Song Name: {this.state.hottestL.SongName[1]}
            <br/>Album image:  
            <br/><img src={this.state.hottestL.AlbumImage[1]} style={{ height: 150 }}/>
            <br/>Artist Name: {this.state.hottestL.ArtistName[2]}
            <br/>Song Name: {this.state.hottestL.SongName[2]}
            <br/>Album image:  
            <br/><img src={this.state.hottestL.AlbumImage[2]} style={{ height: 150 }}/>
            <br/>Artist Name: {this.state.hottestL.ArtistName[3]}
            <br/>Song Name: {this.state.hottestL.SongName[3]}
            <br/>Album image:  
            <br/><img src={this.state.hottestL.AlbumImage[3]} style={{ height: 150 }}/>
            <br/>Artist Name: {this.state.hottestL.ArtistName[4]}
            <br/>Song Name: {this.state.hottestL.SongName[4]}
            <br/>Album image:  
            <br/><img src={this.state.hottestL.AlbumImage[4]} style={{ height: 150 }}/>
        </div>
        }
        </div>
        }
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}


export default connect(mapStateToProps)(Discover)