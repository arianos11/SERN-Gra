import React from "react";
import { withRouter } from 'react-router-dom';
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
          this.props.history.push("/");
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
      <div className="sign-in">
        <form onSubmit={this.handleSubmit}>
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
          <button type="submit"> Sign In</button>
        </form>
        <Alert messages={this.state.errors}/>
      </div>
    );
  }
}

export default withRouter(SignIn);
