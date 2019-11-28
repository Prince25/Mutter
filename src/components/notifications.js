// DELETE: FOR REFERENCE 

import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom';

const Notifications = (props) => {
  const { notifications } = props;
  
  return (
    <div className="section">
      <div className="card z-depth-0">
        <div className="card-content">
          <span className="card-title">Notifications</span>
          <ul className="notification">
            {notifications && notifications.map(item => (
              <li key={item.id}>
                <Link to={"/profile/" + (item.id ? item.id : null) }>
                  <span className="pink-text">{item.user} </span> 
                </Link>
                <span>{item.content}</span>
                <div className="grey-text note-date">
                  {moment(item.time.toDate()).fromNow()}
                </div>
                <br/>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Notifications