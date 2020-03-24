import React from "react";

import "./Alert.scss";

class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  render() {
    return (   
      <div className="alerts">
        {this.props.messages.map((message, idx) => {
          return (
            <div key={`alert-${idx}`} className={`alert ${message.type}`}>
              <p>{message.text}</p>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Alert;
