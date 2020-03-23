import React from "react";
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import './SignUp.scss';

class SignUp extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        username: "",
        email: "",
        password: "",
        passwordRep: ""
      };
    }
  
    handleSubmit = async event => {
      event.preventDefault();
  
      const { username, email, password, passwordRep } = this.state;
      if(password !== passwordRep) {
          return console.log("Hasła nie są takie same!");
      } else {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json"
          }
        };
        const body = JSON.stringify({ username, email, password });
        try {
            const res = await axios.post("/api/users", body, config);
            this.setState({ username: "", email: "", password: "", passwordRep: "" });
            localStorage.setItem('token', res.data.token);
            //console.log(res);
            //console.log(this.props);
            this.props.logInState();
            this.props.history.push("/postac");
        } catch (err) {
          console.log(err);
          const errors = err.response.data.errors;
          errors.map( error => console.log(error.msg));
        }
  
      } catch (err) {
        console.log(err);
      }
    }
    };
  
    handleChange = event => {
      const { value, name } = event.target;
  
      this.setState({ [name]: value });
    };
  
    render() {
      return (
        <div className="sign-in">
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="username"
              value={this.state.username}
              onChange={this.handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="email"
              value={this.state.email}
              onChange={this.handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="password"
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
            <input
              type="password"
              name="passwordRep"
              placeholder="Repeate password"
              value={this.state.passwordRep}
              onChange={this.handleChange}
              required
            />
            <button type="submit"> Sign Up</button>
          </form>
        </div>
      );
    }
  }
  
  export default withRouter(SignUp);