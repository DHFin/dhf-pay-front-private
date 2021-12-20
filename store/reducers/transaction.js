import {GET_TRANSACTION_START, GET_TRANSACTION_SUCCESS, GET_TRANSACTION_FAILED} from "../actions/transaction";
import {POST_LOGOUT_SUCCESS} from "../actions/auth";

const initialState = {
  data: {},
  isLoading: false,
  error: '',
  isChanged: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case  POST_LOGOUT_SUCCESS:
      return initialState;
    case  GET_TRANSACTION_START:
      return {
        ...state,
        start: true,
        isLoading: true,
        isChanged: true
      };
    case  GET_TRANSACTION_SUCCESS:
      return {
        ...state,
        data: action.payload,
        start: false,
        error: '',
        isLoading: false,
        isChanged: true
      };
    case  GET_TRANSACTION_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isChanged: true
      };
    default:
      return state
  }
}
