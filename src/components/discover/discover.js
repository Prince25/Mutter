import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateToken } from '../../store/actions/authActions'
import './Search.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();
var request = require('request');
// const AppConfig = require('../config/app');
// const AuthConfig = require('../config/auth');

var tempaccess=''

/* 
COMMENTS FROM EGE FOR RESTRUCTURING:
- The main problem here is that we are not using props in React. Through props, we can have subcomponents,
then pass in information for that subcomponent through the main component.
1. Generally react files have the .jsx extension, instead of .js
2. Information about props: https://reactjs.org/docs/components-and-props.html
3. Here is an example implementation of a search bar: https://www.youtube.com/watch?v=OlVkYnVXPl0
4. Component structure could be something similar to this
Main Component: Discover.jsx
Subcomponents: NowPlaying.jsx, RecentlyPlayed.jsx, MostRecommended.jsx, Hottest.jsx

Now, the main Discover.jsx component can load the list, but it doesn't have to display the lists, hence, you can pass
the lists as props to the other components, and they can display the lists. Try breaking down now playing first,
as that seems to be the simplest component

*/

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
      url: null,
      loggedIn: (token || spotifyApi.getAccessToken()) ? true : false,
      loading : false,
      PostSongName : ' you',
      PostUrl: 'https://www.google.com/',
      SongSelectOption : "0",
      TypeSelectOption : "R",
      SearchSelectOption: "Artist",
      NoImageUrl: "https://firebasestorage.googleapis.com/v0/b/mutter-ucla.appspot.com/o/discover%2FUnknown.png?alt=media&token=c8c29a7f-03db-432d-b87e-35f5333e5f99",
      checkclicked: {ClickStartSearch: false, ClickSearchArtist: false, ClickSearchAlbum: false, ClickSearchTrack: false,
                      ClickRecommended: false, ClickHottest: false, ClickRecent: false},
      SearchResultNumber: {RecentNum : 0 ,RecommendedNum : 0 ,HottestNum : 0,
                           SearchArtNum : 0,SearchTraNum : 0,SearchAlbNum : 0},
      ArtistReturnElement:[],
      ArtistReturnItem : [],
  
      recentList: { SongName: ['','','','',''],
                    SongLink: ['','','','',''],
                    ArtistName: ['','','','',''],
                    ArtistLink: ['','','','',''],
                    AlbumLink: ['','','','',''],
                    AlbumImage: ['','','','','']},
      mostRecommendedL: { SongName: ['','','','',''],
                          SongLink: ['','','','',''],
                          ArtistName: ['','','','',''],
                          ArtistLink: ['','','','',''],
                          AlbumLink: ['','','','',''],
                          AlbumImage: ['','','','','']},
      hottestL: { SongName: ['','','','',''],
                          SongLink: ['','','','',''],
                          ArtistName: ['','','','',''],
                          ArtistLink: ['','','','',''],
                          AlbumImage: ['','','','',''],
                          AlbumLink: ['','','','','']},
      searchingArtistL: { ArtistName: ['','','','',''],
                          ArtistImage: ['','','','',''],
                          ArtistLink: ['','','','','']},
      searchingAlbumL:  { ArtistName: ['','','','',''],
                          AlbumName: ['','','','',''],
                          AlbumImage:['','','','',''],
                          ArtistLink:['','','','',''],
                          AlbumLink:['','','','','']},
      searchingTrackL:  { SongName: ['','','','',''],
                          ArtistName: ['','','','',''],
                          AlbumImage:['','','','',''],
                          SongLink: ['','','','',''],
                          ArtistLink:['','','','',''],
                          AlbumLink:['','','','','']}
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTypeOptionChange = this.handleTypeOptionChange.bind(this);
    this.handleSongOptionChange = this.handleSongOptionChange.bind(this);
    this.handleSearchOptionChangel = this.handleSearchOptionChangel.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  /**
   * @method handleChange
   * @description detecting the type or deley event, then update the input value to searchingvalue in discover class
   * @param {event} - the change while the user type or delete characters in the searching input bar
   * @returns {null}
  */
  handleChange(event) {
    var changeFlag = false;
    var searched = false;
    while (!changeFlag) {
      const query = event.target.value;
      if(query){
        this.state.searchvalue.searchinput = query;
        changeFlag = true;
      }
      else if (query === '') {
        this.state.searchvalue.searchinput = '';
        changeFlag = true;
      }
    }

    while(!searched) {
      if (changeFlag) {
        if(this.state.SearchSelectOption === "Artist")
        {this.getSearchArtist();
         this.setState({ searchingAlbumL:  { ArtistName: ['','','','',''],
                                  AlbumName: ['','','','',''],
                                  AlbumImage:['','','','',''],
                                  ArtistLink:['','','','',''],
                                  AlbumLink:['','','','','']}});
        this.setState({searchingTrackL:  { SongName: ['','','','',''],
                                  ArtistName: ['','','','',''],
                                  AlbumImage:['','','','',''],
                                  SongLink: ['','','','',''],
                                  ArtistLink:['','','','',''],
        AlbumLink:['','','','','']}});
        }
        else if(this.state.SearchSelectOption === "Album")
        {
          //window.alert("inside the album");
          this.getSearchAlbum();
          this.setState({searchingArtistL : { ArtistName: ['','','','',''],
                                   ArtistImage: ['','','','',''],
                                   ArtistLink: ['','','','','']}});
          this.setState({searchingTrackL:  { SongName: ['','','','',''],
                                    ArtistName: ['','','','',''],
                                    AlbumImage:['','','','',''],
                                    SongLink: ['','','','',''],
                                    ArtistLink:['','','','',''],
          AlbumLink:['','','','','']}});
        }
        else if(this.state.SearchSelectOption === "Track")
        {
          //window.alert("inside the track");
          this.getSearchTrack();
          this.setState({searchingArtistL : { ArtistName: ['','','','',''],
                                  ArtistImage: ['','','','',''],
                                  ArtistLink: ['','','','','']}});
                                  
           this.setState({ searchingAlbumL:  { ArtistName: ['','','','',''],
                                    AlbumName: ['','','','',''],
                                    AlbumImage:['','','','',''],
                                    ArtistLink:['','','','',''],
                                    AlbumLink:['','','','','']}});
        }
        searched = true;
      }
    }
    //window.alert(this.state.searchingArtistL.ArtistName[0]);
  }

  handleSubmit(event) {
    //this.setState({searchvalue: event.target.value});
    window.alert('A name was submitted: ' + this.state.searchvalue);
    event.preventDefault();
  }

  handleTypeOptionChange(event) {
    //const option = event.target.value;
    this.setState({
      TypeSelectOption: event.target.value
    });
  }

  handleSearchOptionChangel(event){
    //const option = event.target.value;
    this.state.SearchSelectOption = event.target.value;
    if(this.state.SearchSelectOption === "Artist")
    {
      this.getSearchArtist();
      this.setState({ searchingAlbumL:  { ArtistName: ['','','','',''],
                                AlbumName: ['','','','',''],
                                AlbumImage:['','','','',''],
                                ArtistLink:['','','','',''],
                                AlbumLink:['','','','','']}});
      this.setState({searchingTrackL:  { SongName: ['','','','',''],
                                ArtistName: ['','','','',''],
                                AlbumImage:['','','','',''],
                                SongLink: ['','','','',''],
                                ArtistLink:['','','','',''],
      AlbumLink:['','','','','']}});
    }
    else if(this.state.SearchSelectOption === "Album")
    {
      //window.alert("inside the album");
      this.getSearchAlbum();
      this.setState({searchingArtistL : { ArtistName: ['','','','',''],
                               ArtistImage: ['','','','',''],
                               ArtistLink: ['','','','','']}});
      this.setState({searchingTrackL:  { SongName: ['','','','',''],
                                ArtistName: ['','','','',''],
                                AlbumImage:['','','','',''],
                                SongLink: ['','','','',''],
                                ArtistLink:['','','','',''],
      AlbumLink:['','','','','']}});
    }
    else if(this.state.SearchSelectOption === "Track")
    {
      //window.alert("inside the track");
      this.getSearchTrack();
      this.setState({searchingArtistL : { ArtistName: ['','','','',''],
                              ArtistImage: ['','','','',''],
                              ArtistLink: ['','','','','']}});
                              
       this.setState({ searchingAlbumL:  { ArtistName: ['','','','',''],
                                AlbumName: ['','','','',''],
                                AlbumImage:['','','','',''],
                                ArtistLink:['','','','',''],
                                AlbumLink:['','','','','']}});
    }
  }

  handleSongOptionChange(event) {
    //const option = event.target.value;
    this.setState({
      SongSelectOption: event.target.value
    });
  }

  handleFormSubmit(formSubmitEvent)
  {
    formSubmitEvent.preventDefault();
    //window.alert("hello");
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
      if (response.next == null) {
        this.state.checkclicked.ClickRecent = false;
        return;
      }
      this.setState({
        recentList:{
          SongName: [response.items[0].track.name,
           response.items[1].track.name,           
           response.items[2].track.name,
           response.items[3].track.name,      
           response.items[4].track.name],
          SongLink: [response.items[0].track.external_urls.spotify,
           response.items[1].track.external_urls.spotify,           
           response.items[2].track.external_urls.spotify,
           response.items[3].track.external_urls.spotify,      
           response.items[4].track.external_urls.spotify],
          ArtistName:[
            response.items[0].track.artists[0].name,
            response.items[1].track.artists[0].name,
            response.items[2].track.artists[0].name,
            response.items[3].track.artists[0].name,
            response.items[4].track.artists[0].name
              ],
          ArtistLink:[
            response.items[0].track.artists[0].external_urls.spotify,
            response.items[1].track.artists[0].external_urls.spotify,
            response.items[2].track.artists[0].external_urls.spotify,
            response.items[3].track.artists[0].external_urls.spotify,
            response.items[4].track.artists[0].external_urls.spotify
              ],
          AlbumImage: [response.items[0].track.album.images[0].url,
            response.items[1].track.album.images[0].url,
            response.items[2].track.album.images[0].url,
            response.items[3].track.album.images[0].url,
            response.items[4].track.album.images[0].url
               ],
          AlbumLink: [response.items[0].track.album.external_urls.spotify,
            response.items[1].track.album.external_urls.spotify,
            response.items[2].track.album.external_urls.spotify,
            response.items[3].track.album.external_urls.spotify,
            response.items[4].track.album.external_urls.spotify
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
    if(bodydata.artists.total < 5){
      var templist = this.state.searchingArtistL;      
      var Num = bodydata.artists.total;
      this.setState({SearchResultNumber:{SearchArtNum : Num}});
      //window.alert("the search artist number is " + this.state.SearchResultNumber.SearchArtNum);
      for(var i = 0 ; i<Num ; i++)
      {
        templist.ArtistName[i] = bodydata.artists.items[i].name;
        if (bodydata.artists.items[i].images[0]) {
          templist.ArtistImage[i] = bodydata.artists.items[i].images[0].url;
        }
        else
        {
          templist.ArtistImage[i] = this.state.NoImageUrl;
        }
        templist.ArtistLink[i] = bodydata.artists.items[i].external_urls.spotify;
      }
      for(var i = Num; i < 5-Num + 1; i++)
      {
        templist.ArtistName[i] = "";
        templist.ArtistImage[i] = "";
        templist.ArtistLink[i] = "";
      }
      if (Num === 0) {
        this.state.checkclicked.ClickSearchArtist = false;
      }
      this.setState({ searchingArtistL: templist });
    }
    else
    {
      var templist = this.state.searchingArtistL;
      for(var i = 0; i < 5; i++)
      {
        templist.ArtistName[i] = bodydata.artists.items[i].name;
        if (bodydata.artists.items[i].images[0]) {
          templist.ArtistImage[i] = bodydata.artists.items[i].images[0].url;
        }
        else
        {
          templist.ArtistImage[i] = this.state.NoImageUrl;
        }
        templist.ArtistLink[i] = bodydata.artists.items[i].external_urls.spotify;
      }
      this.setState({SearchResultNumber:{SearchArtNum : 5}});
      this.setState({ searchingArtistL: templist });
    }
  }

  /**
   * @method changeAlbum
   * @description updating the searchingAlbumL's ArtistName, AlbumName, and AlbumImage in discover class with the albums object from the Spotify catalog
   * @param {object} bodydata - the object of albums list
   * @returns {null}
  */
  changeAlbum(bodydata)
  {
    if(bodydata.albums.total < 5){
      var templist = this.state.searchingAlbumL;      
      var Num = bodydata.albums.total;
      this.setState({SearchResultNumber:{SearchAlbNum : Num}});
      //window.alert("the search artist number is " + this.state.SearchResultNumber.SearchArtNum);
      for(var i = 0 ; i<Num ; i++)
      {
        templist.ArtistName[i] = bodydata.albums.items[i].artists[0].name;
        if (bodydata.albums.items[i].images[0]) {
          templist.AlbumImage[i] = bodydata.albums.items[i].images[0].url;
          templist.AlbumLink[i] = bodydata.albums.items[i].external_urls.spotify;
        }
        else
        {
          templist.AlbumImage[i] = this.state.NoImageUrl;
          templist.AlbumLink[i] = '';
        }
        templist.ArtistLink[i] = bodydata.albums.items[i].artists[0].external_urls.spotify;
        templist.AlbumName[i] = bodydata.albums.items[i].name;
      }
      for(var i = Num; i < 5-Num + 1; i++)
      {
        templist.ArtistName[i] = ""
        templist.AlbumImage[i] = ""
        templist.AlbumLink[i] = ""
        templist.ArtistLink[i] = ""
        templist.AlbumName[i] = ""
      }
      if (Num === 0) {
        this.state.checkclicked.ClickSearchAlbum = false;
      }
      this.setState({ searchingAlbumL: templist });
    }
    else
    {
      var templist = this.state.searchingAlbumL;
      for(var i = 0; i < 5; i++)
      {
         templist.ArtistName[i] = bodydata.albums.items[i].artists[0].name;
        if (bodydata.albums.items[i].images[0]) {
          templist.AlbumImage[i] = bodydata.albums.items[i].images[0].url;
          templist.AlbumLink[i] = bodydata.albums.items[i].external_urls.spotify;
        }
        else
        {
          templist.AlbumImage[i] = this.state.NoImageUrl;
          templist.AlbumLink[i] = '';
        }        
        templist.ArtistLink[i] = bodydata.albums.items[i].artists[0].external_urls.spotify;
        templist.AlbumName[i] = bodydata.albums.items[i].name;
      }
      this.setState({SearchResultNumber:{SearchAlbNum : 5}});
      this.setState({ searchingAlbumL: templist });
    }
  }

  /**
   * @method changeTrack
   * @description updating the searchingTrackL's ArtistName, SongName, and AlbumImage in discover class with the  Tracks object from the Spotify catalog
   * @param {object} bodydata - the object of tracks list
   * @returns {null}
  */
  changeTrack(bodydata)
  { 
    //window.alert("the track total is "+ bodydata.tracks.total);
    if(bodydata.tracks.total < 5){
      var templist = this.state.searchingTrackL;   
      var Num = bodydata.tracks.total;
      this.setState({SearchResultNumber:{SearchTraNum : Num}});
      //window.alert("the search artist number is " + this.state.SearchResultNumber.SearchArtNum);
      for(var i = 0 ; i<Num ; i++)
      {
        templist.ArtistName[i] = bodydata.tracks.items[i].artists[0].name;
        if (bodydata.tracks.items[i].album.images[0]) {
          templist.AlbumImage[i] = bodydata.tracks.items[i].album.images[0].url;
          templist.AlbumLink[i] = bodydata.tracks.items[i].album.external_urls.spotify;
        }
        else
        {
          templist.AlbumImage[i] = this.state.NoImageUrl;
          templist.AlbumLink[i] = '';
        }      
        templist.ArtistLink[i] = bodydata.tracks.items[i].artists[0].external_urls.spotify;
        templist.SongName[i] = bodydata.tracks.items[i].name;
        templist.SongLink[i] = bodydata.tracks.items[i].external_urls.spotify;
      }
      for(var i = Num; i < 5-Num + 1; i++)
      {
        templist.ArtistName[i] = ""; 
        templist.AlbumImage[i] = "";
        templist.AlbumLink[i] = "";
        templist.ArtistLink[i] = "";
        templist.SongName[i] = "";
        templist.SongLink[i] = "";
      }
      if (Num === 0) {
        this.state.checkclicked.ClickSearchTrack = false;
      }
      this.setState({ searchingTrackL: templist });
    }
    else
    {
      var templist = this.state.searchingTrackL;
      for(var i = 0; i < 5; i++)
      {
        templist.ArtistName[i] = bodydata.tracks.items[i].artists[0].name;
        if (bodydata.tracks.items[i].album.images[0]) {
          templist.AlbumImage[i] = bodydata.tracks.items[i].album.images[0].url;
          templist.AlbumLink[i] = bodydata.tracks.items[i].album.external_urls.spotify;
        }
        else
        {
          templist.AlbumImage[i] = this.state.NoImageUrl;
          templist.AlbumLink[i] = '';
        }        
        templist.ArtistLink[i] = bodydata.tracks.items[i].artists[0].external_urls.spotify;
        templist.SongName[i] = bodydata.tracks.items[i].name;
        templist.SongLink[i] = bodydata.tracks.items[i].external_urls.spotify;
      }
      this.setState({SearchResultNumber:{SearchTraNum : 5}});
      this.setState({ searchingTrackL: templist });
    }
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
          SongName: [bodydata.tracks[0].name,
           bodydata.tracks[1].name,        
           bodydata.tracks[2].name,
           bodydata.tracks[3].name,   
           bodydata.tracks[4].name],
          SongLink: [bodydata.tracks[0].external_urls.spotify,
           bodydata.tracks[1].external_urls.spotify,        
           bodydata.tracks[2].external_urls.spotify,
           bodydata.tracks[3].external_urls.spotify,   
           bodydata.tracks[4].external_urls.spotify],
          ArtistName:[
            bodydata.tracks[0].album.artists[0].name,
            bodydata.tracks[1].album.artists[0].name,        
            bodydata.tracks[2].album.artists[0].name,
            bodydata.tracks[3].album.artists[0].name,   
            bodydata.tracks[4].album.artists[0].name],
          ArtistLink:[
            bodydata.tracks[0].album.artists[0].external_urls.spotify,
            bodydata.tracks[1].album.artists[0].external_urls.spotify,        
            bodydata.tracks[2].album.artists[0].external_urls.spotify,
            bodydata.tracks[3].album.artists[0].external_urls.spotify,   
            bodydata.tracks[4].album.artists[0].external_urls.spotify],
          AlbumImage: [bodydata.tracks[0].album.images[0].url,
            bodydata.tracks[1].album.images[0].url,
            bodydata.tracks[2].album.images[0].url,
            bodydata.tracks[3].album.images[0].url,
            bodydata.tracks[4].album.images[0].url],
          AlbumLink: [bodydata.tracks[0].album.external_urls.spotify,
            bodydata.tracks[1].album.external_urls.spotify,
            bodydata.tracks[2].album.external_urls.spotify,
            bodydata.tracks[3].album.external_urls.spotify,
            bodydata.tracks[4].album.external_urls.spotify]
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
                                        bodydata.tracks.items[4].track.album.images[0].url],
                ArtistLink: [bodydata.tracks.items[0].track.artists[0].external_urls.spotify,
                                      bodydata.tracks.items[1].track.artists[0].external_urls.spotify,
                                      bodydata.tracks.items[2].track.artists[0].external_urls.spotify,
                                      bodydata.tracks.items[3].track.artists[0].external_urls.spotify,
                                      bodydata.tracks.items[4].track.artists[0].external_urls.spotify],
                SongLink  : [bodydata.tracks.items[0].track.external_urls.spotify,
                                        bodydata.tracks.items[1].track.external_urls.spotify,
                                        bodydata.tracks.items[2].track.external_urls.spotify,
                                        bodydata.tracks.items[3].track.external_urls.spotify,
                                        bodydata.tracks.items[4].track.external_urls.spotify],
                AlbumLink: [bodydata.tracks.items[0].track.album.external_urls.spotify,
                                        bodydata.tracks.items[1].track.album.external_urls.spotify,
                                        bodydata.tracks.items[2].track.album.external_urls.spotify,
                                        bodydata.tracks.items[3].track.album.external_urls.spotify,
                                        bodydata.tracks.items[4].track.album.external_urls.spotify]
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
    if (this.state.searchvalue.searchinput === '' || this.state.SearchSelectOption !== "Artist") {
      //window.alert("empty search input");
      this.setState({searchingArtistL : { ArtistName: ['','','','',''],
                          ArtistImage: ['','','','',''],
                          ArtistLink: ['','','','','']}});
      this.state.checkclicked.ClickSearchArtist = false;
      return;
    }
    this.state.checkclicked.ClickSearchArtist = true;
    this.state.checkclicked.ClickSearchAlbum = false;
    this.state.checkclicked.ClickSearchTrack = false;
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
    if (this.state.searchvalue.searchinput === '' || this.state.SearchSelectOption !== "Album") {
    
      this.setState({searchingAlbumL:  { ArtistName: ['','','','',''],
                          AlbumName: ['','','','',''],
                          AlbumImage:['','','','',''],
                          ArtistLink:['','','','',''],
              AlbumLink:['','','','','']}});
      this.state.checkclicked.ClickSearchAlbum = false;
      return;
    }
    this.state.checkclicked.ClickSearchArtist = false;
    this.state.checkclicked.ClickSearchAlbum = true;
    this.state.checkclicked.ClickSearchTrack = false;
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
    if (this.state.searchvalue.searchinput === '' || this.state.SearchSelectOption !== "Track") {
          this.setState({searchingTrackL:  { SongName: ['','','','',''],
                                ArtistName: ['','','','',''],
                                AlbumImage:['','','','',''],
                                SongLink: ['','','','',''],
                                ArtistLink:['','','','',''],
          AlbumLink:['','','','','']}});
      this.state.checkclicked.ClickSearchTrack = false;
    
      return;
    }
    this.state.checkclicked.ClickSearchArtist = false;
    this.state.checkclicked.ClickSearchAlbum = false;
    this.state.checkclicked.ClickSearchTrack = true;
    var searchtrackurl = 'https://api.spotify.com/v1/search?q=' + this.state.searchvalue.searchinput + '&type=track&limit=5';
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
        if (body.total === 0) {
          feed.state.checkclicked.ClickRecommended = false; 
          return;
        }
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
    if (this.state.loggedIn === false) {
      window.alert("Cannot search, please login with Spotify");
      return;
    }
    if (this.state.checkclicked.ClickStartSearch === true) 
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
    if (this.state.loggedIn === true && this.state.showonce && !this.state.loading) 
    {
      // this.getaccesstoken();
      this.getMostReommended();
      this.getHottestSong();
      this.getRecentList();
      this.state.showonce = false;
      // if accesstoken not in url, append it 
      this.appendToUrl();
    }
  }
  
  appendToUrl()
  {
    var url = window.location.href; 
    // window.alert("the url is " + url);   
    if (url.indexOf('#') > -1) {}
    else {
      url += '#';
      url += 'access_token=';
      url += spotifyApi.getAccessToken();
      // window.alert("the new url is " + url);
    }
  }

  getPost(TypeForPost, SongNumForPost )
  {
    var SongNum = SongNumForPost;
    var PostType = TypeForPost;
    // window.alert("The PostType is "+ PostType);
    // window.alert("The SongNum is "+ SongNum);
    var SongName = '';
    var SongUrl = '';
    if(PostType === "R")
    {
      SongName = this.state.recentList.SongName[SongNum];
      SongUrl = this.state.recentList.SongLink[SongNum];
    }
    else if(PostType === "RM")
    {
      SongName = this.state.mostRecommendedL.SongName[SongNum];
      SongUrl = this.state.mostRecommendedL.SongLink[SongNum];
    }
    else if(PostType === "STRA")
    {
      SongName = this.state.searchingTrackL.SongName[SongNum];
      SongUrl = this.state.searchingTrackL.SongLink[SongNum];
    }
    else if(PostType === "H")
    {
      SongName = this.state.hottestL.SongName[SongNum];
      SongUrl = this.state.hottestL.SongLink[SongNum];
    }
    this.state.url = "http://localhost:3000/newpost/#SongName=" + SongName + "&SongUrl=" + SongUrl + "&access_token=" + spotifyApi.getAccessToken();
    if(this.state.url)
    {
      window.location.href = this.state.url;
    }    
  }

  AppendSearchArtistItem()
  {
    for(var i = 0 ; i<this.state.SearchResultNumber.SearchArtNum; i ++)
    {
      this.state.ArtistReturnItem.push(this.state.searchingArtistL.ArtistLink[i]);
    }
  }

  render() {
    const {searchvalue} = this.state;
    if (this.props.auth && this.props.location)
      this.props.updateToken(this.props.auth.uid, this.props.location.hash)

    return (
      <div className="container">        
        <br/>
        <button className="waves-effect waves-yellow btn yellow darken-4" id="discover_search" onClick={() => this.getStartSearch()}>
          Search
        </button>
        {this.state.checkclicked.ClickStartSearch && <div className="search">
          <div className="row mt-5">
            <div className="col-sm-12">
              <form onSubmit={this.handleFormSubmit}>
                <div className="form-check">
                  <label>
                    <input
                      type="radio"
                      name="react-tips"
                      value="Artist"
                      checked={this.state.SearchSelectOption === "Artist"}
                      onChange={this.handleSearchOptionChangel}
                      className="form-check-input"
                    />
                    <span>Artist</span>
                  </label>
                </div>
                <div className="form-check">
                  <label>
                    <input
                      type="radio"
                      name="react-tips"
                      value="Album"
                      checked={this.state.SearchSelectOption === "Album"}
                      onChange={this.handleSearchOptionChangel}
                      className="form-check-input"
                    />
                    <span>Album</span>
                  </label>
                </div>
                <div className="form-check">
                  <label>
                    <input
                      type="radio"
                      name="react-tips"
                      value="Track"
                      checked={this.state.SearchSelectOption === "Track"}
                      onChange={this.handleSearchOptionChangel}
                      className="form-check-input"
                    />
                    <span>Track</span>
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>
        }
        
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

        { this.state.checkclicked.ClickSearchArtist && <div className="searchtotresults"> The Searched Artists: <br/>
        { (this.state.searchingArtistL.ArtistName[0] !== "") && <div className ="searchartistresult">
        Artist Name: <a href= {this.state.searchingArtistL.ArtistLink[0]}>
                          {this.state.searchingArtistL.ArtistName[0]}</a>
        <br/>Artist image:  
        <br/><a href= {this.state.searchingArtistL.ArtistLink[0]}>
             <img src={this.state.searchingArtistL.ArtistImage[0]} style={{ height: 150 }} alt="results"/>
             </a>
        </div>}
        { (this.state.searchingArtistL.ArtistName[1] !== "") && <div className ="searchartistresult">
        Artist Name: <a href= {this.state.searchingArtistL.ArtistLink[1]}>
                          {this.state.searchingArtistL.ArtistName[1]}</a>
        <br/>Artist image:  
        <br/><a href= {this.state.searchingArtistL.ArtistLink[1]}>
             <img src={this.state.searchingArtistL.ArtistImage[1]} style={{ height: 150 }} alt="results"/>
             </a>
        </div>}
        { (this.state.searchingArtistL.ArtistName[2] !== "") && <div className ="searchartistresult">
        Artist Name: <a href= {this.state.searchingArtistL.ArtistLink[2]}>
                          {this.state.searchingArtistL.ArtistName[2]}</a>
        <br/>Artist image:  
        <br/><a href= {this.state.searchingArtistL.ArtistLink[2]}>
             <img src={this.state.searchingArtistL.ArtistImage[2]} style={{ height: 150 }} alt="results"/>
             </a>
        </div>}
        { (this.state.searchingArtistL.ArtistName[3] !== "") && <div className ="searchartistresult">
        Artist Name: <a href= {this.state.searchingArtistL.ArtistLink[3]}>
                          {this.state.searchingArtistL.ArtistName[3]}</a>
        <br/>Artist image:  
        <br/><a href= {this.state.searchingArtistL.ArtistLink[3]}>
             <img src={this.state.searchingArtistL.ArtistImage[3]} style={{ height: 150 }} alt="results"/>
             </a>
        </div>}
        { (this.state.searchingArtistL.ArtistName[4] !== "") && <div className ="searchartistresult">
        Artist Name: <a href= {this.state.searchingArtistL.ArtistLink[4]}>
                          {this.state.searchingArtistL.ArtistName[4]}</a>
        <br/>Artist image:  
        <br/><a href= {this.state.searchingArtistL.ArtistLink[4]}>
             <img src={this.state.searchingArtistL.ArtistImage[4]} style={{ height: 150 }} alt="results"/>
             </a>
        </div>}
        </div>
        }

        { this.state.checkclicked.ClickSearchAlbum && <div className="searchtotresults"> The Searched Albums: <br/>
        { (this.state.searchingAlbumL.ArtistName[0] !== "") && <div className ="searchalbumresult">
        Album Name: <a href= {this.state.searchingAlbumL.AlbumLink[0]}>
                         {this.state.searchingAlbumL.AlbumName[0]}</a>
        <br/>Artist Name: <a href= {this.state.searchingAlbumL.ArtistLink[0]}>
                          {this.state.searchingAlbumL.ArtistName[0]}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingAlbumL.AlbumLink[0]}>
             <img src={this.state.searchingAlbumL.AlbumImage[0]} style={{ height: 150 }} alt="results"/></a>
        </div>}
        { (this.state.searchingAlbumL.ArtistName[1] !== "") && <div className ="searchalbumresult">
        Album Name: <a href= {this.state.searchingAlbumL.AlbumLink[1]}>
                         {this.state.searchingAlbumL.AlbumName[1]}</a>
        <br/>Artist Name: <a href= {this.state.searchingAlbumL.ArtistLink[1]}>
                          {this.state.searchingAlbumL.ArtistName[1]}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingAlbumL.AlbumLink[1]}>
             <img src={this.state.searchingAlbumL.AlbumImage[1]} style={{ height: 150 }} alt="results"/></a>
        </div>}
        { (this.state.searchingAlbumL.ArtistName[2] !== "") && <div className ="searchalbumresult">
        Album Name: <a href= {this.state.searchingAlbumL.AlbumLink[2]}>
                         {this.state.searchingAlbumL.AlbumName[2]}</a>
        <br/>Artist Name: <a href= {this.state.searchingAlbumL.ArtistLink[2]}>
                          {this.state.searchingAlbumL.ArtistName[2]}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingAlbumL.AlbumLink[2]}>
             <img src={this.state.searchingAlbumL.AlbumImage[2]} style={{ height: 150 }} alt="results"/></a>
        </div>}
        { (this.state.searchingAlbumL.ArtistName[3] !== "") && <div className ="searchalbumresult">
        Album Name: <a href= {this.state.searchingAlbumL.AlbumLink[3]}>
                         {this.state.searchingAlbumL.AlbumName[3]}</a>
        <br/>Artist Name: <a href= {this.state.searchingAlbumL.ArtistLink[3]}>
                          {this.state.searchingAlbumL.ArtistName[3]}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingAlbumL.AlbumLink[3]}>
             <img src={this.state.searchingAlbumL.AlbumImage[3]} style={{ height: 150 }} alt="results"/></a>
        </div>}
        { (this.state.searchingAlbumL.ArtistName[4] !== "") && <div className ="searchalbumresult">
        Album Name: <a href= {this.state.searchingAlbumL.AlbumLink[4]}>
                         {this.state.searchingAlbumL.AlbumName[4]}</a>
        <br/>Artist Name: <a href= {this.state.searchingAlbumL.ArtistLink[4]}>
                          {this.state.searchingAlbumL.ArtistName[4]}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingAlbumL.AlbumLink[4]}>
             <img src={this.state.searchingAlbumL.AlbumImage[4]} style={{ height: 150 }} alt="results"/></a>
        </div>}
        </div>
        } 

        { this.state.checkclicked.ClickSearchTrack && <div className="searchtotresults"> The Searched Tracks: <br/>
        { (this.state.searchingTrackL.ArtistName[0] !== "") && <div className ="searchtrackresult">
        <div className="post-button-group">
          <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("STRA", 0)}>
              write a post
          </button>
        </div>
        Song Name: <a href= {this.state.searchingTrackL.SongLink[0]}>
                          {this.state.searchingTrackL.SongName[0]}</a>
        <br/>Artist Name: <a href= {this.state.searchingTrackL.ArtistLink[0]}>
                          {this.state.searchingTrackL.ArtistName[0]}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingTrackL.AlbumLink[0]}>
             <img src={this.state.searchingTrackL.AlbumImage[0]} style={{ height: 150 }} alt="results"/></a>
        </div>}
        { (this.state.searchingTrackL.ArtistName[1] !== "") && <div className ="searchtrackresult">
        <div className="post-button-group">
          <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("STRA", 1)}>
              write a post
          </button>
        </div>
        Song Name: <a href= {this.state.searchingTrackL.SongLink[1]}>
                          {this.state.searchingTrackL.SongName[1]}</a>
        <br/>Artist Name: <a href= {this.state.searchingTrackL.ArtistLink[1]}>
                          {this.state.searchingTrackL.ArtistName[1]}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingTrackL.AlbumLink[1]}>
             <img src={this.state.searchingTrackL.AlbumImage[1]} style={{ height: 150 }} alt="results"/></a>
        </div>}
        { (this.state.searchingTrackL.ArtistName[2] !== "") && <div className ="searchtrackresult">
        <div className="post-button-group">
          <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("STRA", 2)}>
              write a post
          </button>
        </div>
        Song Name: <a href= {this.state.searchingTrackL.SongLink[2]}>
                          {this.state.searchingTrackL.SongName[2]}</a>
        <br/>Artist Name: <a href= {this.state.searchingTrackL.ArtistLink[2]}>
                          {this.state.searchingTrackL.ArtistName[2]}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingTrackL.AlbumLink[2]}>
             <img src={this.state.searchingTrackL.AlbumImage[2]} style={{ height: 150 }} alt="results"/></a>
        </div>}
        { (this.state.searchingTrackL.ArtistName[3] !== "") && <div className ="searchtrackresult">
        <div className="post-button-group">
          <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("STRA", 3)}>
              write a post
          </button>
        </div>
        Song Name: <a href= {this.state.searchingTrackL.SongLink[3]}>
                          {this.state.searchingTrackL.SongName[3]}</a>
        <br/>Artist Name: <a href= {this.state.searchingTrackL.ArtistLink[3]}>
                          {this.state.searchingTrackL.ArtistName[3]}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingTrackL.AlbumLink[3]}>
             <img src={this.state.searchingTrackL.AlbumImage[3]} style={{ height: 150 }} alt="results"/></a>
        </div>}
        { (this.state.searchingTrackL.ArtistName[4] !== "") && <div className ="searchtrackresult">
        <div className="post-button-group">
          <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("STRA", 4)}>
              write a post
          </button>
        </div>
        Song Name: <a href= {this.state.searchingTrackL.SongLink[4]}>
                          {this.state.searchingTrackL.SongName[4]}</a>
        <br/>Artist Name: <a href= {this.state.searchingTrackL.ArtistLink[4]}>
                          {this.state.searchingTrackL.ArtistName[4]}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingTrackL.AlbumLink[4]}>
             <img src={this.state.searchingTrackL.AlbumImage[4]} style={{ height: 150 }} alt="results"/></a>
        </div>}
        </div>
        }

        { (this.state.checkclicked.ClickRecent || this.state.checkclicked.ClickRecommended || this.state.checkclicked.ClickHottest) &&<div className="largefont">
        <hr style={{        
            backgroundColor: "deepskyblue",
            height: 3
        }}/>
        </div>
        }

        { (this.state.checkclicked.ClickRecent || this.state.checkclicked.ClickRecommended || this.state.checkclicked.ClickHottest) && <div className="totresults">
         { this.state.checkclicked.ClickRecent && <div className="results1"> 
          <div className="largefont2">Recent:</div>
          Song Name: <a href= {this.state.recentList.SongLink[0]}>
                          { this.state.recentList.SongName[0] }</a>
          <br/>Artist Name: <a href= {this.state.recentList.ArtistLink[0]}>
                            {this.state.recentList.ArtistName[0]}</a>
          <br/>Album image:     
          <br/><a href= {this.state.recentList.AlbumLink[0]}>
               <img src={this.state.recentList.AlbumImage[0]} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("R", 0)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.recentList.SongLink[1]}>
                          { this.state.recentList.SongName[1] }</a>
          <br/>Artist Name: <a href= {this.state.recentList.ArtistLink[1]}>
                            {this.state.recentList.ArtistName[1]}</a>
          <br/>Album image:     
          <br/><a href= {this.state.recentList.AlbumLink[1]}>
               <img src={this.state.recentList.AlbumImage[1]} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("R", 1)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.recentList.SongLink[2]}>
                          { this.state.recentList.SongName[2] }</a>
          <br/>Artist Name: <a href= {this.state.recentList.ArtistLink[2]}>
                            {this.state.recentList.ArtistName[2]}</a>
          <br/>Album image:     
          <br/><a href= {this.state.recentList.AlbumLink[2]}>
               <img src={this.state.recentList.AlbumImage[2]} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("R", 2)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.recentList.SongLink[3]}>
                          { this.state.recentList.SongName[3] }</a>
          <br/>Artist Name: <a href= {this.state.recentList.ArtistLink[3]}>
                            {this.state.recentList.ArtistName[3]}</a>
          <br/>Album image:     
          <br/><a href= {this.state.recentList.AlbumLink[3]}>
               <img src={this.state.recentList.AlbumImage[3]} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("R", 3)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.recentList.SongLink[4]}>
                          { this.state.recentList.SongName[4] }</a>
          <br/>Artist Name: <a href= {this.state.recentList.ArtistLink[4]}>
                            {this.state.recentList.ArtistName[4]}</a>
          <br/>Album image:     
          <br/><a href= {this.state.recentList.AlbumLink[4]}>
               <img src={this.state.recentList.AlbumImage[4]} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("R", 4)}>
                  write a post
              </button>
          </div>  
        </div>
        }

        { this.state.checkclicked.ClickRecommended && <div className="results2">
          <div className="largefont2">Recommended:</div> 
          Song Name: <a href= {this.state.mostRecommendedL.SongLink[0]}>
                          { this.state.mostRecommendedL.SongName[0] }</a>
          <br/>Artist Name: <a href= {this.state.mostRecommendedL.ArtistLink[0]}>
                            {this.state.mostRecommendedL.ArtistName[0]}</a>
          <br/>Album image: 
          <br/><a href= {this.state.mostRecommendedL.AlbumLink[0]}>
               <img src={this.state.mostRecommendedL.AlbumImage[0]} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("RM", 0)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.mostRecommendedL.SongLink[1]}>
                          { this.state.mostRecommendedL.SongName[1] }</a>
          <br/>Artist Name: <a href= {this.state.mostRecommendedL.ArtistLink[1]}>
                            {this.state.mostRecommendedL.ArtistName[1]}</a>
          <br/>Album image: 
          <br/><a href= {this.state.mostRecommendedL.AlbumLink[1]}>
               <img src={this.state.mostRecommendedL.AlbumImage[1]} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("RM", 1)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.mostRecommendedL.SongLink[2]}>
                          { this.state.mostRecommendedL.SongName[2] }</a>
          <br/>Artist Name: <a href= {this.state.mostRecommendedL.ArtistLink[2]}>
                            {this.state.mostRecommendedL.ArtistName[2]}</a>
          <br/>Album image: 
          <br/><a href= {this.state.mostRecommendedL.AlbumLink[2]}>
               <img src={this.state.mostRecommendedL.AlbumImage[2]} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("RM", 2)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.mostRecommendedL.SongLink[3]}>
                          { this.state.mostRecommendedL.SongName[3] }</a>
          <br/>Artist Name: <a href= {this.state.mostRecommendedL.ArtistLink[3]}>
                            {this.state.mostRecommendedL.ArtistName[3]}</a>
          <br/>Album image: 
          <br/><a href= {this.state.mostRecommendedL.AlbumLink[3]}>
               <img src={this.state.mostRecommendedL.AlbumImage[3]} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("RM", 3)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.mostRecommendedL.SongLink[4]}>
                          { this.state.mostRecommendedL.SongName[4] }</a>
          <br/>Artist Name: <a href= {this.state.mostRecommendedL.ArtistLink[4]}>
                            {this.state.mostRecommendedL.ArtistName[4]}</a>
          <br/>Album image: 
          <br/><a href= {this.state.mostRecommendedL.AlbumLink[4]}>
               <img src={this.state.mostRecommendedL.AlbumImage[4]} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("RM", 4)}>
                  write a post
              </button>
          </div>
        </div>
        }

        { this.state.checkclicked.ClickHottest && <div className="results3"> 
          <div className="largefont2">Global Hottest:</div>
          Song Name: <a href= {this.state.hottestL.SongLink[0]}>
                          { this.state.hottestL.SongName[0] }</a>
          <br/>Artist Name: <a href= {this.state.hottestL.ArtistLink[0]}>
                            {this.state.hottestL.ArtistName[0]}</a>
          <br/>Album image: 
          <br/><a href= {this.state.hottestL.AlbumLink[0]}>
               <img src={this.state.hottestL.AlbumImage[0]} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("H", 0)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.hottestL.SongLink[1]}>
                          { this.state.hottestL.SongName[1] }</a>
          <br/>Artist Name: <a href= {this.state.hottestL.ArtistLink[1]}>
                            {this.state.hottestL.ArtistName[1]}</a>
          <br/>Album image: 
          <br/><a href= {this.state.hottestL.AlbumLink[1]}>
               <img src={this.state.hottestL.AlbumImage[1]} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("H", 1)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.hottestL.SongLink[2]}>
                          { this.state.hottestL.SongName[2] }</a>
          <br/>Artist Name: <a href= {this.state.hottestL.ArtistLink[2]}>
                            {this.state.hottestL.ArtistName[2]}</a>
          <br/>Album image: 
          <br/><a href= {this.state.hottestL.AlbumLink[2]}>
               <img src={this.state.hottestL.AlbumImage[2]} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("H", 2)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.hottestL.SongLink[3]}>
                          { this.state.hottestL.SongName[3] }</a>
          <br/>Artist Name: <a href= {this.state.hottestL.ArtistLink[3]}>
                            {this.state.hottestL.ArtistName[3]}</a>
          <br/>Album image: 
          <br/><a href= {this.state.hottestL.AlbumLink[3]}>
               <img src={this.state.hottestL.AlbumImage[3]} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("H", 3)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.hottestL.SongLink[4]}>
                          { this.state.hottestL.SongName[4] }</a>
          <br/>Artist Name: <a href= {this.state.hottestL.ArtistLink[4]}>
                            {this.state.hottestL.ArtistName[4]}</a>
          <br/>Album image: 
          <br/><a href= {this.state.hottestL.AlbumLink[4]}>
               <img src={this.state.hottestL.AlbumImage[4]} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("H", 4)}>
                  write a post
              </button>
          </div>
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


const mapDispatchToProps = (dispatch) => {
  return {
    updateToken: (uId, token) => dispatch(updateToken(uId, token))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Discover)
