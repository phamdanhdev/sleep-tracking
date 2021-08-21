import { combineReducers } from "redux";
import auth from "./auth";
import error from "./error";
import entry from "./entry";
export default combineReducers({ auth, error, entry });
