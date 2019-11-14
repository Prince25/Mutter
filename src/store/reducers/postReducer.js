// dummy data for now
// add more dummy data!!
  // TODO: add flexibility for song OR album
  // TODO: add timestamp
const initState = {
  posts: [
    {id: '1', author: 'AaronLovesMutter1', song: 'Stronger', comment: 'an all-time favorite workout song', rating: 4},
    {id: '2', author: 'AaronLovesMutter2', song: 'EARFQUAKE', comment: 'pretty good but not really what I listen to Tyler for', rating: 3},
    {id: '3', author: 'AaronLovesMutter3', song: 'No Role Modelz', comment: 'an all-time favorite song. period.', rating: 5},
    {id: '4', author: 'AaronLovesMutter4', song: 'Ye vs. the People', comment: 'can he please just shut the fuck up', rating: 1}
  ]
}

const postReducer = (state = initState, action) => {
  switch (action.type) {
    case 'CREATE_POST': 
      console.log('Created post:', action.post);
      return state;

    case 'CREATE_POST_ERROR': 
      console.log('Create post error:', action.err);
      return state;

    //TODO: add functionality for deleting and editing
    /*
    case 'DELETE_POST': 
      console.log('Deleted post:', action.project);
      return state;
    case 'DELETE_POST_ERROR': 
      console.log('Delete post error:', action.err);
      return state;
    case 'EDIT_POST': 
      console.log('Edited post:', action.project);
      return state;
    case 'EDIT_POST_ERROR': 
      console.log('Edit post error:', action.err);
      return state;
    */
    default: 
      return state;
  }
}


export default postReducer;