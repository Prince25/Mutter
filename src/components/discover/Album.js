import Artist from './Artist'
import React, { Component } from 'react'

export default class Album extends Component
{
  constructor(){
  	super();
    this.Artist = new Artist();
    this.AlbumImage = "";
    this.AlbumName="";
    this.AlbumLink = "";

  }

  //getArtistName(){return this.ArtistName;}
  //getArtistLink(){return this.ArtistLink;}
  getAlbumImage(){return this.AlbumImage;}
  getAlbumLink(){return this.AlbumLink;}
  getAlbumName(){return this.AlbumName;}
  getArtist(){return this.Artist;}

  //setArtistName(a){this.ArtistName = a;}
  //setArtistLink(a){this.ArtistLink = a;}
  setAlbumImage(a){this.AlbumImage = a;}
  setAlbumLink(a){this.AlbumLink = a;}
  setAlbumName(a){this.AlbumName = a;}
  setArtist(a){this.Artist = a;}
}
