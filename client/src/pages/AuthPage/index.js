import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { message } from "antd";
import Login from "./components/Login";
import Register from "./components/Register";
import "./style.scss";

export default function AppAuthPage() {
  const [registerForm, setRegisterForm] = useState(false);
  const error = useSelector((state) => state.error);
  const { isLogin } = useParams();

  const handleChangeFrom = (e) => {
    setRegisterForm(e);
  };

  useEffect(() => {
    if (error.authMessage) {
      message.error(error.authMessage);
    }
    if (isLogin === "login") {
      setRegisterForm(false);
    } else {
      setRegisterForm(true);
    }
  }, [error, isLogin]);

  return (
    <div className="_authPage">
      <div className="_container">
        <div className="_form">
          {registerForm ? (
            <Register handleChangeFrom={handleChangeFrom} />
          ) : (
            <Login handleChangeFrom={handleChangeFrom} />
          )}
        </div>
        <div className="_intro">
          <h2>Welcome!</h2>
          <h3>Sleep Sensing & Tracking</h3>
          <h4>Know your</h4>
          <h4>nights, for your</h4>
          <h4>better life!</h4>
        </div>
      </div>
    </div>
  );
}
