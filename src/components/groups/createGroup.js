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

  render() {
    return (
      <div className="container">
        <form id="groupForm" onSubmit={() => this.props.createGroup(this.state)} className="white">
          <h5 className="grey-text text-darken-3">Create Group</h5>

            <div className="input-field">
              <label htmlFor="name">Group Name</label>
              <input type="text" id="name" maxLength="30" onChange={this.handleChange}/>
            </div>

            <div className="input-field">
              <label htmlFor="description">Group Description</label>
              <textarea id="description" className="materialize-textarea" onChange={this.handleChange}></textarea>
            </div>

            <div className="input-field">
              <label htmlFor="category">Group Category</label>
              <textarea id="category" className="materialize-textarea" maxLength="20" onChange={this.handleChange}></textarea>
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
