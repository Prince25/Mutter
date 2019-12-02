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
const access_token = "BQD3hzdiaYfZdofxYqZefa3bWbdqVHZvshUnSoBdMD1I_ukvmgC2uFQmWM37Qs30gr_s_qWBa06upbSaqIYZFVq2adN-MHaN4YSgwuIsBLZd75Go-bw7eBd9mwXqNJPVjilTk4wVTSf4ICo-SEXK1cXISguAc5VnSKOK59a5Ag";

const fs = require('fs')

var object;

fs.readFile("searchartistinput.txt", 'utf-8', (err, data) => { 
    if (err) throw err; 
	object = JSON.parse(data);
	
})

var ifmatch = false;

 var options3 = {
          url: 'https://api.spotify.com/v1/search?q=Taylor%20Swift&type=artist&limit=5',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };


request.get(options3, function(error, response, body) {
          //console.log(object);

		  for (var i =0; i<body.artists.total ; i++)
		  {
		  if((body.artists.items[i].external_url == object.artists.items[i].external_url)  && (body.artists.items[i].name == object.artists.items[i].name) && (body.artists.items[i].images[0].url == object.artists.items[i].images[0].url) )
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
		  
		  if(ifmatch ==true){console.log("the result is match in search for artist")}
			  else {console.log("the result is not match in search for artist")}
		  
        });