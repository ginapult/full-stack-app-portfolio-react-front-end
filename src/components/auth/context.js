/* eslint-disable no-console */
/* eslint-disable react/prop-types */
// auth context provider user with token and boolean for if logged in or not
// creates methods and data required for authentication/authorization
// does this user have the capabilities we think they need

// big boy - powers most of our app, rest of app will write itself

import React from 'react';
import jwt from 'jsonwebtoken';
import cookie from 'react-cookies';

// context API - tool for state management - it's just an object tied to a component
// component with state, using state to create React context from it
export const LoginContext = React.createContext();

const API = process.env.REACT_APP_API;

class LoginProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // when defining our context this.state is all the auth data we want to pass to children
      // defines what children need to render properly
      // 3 properties:
      loggedIn: false,
      token: null,
      user: {},
      login: this.login,
      logout: this.logout,
      // shows what data is being passed around by token on the back end
    };
  }

  // login - method on login provider class - sends a request (like Postman) to our back end
  // can be used for both sign up and sign in
  login = (username, password, type) => {
    const options = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: new Headers({
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      }),
    };

    if (type === 'signup') {
      options.body = JSON.stringify({ username, password });
      options.headers = new Headers({
        'Content-Type': 'application/json',
      });
    }
    // fetch is awesome for making requests
    // more modern way to make http request from the browser
    fetch(`${API}/${type}`, options)
      .then((response) => response.text())
      .then((token) => this.validateToken(token))
      // validating tokens on our class vs user like on back end
      .catch(console.error);
  }

  // logout - set default state - logged in false, token null and user 
  logout = () => {
    this.setLoginState(false, null, {});
  };

  // validate token with jwt
  validateToken = (token) => {
    // verify token and put in our context state
    try {
      const user = jwt.verify(token, process.env.REACT_APP_SECRET);
      this.setLoginState(true, user, token);
    } catch (error) {
      this.setLoginState(false, null, {});
    }
  }

  // state handling - e.g. properly set variable - similar to validating things in auth
  // set header and set the state
  setLoginState = (loggedIn, user, token) => {
    cookie.save('auth', token);
    this.setState({ token, loggedIn, user });
  }

  componentDidMount() {
    // when component is born, validate tokens. set cookies if able to
    const cookieToken = cookie.load('auth');
    this.validateToken(cookieToken);
  }

  // whole point is to render
  render() {
    return (
      // this is the wrapper so when we wrap things in this it allows us to inject
      // things into the children
      <LoginContext.Provider value={this.state}>
        {this.props.children}
      </LoginContext.Provider>
      // this.props.children - eslint disable for things with props validation
    );
  }
}

export default LoginProvider;
