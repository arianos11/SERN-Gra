import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import HomePage from './pages/HomePage/HomePage';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Hero from './pages/Hero/Hero';

import Header from './components/Header/Header';

import setAuthToken from "./utils/setAuthToken";

import "./App.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      logIn: false
    };
  }

  componentDidMount() {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      this.setState({ logIn: true });
    }
  }

  logInState = () => this.setState(prevState => ({ logIn: !prevState.logIn }));

  render() {
    return (
      <div className="App">
        <Header login={this.state.logIn} logInState={() => this.logInState()} />
        <Switch>
          
          <Route exact path="/">
          {this.state.logIn ? (
              <Redirect to="/postac" />
            ) : (
              <HomePage />
            )}
          </Route>

          <Route path="/sign-in">
            {this.state.logIn ? (
              <Redirect to="/postac" />
            ) : (
              <SignIn logInState={() => this.logInState()} />
            )}
          </Route>

          <Route path="/sign-up">
            {this.state.logIn ? (
              <Redirect to="/postac" />
            ) : (
              <SignUp logInState={() => this.logInState()} />
            )}
          </Route>

          {/* Zalogowany */}

          <Route path="/postac">
            {!this.state.logIn ? (
              <Redirect to="/" />
            ) : (
              <Hero />
            )}
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;
