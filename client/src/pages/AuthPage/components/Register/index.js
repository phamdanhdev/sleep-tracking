import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./style.scss";
import { Input, message } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { register } from "../../../../actions/auth";

const initialState = { name: "", email: "", password: "", confirmPassword: "" };

const Register = React.memo(({ handleChangeFrom }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [formData, setFormData] = useState(initialState);
  const [nameValid, setNameValid] = useState("");
  const [emailValid, setEmailValid] = useState("");
  const [passwordValid, setPasswordValid] = useState("");
  const [confirmPasswordValid, setConfirmPasswordValid] = useState("");
  const handleSubmitRegister = (e) => {
    e.preventDefault();
    if (
      formData.name.trim().length === 0 ||
      formData.email.trim().length === 0 ||
      formData.password.trim().length === 0 ||
      formData.confirmPassword.trim().length === 0 ||
      nameValid.length !== 0 ||
      emailValid.length !== 0 ||
      passwordValid.length !== 0 ||
      confirmPasswordValid.length !== 0
    ) {
      message.error("Infomation not valid!");
      return;
    } else {
      dispatch(register(formData, history));
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    switch (e.target.name) {
      case "name":
        if (e.target.value.trim().length === 0) {
          setNameValid("Name cannot empty!");
        } else {
          setNameValid("");
        }
        break;
      case "email":
        const reg =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (e.target.value.trim().length === 0) {
          setEmailValid("Email cannot empty!");
        } else if (reg.test(String(e.target.value.trim()).toLowerCase())) {
          setEmailValid("");
        } else {
          setEmailValid("This email is not available!");
        }
        break;
      case "password":
        if (e.target.value.trim().length === 0) {
          setPasswordValid("Password cannot empty!");
        } else if (e.target.value.trim().length <= 8) {
          setPasswordValid("The password field must be at least 8 characters!");
        } else {
          setPasswordValid("");
        }
        break;
      case "confirmPassword":
        if (e.target.value === formData.password) {
          setConfirmPasswordValid("");
        } else {
          setConfirmPasswordValid("Password doesn't match!");
        }
        break;
      default:
        return;
    }
  };

  return (
    <div className="_authForm">
      <h3>Register</h3>
      <form onSubmit={handleSubmitRegister}>
        <div className="_input">
          <Input
            name="name"
            size="large"
            placeholder="Name"
            prefix={<UserOutlined />}
            onChange={handleChange}
          />
          <p style={{ margin: 0, color: "#ffe900", height: "22px" }}>
            {nameValid}
          </p>
        </div>
        <div className="_input">
          <Input
            name="email"
            size="large"
            placeholder="Email"
            prefix={<UserOutlined />}
            onChange={handleChange}
          />
          <p style={{ margin: 0, color: "#ffe900", height: "22px" }}>
            {emailValid}
          </p>
        </div>
        <div className="_input">
          <Input.Password
            name="password"
            size="large"
            placeholder="Password"
            prefix={<UnlockOutlined />}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onChange={handleChange}
          />
          <p style={{ margin: 0, color: "#ffe900", height: "22px" }}>
            {passwordValid}
          </p>
        </div>
        <div className="_input">
          <Input.Password
            name="confirmPassword"
            size="large"
            placeholder="Confirm Password"
            prefix={<UnlockOutlined />}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onChange={handleChange}
          />
          <p style={{ margin: 0, color: "#ffe900", height: "22px" }}>
            {confirmPasswordValid}
          </p>
        </div>
        <div className="_action">
          <button type="submit" id="_actionBtn">
            Register
          </button>
        </div>
      </form>
      <div className="_changeForm">
        <p>
          Have an account?{" "}
          <span id="_changeFormBtn" onClick={() => handleChangeFrom(false)}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
});

export default Register;
