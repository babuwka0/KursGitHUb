import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_MESSAGE,
} from "./type";
import AuthService from "../services/auth.service";

const register = (username, password, role) => (dispatch) => {
  return AuthService.register(username, password, role)
    .then((res) => {
      dispatch({ type: REGISTER_SUCCESS });
      dispatch({ type: SET_MESSAGE, payload: res.data?.message || "Регистрация успешна" });
      return Promise.resolve();
    })
    .catch((err) => {
      dispatch({ type: REGISTER_FAIL });
      const msg = err.response?.data?.message || err.message || "Ошибка регистрации";
      dispatch({ type: SET_MESSAGE, payload: msg });
      return Promise.reject();
    });
};

const login = (username, password) => (dispatch) => {
  return AuthService.login(username, password)
    .then((data) => {
      dispatch({ type: LOGIN_SUCCESS, payload: { user: data } });
      return Promise.resolve();
    })
    .catch((err) => {
      dispatch({ type: LOGIN_FAIL });
      const msg = err.response?.data?.message || err.message || "Ошибка входа";
      dispatch({ type: SET_MESSAGE, payload: msg });
      return Promise.reject();
    });
};

const logout = () => (dispatch) => {
  AuthService.logout();
  dispatch({ type: LOGOUT });
};

export default { register, login, logout };
