import React from 'react';
import { Link } from 'react-router-dom';


const UserList = ({users}) => {

  return (
  	<div>
	  	{users && users.map(user => {
	        return (
	          <Link to={'/profile/' + user.id } key={user.id} className="collection-item">{user.name} </Link>
	        )
	      })}
    </div>
  )
}


export default UserList;