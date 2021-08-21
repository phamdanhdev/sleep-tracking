import { AUTH_MESSAGE, ENTRY_MESSAGE } from "../constants/actionTypes";

const errorReducer = (
  state = { authMessage: null, entryMessage: null },
  action
) => {
  switch (action.type) {
    case AUTH_MESSAGE:
      return { ...state, authMessage: action?.data };

    case ENTRY_MESSAGE:
      return { ...state, entryMessage: action?.data };

    default:
      return state;
  }
};

export default errorReducer;
