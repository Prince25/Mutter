import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import SongCard from './songCard'

class SongGrid extends Component {

    render() {
        const { song_info } = this.props

        if (!Array.isArray(song_info)) {
            return null;
        }
        else {            
            const song_cards = song_info.map((info, index) => <Grid.Column stretched key={index}><SongCard title={info.title} artist={info.artist} album={info.album} art_url={info.art_url}
                 url={info.url}_token={info._token} uri={info.uri} deviceid={info.deviceid} type={info.type} account_type={info.account_type} player_connected={info.player_connected} 
                 history={info.history} /></Grid.Column>)
            const rows = Array(Math.ceil(song_info.length / 5)).fill().map((currValue, index) => <Grid.Row key={index}>{song_cards.slice(index*5, index*5 + 5)}</Grid.Row>)
            return (
                <Grid columns='equal'>
                    {rows}
                </Grid>
            )
        }
    }

}

export class SongInfo {
    title;
    artist;
    album;
    art_url;
    url;
    _token;
    uri;
    deviceid;
    type;
    account_type;
    player_connected;
    history;

    constructor(title, artist, album, art_url, url, _token, uri, deviceid, type, account_type, player_connected, history) {
        this.title = title
        this.artist = artist
        this.album = album
        this.art_url = art_url
        this.url = url
        this._token = _token
        this.uri = uri
        this.deviceid = deviceid
        this.type = type
        this.account_type = account_type
        this.player_connected = player_connected
        this.history = history
    }
}

export default SongGrid;