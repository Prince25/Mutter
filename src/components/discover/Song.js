import Album from './Album'
import React, { Component } from 'react'

export default class Song extends Component 
{
  constructor(){
    super();

    this.SongName = "";

    this.SongLink = "";

    this.Album = new Album();

  }

  getSongName(){return this.SongName;}
  //getArtistName(){return this.ArtistName;}
  //getArtistLink(){return this.ArtistLink;}
  //getAlbumImage(){return this.AlbumImage;}
  //getAlbumLink(){return this.AlbumLink;}
  getSongLink(){return this.SongLink;}
  getAlbum(){return this.Album;}


  setSongLink(s){this.SongLink = s;}
  setSongName(s){this.SongName = s;}
  setAlbum(a){this.Album = a;}
  //setArtistName(a){this.ArtistName = a;}
  //setArtistLink(a){this.ArtistLink = a;}
  //setAlbumImage(a){this.AlbumImage = a;}
  //setAlbumLink(a){this.AlbumLink = a;}
}