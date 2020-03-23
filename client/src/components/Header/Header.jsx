import React from 'react';
import { NavLink } from "react-router-dom";

import './Header.scss';

const Header = ({ login, logInState }) => (
    <div className="header">
      <div className="logo-container">
        <h3>Logo</h3>
      </div>
      <div className="options">
        {login ? (
          <>
          <NavLink className="option" activeClassName="active" to="/karczma">
            Karczma
          </NavLink>
          <NavLink className="option" activeClassName="active" to="/arena">
            Arena
          </NavLink>
          <NavLink className="option" activeClassName="active" to="/warta">
            Warta
          </NavLink>
          <NavLink className="option" activeClassName="active" to="/sklep">
            Sklep
          </NavLink>
          <NavLink className="option" activeClassName="active" to="/postac">
            Postac
          </NavLink>
          <NavLink className="option" activeClassName="active" to="/poczta">
            Poczta
          </NavLink>
          <NavLink className="option" activeClassName="active" to="/gildia">
            Gildia
          </NavLink>
          <NavLink className="option" activeClassName="active" to="/sala-chwaly">
            Sala chwały
          </NavLink>
          <NavLink className="option" activeClassName="active" to="/lochy">
            Lochy
          </NavLink>
          <NavLink
            className="option"
            onClick={() => {
              localStorage.removeItem("token");
              logInState();
            }}
            activeClassName="neverActive"
            exact
            to="/"
          >
            Wyloguj się
          </NavLink>
          </>
        ) : (
          <NavLink className="option" activeClassName="active" to="/sign-in">
            Zaloguj się
          </NavLink>
        )}
      </div>
    </div>
  );

export default Header;