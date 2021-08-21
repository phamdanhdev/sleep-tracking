import {
  FETCH_ALL,
  CREATE_ENTRY,
  ENTRY_MESSAGE,
  UPDATE_ENTRY,
  DELETE_ENTRY,
} from "../constants/actionTypes";
import * as api from "../api/index";

export const getEntries = () => async (dispatch) => {
  try {
    const { data } = await api.fetchEntries();
    dispatch({ type: FETCH_ALL, data });
  } catch (error) {
    console.log(error.response);
    dispatch({ type: ENTRY_MESSAGE, data: error.response.data.message });
  }
};

export const createEntry = (entry) => async (dispatch) => {
  try {
    const { data } = await api.createEntry(entry);
    dispatch({ type: CREATE_ENTRY, data });
  } catch (error) {
    console.log(error.response);
  }
};

export const updateEntry = (id, entry) => async (dispatch) => {
  try {
    const { data } = await api.updateEntry(id, entry);
    dispatch({ type: UPDATE_ENTRY, data });
  } catch (error) {
    console.log(error.response);
  }
};

export const deleteEntry = (id) => async (dispatch) => {
  
  try {
    await api.deleteEntry(id);
    dispatch({ type: DELETE_ENTRY, id });
  } catch (error) {
    console.log(error.response);
  }
};
