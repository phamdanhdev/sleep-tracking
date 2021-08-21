import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./style.scss";
import { Input } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { GoogleLogin } from "react-google-login";
import { useHistory } from "react-router-dom";
import { signin } from "../../../../actions/auth";

const initialState = { email: "", password: "" };

const Login = React.memo(({ handleChangeFrom }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [formData, setFormData] = useState(initialState);

  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;
    try {
      dispatch({ type: "AUTH", data: { result, token } });
      history.push("/");
    } catch (error) {}
  };

  const googleFailure = (error) => {
    console.log(error);
    console.log("GOOGLE LOGIN FAILURE !!!");
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    dispatch(signin(formData, history));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="_authForm">
      <h3>Login</h3>
      <form onSubmit={handleSubmitLogin}>
        <div className="_input">
          <Input
            name="email"
            size="large"
            placeholder="Email"
            prefix={<UserOutlined />}
            onChange={handleChange}
          />
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
        </div>
        <div className="_action">
          <button type="submit" id="_actionBtn">
            Login
          </button>
        </div>
      </form>
      <div className="_changeForm">
        <p>
          Don't have an account?{" "}
          <span id="_changeFormBtn" onClick={() => handleChangeFrom(true)}>
            Sign up now!
          </span>
        </p>
      </div>
      <div className="_connectSocial">
        <div className="_connectTitle">
          <div className="_line"></div>
          <div>or connect with</div>
          <div className="_line"></div>
        </div>
        <div className="_connectIcon">
          <div className="_connectItem">
            <i className="fab fa-facebook-f"></i>
          </div>
          <div className="_connectItem">
            <GoogleLogin
              clientId="424007906678-ant4psrolajssvhsru06ip5pfli0g8tk.apps.googleusercontent.com"
              render={(renderProps) => (
                <i
                  className="fab fa-google"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                ></i>
              )}
              onSuccess={googleSuccess}
              onFailure={googleFailure}
              cookiePolicy="single_host_origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Login;
