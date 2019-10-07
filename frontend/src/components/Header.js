import React from "react";
import { NavLink } from "react-router-dom";
import CurrentUser from "../components/CurrentUser";
import Signout from "./Signout";

const Header = () => (
  <CurrentUser>
    {currentUser => (
      <header>
        <nav>
          <NavLink className="logo" to="/">
            <span className="head">Get</span>
            <span className="tail">/Aways</span>
          </NavLink>
          <ul>
            <li>
              <NavLink exact to="/places">
                Find A Place
              </NavLink>
            </li>
            {currentUser && (
              <>
                <li>
                  <NavLink to="/bookings">My Bookings</NavLink>
                </li>
                <li>
                  <Signout />
                </li>
                <li className="user">
                  <i className="far fa-user" />
                  {currentUser.username}
                </li>
              </>
            )}
            {!currentUser && (
              <>
                <li>
                  <NavLink to="/sign-in">Sign In</NavLink>
                </li>
                <li>
                  <NavLink to="/sign-up" className="button">
                    Sign Up
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
    )}
  </CurrentUser>
);

export default Header;
