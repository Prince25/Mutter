var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

const AppConfig = require('../src/components/config/app');
const AuthConfig = require('../src/components/config/auth');

const redirect_uri = AppConfig.HOST;
const client_id = AuthConfig.CLIENT_ID;
const client_secret = AuthConfig.CLIENT_SECRET

//this will expired within one hours
const access_token = "BQC6iDB_KsGay8275rCoieYAxPtFmrAuGTLgzW0RE-0MbutKqtjGEBNmmQEH_cR0WTPB3UuIqYY_QVeHkWJA_GqAnHbYZ_FwmAYjsa3kzmVear-zS5crqqGkfIfYXx4jf_6LgVFNSPYOmbung5B5r0va7-LukIEePurrwQWcqA";
const fs = require('fs')

var object;

fs.readFile("hottestinput.txt", 'utf-8', (err, data) => { 
    if (err) throw err; 
	object = JSON.parse(data);
	
})

var ifmatch = false;

 var options3 = {
          url: "https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF",
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };


request.get(options3, function(error, response, body) {
          //console.log(body);

		  for (var i =0; i<5 ; i++)
		  {
		  if((body.tracks.items[i].track.name == object.tracks.items[i].track.name)  && 
		  (body.tracks.items[i].track.external_urls.spotify == object.tracks.items[i].track.external_urls.spotify) &&
		  (body.tracks.items[i].track.artists[0].external_urls.spotify == object.tracks.items[i].track.artists[0].external_urls.spotify) &&
		  (body.tracks.items[i].track.album.images[0].url == object.tracks.items[i].track.album.images[0].url) &&
		  (body.tracks.items[i].track.album.external_urls.spotify== object.tracks.items[i].track.album.external_urls.spotify)
		  )
		  { 
			ifmatch =true;
			//console.log("the result is match in search for artist")
		  }
		  else
		  {
			  //console.log("the result is not match in search for artist")
			  ifmatch = false; 
			  break;
		  } 
		  }
		  
		  if(ifmatch ==true){console.log("the result is match in hottest song")}
			  else {console.log("the result is not match in hottest song")}
		  
        });


 