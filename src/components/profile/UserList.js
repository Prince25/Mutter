import React from 'react';
import { Link } from 'react-router-dom';

const UserList = ({users}) => {
  return (
  	<div>
	  	{users && users.map(user => {
	        return (
	          <a href="#!" className="collection-item">{user.name}</a>
	        )
	      })}
    </div>
  )
}

export default UserList;