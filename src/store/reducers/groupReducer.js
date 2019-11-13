
const initState = {
  groups: [
    {
      name: "new group",
      description: "group description",
      category: "group category",
      createdBy: 123,
      createdAt: new Date(),
      members: ["1", "2", "3"],
      posts: ["1", "2", "3"],
      numberOfMembers: 0,
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/mutter-ucla.appspot.com/o/groups%2Fdefault.png?alt=media&token=9902e63a-5fa4-4256-ac94-0647583086d3"
    }
  ]
}


const groupReducer = (state = initState, action) => {
  switch (action.type) {
    case 'CREATE_GROUP': 
      console.log('Created group', action.group)
      return state

    case 'CREATE_GROUP_ERROR': 
      console.log('Create group error', action.err)
      return state

    case 'REMOVE_GROUP': 
      console.log('Removed group', action.groupId)
      return state

    case 'REMOVE_GROUP_ERROR': 
      console.log('Remove group error', action.err)
      return state

    case 'ADD_MEMBER': 
      console.log('Joined group', action.groupId)
      alert("Joined Group")
      return state

    case 'ADD_MEMBER_ERROR': 
      console.log('Join group error', action.err)
      return state

    case 'REMOVE_MEMBER': 
      console.log('Left group', action.groupId)
      alert("Left Group")
      return state

    case 'REMOVE_MEMBER_ERROR': 
      console.log('Leave group error', action.err)
      return state

    case 'GROUP_IMAGE': 
      console.log('Updated group image', action.groupId, action.imageUrl)
      return state

    case 'GROUP_IMAGE_ERROR': 
      console.log('Update group image error', action.err)
      return state
      
    default: return state
  }
}


export default groupReducer