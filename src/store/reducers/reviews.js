import { addReview } from "../../api";
import { ADD_REVIEW } from "../types";

const reviewsReducer = (state={}, action) => {
  switch (action.type) {
    case ADD_REVIEW:
      return { ...state, addedReview: action.payload }
    default:
      return state;
  }
};

export default reviewsReducer;