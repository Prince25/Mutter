
export const createGroup = (group) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    // Make async call to database
    const firestore = getFirestore()
    const authorId = getState().firebase.auth.uid

    firestore.collection('groups').add({
      ...group, 
      name: group.name,
      description: group.description,
      category: group.category,
      createdBy: authorId,
      createdAt: new Date(),
      members: null,
      posts: null
    }).then(() => {
      dispatch({ type: 'CREATE_GROUP', group })
    }).catch((err) => {
      dispatch({ type: 'CREATE_GROUP_ERROR', err })
    })
  }
}


export const removeGroup = (groupId) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    // Make async call to database
    const firestore = getFirestore()
    const authorId = getState().firebase.auth.uid

    firestore.collection('groups').doc(groupId).delete()
    .then(() => {
      dispatch({ type: 'REMOVE_GROUP', groupId })
    }).catch((err) => {
      dispatch({ type: 'REMOVE_GROUP_ERROR', err })
    })
  }
}


export const joinGroup = (groupId) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    // Make async call to database
    const firestore = getFirestore()
    const userId = getState().firebase.auth.uid

    firestore.collection('groups').doc(groupId).update({
      members: firestore.FieldValue.arrayUnion(userId)
    }).then(() => {
      dispatch({ type: 'ADD_MEMBER', groupId })
    }).catch((err) => {
      dispatch({ type: 'ADD_MEMBER_ERROR', err })
    })
  }
}


export const leaveGroup = (groupId) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    // Make async call to database
    const firestore = getFirestore()
    const userId = getState().firebase.auth.uid

    firestore.collection('groups').doc(groupId).update({
      members: firestore.FieldValue.arrayRemove(userId)
    }).then(() => {
      dispatch({ type: 'REMOVE_MEMBER', groupId })
    }).catch((err) => {
      dispatch({ type: 'REMOVE_MEMBER_ERROR', err })
    })
  }
}