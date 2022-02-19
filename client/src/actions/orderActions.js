import {
  CREATE_ORDER_FAIL,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  MY_ORDER_FAIL,
  MY_ORDER_REQUEST,
  MY_ORDER_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ALL_ORDERS_FAIL,
  ALL_ORDERS_REQUEST,
  ALL_ORDERS_SUCCESS,
  DELETE_ORDER_FAIL,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  UPDATE_ORDER_FAIL,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_SUCCESS,
  CLEAR_ERRORS,
} from "../types/orderTypes";
import axios from "axios";

export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch({
      type: CREATE_ORDER_REQUEST,
    });
    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(`/api/orders/new`, order, config);
    if (data.errormsg) {
      dispatch({
        type: CREATE_ORDER_FAIL,
        payload: data.errormsg,
      });
    }
    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CREATE_ORDER_FAIL,
      payload: error.response.data.errormsg,
    });
  }
};

export const myOrders = () => async (dispatch) => {
  try {
    dispatch({
      type: MY_ORDER_REQUEST,
    });
    const { data } = await axios.get(`/api/orders/my`);

    dispatch({
      type: MY_ORDER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MY_ORDER_FAIL,
      payload: error.response.data.errormsg,
    });
  }
};

export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch({
      type: ORDER_DETAILS_REQUEST,
    });
    const { data } = await axios.get(`/api/orders/${id}`);

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: error.response.data.errormsg,
    });
  }
};
export const getAllOrders = () => async (dispatch) => {
  try {
    dispatch({
      type: ALL_ORDERS_REQUEST,
    });

    const { data } = await axios.get(`/api/orders/all`);
    if (data.errormsg) {
      dispatch({
        type: ALL_ORDERS_FAIL,
        payload: data.errormsg,
      });
    }
    dispatch({
      type: ALL_ORDERS_SUCCESS,
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: ALL_ORDERS_FAIL,
      payload: error.response.data.errormsg,
    });
  }
};

export const updateOrders = (id, order) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_ORDER_REQUEST,
    });
    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(`/api/orders/${id}`, order, config);
    if (data.errormsg) {
      dispatch({
        type: UPDATE_ORDER_FAIL,
        payload: data.errormsg,
      });
    }
    dispatch({
      type: UPDATE_ORDER_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_ORDER_FAIL,
      payload: error.response.data.errormsg,
    });
  }
};

export const deleteOrders = (id) => async (dispatch) => {
  try {
    dispatch({
      type: DELETE_ORDER_REQUEST,
    });

    const { data } = await axios.delete(`/api/orders/${id}`);
    if (data.errormsg) {
      dispatch({
        type: DELETE_ORDER_FAIL,
        payload: data.errormsg,
      });
    }
    dispatch({
      type: DELETE_ORDER_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: DELETE_ORDER_FAIL,
      payload: error.response.data.errormsg,
    });
  }
};
// to clear errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
