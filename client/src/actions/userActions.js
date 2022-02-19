import axios from "axios";
import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGIN_REQUEST,
  REGISTER_FAIL,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  LOAD_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOGOUT_FAIL,
  GET_USERS_FAIL,
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  DELETE_USERS_FAIL,
  DELETE_USERS_REQUEST,
  DELETE_USERS_SUCCESS,
  DELETE_USERS_RESET,
  UPDATE_USERS_FAIL,
  UPDATE_USERS_RESET,
  UPDATE_USERS_REQUEST,
  UPDATE_USERS_SUCCESS,
  USERS_DETAILS_FAIL,
  USERS_DETAILS_REQUEST,
  USERS_DETAILS_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  LOGOUT_SUCCESS,
  CLEAR_ERRORS,
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
} from "../types/userTypes";

//login action
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(
      `/api/users/login`,
      { email, password },
      config
    );
    if (data.errormsg) {
      dispatch({
        type: LOGIN_FAIL,
        payload: data.errormsg,
      });
    }
    dispatch({ type: LOGIN_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: LOGIN_FAIL, payload: error.response.data.errormsg });
  }
};

// register action
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(`/api/users/register`, userData, config);
    if (data.errormsg) {
      dispatch({
        type: REGISTER_FAIL,
        payload: data.errormsg,
      });
    }
    dispatch({ type: REGISTER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: REGISTER_FAIL, payload: error.response.data.errormsg });
  }
};
// loaduser
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    const { data } = await axios.get(`/api/users/me`);

    dispatch({ type: LOAD_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: LOAD_USER_FAIL, payload: error.response.data.errormsg });
  }
};
// logout
export const logout = () => async (dispatch) => {
  try {
    await axios.get("/api/users/logout");
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    dispatch({ type: LOGOUT_FAIL, payload: error.response.data.errormsg });
  }
};
// update profile
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const { data } = await axios.put(
      `/api/users/profile/update`,
      userData,
      config
    );
    if (data.errormsg) {
      dispatch({
        type: UPDATE_PROFILE_FAIL,
        payload: data.errormsg,
      });
    }
    dispatch({ type: UPDATE_PROFILE_SUCCESS });
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response.data.errormsg,
    });
  }
};
// update Password
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PASSWORD_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(
      `/api/users/password/update`,
      passwords,
      config
    );
    if (data.errormsg) {
      dispatch({
        type: UPDATE_PASSWORD_FAIL,
        payload: data.errormsg,
      });
    }
    dispatch({ type: UPDATE_PASSWORD_SUCCESS });
  } catch (error) {
    dispatch({
      type: UPDATE_PASSWORD_FAIL,
      payload: error.response.data.errormsg,
    });
  }
};

// forgot password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(
      `/api/users/password/forgot`,
      email,
      config
    );
    if (data.errormsg) {
      dispatch({
        type: FORGOT_PASSWORD_FAIL,
        payload: data.errormsg,
      });
    }
    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.successmsg });
  } catch (error) {
    console.log(error.response);
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response.data.errormsg,
    });
  }
};

// reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(
      `/api/users/password/reset/${token}`,
      passwords,
      config
    );
    if (data.errormsg) {
      dispatch({
        type: RESET_PASSWORD_FAIL,
        payload: data.errormsg,
      });
    }
    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: true });
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: error.response.data.errormsg,
    });
  }
};

// get all users
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: GET_USERS_REQUEST });

    const { data } = await axios.get(`/api/users/admin`);

    dispatch({ type: GET_USERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_USERS_FAIL, payload: error.response.data.errormsg });
  }
};

// get user details
export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: USERS_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/users/admin/${id}`);

    dispatch({ type: USERS_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USERS_DETAILS_FAIL,
      payload: error.response.data.errormsg,
    });
  }
};

// update user info

export const updateUser = (id, userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USERS_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(
      `/api/users/admin/${id}`,
      userData,
      config
    );
    if (data.errormsg) {
      dispatch({
        type: UPDATE_USERS_FAIL,
        payload: data.errormsg,
      });
    }
    dispatch({ type: UPDATE_USERS_SUCCESS });
  } catch (error) {
    dispatch({
      type: UPDATE_USERS_FAIL,
      payload: error.response.data.errormsg,
    });
  }
};

// delete user
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USERS_REQUEST });

    const { data } = await axios.delete(`/api/users/delete/${id}`);
    if (data.errormsg) {
      dispatch({
        type: DELETE_USERS_FAIL,
        payload: data.errormsg,
      });
    }
    dispatch({ type: DELETE_USERS_SUCCESS, payload: data.successmsg });
  } catch (error) {
    dispatch({
      type: DELETE_USERS_FAIL,
      payload: error.response.data.errormsg,
    });
  }
};
// to clear errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
