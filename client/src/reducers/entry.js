import {
  FETCH_ALL,
  CREATE_ENTRY,
  UPDATE_ENTRY,
  DELETE_ENTRY,
} from "../constants/actionTypes";

const entryReducer = (entryData = [], action) => {
  switch (action.type) {
    case FETCH_ALL:
      let entry = action?.data;
      entry.sort(
        (a, b) =>
          b.date.split("/").reverse().join("") -
          a.date.split("/").reverse().join("")
      );

      return entry;

    case CREATE_ENTRY:
      if (action?.data) {
        return [...entryData, action.data];
      }
      return entryData;

    case UPDATE_ENTRY:
      return entryData.map((entry) => {
        if (entry._id === action?.data._id) {
          return action.data;
        } else {
          return entry;
        }
      });

    case DELETE_ENTRY:
      return entryData.filter((entry) => entry._id !== action.id);

    default:
      return entryData;
  }
};

export default entryReducer;
