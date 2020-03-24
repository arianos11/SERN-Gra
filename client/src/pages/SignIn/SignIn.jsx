import React from "react";
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';

import Alert from '../../components/Alert/Alert';

import "./SignIn.scss";

class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errors: []
    };
  }

  handleSubmit = async event => {
    event.preventDefault();

    const { email, password } = this.state;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      const body = JSON.stringify({ email, password });
      try {
          const res = await axios.post("/api/auth", body, config);
          localStorage.setItem('token', res.data.token);
          this.setState({ email: "", password: "", errors: [] });
          //console.log(res);
          //console.log(this.props);
          this.props.logInState();
          setTimeout(() => this.props.history.push("/postac"), 200);
      } catch (err) {
        const error = err.response.data;
        console.log(error)
        this.setState({ errors: error });
        //error.map( error => console.log(error.msg));
      }

    } catch (err) {
      console.log(err);
    }
  };

  handleChange = event => {
    const { value, name } = event.target;
    console.log(this.state);

    this.setState({ [name]: value });
  };

  render() {
    return (
      <>
      <div className="sign-in">
        <form onSubmit={this.handleSubmit}>
          <h2>Logowanie</h2>
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
          <button type="submit">Zaloguj się</button>
          <h3>Nie posiadasz konta? Zarejestruj się <Link to="/sign-up">tutaj!</Link></h3>
        </form>
      </div>
      <Alert messages={this.state.errors}/>
      </>
    );
  }
}

export default withRouter(SignIn);
