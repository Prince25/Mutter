
/** 
 * @method createGroup
 * @description a function for a user to create a group for Mutterers.
 * @param {object} group- the group object taken from the input form.
 * @param {string} group.name - name of the group created.
 * @param {string} group.description - description for the group created.
 * @param {string} group.category - category for the group created.
 * @returns {null} 
 */

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
      members: [authorId],
      numberOfMembers: 1,
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/mutter-ucla.appspot.com/o/groups%2Fdefault.png?alt=media&token=9902e63a-5fa4-4256-ac94-0647583086d3"
    }).then(() => {
      dispatch({ type: 'CREATE_GROUP', group })
    }).catch((err) => {
      dispatch({ type: 'CREATE_GROUP_ERROR', err })
    })
  }
}

/** 
 * @method removeGroup
 * @description a function for a user to create a group for Mutterers.
 * @param {string} groupId - the ID of the group we want to remove.
 * @returns {Object} 
 */

export const removeGroup = (groupId) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    // Make async call to database
    const firestore = getFirestore()

    firestore.collection('groups').doc(groupId).delete()
    .then(() => {
      dispatch({ type: 'REMOVE_GROUP', groupId })
    }).catch((err) => {
      dispatch({ type: 'REMOVE_GROUP_ERROR', err })
    })
  }
}


/** 
 * @method joinGroup
 * @description a function for users to join a group. 
 * @param {string} groupId - the ID of the group we want to join.
 * @returns {Object} 
 */

export const joinGroup = (groupId) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    // Make async call to database
    const firestore = getFirestore()
    const userId = getState().firebase.auth.uid

    firestore.collection('groups').doc(groupId).update({
      members: firestore.FieldValue.arrayUnion(userId),
      numberOfMembers: firestore.FieldValue.increment(1),
    }).then(() => {
      dispatch({ type: 'ADD_MEMBER', groupId })
    }).catch((err) => {
      dispatch({ type: 'ADD_MEMBER_ERROR', err })
    })

    //get groups collection
    let userCollectionRef = firestore.collection('users');

    //add to list of groups user is in
    userCollectionRef.doc(userId).update({
      groups: firestore.FieldValue.arrayUnion(groupId)
    }).then(() => {
      dispatch({ type: 'JOIN_GROUP', userId, groupId })
    }).catch((err) => {
      dispatch({ type: 'JOIN_GROUP_ERROR', err })
    });
  }
}


/** 
 * @method leaveGroup
 * @description a function for users to leave a group they no longer like.
 * @param {string} groupId - the ID of the group we want to join.
 * @returns {Object} 
 */

export const leaveGroup = (groupId) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    // Make async call to database
    const firestore = getFirestore()
    const userId = getState().firebase.auth.uid

    firestore.collection('groups').doc(groupId).update({
      members: firestore.FieldValue.arrayRemove(userId),
      numberOfMembers: firestore.FieldValue.increment(-1)
    }).then(() => {
      dispatch({ type: 'REMOVE_MEMBER', groupId })
    }).catch((err) => {
      dispatch({ type: 'REMOVE_MEMBER_ERROR', err })
    })

    //get groups collection
    let userCollectionRef = firestore.collection('users');

    //remove group from list of groups user is in
    userCollectionRef.doc(userId).update({
      groups: firestore.FieldValue.arrayRemove(groupId)
    }).then(() => {
      dispatch({ type: 'LEAVE_GROUP', userId, groupId })
    }).catch((err) => {
      dispatch({ type: 'LEAVE_GROUP_ERROR', err })
    });
  }
}

/** 
 * @method updateImage
 * @description a function to update the images
 * @param {string} groupId - the ID of the group we want to update the image for
 * @param {string} imageUrl - the new image URL that we want to use for our updated image.
 * @returns {Object} 
 */


export const updateImage = (groupId, imageUrl) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    // Make async call to database
    const firestore = getFirestore()

    firestore.collection('groups').doc(groupId).update({
      imageUrl: imageUrl
    }).then(() => {
      dispatch({ type: 'GROUP_IMAGE', groupId })
    }).catch((err) => {
      dispatch({ type: 'GROUP_IMAGE_ERROR', err })
    })
  }
}
