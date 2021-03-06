import { AUTH_USER, LOGOUT_USER, SEND_CONTACT } from "../types";

const INITIAL_STATE = {
  isAuth: false,
  user: null,
  checkingAuth: false // asta e fol pt loading, dupa ce trimitem req din auth
};

const auth = function(state=INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER: 
      return { ...action.payload, checkingAuth:true };
    case LOGOUT_USER:
      return { ...state, user: null, isAuth: false };
    case SEND_CONTACT:
      return {...state,contact: action.payload };
    default:
      return state;
  }
}

export default auth;