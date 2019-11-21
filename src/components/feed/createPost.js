import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createPost } from '../../store/actions/postActions'


export class CreatePost extends Component {


  constructor(){
    super();
    const params = this.getHashParams();

    const SongName = params.SongName;
    const SongUrl = params.SongUrl;

    ///////solution 1

    // if(!SongName)
    // { SongName ="enter song name";
    //   SongUrl ="enter song url";
    //   this.state = {
    //     song: null,
    //     comment: '',
    //     rating: null,
    //     url: null
    //     }
    // }
    // else
    // {
      this.state = {
        song: SongName,
        comment: '',
        rating: null,
        url: SongUrl
        }

    //}
    

    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
}

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.createPost(this.state)
    this.props.history.push('/feed')
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

    ///////solution 2

    //this.setState({ song : hashParams.SongName , url : hashParams.SongUrl});
    //window.alert("the hashParams SongName is :" + hashParams.SongName);
    //window.alert("the hashParams URL is :" + hashParams.SongName);
    return hashParams;
  }

  render() {
    
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit} className="white">
          <h5 className="grey-text text-darken-3">Create Post</h5>

            <div className="input-field">
              <label htmlFor="song">Song</label>
              <input type="text" value = {this.state.song} id="song" onChange={this.handleChange} />
            </div>

            <div className="input-field">
              <label htmlFor="rating">Rating (1 - 5)</label>
              <input type="number" min="1" max="5" id="rating" className="materialize-textarea" onChange={this.handleChange} />
            </div>

            <div className="input-field">
              <label htmlFor="comment">Comment</label>
              <input type="text" id="comment" className="materialize-textarea" onChange={this.handleChange} />
            </div>

            <div className="input-field">
              <label htmlFor="URL">URL</label>
              <input type="text" value = {this.state.url} id="URL" className="materialize-textarea" onChange={this.handleChange} />
            </div>

            <div className="input-field">
              <button className="btn pink lighten-1 z-depth-0">Create</button>
            </div>

        </form>
        
      </div>
    )
  }
}
 

const mapDispatchToProps = (dispatch) => {
  return {
    createPost: (Post) => dispatch(createPost(Post))
  }
}


export default connect(null, mapDispatchToProps)(CreatePost);

