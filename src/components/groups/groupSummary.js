
import React from 'react'
import moment from 'moment'


const GroupSummary = ({group}) => {
  
  return (

    <div className="card z-depth-0 project-summary">
      <div className="card-content grey-text text-darken-3">

        <span className="card-title">{group.name}</span>
        <p>Category: {group.category} </p>
        <p>Number of Members: {group.numberOfMembers}</p>

        <p className="grey-text">
          { moment(group.createdAt.toDate()).calendar() }
        </p>
        
      </div>
    </div>
      
  )
}


export default GroupSummary