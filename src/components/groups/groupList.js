
import React from 'react'
import GroupSummary from './groupSummary'
import { Link } from 'react-router-dom'


const GroupList = ({groups}) => {

  return (
    <div className="project-list section">
    <div className="row">
      { groups && groups.map(group => {
        return (
          <div className="col s3" key={group.id}>   {/* https://youtu.be/hZswcXSd5GA?t=130 */}
            <Link to={'/group/' + group.id} key={group.id}>
              <GroupSummary group={group} />
            </Link>
          </div>
        )
      })}
      </div>
    </div>
  )

}

export default GroupList