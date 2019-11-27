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
    const { groups, recent, popular, authId } = this.props
    const ownGroups = groups ? groups.filter(group => group.members.includes(authId)) : null

    return (
      <div className="container">
        <br/>
        
        <button className="waves-effect waves-red btn yellow darken-4" onClick={
          () => this.setState({ showCreate: !showCreate })}>
          <i className="material-icons left">add</i>Create</button>
        { showCreate ? <CreateGroup /> : null }

        <br/><br/>
        <div className="divider" />

        <h5>My Groups</h5>
        <GroupList groups={ownGroups} />
 
        <div className="divider" />
        

        <h5>Recent Groups</h5>
        <GroupList groups={recent} />
 
        <div className="divider" />

        <h5>Popular Groups</h5>
        <GroupList groups={popular} />

      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    groups: state.firestore.ordered.groups,
    recent: state.firestore.ordered.recent,
    popular: state.firestore.ordered.popular,
    authId: state.firebase.auth.uid
  }
}


export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'groups', storeAs: 'groups' },
    { collection: 'groups', orderBy: ['createdAt', 'desc'], limit: 4, storeAs: 'recent' },
    { collection: 'groups', orderBy: ['numberOfMembers', 'desc'], limit: 4, storeAs: 'popular' }
  ])
)(Groups)
