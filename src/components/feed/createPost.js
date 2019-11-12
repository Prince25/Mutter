import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createPost } from '../../store/actions/postActions'


export class CreatePost extends Component {

  state = {
    song: '',
    comment: '',
    rating: null
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

  render() {

    return (
      <div className="container">
        <form onSubmit={this.handleSubmit} className="white">
          <h5 className="grey-text text-darken-3">Create Post</h5>

            <div className="input-field">
              <label htmlFor="song">Song</label>
              <input type="text" id="song" onChange={this.handleChange} />
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
