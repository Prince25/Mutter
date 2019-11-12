import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createGroup } from '../../store/actions/groupActions'


export class CreateGroup extends Component {

  state = {
    name: "",
    description: "",
    category: ""
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    console.log(this.props)
    this.props.createGroup(this.state)
  }

  render() {

    return (
      <div className="container">
        <form onSubmit={this.handleSubmit} className="white">
          <h5 className="grey-text text-darken-3">Create Group</h5>

            <div className="input-field">
              <label htmlFor="name">Group Name</label>
              <input type="text" id="name" onChange={this.handleChange}/>
            </div>

            <div className="input-field">
              <label htmlFor="description">Group Description</label>
              <textarea id="description" className="materialize-textarea" onChange={this.handleChange}></textarea>
            </div>

            <div className="input-field">
              <label htmlFor="category">Group Category</label>
              <textarea id="category" className="materialize-textarea" onChange={this.handleChange}></textarea>
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
    createGroup: (group) => dispatch(createGroup(group))
  }
}


export default connect(null, mapDispatchToProps)(CreateGroup)
