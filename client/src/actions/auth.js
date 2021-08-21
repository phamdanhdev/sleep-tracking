import { AUTH, AUTH_MESSAGE } from "../constants/actionTypes";
import * as api from "../api/index";

export const register = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);
    console.log(data);

    dispatch({ type: AUTH, data });

    history.push("/");
  } catch (error) {
    console.log(error.response.data);
    console.log(error.response.status);
    dispatch({ type: AUTH_MESSAGE, data: error.response.data.message });
    history.push("/auth");
  }
};

export const signin = (formData, history) => async (dispatch) => {
  try {
    // api check and return result
    const { data } = await api.signIn(formData);
    dispatch({ type: AUTH, data });
    dispatch({ type: AUTH_MESSAGE, data: null });
    history.push("/");
  } catch (error) {
    console.log(error.response.data);
    console.log(error.response.status);
    dispatch({ type: AUTH_MESSAGE, data: error.response.data.message });
    history.push("/auth");
  }
};
