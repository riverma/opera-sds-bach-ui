import React from "react";
import { withRouter, useHistory } from "react-router-dom";

import { Typography } from "@material-ui/core";

import moment from "moment";

import {
  onMount,
  pushUrlParams,
  pushTempToState,
  getTempValues,
  makeAPIGet,
} from "../../../api/DataUtils";

import {
  DispatchContext,
  StateContext,
} from "../../../contexts/ReportingContexts";

import {
  StateContext as DataStateContext,
  DispatchContext as DataDispatchContext,
} from "../../../contexts/DataContexts/ObservationsReport";

import FilterMenu from "../../../components/FilterMenu";
import FilterController from "../../../components/FilterController";
import Table from "../../../components/Table";
import DateFilter from "../../../components/Filters/DateFilter";
import StringFilter from "../../../components/Filters/StringFilter";
import SelectFilter from "../../../components/Filters/SelectFilter";
import RadioFilter from "../../../components/Filters/RadioFilter";
import SummaryTable from "../../../components/SummaryTable";
import PageWrapper from "../../../components/PageWrapper";
import FilterTableGrid from "../../../components/FilterTableGrid";

import useStyles from "./style";

function Observations() {
  const history = useHistory();
  const classes = useStyles();

  const [filtersHidden, setFiltersHidden] = React.useState(false);

  const state = React.useContext(StateContext);
  const dispatch = React.useContext(DispatchContext);
  const dataState = React.useContext(DataStateContext);
  const dataDispatch = React.useContext(DataDispatchContext);

  const {
    startDate,
    endDate,
    preset,
    crid,
    processingMode,
    reportType,
  } = state;

  const { data, summary } = dataState;
  const { setData, setSummary } = dataDispatch;

  const [tempStartDate, setTempStartDate] = React.useState(startDate);
  const [tempEndDate, setTempEndDate] = React.useState(endDate);
  const [tempPreset, setTempPreset] = React.useState(preset);
  const [tempCRID, setTempCRID] = React.useState(crid);
  const [tempProcessingMode, setTempProcessingMode] = React.useState(
    processingMode
  );
  const [tempReportType, setTempReportType] = React.useState(reportType);

  const [loading, setLoading] = React.useState(false);

  const tempState = {
    tempStartDate,
    tempEndDate,
    tempPreset,
    tempCRID,
    tempProcessingMode,
    tempReportType,
  };

  const tempDispatch = {
    setStartDate: setTempStartDate,
    setEndDate: setTempEndDate,
    setPreset: setTempPreset,
    setCRID: setTempCRID,
    setProcessingMode: setTempProcessingMode,
    setReportType: setTempReportType,
  };

  const columns = [
    { field: "id", headerName: "Observation ID", width: 220 },
    {
      field: "PERCENT_COMPLETE",
      headerName: "Perecent Complete",
      width: 220,
    },
    { field: "LATENCY", headerName: "Latency", width: 220 },
    { field: "PRODUCT_SIZE", headerName: "Product Size (Bytes)", width: 220 },
    { field: "COMPLETENESS", headerName: "Completeness", width: 220 },
  ];

  const radioFilterOptions = [
    {
      label: "Brief",
      color: "primary",
      value: "brief",
      name: "brief",
      labelColor: "primary",
    },
    {
      label: "Detailed",
      color: "primary",
      value: "detailed",
      name: "detailed",
      labelColor: "primary",
    },
  ];

  const toggleFilters = () => setFiltersHidden(!filtersHidden);

  const getObservationReport = async () => {
    const paths = ["reports", "ObservationAccountabilityReport"];
    const params = {
      startDateTime: `${tempStartDate}:00Z`,
      endDateTime: `${tempEndDate}:00Z`,
      mime: `json`,
    };
    let results = {};
    try {
      results = await makeAPIGet(paths, params);
    } catch (err) {
      console.error(err);
    }
    return results;
  };

  const fixObservationData = (obsData) => {
    const newData = obsData.map((val) => {
      const newVal = val;
      const id = newVal.OBS_ID;
      delete newVal.OBS_ID;
      newVal.id = id;
      return newVal;
    });
    return newData;
  };

  const search = async () => {
    setLoading(true);
    pushTempToState(dispatch, tempState);

    pushUrlParams(getTempValues(state, tempState, true), history);
    const results = await getObservationReport();
    results.data = JSON.parse(results.data);
    setLoading(false);
    setSummary(results.data.HEADER);
    const observations = fixObservationData(results.data.OBSERVATION);
    setData(observations);
  };

  const reset = () => {
    setTempStartDate(moment().startOf("day").format("YYYY-MM-DDTHH:mm"));
    setTempEndDate(moment().endOf("day").format("YYYY-MM-DDTHH:mm"));
    setTempPreset("Today");
    setTempCRID("");
    setTempReportType("brief");
  };

  React.useEffect(() => {
    // grans url params if they are passed into url manually, otherwise grabs the current state.
    onMount(history, getTempValues(state, tempState, true), tempDispatch);
  }, [history.location.pathname]);

  return (
    <PageWrapper>
      <FilterController hidden={filtersHidden} toggleFilters={toggleFilters} />
      <FilterTableGrid filtersHidden={filtersHidden}>
        <FilterMenu title="REPORT SETTINGS" search={search} reset={reset}>
          <DateFilter
            label="Date"
            startValue={tempStartDate}
            setStartValue={setTempStartDate}
            endValue={tempEndDate}
            setEndValue={setTempEndDate}
            presetValue={tempPreset}
            setPresetValue={setTempPreset}
            presets
          />
          <StringFilter
            label="Component Release ID (CRID)"
            value={tempCRID}
            setValue={setTempCRID}
          />
          <SelectFilter
            label="Processing Mode"
            options={[]}
            value={tempProcessingMode}
            setValue={setTempProcessingMode}
          />
          <RadioFilter
            label="Report Type"
            value={tempReportType}
            setValue={setTempReportType}
            options={radioFilterOptions}
          />
        </FilterMenu>
        <>
          <div className={classes.summaryTable}>
            <Typography variant="h6">Report Summary</Typography>
            <SummaryTable data={summary} />
          </div>
          <div className={classes.reportTable}>
            <Typography variant="h6">Report Data</Typography>
            <Table data={data} columns={columns} loading={loading} />
          </div>
        </>
      </FilterTableGrid>
    </PageWrapper>
  );
}

export default withRouter(Observations);
