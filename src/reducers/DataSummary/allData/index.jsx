import * as React from "react";

import { DATA } from "../../../constants";

const initialState = {
  data: [],
};

function allDataReducer(state, action) {
  switch (action.type) {
    case DATA: {
      return { ...state, data: action.payload };
    }
    default: {
      throw new Error(`Unhandled type: ${action.type}`);
    }
  }
}
/**
 * [useAllData]
 * Takes in a reducer that defaults to the allDataReducer. This is just the syntax utilizing
 * the React Reducer functionality. The = {} is just what it would default to otherwise which is required.
 * @param {*} reducer
 * @returns Object
 */
function useAllData({ reducer = allDataReducer } = {}) {
  const [{ data }, dispatch] = React.useReducer(reducer, {
    data: [],
  });
  const setData = (val) => dispatch({ type: DATA, payload: val });

  return {
    data,
    setData,
  };
}

export { useAllData, initialState, allDataReducer };
