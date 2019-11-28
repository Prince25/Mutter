import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateToken } from '../../store/actions/authActions'
import './Search.css';
import Song from './Song';
import Album from './Album';
import Artist from './Artist';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();
var request = require('request');

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
      //manual_token: spotifyApi.getAccessToken(),
      showonce : true,
      searchvalue : {searchinput :''},
      //searchloading : false,
      //message:'',
      url: null,
      loggedIn: (token || spotifyApi.getAccessToken()) ? true : false,
      loading : false,
      SongSelectOption : "0",
      TypeSelectOption : "R",
      SearchSelectOption: "Artist",
      NoImageUrl: "https://firebasestorage.googleapis.com/v0/b/mutter-ucla.appspot.com/o/discover%2FUnknown.png?alt=media&token=c8c29a7f-03db-432d-b87e-35f5333e5f99",
      checkclicked: {ClickStartSearch: false, ClickSearchArtist: false, ClickSearchAlbum: false, ClickSearchTrack: false,
                      ClickRecommended: false, ClickHottest: false, ClickRecent: false},
      SearchResultNumber: {RecentNum : 0 ,RecommendedNum : 0 ,HottestNum : 0,
                           SearchArtNum : 0,SearchTraNum : 0,SearchAlbNum : 0},
      //ArtistReturnElement:[],
      //ArtistReturnItem : [],
      recentlyListnew :        [new Song(),new Song(), new Song(), new Song(), new Song()],
      mostRecommendedListnew : [new Song(),new Song(), new Song(), new Song(), new Song()],
      HottestListnew :         [new Song(),new Song(), new Song(), new Song(), new Song()],
      
      searchingArtistListNew: [new Artist(),new Artist(),new Artist(),new Artist(),new Artist()],
      searchingAlbumListNew: [new Album(), new Album(), new Album(), new Album(), new Album()],
      searchingTrackListNew: [new Song(),new Song(), new Song(), new Song(), new Song()],
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
        this.setState({searchingAlbumListNew : [new Album(), new Album(), new Album(), new Album(), new Album()]});
        this.setState({searchingTrackListNew : [new Song(),new Song(), new Song(), new Song(), new Song()]});
        }
        else if(this.state.SearchSelectOption === "Album")
        {
          //window.alert("inside the album");
          this.getSearchAlbum();
          this.setState({searchingTrackListNew : [new Song(),new Song(), new Song(), new Song(), new Song()]});
          this.setState({searchingArtistListNew : [new Artist(),new Artist(), new Artist(), new Artist(), new Artist()]});
        }
        else if(this.state.SearchSelectOption === "Track")
        {
          this.getSearchTrack();
          this.setState({searchingArtistListNew : [new Artist(),new Artist(), new Artist(), new Artist(), new Artist()]});
          this.setState({searchingAlbumListNew : [new Album(), new Album(), new Album(), new Album(), new Album()]});
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
      this.setState({searchingAlbumListNew : [new Album(), new Album(), new Album(), new Album(), new Album()]});
      this.setState({searchingTrackListNew : [new Song(),new Song(), new Song(), new Song(), new Song()]});
    }
    else if(this.state.SearchSelectOption === "Album")
    {
      this.getSearchAlbum();
      this.setState({searchingTrackListNew : [new Song(),new Song(), new Song(), new Song(), new Song()]});
      this.setState({searchingArtistListNew : [new Artist(),new Artist(), new Artist(), new Artist(), new Artist()]});
    }
    else if(this.state.SearchSelectOption === "Track")
    {
      this.getSearchTrack();
      this.setState({searchingArtistListNew : [new Artist(),new Artist(), new Artist(), new Artist(), new Artist()]});
      this.setState({searchingAlbumListNew : [new Album(), new Album(), new Album(), new Album(), new Album()]});
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
  getRecentListnew()
  {
    this.state.checkclicked.ClickRecent = true;
    spotifyApi.getMyRecentlyPlayedTracks()
    .then((response)=>{
      if (response.next == null) {
        this.state.checkclicked.ClickRecent = false;
        return;
      }
      var tempSongList = this.state.recentlyListnew;
      for(var i =0; i <5; i++)
      {
        var tempSong = new Song();
        tempSong.setSongName(response.items[i].track.name);
        tempSong.setSongLink(response.items[i].track.external_urls.spotify);
        tempSong.getAlbum().getArtist().setArtistName(response.items[i].track.artists[0].name);
        tempSong.getAlbum().getArtist().setArtistLink(response.items[i].track.artists[0].external_urls.spotify);
        tempSong.getAlbum().setAlbumImage(response.items[i].track.album.images[0].url);
        tempSong.getAlbum().setAlbumLink(response.items[i].track.album.external_urls.spotify);
        tempSongList[i] = tempSong;
      }
      this.setState({recentlyListnew : tempSongList});
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
      var templist = this.state.searchingArtistListNew;      
      var Num = bodydata.artists.total;
      this.setState({SearchResultNumber:{SearchArtNum : Num}});
      //window.alert("the search artist number is " + this.state.SearchResultNumber.SearchArtNum);
      for(var i = 0 ; i<Num ; i++)
      {
        templist[i].setArtistName(bodydata.artists.items[i].name);
        if (bodydata.artists.items[i].images[0]) {
          templist[i].setArtistImage(bodydata.artists.items[i].images[0].url);
        }
        else
        {
          templist[i].setArtistImage(this.state.NoImageUrl);
        }
        templist[i].setArtistLink(bodydata.artists.items[i].external_urls.spotify);
      }
      for(var i = Num; i < 5-Num + 1; i++)
      {
        templist[i] = new Artist();
        // templist.ArtistName[i] = "";
        // templist.ArtistImage[i] = "";
        // templist.ArtistLink[i] = "";
      }
      if (Num === 0) {
        this.state.checkclicked.ClickSearchArtist = false;
      }
      this.setState({ searchingArtistListNew: templist });
    }
    else
    {
      var templist = this.state.searchingArtistListNew;
      for(var i = 0; i < 5; i++)
      {
        templist[i].setArtistName(bodydata.artists.items[i].name);
        if (bodydata.artists.items[i].images[0]) {
          templist[i].setArtistImage(bodydata.artists.items[i].images[0].url);
        }
        else
        {
          templist[i].setArtistImage(this.state.NoImageUrl);
        }
        templist[i].setArtistLink(bodydata.artists.items[i].external_urls.spotify);
      }
      this.setState({SearchResultNumber:{SearchArtNum : 5}});
      this.setState({ searchingArtistListNew: templist });
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
      var templist = this.state.searchingAlbumListNew;      
      var Num = bodydata.albums.total;
      this.setState({SearchResultNumber:{SearchAlbNum : Num}});
      //window.alert("the search artist number is " + this.state.SearchResultNumber.SearchArtNum);
      for(var i = 0 ; i<Num ; i++)
      {
        templist[i].getArtist().setArtistName(bodydata.albums.items[i].artists[0].name);
        if (bodydata.albums.items[i].images[0]) {
          templist[i].setAlbumImage(bodydata.albums.items[i].images[0].url);
          templist[i].setAlbumLink(bodydata.albums.items[i].external_urls.spotify);
        }
        else
        {
          templist[i].setAlbumImage(this.state.NoImageUrl);
          templist[i].setAlbumLink("");
        }
        templist[i].getArtist().setArtistLink(bodydata.albums.items[i].artists[0].external_urls.spotify);
        templist[i].setAlbumName(bodydata.albums.items[i].name);
      }
      for(var i = Num; i < 5-Num + 1; i++)
      {
        templist[i] = new Album();
      }
      if (Num === 0) {
        this.state.checkclicked.ClickSearchAlbum = false;
      }
      this.setState({ searchingAlbumListNew: templist });
    }
    else
    {
      var templist = this.state.searchingAlbumListNew;
      for(var i = 0; i < 5; i++)
      {
         templist[i].getArtist().setArtistName(bodydata.albums.items[i].artists[0].name);
        if (bodydata.albums.items[i].images[0]) {
          templist[i].setAlbumImage(bodydata.albums.items[i].images[0].url);
          templist[i].setAlbumLink(bodydata.albums.items[i].external_urls.spotify);
        }
        else
        {
          templist[i].setAlbumImage(this.state.NoImageUrl);
          templist[i].setAlbumLink("");
        }
        templist[i].getArtist().setArtistLink(bodydata.albums.items[i].artists[0].external_urls.spotify);
        templist[i].setAlbumName(bodydata.albums.items[i].name);
      }
      this.setState({SearchResultNumber:{SearchAlbNum : 5}});
      this.setState({ searchingAlbumListNew: templist });
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
      var templist = this.state.searchingTrackListNew;   
      var Num = bodydata.tracks.total;
      this.setState({SearchResultNumber:{SearchTraNum : Num}});
      //window.alert("the search artist number is " + this.state.SearchResultNumber.SearchArtNum);
      for(var i = 0 ; i<Num ; i++)
      {
        templist[i].getAlbum().getArtist().setArtistName(bodydata.tracks.items[i].artists[0].name);
        if (bodydata.tracks.items[i].album.images[0]) {
          templist[i].getAlbum().setAlbumImage(bodydata.tracks.items[i].album.images[0].url);
          templist[i].getAlbum().setAlbumLink(bodydata.tracks.items[i].album.external_urls.spotify);
        }
        else
        {
          templist[i].getAlbum().setAlbumImage(this.state.NoImageUrl);
          templist[i].getAlbum().setAlbumLink('');
        }      
        templist[i].getAlbum().getArtist().setArtistLink(bodydata.tracks.items[i].artists[0].external_urls.spotify);
        templist[i].setSongName(bodydata.tracks.items[i].name);
        templist[i].setSongLink(bodydata.tracks.items[i].external_urls.spotify);
      }
      for(var i = Num; i < 5-Num + 1; i++)
      {
        templist[i] = new Song();
      }
      if (Num === 0) {
        this.state.checkclicked.ClickSearchTrack = false;
      }
      this.setState({ searchingTrackListNew: templist });
    }
    else
    {
      var templist = this.state.searchingTrackListNew;
      for(var i = 0; i < 5; i++)
      {
        templist[i].getAlbum().getArtist().setArtistName(bodydata.tracks.items[i].artists[0].name);
        if (bodydata.tracks.items[i].album.images[0]) {
          templist[i].getAlbum().setAlbumImage(bodydata.tracks.items[i].album.images[0].url);
          templist[i].getAlbum().setAlbumLink(bodydata.tracks.items[i].album.external_urls.spotify);
        }
        else
        {
          templist[i].getAlbum().setAlbumImage(this.state.NoImageUrl);
          templist[i].getAlbum().setAlbumLink('');
        }      
        templist[i].getAlbum().getArtist().setArtistLink(bodydata.tracks.items[i].artists[0].external_urls.spotify);
        templist[i].setSongName(bodydata.tracks.items[i].name);
        templist[i].setSongLink(bodydata.tracks.items[i].external_urls.spotify);
      }
      this.setState({SearchResultNumber:{SearchTraNum : 5}});
      this.setState({ searchingTrackListNew: templist });
    }
  }

  /**
   * @method changeRecommandation
   * @description updating the mostRecommendedL's ArtistName, SongName, and AlbumImage in discover class with the tracks object from the Spotify catalog
   * @param {object} bodydata - the object of most recommended tracks list base on user's database
   * @returns {null}
  */
  changeRecommandationNew(bodydata)
  {
    
      var tempSongList = this.state.mostRecommendedListnew;
      for(var i =0; i <5; i++)
      {
        var tempSong = new Song();
        tempSong.setSongName(bodydata.tracks[i].name);
        tempSong.setSongLink(bodydata.tracks[i].external_urls.spotify);
        tempSong.getAlbum().getArtist().setArtistName(bodydata.tracks[i].album.artists[0].name);
        tempSong.getAlbum().getArtist().setArtistLink(bodydata.tracks[i].album.artists[0].external_urls.spotify);
        if(bodydata.tracks[i].album.images[0])
        { tempSong.getAlbum().setAlbumImage(bodydata.tracks[i].album.images[0].url);
          tempSong.getAlbum().setAlbumLink(bodydata.tracks[i].album.external_urls.spotify);
        }
        else
        {
          tempSong.getAlbum().setAlbumImage(this.state.NoImageUrl);
          tempSong.getAlbum().setAlbumLink(""); 
        }
        tempSongList[i] = tempSong;
      }
      this.setState({mostRecommendedListnew : tempSongList});
  }

  /**
   * @method changeHottest
   * @description updating the hottestL's ArtistName, SongName, and AlbumImage in discover class with the tracks object from the Spotify catalog
   * @param {object} bodydata - the object of most hottest tracks list base on the top 50 global playlist from spotify database
   * @returns {null}
  */
  changeHottestNew(bodydata)
  {
    
      var tempSongList = this.state.HottestListnew;
      for(var i =0; i <5; i++)
      {
        var tempSong = new Song();
        tempSong.setSongName(bodydata.tracks.items[i].track.name);
        tempSong.setSongLink(bodydata.tracks.items[i].track.external_urls.spotify);
        tempSong.getAlbum().getArtist().setArtistName(bodydata.tracks.items[i].track.artists[0].name);
        tempSong.getAlbum().getArtist().setArtistLink(bodydata.tracks.items[i].track.artists[0].external_urls.spotify);
        if(bodydata.tracks.items[i].track.album.images[0])
        { tempSong.getAlbum().setAlbumImage(bodydata.tracks.items[i].track.album.images[0].url);
          tempSong.getAlbum().setAlbumLink(bodydata.tracks.items[i].track.album.external_urls.spotify);
        }
        else
        {
          tempSong.getAlbum().setAlbumImage(this.state.NoImageUrl);
          tempSong.getAlbum().setAlbumLink(""); 
        }
        tempSongList[i] = tempSong;
      }
      this.setState({HottestListnew : tempSongList});
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
      this.setState({searchingArtistListNew : [new Artist(),new Artist(), new Artist(), new Artist(), new Artist()]});
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
        
        if (typeof body.error != "undefined") //check if error exist which may return from spotify
        {
          feed.state.checkclicked.ClickHottest = false;
          feed.state.checkclicked.ClickRecommended = false;
          feed.state.checkclicked.ClickRecent = false;
          window.alert("the access_token is expired, please log in the spotify again");
          return;
        }
        else
        {
          feed.changeArtist(body);
        }
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
      this.setState({searchingAlbumListNew : [new Album(), new Album(), new Album(), new Album(), new Album()]}); 
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
          if (typeof body.error != "undefined") //check if error exist which may return from spotify
          {
            feed.state.checkclicked.ClickHottest = false;
            feed.state.checkclicked.ClickRecommended = false;
            feed.state.checkclicked.ClickRecent = false;
            window.alert("the access_token is expired, please log in the spotify again");
            return;
          }
          else
          {
            feed.changeAlbum(body);
          }
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
      this.setState({searchingTrackListNew : [new Song(),new Song(), new Song(), new Song(), new Song()]});
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
          if (typeof body.error != "undefined") //check if error exist which may return from spotify
          {
            feed.state.checkclicked.ClickHottest = false;
            feed.state.checkclicked.ClickRecommended = false;
            feed.state.checkclicked.ClickRecent = false;
            window.alert("the access_token is expired, please log in the spotify again");
            return;
          }
          else { 
            feed.changeTrack(body);
          }
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
          if (typeof body.error != "undefined") //check if error exist which may return from spotify
          {
            feed.state.checkclicked.ClickHottest = false;
            feed.state.checkclicked.ClickRecommended = false;
            feed.state.checkclicked.ClickRecent = false;
            window.alert("the access_token is expired, please log in the spotify again");
            return;
          }
          else
          {
            feed.changeHottestNew(body);
          }
        });
  };

  /**
   * @method getMostRecommended
   * @description updating mostRecommendedL by calling changeRecommandation() and the endpointurl with the topartists ID from two HTTP requests to get the Tracks object from spotify catalog callback
   * @returns {null}
  */
  getMostRecommended()
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
        if (typeof body.error != "undefined") //check if error exist which may return from spotify
        {
          feed.state.checkclicked.ClickHottest = false;
          feed.state.checkclicked.ClickRecommended = false;
          feed.state.checkclicked.ClickRecent = false;
          window.alert("the access_token is expired, please log in the spotify again");
          return;
        }
        else{
          var topartists = body.items[0].id;
          var recommendedurl ='https://api.spotify.com/v1/recommendations?limit=5&market=US&seed_artists=' + topartists + '&min_energy=0.4&min_popularity=50';
          var options3 = {
              url: recommendedurl,
              headers: { 'Authorization': 'Bearer ' + tempaccess },
              json: true
        };
        request.get(options3, function(error, response, body) {
            //feed.changeRecommandation(body);
            feed.changeRecommandationNew(body);
        });
        }     
    });
    this.state.loading = false;
  }
  getStartSearch() 
  { 
    if (this.state.loggedIn === false) {
      window.alert("Cannot search, please connect with Spotify!");
      return;
    }
    if (this.state.checkclicked.ClickStartSearch === true) 
    {
      this.state.checkclicked.ClickStartSearch = false; 
    }
    else
    {
      this.state.checkclicked.ClickStartSearch = true;
    }
    //this.authshow();
    this.state.checkclicked.ClickRecommended = true;
    this.getHottestSong();
    this.getRecentListnew();

  }
  authshow()
  {
    if (this.state.loggedIn === true && this.state.showonce && !this.state.loading) 
    {
      // this.getaccesstoken();
      this.getMostRecommended();
      this.getHottestSong();
      this.getRecentListnew();
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
      //SongName = this.state.recentList.SongName[SongNum];
      //SongUrl = this.state.recentList.SongLink[SongNum];
      SongName = this.state.recentlyListnew[SongNum].getSongName();
      SongUrl = this.state.recentlyListnew[SongNum].getSongLink();

    }
    else if(PostType === "RM")
    {
      SongName = this.state.mostRecommendedListnew[SongNum].getSongName();
      SongUrl = this.state.mostRecommendedListnew[SongNum].getSongLink();
    }
    else if(PostType === "STRA")
    {
      SongName = this.state.searchingTrackListNew[SongNum].getSongName();
      SongUrl = this.state.searchingTrackListNew[SongNum].getSongLink();
    }
    else if(PostType === "H")
    {
      SongName = this.state.HottestListnew[SongNum].getSongName();
      SongUrl = this.state.HottestListnew[SongNum].getSongLink();
    }
    this.state.url = "http://localhost:3000/newpost/#SongName=" + SongName + "&SongUrl=" + SongUrl + "&access_token=" + spotifyApi.getAccessToken();
    if(this.state.url)
    {
      window.location.href = this.state.url;
    }    
  }

  render() {
    const {searchvalue} = this.state;
    if (this.props.auth && !this.props.auth.isEmpty && this.props.location && this.props.location.hash !== '')
      this.props.updateToken(this.props.auth.uid, this.props.location.hash)

    return (
      <div className="container">        
        <br/>
        <button id="search_btn" className="waves-effect waves-yellow btn yellow darken-4" onClick={() => this.getStartSearch()}>
          Search
        </button>
        {this.state.checkclicked.ClickStartSearch && <div className="search">
          <div className="row mt-5">
            <div className="col-sm-12">
              <form onSubmit={this.handleFormSubmit}>
                <div id= "search_artist" className="form-check">
                  <label>
                    <input type="radio" name="react-tips" value="Artist" checked={this.state.SearchSelectOption === "Artist"} onChange={this.handleSearchOptionChangel} className="form-check-input"/>
                    <span id= "artist_span">Artist</span>
                  </label>
                </div>
                <div id = "search_album" className="form-check">
                  <label>
                    <input type="radio" name="react-tips" value="Album" checked={this.state.SearchSelectOption === "Album"} onChange={this.handleSearchOptionChangel} className="form-check-input"/>
                    <span id = "album_span">Album</span>
                  </label>
                </div>
                <div id = "search_track" className="form-check">
                  <label>
                    <input type="radio" name="react-tips" value="Track" checked={this.state.SearchSelectOption === "Track"} onChange={this.handleSearchOptionChangel} className="form-check-input"/>
                    <span id = "track_span">Track</span>
                  </label>
                </div>
              </form>
            </div>
          </div>
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

        { (this.state.checkclicked.ClickSearchArtist&&this.state.checkclicked.ClickStartSearch) && <div className="searchtotresults"> The Searched Artists: <br/>
        { (this.state.searchingArtistListNew[0].getArtistName() !== "") && <div className ="searchartistresult">
        Artist Name: <a href= {this.state.searchingArtistListNew[0].getArtistLink()}>
                          {this.state.searchingArtistListNew[0].getArtistName()}</a>
        <br/>Artist image:  
        <br/><a href= {this.state.searchingArtistListNew[0].getArtistLink()}>
             <img src={this.state.searchingArtistListNew[0].getArtistImage()} style={{ height: 150 }} alt="results"/>
             </a>
        </div>}
        { (this.state.searchingArtistListNew[1].getArtistName() !== "") && <div className ="searchartistresult">
        Artist Name: <a href= {this.state.searchingArtistListNew[1].getArtistLink()}>
                          {this.state.searchingArtistListNew[1].getArtistName()}</a>
        <br/>Artist image:  
        <br/><a href= {this.state.searchingArtistListNew[1].getArtistLink()}>
             <img src={this.state.searchingArtistListNew[1].getArtistImage()} style={{ height: 150 }} alt="results"/>
             </a>
        </div>}
        { (this.state.searchingArtistListNew[2].getArtistName() !== "") && <div className ="searchartistresult">
        Artist Name: <a href= {this.state.searchingArtistListNew[2].getArtistLink()}>
                          {this.state.searchingArtistListNew[2].getArtistName()}</a>
        <br/>Artist image:  
        <br/><a href= {this.state.searchingArtistListNew[2].getArtistLink()}>
             <img src={this.state.searchingArtistListNew[2].getArtistImage()} style={{ height: 150 }} alt="results"/>
             </a>
        </div>}
        { (this.state.searchingArtistListNew[3].getArtistName() !== "") && <div className ="searchartistresult">
        Artist Name: <a href= {this.state.searchingArtistListNew[3].getArtistLink()}>
                          {this.state.searchingArtistListNew[3].getArtistName()}</a>
        <br/>Artist image:  
        <br/><a href= {this.state.searchingArtistListNew[3].getArtistLink()}>
             <img src={this.state.searchingArtistListNew[3].getArtistImage()} style={{ height: 150 }} alt="results"/>
             </a>
        </div>}
        { (this.state.searchingArtistListNew[4].getArtistName() !== "") && <div className ="searchartistresult">
        Artist Name: <a href= {this.state.searchingArtistListNew[4].getArtistLink()}>
                          {this.state.searchingArtistListNew[4].getArtistName()}</a>
        <br/>Artist image:  
        <br/><a href= {this.state.searchingArtistListNew[4].getArtistLink()}>
             <img src={this.state.searchingArtistListNew[4].getArtistImage()} style={{ height: 150 }} alt="results"/>
             </a>
        </div>}
        </div>
        }

        { (this.state.checkclicked.ClickSearchAlbum&&this.state.checkclicked.ClickStartSearch) && <div className="searchtotresults"> The Searched Albums: <br/>
        { (this.state.searchingAlbumListNew[0].getArtist().getArtistName() !== "") && <div className ="searchalbumresult">
        Album Name: <a href= {this.state.searchingAlbumListNew[0].getAlbumLink()}>
                         {this.state.searchingAlbumListNew[0].getAlbumName()}</a>
        <br/>Artist Name: <a href= {this.state.searchingAlbumListNew[0].getArtist().getArtistLink()}>
                          {this.state.searchingAlbumListNew[0].getArtist().getArtistName()}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingAlbumListNew[0].getAlbumLink()}>
             <img src={this.state.searchingAlbumListNew[0].getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
        </div>}
        { (this.state.searchingAlbumListNew[1].getArtist().getArtistName() !== "") && <div className ="searchalbumresult">
        Album Name: <a href= {this.state.searchingAlbumListNew[1].getAlbumLink()}>
                         {this.state.searchingAlbumListNew[1].getAlbumName()}</a>
        <br/>Artist Name: <a href= {this.state.searchingAlbumListNew[1].getArtist().getArtistLink()}>
                          {this.state.searchingAlbumListNew[1].getArtist().getArtistName()}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingAlbumListNew[1].getAlbumLink()}>
             <img src={this.state.searchingAlbumListNew[1].getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
        </div>}
        { (this.state.searchingAlbumListNew[2].getArtist().getArtistName() !== "") && <div className ="searchalbumresult">
        Album Name: <a href= {this.state.searchingAlbumListNew[2].getAlbumLink()}>
                         {this.state.searchingAlbumListNew[2].getAlbumName()}</a>
        <br/>Artist Name: <a href= {this.state.searchingAlbumListNew[2].getArtist().getArtistLink()}>
                          {this.state.searchingAlbumListNew[2].getArtist().getArtistName()}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingAlbumListNew[2].getAlbumLink()}>
             <img src={this.state.searchingAlbumListNew[2].getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
        </div>}
        { (this.state.searchingAlbumListNew[3].getArtist().getArtistName() !== "") && <div className ="searchalbumresult">
        Album Name: <a href= {this.state.searchingAlbumListNew[3].getAlbumLink()}>
                         {this.state.searchingAlbumListNew[3].getAlbumName()}</a>
        <br/>Artist Name: <a href= {this.state.searchingAlbumListNew[3].getArtist().getArtistLink()}>
                          {this.state.searchingAlbumListNew[3].getArtist().getArtistName()}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingAlbumListNew[3].getAlbumLink()}>
             <img src={this.state.searchingAlbumListNew[3].getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
        </div>}
        { (this.state.searchingAlbumListNew[4].getArtist().getArtistName() !== "") && <div className ="searchalbumresult">
        Album Name: <a href= {this.state.searchingAlbumListNew[4].getAlbumLink()}>
                         {this.state.searchingAlbumListNew[4].getAlbumName()}</a>
        <br/>Artist Name: <a href= {this.state.searchingAlbumListNew[4].getArtist().getArtistLink()}>
                          {this.state.searchingAlbumListNew[4].getArtist().getArtistName()}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingAlbumListNew[4].getAlbumLink()}>
             <img src={this.state.searchingAlbumListNew[4].getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
        </div>}
        </div>
        } 

        { (this.state.checkclicked.ClickSearchTrack&&this.state.checkclicked.ClickStartSearch) && <div className="searchtotresults"> The Searched Tracks: <br/>
        { (this.state.searchingTrackListNew[0].getAlbum().getArtist().getArtistName() !== "") && <div className ="searchtrackresult">
        <div className="post-button-group">
          <button className="btn btn-primary mt-2" id="PostSong_1" onClick={() => this.getPost("STRA", 0)}>
              write a post
          </button>
        </div>
        Song Name: <a href= {this.state.searchingTrackListNew[0].getSongLink()}>
                          {this.state.searchingTrackListNew[0].getSongName()}</a>
        <br/>Artist Name: <a href= {this.state.searchingTrackListNew[0].getAlbum().getArtist().getArtistLink()}>
                          {this.state.searchingTrackListNew[0].getAlbum().getArtist().getArtistName()}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingTrackListNew[0].getAlbum().getAlbumLink()}>
             <img src={this.state.searchingTrackListNew[0].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
        </div>}
        { (this.state.searchingTrackListNew[1].getAlbum().getArtist().getArtistName() !== "") && <div className ="searchtrackresult">
        <div className="post-button-group">
          <button className="btn btn-primary mt-2" id="PostSong_2" onClick={() => this.getPost("STRA", 1)}>
              write a post
          </button>
        </div>
        Song Name: <a href= {this.state.searchingTrackListNew[1].getSongLink()}>
                          {this.state.searchingTrackListNew[1].getSongName()}</a>
        <br/>Artist Name: <a href= {this.state.searchingTrackListNew[1].getAlbum().getArtist().getArtistLink()}>
                          {this.state.searchingTrackListNew[1].getAlbum().getArtist().getArtistName()}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingTrackListNew[1].getAlbum().getAlbumLink()}>
             <img src={this.state.searchingTrackListNew[1].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
        </div>}
        { (this.state.searchingTrackListNew[2].getAlbum().getArtist().getArtistName() !== "") && <div className ="searchtrackresult">
        <div className="post-button-group">
          <button className="btn btn-primary mt-2" id="PostSong_3" onClick={() => this.getPost("STRA", 2)}>
              write a post
          </button>
        </div>
        Song Name: <a href= {this.state.searchingTrackListNew[2].getSongLink()}>
                          {this.state.searchingTrackListNew[2].getSongName()}</a>
        <br/>Artist Name: <a href= {this.state.searchingTrackListNew[2].getAlbum().getArtist().getArtistLink()}>
                          {this.state.searchingTrackListNew[2].getAlbum().getArtist().getArtistName()}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingTrackListNew[2].getAlbum().getAlbumLink()}>
             <img src={this.state.searchingTrackListNew[2].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
        </div>}
        { (this.state.searchingTrackListNew[3].getAlbum().getArtist().getArtistName() !== "") && <div className ="searchtrackresult">
        <div className="post-button-group">
          <button className="btn btn-primary mt-2" id="PostSong_4" onClick={() => this.getPost("STRA", 3)}>
              write a post
          </button>
        </div>
        Song Name: <a href= {this.state.searchingTrackListNew[3].getSongLink()}>
                          {this.state.searchingTrackListNew[3].getSongName()}</a>
        <br/>Artist Name: <a href= {this.state.searchingTrackListNew[3].getAlbum().getArtist().getArtistLink()}>
                          {this.state.searchingTrackListNew[3].getAlbum().getArtist().getArtistName()}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingTrackListNew[3].getAlbum().getAlbumLink()}>
             <img src={this.state.searchingTrackListNew[3].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
        </div>}
        { (this.state.searchingTrackListNew[4].getAlbum().getArtist().getArtistName() !== "") && <div className ="searchtrackresult">
        <div className="post-button-group">
          <button className="btn btn-primary mt-2" id="PostSong_5" onClick={() => this.getPost("STRA", 4)}>
              write a post
          </button>
        </div>
        Song Name: <a href= {this.state.searchingTrackListNew[4].getSongLink()}>
                          {this.state.searchingTrackListNew[4].getSongName()}</a>
        <br/>Artist Name: <a href= {this.state.searchingTrackListNew[4].getAlbum().getArtist().getArtistLink()}>
                          {this.state.searchingTrackListNew[4].getAlbum().getArtist().getArtistName()}</a>
        <br/>Album image:  
        <br/><a href= {this.state.searchingTrackListNew[4].getAlbum().getAlbumLink()}>
             <img src={this.state.searchingTrackListNew[4].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
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
          Song Name: <a href= {this.state.recentlyListnew[0].getSongLink()}>
                          { this.state.recentlyListnew[0].getSongName() }</a>
          <br/>Artist Name: <a href= {this.state.recentlyListnew[0].getAlbum().getArtist().getArtistLink()}>
                            {this.state.recentlyListnew[0].getAlbum().getArtist().getArtistName()}</a>
          <br/>Album image:     
          <br/><a href= {this.state.recentlyListnew[0].getAlbum().getAlbumLink()}>
               <img src={this.state.recentlyListnew[0].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("R", 0)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.recentlyListnew[1].getSongLink()}>
                          { this.state.recentlyListnew[1].getSongName() }</a>
          <br/>Artist Name: <a href= {this.state.recentlyListnew[1].getAlbum().getArtist().getArtistLink()}>
                            {this.state.recentlyListnew[1].getAlbum().getArtist().getArtistName()}</a>
          <br/>Album image:     
          <br/><a href= {this.state.recentlyListnew[1].getAlbum().getAlbumLink()}>
               <img src={this.state.recentlyListnew[1].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("R", 1)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.recentlyListnew[2].getSongLink()}>
                          { this.state.recentlyListnew[2].getSongName() }</a>
          <br/>Artist Name: <a href= {this.state.recentlyListnew[2].getAlbum().getArtist().getArtistLink()}>
                            {this.state.recentlyListnew[2].getAlbum().getArtist().getArtistName()}</a>
          <br/>Album image:     
          <br/><a href= {this.state.recentlyListnew[2].getAlbum().getAlbumLink()}>
               <img src={this.state.recentlyListnew[2].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("R", 2)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.recentlyListnew[3].getSongLink()}>
                          { this.state.recentlyListnew[3].getSongName() }</a>
          <br/>Artist Name: <a href= {this.state.recentlyListnew[3].getAlbum().getArtist().getArtistLink()}>
                            {this.state.recentlyListnew[3].getAlbum().getArtist().getArtistName()}</a>
          <br/>Album image:     
          <br/><a href= {this.state.recentlyListnew[3].getAlbum().getAlbumLink()}>
               <img src={this.state.recentlyListnew[3].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("R", 3)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.recentlyListnew[4].getSongLink()}>
                          { this.state.recentlyListnew[4].getSongName() }</a>
          <br/>Artist Name: <a href= {this.state.recentlyListnew[4].getAlbum().getArtist().getArtistLink()}>
                            {this.state.recentlyListnew[4].getAlbum().getArtist().getArtistName()}</a>
          <br/>Album image:     
          <br/><a href= {this.state.recentlyListnew[4].getAlbum().getAlbumLink()}>
               <img src={this.state.recentlyListnew[4].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("R", 4)}>
                  write a post
              </button>
          </div>  
        </div>
        }

        { this.state.checkclicked.ClickRecommended && <div className="results2">
          <div className="largefont2">Recommended:</div> 
          Song Name: <a href= {this.state.mostRecommendedListnew[0].getSongLink()}>
                          { this.state.mostRecommendedListnew[0].getSongName() }</a>
          <br/>Artist Name: <a href= {this.state.mostRecommendedListnew[0].getAlbum().getArtist().getArtistLink()}>
                            {this.state.mostRecommendedListnew[0].getAlbum().getArtist().getArtistName()}</a>
          <br/>Album image:     
          <br/><a href= {this.state.mostRecommendedListnew[0].getAlbum().getAlbumLink()}>
               <img src={this.state.mostRecommendedListnew[0].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("RM", 0)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.mostRecommendedListnew[1].getSongLink()}>
                          { this.state.mostRecommendedListnew[1].getSongName() }</a>
          <br/>Artist Name: <a href= {this.state.mostRecommendedListnew[1].getAlbum().getArtist().getArtistLink()}>
                            {this.state.mostRecommendedListnew[1].getAlbum().getArtist().getArtistName()}</a>
          <br/>Album image:     
          <br/><a href= {this.state.mostRecommendedListnew[1].getAlbum().getAlbumLink()}>
               <img src={this.state.mostRecommendedListnew[1].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("RM", 1)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.mostRecommendedListnew[2].getSongLink()}>
                          { this.state.mostRecommendedListnew[2].getSongName() }</a>
          <br/>Artist Name: <a href= {this.state.mostRecommendedListnew[2].getAlbum().getArtist().getArtistLink()}>
                            {this.state.mostRecommendedListnew[2].getAlbum().getArtist().getArtistName()}</a>
          <br/>Album image:     
          <br/><a href= {this.state.mostRecommendedListnew[2].getAlbum().getAlbumLink()}>
               <img src={this.state.mostRecommendedListnew[2].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("RM", 2)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.mostRecommendedListnew[3].getSongLink()}>
                          { this.state.mostRecommendedListnew[3].getSongName() }</a>
          <br/>Artist Name: <a href= {this.state.mostRecommendedListnew[3].getAlbum().getArtist().getArtistLink()}>
                            {this.state.mostRecommendedListnew[3].getAlbum().getArtist().getArtistName()}</a>
          <br/>Album image:     
          <br/><a href= {this.state.mostRecommendedListnew[3].getAlbum().getAlbumLink()}>
               <img src={this.state.mostRecommendedListnew[3].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("RM", 3)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.mostRecommendedListnew[4].getSongLink()}>
                          { this.state.mostRecommendedListnew[4].getSongName() }</a>
          <br/>Artist Name: <a href= {this.state.mostRecommendedListnew[4].getAlbum().getArtist().getArtistLink()}>
                            {this.state.mostRecommendedListnew[4].getAlbum().getArtist().getArtistName()}</a>
          <br/>Album image:     
          <br/><a href= {this.state.mostRecommendedListnew[4].getAlbum().getAlbumLink()}>
               <img src={this.state.mostRecommendedListnew[4].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("RM", 4)}>
                  write a post
              </button>
          </div>
          <br/>
          <button className="waves-effect waves-yellow btn yellow darken-4" id="check_recommended" onClick={() => this.getMostRecommended()}>
            Find More
          </button>
        </div>
        }

        { this.state.checkclicked.ClickHottest && <div className="results3"> 
          <div className="largefont2">Global Hottest:</div>
          Song Name: <a href= {this.state.HottestListnew[0].getSongLink()}>
                          { this.state.HottestListnew[0].getSongName() }</a>
          <br/>Artist Name: <a href= {this.state.HottestListnew[0].getAlbum().getArtist().getArtistLink()}>
                            {this.state.HottestListnew[0].getAlbum().getArtist().getArtistName()}</a>
          <br/>Album image:     
          <br/><a href= {this.state.HottestListnew[0].getAlbum().getAlbumLink()}>
               <img src={this.state.HottestListnew[0].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("H", 0)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.HottestListnew[1].getSongLink()}>
                          { this.state.HottestListnew[1].getSongName() }</a>
          <br/>Artist Name: <a href= {this.state.HottestListnew[1].getAlbum().getArtist().getArtistLink()}>
                            {this.state.HottestListnew[1].getAlbum().getArtist().getArtistName()}</a>
          <br/>Album image:     
          <br/><a href= {this.state.HottestListnew[1].getAlbum().getAlbumLink()}>
               <img src={this.state.HottestListnew[1].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("H", 1)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.HottestListnew[2].getSongLink()}>
                          { this.state.HottestListnew[2].getSongName() }</a>
          <br/>Artist Name: <a href= {this.state.HottestListnew[2].getAlbum().getArtist().getArtistLink()}>
                            {this.state.HottestListnew[2].getAlbum().getArtist().getArtistName()}</a>
          <br/>Album image:     
          <br/><a href= {this.state.HottestListnew[2].getAlbum().getAlbumLink()}>
               <img src={this.state.HottestListnew[2].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("H", 2)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.HottestListnew[3].getSongLink()}>
                          { this.state.HottestListnew[3].getSongName() }</a>
          <br/>Artist Name: <a href= {this.state.HottestListnew[3].getAlbum().getArtist().getArtistLink()}>
                            {this.state.HottestListnew[3].getAlbum().getArtist().getArtistName()}</a>
          <br/>Album image:     
          <br/><a href= {this.state.HottestListnew[3].getAlbum().getAlbumLink()}>
               <img src={this.state.HottestListnew[3].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
          <div className="post-button-group">
              <button className="btn btn-primary mt-2" id="PostSong"onClick={() => this.getPost("H", 3)}>
                  write a post
              </button>
          </div>
          <br/>Song Name: <a href= {this.state.HottestListnew[4].getSongLink()}>
                          { this.state.HottestListnew[4].getSongName() }</a>
          <br/>Artist Name: <a href= {this.state.HottestListnew[4].getAlbum().getArtist().getArtistLink()}>
                            {this.state.HottestListnew[4].getAlbum().getArtist().getArtistName()}</a>
          <br/>Album image:     
          <br/><a href= {this.state.HottestListnew[4].getAlbum().getAlbumLink()}>
               <img src={this.state.HottestListnew[4].getAlbum().getAlbumImage()} style={{ height: 150 }} alt="results"/></a>
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