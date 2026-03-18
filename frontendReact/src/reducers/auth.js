import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "../actions/type";

const user = JSON.parse(localStorage.getItem("user"));
const initialState = user
  ? { isLoggedIn: true, isRegistered: true, user }
  : { isLoggedIn: false, isRegistered: false, user: null };

export default function auth(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_SUCCESS:
      return { ...state, isLoggedIn: false, isRegistered: true };
    case REGISTER_FAIL:
      return { ...state, isLoggedIn: false, isRegistered: false };
    case LOGIN_SUCCESS:
      return { ...state, isLoggedIn: true, isRegistered: true, user: payload.user };
    case LOGIN_FAIL:
    case LOGOUT:
      return { ...state, isLoggedIn: false, isRegistered: false, user: null };
    default:
      return state;
  }
}
