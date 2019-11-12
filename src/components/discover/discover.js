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



class Discover extends Component {
  constructor(){
     
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      //console.log(token);
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      access_token :'',
      refresh_token :'',
      searchvalue : {searchartistvalue :'', searchalbumvalue : ''},
      searchloading : false,
      message:'',
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
  
      recentList: { name: ['','','','',''],
                    albumArtN: ['','','','',''],
                    albumArtL: ['','','','','']},
      mostRecommendedL: { songname: ['recommendedtest','','','',''],
                          albumArtN: ['','','','',''],
                          albumArtL: ['','','','','']},
      searchingArtistL: { ArtistName: ['1','2','3','',''],
                          ArtistImage: ['6','7','8','','']}
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
    this.setState({searchvalue:{searchartistvalue : query, searchalbumvalue :''},
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

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              name: response.item.name, 
              albumArt: response.item.album.images[0].url
            }
        });
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


  getSearchArtist()
  {
  	//var Q = this.state.searchvalue.searchartistvalue;
    //Q = Q + '-H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer BQCfOZVYMAZr54h6uJ6wEtfsYAPbgCKNLrYGI6chKSr3stYSCAwnt50Hd2i-SkTPnCEdxm8h-ngTCrrp47iz8_cLiClg2lTLkeLYrAo1BadxjpIaWidSag0lGYGYmV1thIGQDxlpMCaJ92Ia0epQnLpQ9Bk9hwPsHfPGh0UwovLVO6g'
    //window.alert("the searching artist value in the function is " + Q);
    //this.getrefreshtoken();
    var searchartisturl = 'https://api.spotify.com/v1/search?q=' + this.state.searchvalue.searchartistvalue + '&type=artist&limit=5';
    //var passlist = searchingArtistL;
    //window.alert(this.state.searchvalue.searchartistvalue)
    var options3 = {
          url: searchartisturl,
          headers: { 'Authorization': 'Bearer ' + 'BQDDLNjheLhY_YNJarl3jveWeBt9cXY3WXtDHw1H7Ccb-oJqo0l24zGQ01a4b5A29nXwpyoeGeWPtq_wCyYz9YQxSZ112C2m67Eqf9m0-CXH07IT3xRzNvMzz1rns0rHlFDoLAtfBdNLNmK2XC7vIiwX-La-yqGs8B2MWr-GhCT34vA' },
          json: true
    //limit 5
        
        };

    //window.alert(this.token);
        // use the access token to access the most recommended song by artistID
        var feed = this;
        request.get(options3, function(error, response, body) {
          //console.log(body);
          window.alert("inside request");
          window.alert("body is there " +body);
          window.alert("artists is there" + body.artists);
          window.alert(body.artists.items[0].name);
          feed.changeArtist(body);
           
          // searchingArtistL.ArtistName[0] = body.artists.items[0].name;
          // window.alert(searchingArtistL.ArtistName[0]);
          // searchingArtistL.ArtistImage[0] = body.artists.items[0].images[0].url;
          // searchingArtistL.ArtistName[1] = body.artists.items[1].name;
          // searchingArtistL.ArtistImage[1] = body.artists.items[1].images[0].url;
          // searchingArtistL.ArtistName[2] = body.artists.items[2].name;
          // searchingArtistL.ArtistImage[2] = body.artists.items[2].images[0].url;
          // searchingArtistL.ArtistName[3] = body.artists.items[3].name;
          // searchingArtistL.ArtistImage[3] = body.artists.items[3].images[0].url;
          // searchingArtistL.ArtistName[4] = body.artists.items[4].name;
          // searchingArtistL.ArtistImage[4] = body.artists.items[4].images[0].url;
/*
          this.setState({
          searchingArtistL: { 
              ArtistName: [body.artists.items[0].name,
                            body.artists.items[1].name,
                            body.artists.items[2].name,
                            body.artists.items[3].name,
                            body.artists.items[4].name ],
              ArtistImage: [body.artists.items[0].images[0].url,
                             body.artists.items[1].images[0].url,
                             body.artists.items[2].images[0].url,
                             body.artists.items[3].images[0].url,
                             body.artists.items[4].images[0].url]
            }
        });*/

        });
        // window.alert(this.searchingArtistL.ArtistName[0]);
  };

