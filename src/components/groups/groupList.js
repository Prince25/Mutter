
import React from 'react'
import GroupSummary from './groupSummary'
import { Link } from 'react-router-dom'


const GroupList = ({groups}) => {

  return (
    <div className="project-list section">
      { groups && groups.map(group => {
        return (
          <Link to={'/group/' + group.id} key={group.id}>
            <GroupSummary group={group} />
          </Link>
        )
      })}
    </div>
  )

}

export default GroupList