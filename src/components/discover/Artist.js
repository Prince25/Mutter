import React, { Component } from 'react'

export default class Artist extends Component 
{
  constructor(){
    super();
    this.ArtistName = "";
    this.ArtistImage = "";
    this.ArtistLink = "";
  }

  getArtistImage(){return this.ArtistImage;}
  getArtistName(){return this.ArtistName;}
  getArtistLink(){return this.ArtistLink;}

  setArtistLink(a){this.ArtistLink = a;}
  setArtistImage(a){this.ArtistImage = a;}
  setArtistName(a){this.ArtistName = a;}


}