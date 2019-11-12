import React, { Component } from 'react'
import CreateGroup from './createGroup'
import GroupList from './groupList'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'



export class Groups extends Component {

  state = {
    showCreate: false
  }

  render() {
    const { showCreate } = this.state
    const { groups } = this.props

    return (
      <div className="container">
        <p>Groups</p>

        <button onClick={() => this.setState({ showCreate: !showCreate })}> Create </button>
        { showCreate ? <CreateGroup /> : null }

        <br/><br/>
        <div className="divider"></div>
        
        <h5>Recent Groups</h5>
        
        <div className="row">

          <div className="col s4"> {/* https://youtu.be/hZswcXSd5GA?t=130 */}
            <GroupList groups={groups} />
          </div>

        </div>
        
      </div>
    )
 
  }
}


const mapStateToProps = (state) => {
  return {
    groups: state.firestore.ordered.groups
  }
}


export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'groups', orderBy: ['createdAt', 'desc'] }
  ])
)(Groups)
