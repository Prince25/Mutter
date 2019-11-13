
import React from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import moment from 'moment'
import { removeGroup, joinGroup, leaveGroup } from '../../store/actions/groupActions'


const GroupDetails = (props) => {

  const { groupId, group, users, authId } = props
   
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
            <p> <strong>Description:</strong> { group.description }</p>
            <p> <strong>Category:</strong> { group.category }</p>

            <strong>Members: </strong>
            { group.members && group.members.map((memberId, index) => {
              return (
                <span key={memberId}>
                  { index > 0 && ', '}
                  { users[memberId] ? users[memberId].name : null }
                </span>
              )
            })}
          </div>
          
          
          <div>
          <div class="myDivider"/>

            { group.members && authId && group.members.indexOf(authId) === -1 ? 
              <button className="btn blue lighten-1 z-depth-0" onClick={() => {
                props.joinGroup(groupId)
                props.history.push("/groups")
              }}>Join</button> : null }
                        
            <div class="myDivider"/>
            
            { group.members && authId && group.members.indexOf(authId) !== -1 ?
              <button className="btn orange lighten-1 z-depth-0" onClick={() => {
                  props.leaveGroup(groupId)
                  props.history.push("/groups")
              }}>Leave</button> : null }

            <div class="myDivider"/>
            
            { authorId && authId && authorId === authId ?
              <button className="btn pink lighten-1 z-depth-0" onClick={() => {
                props.removeGroup(groupId)
                props.history.push("/groups")
              }}>Delete</button>: null }
          </div>

          <div class="myDivider"/>

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
    users: users,
    authId: state.firebase.auth.uid
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
