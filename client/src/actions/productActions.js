import axios from "axios";
import {
  ALL_PRODUCT_FAIL,
  ALL_PRODUCT_SUCCESS,
  ALL_PRODUCT_REQUEST,
  ADMIN_PRODUCT_FAIL,
  ADMIN_PRODUCT_SUCCESS,
  ADMIN_PRODUCT_REQUEST,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  NEW_REVIEW_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_PRODUCT_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  CLEAR_ERRORS,
} from "../types/productTypes";

export const listProducts =
  (keyword = "", currentPage = 1, price = [0, 25000], category, ratings = 0) =>
  async (dispatch) => {
    try {
      dispatch({
        type: ALL_PRODUCT_REQUEST,
      });
      let link = `/api/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&rating[gte]=${ratings}`;
      if (category) {
        link = `/api/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&rating[gte]=${ratings}`;
      }

      const { data } = await axios.get(link);
      if (data.errormsg) {
        dispatch({
          type: ALL_PRODUCT_FAIL,
          payload: data.errormsg,
        });
      }
      dispatch({
        type: ALL_PRODUCT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ALL_PRODUCT_FAIL,
        payload: error.response.data.errormsg,
      });
    }
  };

export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_DETAILS_REQUEST,
    });
    const { data } = await axios.get(`/api/products/${id}`);
    if (data.errormsg) {
      dispatch({
        type: PRODUCT_DETAILS_FAIL,
        payload: data.errormsg,
      });
    }
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.errormsg,
    });
  }
};

// new review
export const newReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({
      type: NEW_REVIEW_REQUEST,
    });
    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(
      `/api/products/review`,
      reviewData,
      config
    );
    if (data.errormsg) {
      dispatch({
        type: NEW_REVIEW_FAIL,
        payload: data.errormsg,
      });
    }
    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error.response.data.errormsg,
    });
  }
};

export const listAdminProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: ADMIN_PRODUCT_REQUEST,
    });

    const { data } = await axios.get("/api/products/admin");
    if (data.errormsg) {
      dispatch({
        type: ADMIN_PRODUCT_FAIL,
        payload: data.errormsg,
      });
    }
    dispatch({
      type: ADMIN_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_PRODUCT_FAIL,
      payload: error.response.data.errormsg,
    });
  }
};

export const newProduct = (productData) => async (dispatch) => {
  try {
    dispatch({
      type: NEW_PRODUCT_REQUEST,
    });
    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(
      `/api/products/admin/new`,
      productData,
      config
    );
    if (data.errormsg) {
      dispatch({
        type: NEW_PRODUCT_FAIL,
        payload: data.errormsg,
      });
    }
    dispatch({
      type: NEW_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_PRODUCT_FAIL,
      payload: error.response.data.errormsg,
    });
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({
      type: DELETE_PRODUCT_REQUEST,
    });
    const { data } = await axios.delete(`/api/products/admin/delete/${id}`);
    if (data.errormsg) {
      dispatch({
        type: DELETE_PRODUCT_FAIL,
        payload: data.errormsg,
      });
    }
    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: error.response.data.errormsg,
    });
  }
};

// to clear errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
