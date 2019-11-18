import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import './Search.css';

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

export class Discover extends Component {
  /**
   * @method constructor
   * @description Represents the discover page
   * @returns {null}
  */
  constructor(){
     
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    const getToken = spotifyApi.getAccessToken();
    if (token) {
  /**
   * @method setAccessToken
   * @description passing the access token for setting the client credential in order to use spotify authorization service
   * @param {string} token - The access_token get from spotify server after login in spotify or 
   * @returns {null}  
  */
      spotifyApi.setAccessToken(token);
    }
    else if(getToken){
    	spotifyApi.setAccessToken(getToken);
    }

    this.state = {
      access_token :'',
      refresh_token :'',
      manual_token: spotifyApi.getAccessToken(),
      showonce : true,
      searchvalue : {searchinput :''},
      searchloading : false,
      message:'',
      loggedIn: (token || spotifyApi.getAccessToken()) ? true : false,
      loading : false,
      checkclicked: {ClickStartSearch: false, ClickSearchArtist: false, ClickSearchAlbum: false, ClickSearchTrack: false,
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
    // window.alert("constructor is called");
    // window.alert("token is " + this.token);
    // window.alert("getToken is " + this.getToken);
  }

  /**
   * @method handleChange
   * @description detecting the type or deley event, then update the input value to searchingvalue in discover class
   * @param {event} - the change while the user type or delete characters in the searching input bar
   * @returns {null}
  */
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

  /**
   * @method getHashParams
   * @description obtain the parameters from the hash of URL from spotify 
   * @returns {string} hashParams - the  query string that spotify sends back when log in
  */
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

  /**
   * @method getaccesstoken
   * @description by using the getAccessToken() function from spotifyAPI, getting a new access_token from spotify server. Then, update the token in discover class
   * @returns {null} 
  */
  getaccesstoken()
  {
    tempaccess = spotifyApi.getAccessToken();
    //window.alert(tempaccess);
  }

  /**
   * @method getNowPlaying
   * @description by using the response from getMyCurrentPlaybackState() function from spotifyAPI, getting a object from spotify server.
    Then, update the nowPlaying list's SongName and AlbumImage with the object's element
   * @returns {null}
  */
    /**
   * @method getMyCurrentPlaybackState
   * @description get information about the user's current playback state, including track, track progress and active device
   * @returns {response} - a object of user's current playback state or object of error message 
  */
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

  /**
   * @method changeRecent
   * @description updating the recentList's ArtistName, SongName, and AlbumImage in discover class with the recently played tracks object 
   * @param {object} bodydata - the object tracks from the current user's recently played tracks
   * @returns {null}
  */
  getRecentList(){
    //this.state.checking = this.state.chekcing + 1;
    //window.alert(this.state.checking);
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
  
  /**
   * @method changeArtist
   * @description updating the searchingArtistL's ArtistName, and ArtistImage in discover class with the artists object from spotify catalog
   * @param {object} bodydata - the object of Artists list 
   * @returns {null}
  */
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

  /**
   * @method changeAlbum
   * @description updating the searchingAlbumL's ArtistName, AlbumName, and AlbumImage in discover class with the albums object from the Spotify catalog
   * @param {object} bodydata - the object of albums list
   * @returns {null}
  */
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

  /**
   * @method changeTrack
   * @description updating the searchingTrackL's ArtistName, SongName, and AlbumImage in discover class with the  Tracks object from the Spotify catalog
   * @param {object} bodydata - the object of tracks list
   * @returns {null}
  */
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

  /**
   * @method changeRecommandation
   * @description updating the mostRecommendedL's ArtistName, SongName, and AlbumImage in discover class with the tracks object from the Spotify catalog
   * @param {object} bodydata - the object of most recommended tracks list base on user's database
   * @returns {null}
  */
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

  /**
   * @method changeHottest
   * @description updating the hottestL's ArtistName, SongName, and AlbumImage in discover class with the tracks object from the Spotify catalog
   * @param {object} bodydata - the object of most hottest tracks list base on the top 50 global playlist from spotify database
   * @returns {null}
  */
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

  /**
   *@method requestget 
   *@description  using the access_token and differecnt endpoint to access the corresponding spotify API  by HTTP request method GET 
   *@param {object} Endpoint - including the endpoint URL and the access_token with json file
   *@param {object} function - a callback function  
   *@param {object} function.error - the error log object that record the error message
   *@param {object} function.response - the object of spotify server response
   *@param {object} function.body - the corresponding return object from spotifyAPI
   *@returns {object} replied message
  */
  /**
   * @method getSearchArtist
   * @description updating searchingartistL by calling changeArtist() and providing user input and the endpointurl for using HTTP request method GET to get the artists object from spotify catalog callback
   * @returns {null}
  */
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

  /**
   * @method getSearchAlbum
   * @description updating searchingAlbumL by calling changeAlbum() and providing user input and the endpointurl for using HTTP request method GET to get the Album object from spotify catalog callback
   * @returns {null}
  */
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

  /**
   * @method getSearchTrack
   * @description updating searchingTrackL by calling changeTrack() and providing user input and the endpointurl for using HTTP request method GET to get the Tracks object from spotify catalog callback
   * @returns {null}
  */
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

  /**
   * @method getHottestSong
   * @description updating hottestL by calling changeHottest() and the endpointurl of globaltop50 playlist ID for using HTTP request method GET to get the Tracks object from spotify catalog callback
   * @returns {null}
  */
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
  /**
   * @method getMostReommended
   * @description updating mostRecommendedL by calling changeRecommandation() and the endpointurl with the topartists ID from two HTTP requests to get the Tracks object from spotify catalog callback
   * @returns {null}
  */
  getMostReommended()
  {
  	this.state.loading = true;
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
    this.state.loading = false;
  }
  getStartSearch() 
  { 
  	if (this.state.loggedIn == false) {
  	  window.alert("Cannot search, please login with Spotify");
  	  return;
  	}
    if (this.state.checkclicked.ClickStartSearch == true) 
    {
      this.setState({checkclicked: {ClickStartSearch : false}});
    }
    else
    {
      this.setState({checkclicked: {ClickStartSearch : true}});
    }

  }
  authshow()
  {
    //window.alert("called");
    if (this.state.loggedIn == true && this.state.showonce && !this.state.loading)
    // if (this.state.loggedIn == true && !this.state.loading) 
    {
    //this.state.checkclicked.ClickStartSearch = true;
      // this.getaccesstoken();

      this.getMostReommended();
      this.getHottestSong();
      this.getRecentList();
      this.state.showonce = false;

      // if accesstoken not in url, append it 
      this.appendToUrl();

    }
    // else if (!this.state.loggedIn && this.state.showonce){
    // 	window.alert("Not logged with spotify, please go to profile page and login!");
    	// window.alert("Recent list");
    	// if(this.recentList){
    	// 	window.alert(this.recentList.name);
    	// }
    	// else{
    	// 	window.alert("not set");
    	// }
    // }
    // this.state.showonce = true;
  }
  // debugclick()
  // {
  // 	window.alert();
  // }
  
  appendToUrl()
  {
  	var url = window.location.href; 
  	// window.alert("the url is " + url);   
	if (url.indexOf('#') > -1){
	   
	}else{
	   url += '#' +'access_token=' +spotifyApi.getAccessToken();
	   //url += '&' +'refresh_token=' + spotifyApi.getRefreshToken();
	   // window.alert("the new url is " + url);
	}
	// window.location.href = url;
  }



  render() {
  	const {searchvalue} = this.state;
    return (
      <div className="container">
        <br/>
        <button className="waves-effect waves-yellow btn" id="discover_search" onClick={() => this.getStartSearch()}>
          Start searching
        </button>
        <div>
        { this.state.checkclicked.ClickStartSearch && 
        <label className="searchartists-label" htmlFor = "searchartists_input">
              <p>Fill your search content below:</p>
              <input type="text"
                   name ="searchvalue" 
                   value={searchvalue.searchartistvalue}
                   id= "searchartists_input" 
                   placeholder="Search..."
                   onChange={this.handleChange}
               />
               <i className="fa fa-search search-icon" aria-hidden="true"/>
        </label>
        }
        </div>
        {this.state.checkclicked.ClickStartSearch && 
        <div className="searchbuttons">
        { 
          <button className="waves-effect waves-yellow btn" id="artist_search" onClick={() => this.getSearchArtist()}>
            SearchByArtist
          </button>
        }
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        { 
          <button className="waves-effect waves-yellow btn" id="album_search" onClick={() => this.getSearchAlbum()}>
            SearchByAlbum
          </button>
        }
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        { 
          <button className="waves-effect waves-yellow btn" id="track_search" onClick={() => this.getSearchTrack()}>
            SearchByTrack
          </button>
        }
        </div>
        }
        <br/>
        {this.state.checkclicked.ClickStartSearch && <div className="checkbuttons">
        { 
          <button className="waves-effect waves-yellow btn" id="check_recently_played"onClick={() => this.getRecentList()}>
            Recently played
          </button>
        }
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
  		  { 
          <button className="waves-effect waves-yellow btn" id="check_recommended" onClick={() => this.getMostReommended()}>
            Recommended Songs
          </button>
        }
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        {
          <button className="waves-effect waves-yellow btn" id="check_hottest" onClick={() => this.getHottestSong()}>
            Hottest Songs
          </button>
            
        }
        </div>
        }
        {
        <script>
          this.showonce = true;
          window.onload = function() {
             this.authshow()
        }
        </script>
        }
        
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
