import * as React from "react";

import moment from "moment";

import {
  START_DATE,
  END_DATE,
  PRESET,
  PRODUCT_TYPE,
  SOURCE,
  DATA,
} from "../../constants";

const actionTypes = {
  startDate: START_DATE,
  endDate: END_DATE,
  preset: PRESET,
  productType: PRODUCT_TYPE,
  source: SOURCE,
  data: DATA,
};

const initialState = {
  startDate: moment().startOf("day").format("YYYY-MM-DDTHH:mm"),
  endDate: moment().endOf("day").format("YYYY-MM-DDTHH:mm"),
  preset: "",
  productType: "",
  source: "",
  data: [],
};

function dataSummaryReducer(state, action) {
  switch (action.type) {
    case START_DATE: {
      return { ...state, startDate: action.payload };
    }
    case END_DATE: {
      return { ...state, endDate: action.payload };
    }
    case PRESET: {
      return { ...state, preset: action.payload };
    }
    case PRODUCT_TYPE: {
      return { ...state, productType: action.payload };
    }
    case SOURCE: {
      return { ...state, source: action.payload };
    }
    case DATA: {
      return { ...state, data: action.payload };
    }
    default: {
      throw new Error(`Unhandled type: ${action.type}`);
    }
  }
}

function useDataSummary({ reducer = dataSummaryReducer } = {}) {
  const [
    { startDate, endDate, preset, productType, source, data },
    dispatch,
  ] = React.useReducer(reducer, {
    startDate: moment().startOf("day").format("YYYY-MM-DDTHH:mm"),
    endDate: moment().endOf("day").format("YYYY-MM-DDTHH:mm"),
    preset: "Today",
    productType: "",
    source: "",
    data: [],
  });

  const setStartDate = (val) => {
    dispatch({ type: actionTypes.startDate, payload: val });
  };
  const setEndDate = (val) =>
    dispatch({ type: actionTypes.endDate, payload: val });
  const setPreset = (val) =>
    dispatch({ type: actionTypes.preset, payload: val });
  const setProductType = (val) =>
    dispatch({ type: actionTypes.productType, payload: val });
  const setSource = (val) =>
    dispatch({ type: actionTypes.source, payload: val });
  const setData = (val) => dispatch({ type: actionTypes.data, payload: val });

  return {
    startDate,
    endDate,
    preset,
    productType,
    source,
    data,
    setStartDate,
    setEndDate,
    setPreset,
    setProductType,
    setSource,
    setData,
  };
}

export { useDataSummary, actionTypes, initialState, dataSummaryReducer };
