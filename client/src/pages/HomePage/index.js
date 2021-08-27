import React, { useState, useEffect } from "react";
import "./style.scss";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LOGOUT } from "../../constants/actionTypes";
import decode from "jwt-decode";
import Home from "./components/Home";
import Landing from "./components/Landing";
export default function AppHomePage() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = user?.token;

    //JWT ...
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) logoutHandler();
    }

    setUser(JSON.parse(localStorage.getItem("profile")));
  }, []);

  const logoutHandler = () => {
    dispatch({ type: LOGOUT });
    history.push("/");
    setUser(null);
  };

  return (
    <div className="_homePage">
      <div className="_navbar">
        <div className="_logo">
          <h2>Sleep Tracker</h2>
        </div>
        <div className="_account">
          <div className="_username">{user ? user?.result?.name : ""}</div>
          <div className="_accountBtn">
            {user ? (
              <a href="." onClick={logoutHandler}>
                Logout
              </a>
            ) : (
              <Link to="/auth">Login</Link>
            )}
          </div>
        </div>
      </div>
      <div className="_container">{user ? <Home /> : <Landing />}</div>
      <div className="_footer">
        <p>Copyright ©2021 phamdanhdev. All Rights Reserved</p>
      </div>
    </div>
  );
}
