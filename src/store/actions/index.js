import {
  AUTH_USER,
  LOGOUT_USER,
  ADD_REVIEW,
  CLEAR_REVIEW,
  GET_REVIEWS,
  GET_REVIEW_BY_ID,
  FETCH_POSTS,
  SEND_CONTACT
} from '../types';
import * as api from "../../api";

export const registerUser = userData => ({
  type: AUTH_USER,
  payload: api.registerUser(userData)
});

export const loginUser = userData => ({
  type: AUTH_USER,
  payload: api.loginUser(userData)
});

export const autoSignIn = () => ({
  type: AUTH_USER,
  payload: api.autoSignIn()
});

export const logOut = () => ({
  type: LOGOUT_USER,
  payload: api.logOut()
});

export const updateProfile = (formData, isEmailChanged) => ({
  type: AUTH_USER,
  payload: api.updateProfile(formData, isEmailChanged)
});

// reviews

export const addReview = (data, user) => ({
  type: ADD_REVIEW,
  payload: api.addReview(data, user)
});

export const clearReview = () => ({
  type: CLEAR_REVIEW,
  payload:null
})

export const getReviews = (limit) => ({
  type:GET_REVIEWS,
  payload: api.getReviews(limit)
}) // pasam o limita pt ca nu le vrem pe toate

export const loadMoreReviews = (limit, reviews) => ({
  type:GET_REVIEWS,
  payload: api.loadMoreReviews(limit, reviews)
}) // pasam limita si toate reviews data din redux, pt ca vrem ultima, ar putea pasa direct ultima mai bine

export const getReviewById = (id) => ({
  type:GET_REVIEW_BY_ID,
  payload: api.getReviewById(id)
}) // doar id ul tre ca sa facem req

export const editReview = (data,id) => ({
  type:GET_REVIEW_BY_ID,
  payload: api.editReview(data,id)
})

// posts

export const fetchPosts = (limit,condition) => ({
  type:FETCH_POSTS,
  payload: api.fetchPosts(limit,condition)
}) // pasam limita si conditia // Vezi ca ii e lene sa faca alt reducer, fol tot pe ala pt reviews lol

// contact 
export const sendContact = (data) => ({
  type:SEND_CONTACT,
  payload: api.sendContact(data)
}); // fol reducerul auth ptasta lol, de lene