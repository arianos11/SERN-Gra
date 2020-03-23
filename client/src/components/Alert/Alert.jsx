import React, { useState, useEffect } from 'react';

import "./Alert.scss";

const Alert = ({messages}) => { 
    console.log(messages);
    const [alerts, setAlerts] = useState(messages);

    useEffect(() => {
        //setTimeout(() => setAlerts([]), 5000);
        console.log("USE EFFECT")
    }, [])
    console.log(alerts);
    return(
    <div className="alerts">
      {alerts.map((message, idx) => { 
        //console.log(copy);
        //console.log(copy.splice(idx, 1))
        return(
        <div key={`alert-${idx}`} className={`alert ${message.type}`}>
          <p>{message.text}</p>
        </div>
      )})}
    </div>
)}

export default Alert;