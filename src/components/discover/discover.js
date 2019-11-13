import React, { Component } from 'react'

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
      nowPlaying: { name: 'Not Checked', albumArt: '' },
  
      recentList: { name: ['recenttest','','','',''],
                    albumArtN: ['','','','',''],
                    albumArtL: ['','','','','']},
      mostRecommendedL: { songname: ['recommendedtest','','','',''],
                          albumArtN: ['','','','',''],
                          albumArtL: ['','','','','']},
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
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        if (response == '' || response.item.name == null) {
          this.setState({
          nowPlaying: { 
              name: "Not playing or advertisement", 
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
  
  getrefreshtoken(){
    var returnaccesstoken;
    var returnrefreshtoken;
    var stateKey = 'spotify_auth_state';
    var express = require('express');
    var app = express();
    app.get('/callback', function(req, res) {
          var code = req.query.code || null;
          var state = req.query.state || null;
          var storedState = req.cookies ? req.cookies[stateKey] : null;

          if (state === null || state !== storedState) {
            res.redirect('/#' +
              querystring.stringify({
                error: 'state_mismatch'
              }));
          } else {
            res.clearCookie(stateKey);
            var authOptions = {
              url: 'https://accounts.spotify.com/api/token',
              form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
              },
              headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
              },
              json: true
            };

            request.post(authOptions, function(error, response, body) {
              if (!error && response.statusCode === 200) {

                var access_token = body.access_token,
                    refresh_token = body.refresh_token;
                    returnaccesstoken = access_token;
                    returnrefreshtoken = refresh_token;
                // res.redirect('http://localhost:3000/profile/#' +
                // querystring.stringify({
                //   access_token: access_token,
                //   refresh_token: refresh_token
                // }));
              }
        //       else {
        //         res.redirect('/#' +
        //           querystring.stringify({
        //             error: 'invalid_token'
        //     }));
        // }
            });
        }
    })
    this.setState({access_token:returnaccesstoken, refresh_token:returnrefreshtoken});
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






  getSearchArtist()
  {
    this.getaccesstoken();
    if (this.state.searchvalue.searchinput == '') {
      return;
    }
    var searchartisturl = 'https://api.spotify.com/v1/search?q=' + this.state.searchvalue.searchinput + '&type=artist&limit=5';
    //var passlist = searchingArtistL;
    //window.alert(this.state.searchvalue.searchartistvalue)
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

  
  printsearch(){
    window.alert(this.state.searchvalue.searchartistvalue);
  }

  getMostReommended(){
  //window.alert(spotifyApi.getRecommendations()); 

    spotifyApi.getRecommendations().then((response)=>{
      window.alert(response);
      window.alert("inside then")
      this.setState({
        mostRecommendedL:{
          songname: [response.tracks[0].name,
           response.tracks[1].name,        
           response.tracks[2].name,
           response.tracks[3].name,   
                       response.tracks[4].name],
        //it may need to change for mutiple artists
          albumArtN:[
            response.tracks[0].album.artists[0].name,
            response.tracks[1].album.artists[0].name,        
            response.tracks[2].album.artists[0].name,
            response.tracks[3].album.artists[0].name,   
                        response.tracks[4].album.artists[0].name],
          albumArtL: [response.tracks[0].images[0].url,
            response.tracks[1].images[0].url,
            response.tracks[2].images[0].url,
            response.tracks[3].images[0].url,
            response.tracks[4].images[0].url
               ]
        
        }
      });
      window.alert('set state');
    })
    window.alert(this.state.mostRecommendedL.songname[0]);
    window.alert(this.state.mostRecommendedL.albumArtN[0]);
    window.alert(this.state.mostRecommendedL.albumArtL[0]);

  }


  render() {
  	const {searchvalue} = this.state;
    return (
      <div className="container">
        <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
        </div>
        
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        
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
            <button onClick={() =>this.printsearch()}> 
      		   print 
  		      </button>
        }
        {
            <button onClick={() =>this.getaccesstoken()}> 
             getaccesstoken 
            </button>
        }
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
          <div> the search artist </div>
        <div>
             Artist Name: {this.state.searchingArtistL.ArtistName[0]}
        <br/>Artist image:  
        <br/><img src={this.state.searchingArtistL.ArtistImage[0]} style={{ height: 150 }}/>
        </div> 
        <div>
             Artist Name: {this.state.searchingArtistL.ArtistName[1]}
        <br/>Artist image:  
        <br/><img src={this.state.searchingArtistL.ArtistImage[1]} style={{ height: 150 }}/>
        </div> 
        <div>
             Artist Name: {this.state.searchingArtistL.ArtistName[2]}
        <br/>Artist image:  
        <br/><img src={this.state.searchingArtistL.ArtistImage[2]} style={{ height: 150 }}/>
        </div> 
        <div>
             Artist Name: {this.state.searchingArtistL.ArtistName[3]}
        <br/>Artist image:  
        <br/><img src={this.state.searchingArtistL.ArtistImage[3]} style={{ height: 150 }}/>
        </div> 
        <div>
             Artist Name: {this.state.searchingArtistL.ArtistName[4]}
        <br/>Artist image:  
        <br/><img src={this.state.searchingArtistL.ArtistImage[4]} style={{ height: 150 }}/>
        </div>




        <div> the search album </div>
        <div>
             Artist Name: {this.state.searchingAlbumL.ArtistName[0]}
        <br/>Album Name: {this.state.searchingAlbumL.AlbumName[0]}
        <br/>Album image:  
        <br/><img src={this.state.searchingAlbumL.AlbumImage[0]} style={{ height: 150 }}/>
        </div> 
        <div>
             Artist Name: {this.state.searchingAlbumL.ArtistName[1]}
        <br/>Album Name: {this.state.searchingAlbumL.AlbumName[1]}
        <br/>Album image:  
        <br/><img src={this.state.searchingAlbumL.AlbumImage[1]} style={{ height: 150 }}/>
        </div> 
        <div>
             Artist Name: {this.state.searchingAlbumL.ArtistName[2]}
        <br/>Album Name: {this.state.searchingAlbumL.AlbumName[2]}
        <br/>Album image:  
        <br/><img src={this.state.searchingAlbumL.AlbumImage[2]} style={{ height: 150 }}/>
        </div> 
        <div>
             Artist Name: {this.state.searchingAlbumL.ArtistName[3]}
        <br/>Album Name: {this.state.searchingAlbumL.AlbumName[3]}
        <br/>Album image:  
        <br/><img src={this.state.searchingAlbumL.AlbumImage[3]} style={{ height: 150 }}/>
        </div> 
        <div>
             Artist Name: {this.state.searchingAlbumL.ArtistName[4]}
        <br/>Album Name: {this.state.searchingAlbumL.AlbumName[4]}
        <br/>Album image:  
        <br/><img src={this.state.searchingAlbumL.AlbumImage[4]} style={{ height: 150 }}/>
        </div> 



        <div> the search track </div>
        <div>
             Artist Name: {this.state.searchingTrackL.ArtistName[0]}
        <br/>Song Name: {this.state.searchingTrackL.SongName[0]}
        <br/>Album image:  
        <br/><img src={this.state.searchingTrackL.AlbumImage[0]} style={{ height: 150 }}/>
        </div> 
        <div>
             Artist Name: {this.state.searchingTrackL.ArtistName[1]}
        <br/>Song Name: {this.state.searchingTrackL.SongName[1]}
        <br/>Album image:  
        <br/><img src={this.state.searchingTrackL.AlbumImage[1]} style={{ height: 150 }}/>
        </div> 
        <div>
             Artist Name: {this.state.searchingTrackL.ArtistName[2]}
        <br/>Song Name: {this.state.searchingTrackL.SongName[2]}
        <br/>Album image:  
        <br/><img src={this.state.searchingTrackL.AlbumImage[2]} style={{ height: 150 }}/>
        </div> 
                
         
        <div>
           Most Recommended Song: 
        </div>
        <div>
                 { this.state.mostRecommendedL.songname[0] }
           <br/> {this.state.mostRecommendedL.albumArtN[0]}
              </div>
        <div>
                <img src={this.state.mostRecommendedL.albumArtL[0]} style={{ height: 150 }}/>
              </div>
        <div>
                 { this.state.mostRecommendedL.songname[1] }
           <br/> {this.state.mostRecommendedL.albumArtN[1]}
              </div>
        <div>
                <img src={this.state.mostRecommendedL.albumArtL[1]} style={{ height: 150 }}/>
              </div><div>
                 { this.state.mostRecommendedL.songname[2] }
           <br/> {this.state.mostRecommendedL.albumArtN[2]}
              </div>
        <div>
                <img src={this.state.mostRecommendedL.albumArtL[2]} style={{ height: 150 }}/>
              </div><div>
                 { this.state.mostRecommendedL.songname[3] }
           <br/> {this.state.mostRecommendedL.albumArtN[3]}
              </div>
        <div>
                <img src={this.state.mostRecommendedL.albumArtL[3]} style={{ height: 150 }}/>
              </div>
        <div>
                 { this.state.mostRecommendedL.songname[4] }
           <br/> {this.state.mostRecommendedL.albumArtN[4]}
              </div>
        <div>
                <img src={this.state.mostRecommendedL.albumArtL[4]} style={{ height: 150 }}/>
              </div>


        <div>
           Recently Played Song 
        </div>
        <div>
                 { this.state.recentList.name[0] }
           <br/> {this.state.recentList.albumArtN[0]}
              
           <br/><img src={this.state.recentList.albumArtL[0]} style={{ height: 150 }}/>
              
           <br/><br/>     { this.state.recentList.name[1] }
           <br/>{this.state.recentList.albumArtN[1]}
              
           <br/>     <img src={this.state.recentList.albumArtL[1]} style={{ height: 150 }}/>
              
           <br/><br/>     { this.state.recentList.name[2] }
           <br/>{this.state.recentList.albumArtN[2]}
              
           <br/>     <img src={this.state.recentList.albumArtL[2]} style={{ height: 150 }}/>
              
           <br/><br/>     { this.state.recentList.name[3] }
           <br/>{this.state.recentList.albumArtN[3]}
              
           <br/>     <img src={this.state.recentList.albumArtL[3]} style={{ height: 150 }}/>
              
           <br/><br/>     { this.state.recentList.name[4] }
           <br/>{this.state.recentList.albumArtN[4]}
              
           <br/>     <img src={this.state.recentList.albumArtL[4]} style={{ height: 150 }}/>
        </div>

      </div>
    );
  }
}

export default Discover