  getSearchTrack()
  {
    //var Q = this.state.searchvalue.searchartistvalue;
    //Q = Q + '-H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer BQCfOZVYMAZr54h6uJ6wEtfsYAPbgCKNLrYGI6chKSr3stYSCAwnt50Hd2i-SkTPnCEdxm8h-ngTCrrp47iz8_cLiClg2lTLkeLYrAo1BadxjpIaWidSag0lGYGYmV1thIGQDxlpMCaJ92Ia0epQnLpQ9Bk9hwPsHfPGh0UwovLVO6g'
    //window.alert("the searching artist value in the function is " + Q);
    //this.getrefreshtoken();
    var searchtrackurl = 'https://api.spotify.com/v1/search?q=' + this.state.searchvalue.searchartistvalue + '&type=track&market=US&limit=5';
    //var passlist = searchingArtistL;
    //window.alert(this.state.searchvalue.searchartistvalue)
    var options4 = {
          url: searchtrackurl,
          headers: { 'Authorization': 'Bearer '},
          json: true
        
        };

    //window.alert(this.token);
        // use the access token to access the most recommended song by artistID
        var feed = this;
        request.get(options4, function(error, response, body) {
          //console.log(body);
          window.alert("inside request");
          window.alert("body is there " +body);
          window.alert("artists is there" + body.artists);
          window.alert(body.artists.items[0].name);
          //feed.changeArtist(body);
           

        });
        // window.alert(this.searchingArtistL.ArtistName[0]);
  };

  getSearchAlbum()
  {
    //var Q = this.state.searchvalue.searchartistvalue;
    //Q = Q + '-H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer BQCfOZVYMAZr54h6uJ6wEtfsYAPbgCKNLrYGI6chKSr3stYSCAwnt50Hd2i-SkTPnCEdxm8h-ngTCrrp47iz8_cLiClg2lTLkeLYrAo1BadxjpIaWidSag0lGYGYmV1thIGQDxlpMCaJ92Ia0epQnLpQ9Bk9hwPsHfPGh0UwovLVO6g'
    //window.alert("the searching artist value in the function is " + Q);
    //this.getrefreshtoken();
    var searchalbumurl = 'https://api.spotify.com/v1/search?q=' + this.state.searchvalue.searchartistvalue + '&type=album&market=US&limit=5';
    //var passlist = searchingArtistL;
    //window.alert(this.state.searchvalue.searchartistvalue)
    var options5 = {
          url: searchalbumurl,
          headers: { 'Authorization': 'Bearer '},
          json: true
        
        };

    //window.alert(this.token);
        // use the access token to access the most recommended song by artistID
        var feed = this;
        request.get(options5, function(error, response, body) {
          //console.log(body);
          window.alert("inside request");
          window.alert("body is there " +body);
          window.alert("artists is there" + body.artists);
          window.alert(body.artists.items[0].name);
          //feed.changeArtist(body);
           

        });
        // window.alert(this.searchingArtistL.ArtistName[0]);
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
          <button onClick={() => this.getSearchArtist()}>
            Search Artists
          </button>
        }
        { 
          <button onClick={() => this.getSearchTrack()}>
            Search Tracks
          </button>
        }
        { 
          <button onClick={() => this.getSearchAlbum()}>
            Search Albums
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
        <div> The searched artist </div>
        <div>
             Artist: {this.state.searchingArtistL.ArtistName[0]}
        <br/>Artist image:  
        <br/><img src={this.state.searchingArtistL.ArtistImage[0]} style={{ height: 150 }}/>
        </div> 
        <div>
             Artist: {this.state.searchingArtistL.ArtistName[1]}
        <br/>Artist image:  
        <br/><img src={this.state.searchingArtistL.ArtistImage[1]} style={{ height: 150 }}/>
        </div> 
        <div>
             Artist: {this.state.searchingArtistL.ArtistName[2]}
        <br/>Artist image:  
        <br/><img src={this.state.searchingArtistL.ArtistImage[2]} style={{ height: 150 }}/>
        </div> 
        <div>
             Artist: {this.state.searchingArtistL.ArtistName[3]}
        <br/>Artist image:  
        <br/><img src={this.state.searchingArtistL.ArtistImage[3]} style={{ height: 150 }}/>
        </div> 
        <div>
             Artist: {this.state.searchingArtistL.ArtistName[4]}
        <br/>Artist image:  
        <br/><img src={this.state.searchingArtistL.ArtistImage[4]} style={{ height: 150 }}/>
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