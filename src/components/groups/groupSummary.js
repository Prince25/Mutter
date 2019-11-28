
import React from 'react'
import moment from 'moment'


const GroupSummary = ({group}) => {
  
  return (

    <div className="card z-depth-1 project-summary large">
      <div className="card-content grey-text text-darken-3">

        <div className="card-image card small">
          { group.imageUrl && <img src={group.imageUrl} alt="" />}
        </div>

        <span className="card-title">{group.name}</span>
        
        { group.numberOfMembers === 1 ? 
          <p>{group.numberOfMembers} Mutterer</p> : 
          <p>{group.numberOfMembers} Mutterers</p> }

        <p className="grey-text">
          Category: {group.category} <br />
          { moment(group.createdAt.toDate()).calendar() }
        </p>
        
      </div>
    </div>
      
  )
}


export default GroupSummary