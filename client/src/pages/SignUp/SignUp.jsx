import React from "react";
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';

import Alert from '../../components/Alert/Alert';

import './SignUp.scss';

class SignUp extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        username: "",
        email: "",
        password: "",
        passwordRep: "",
        errors: []
      };
    }
  
    handleSubmit = async event => {
      event.preventDefault();
  
      const { username, email, password, passwordRep } = this.state;
      if(password !== passwordRep) {
          return this.setState({ errors: [{ text: "Podane hasła nie są takie same", type: "fail" }] });
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
          const error = err.response.data;
          this.setState({ errors: error });
          //error.map( error => console.log(error.msg));
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
        <>
        <div className="sign-in">
          <form onSubmit={this.handleSubmit}>
            <h2>Rejestracja</h2>
            <input
              type="text"
              name="username"
              placeholder="Nazwa użytkownika"
              value={this.state.username}
              onChange={this.handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Hasło"
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
            <input
              type="password"
              name="passwordRep"
              placeholder="Powtórz hasło"
              value={this.state.passwordRep}
              onChange={this.handleChange}
              required
            />
            <button type="submit">Zarejestruj się</button>
            <h3>Masz już konto? Zaloguj się <Link to="/sign-in">tutaj!</Link></h3>
          </form>
        </div>
        <Alert messages={this.state.errors}/>
        </>
      );
    }
  }
  
  export default withRouter(SignUp);