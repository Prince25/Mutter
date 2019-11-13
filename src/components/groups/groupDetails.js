
import React from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import moment from 'moment'
import { removeGroup, joinGroup, leaveGroup } from '../../store/actions/groupActions'


const GroupDetails = (props) => {

  const { groupId, group, users } = props
   
  if (group && users) {
    const authorId = group.createdBy
    let authorName = ""
    if (authorId && users[authorId]) {
      authorName = users[authorId].name
    }
    return(
      <div className="container section project-details">
        <div className="card z-depth-0">

          <div className="card-content">
            <span className="card-title">{ group.name }</span>
            <p>{ group.description }</p>
          </div>

          <button onClick={() => {
              props.joinGroup(groupId)
              props.history.push("/groups")
              }
          }>Join</button>

          <button onClick={() => {
              props.leaveGroup(groupId)
              props.history.push("/groups")
              }
          }>Leave</button>

          <button onClick={() => {
              props.removeGroup(groupId)
              props.history.push("/groups")
              }
          }>Delete</button>

          <div className="card-action grey lighten-4 grey-text">
            <div>Created by { authorName }</div>
            <div>
              on { moment(group.createdAt.toDate()).format('LLLL') }
            </div>
          </div>

        </div>
      </div>
    )
  } else {
    return (
      <div className="container center">
        <p>Loading group...</p>
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id
  const groups = state.firestore.data.groups
  const group = groups ? groups[id] : null
  const users = state.firestore.data.users

  return {
    groupId: id,
    group: group,
    users: users
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    removeGroup: (groupId) => dispatch(removeGroup(groupId)),
    joinGroup: (groupId) => dispatch(joinGroup(groupId)),
    leaveGroup: (groupId) => dispatch(leaveGroup(groupId))
  }
}


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'groups' }, 
    { collection: 'users' }
  ])
)(GroupDetails)
