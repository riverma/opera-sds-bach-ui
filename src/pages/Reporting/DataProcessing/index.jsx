import React from "react";
import PropTypes from "prop-types";
import { withRouter, useHistory, Redirect, Route } from "react-router-dom";

import { Typography } from "@material-ui/core";

import moment from "moment";

import {
  onMount,
  pushUrlParams,
  pushTempToState,
  getTempValues,
  makeAPIGet,
} from "../../../api/DataUtils";

import { getPathTail } from "../../../api/utils";

import {
  DispatchContext,
  StateContext,
} from "../../../contexts/ReportingContexts";

import {
  StateContext as DataStateNenContext,
  DispatchContext as DataDispatchNenContext,
} from "../../../contexts/DataContexts/DataProcessing/IncomingNen";

import {
  StateContext as DataStateGdsContext,
  DispatchContext as DataDispatchGdsContext,
} from "../../../contexts/DataContexts/DataProcessing/IncomingGds";

import {
  StateContext as DataStateGeneratedContext,
  DispatchContext as DataDispatchGeneratedContext,
} from "../../../contexts/DataContexts/DataProcessing/GeneratedSds";

import {
  StateContext as DataStateOutgoingContext,
  DispatchContext as DataDispatchOutgoingContext,
} from "../../../contexts/DataContexts/DataProcessing/OutgoingDaac";

import FilterMenu from "../../../components/FilterMenu";
import FilterController from "../../../components/FilterController";
import DateFilter from "../../../components/Filters/DateFilter";
import StringFilter from "../../../components/Filters/StringFilter";
import SelectFilter from "../../../components/Filters/SelectFilter";
import RadioFilter from "../../../components/Filters/RadioFilter";
import SummaryTable from "../../../components/SummaryTable";
import TabMenu from "../../../components/TabMenu";
import PageWrapper from "../../../components/PageWrapper";
import FilterTableGrid from "../../../components/FilterTableGrid";

import IncomingNenProducts from "./IncomingNenProducts";
import IncomingGdsProducts from "./IncomingGdsProducts";
import GeneratedSdsProducts from "./GeneratedSdsProducts";
import OutgoingDaacProducts from "./OutgoingDaacProducts";

import useStyles from "./style";

function DataProcessing(props) {
  const history = useHistory();
  const classes = useStyles();

  const { match } = props;

  const links = [
    { path: "incoming-nen", label: "Incoming NEN Files" },
    { path: "incoming-gds", label: "Incoming GDS Ancillary Files" },
    { path: "generated-sds", label: "Generated SDS Products" },
    { path: "outgoing-to-daac", label: "Outgoing Products To DAAC" },
  ];

  const [filtersHidden, setFiltersHidden] = React.useState(false);

  const state = React.useContext(StateContext);
  const dispatch = React.useContext(DispatchContext);

  const nenDataState = React.useContext(DataStateNenContext);
  const nenDataDispatch = React.useContext(DataDispatchNenContext);

  const gdsDataState = React.useContext(DataStateGdsContext);
  const gdsDataDispatch = React.useContext(DataDispatchGdsContext);

  const generatedDataState = React.useContext(DataStateGeneratedContext);
  const generatedDataDispatch = React.useContext(DataDispatchGeneratedContext);

  const outgoingDataState = React.useContext(DataStateOutgoingContext);
  const outgoingDataDispatch = React.useContext(DataDispatchOutgoingContext);

  const {
    startDate,
    endDate,
    preset,
    crid,
    processingMode,
    reportType,
  } = state;

  const nenData = nenDataState.data;
  const nenSummary = nenDataState.summary;
  const setNenData = nenDataDispatch.setData;
  const setNenSummary = nenDataDispatch.setSummary;

  const gdsData = gdsDataState.data;
  const gdsSummary = gdsDataState.summary;
  const setGdsData = gdsDataDispatch.setData;
  const setGdsSummary = gdsDataDispatch.setSummary;

  const generatedData = generatedDataState.data;
  const generatedSummary = generatedDataState.summary;
  const setGeneratedData = generatedDataDispatch.setData;
  const setGeneratedSummary = generatedDataDispatch.setSummary;

  const outgoingData = outgoingDataState.data;
  const outgoingSummary = outgoingDataState.summary;
  const setOutgoingData = outgoingDataDispatch.setData;
  const setOutgoingSummary = outgoingDataDispatch.setSummary;

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

  const keyMap = {
    crid: "CRID",
    data_recieved_time_range: "Data Recieved Time Range",
    processing_mode: "Processing Mode",
    time_of_report: "Time of Report",
    total_data_volume: "Total Data Volume",
    total_products_produced: "Total Products Produced",
    venue: "Venue",
  };

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

  const getIncomingNen = async () => {
    const paths = ["reports", "IncomingFiles"];
    const params = {
      startDateTime: `${tempStartDate}:00Z`,
      endDateTime: `${tempEndDate}:00Z`,
      reportType: "nen",
    };
    let results = {};
    try {
      results = await makeAPIGet(paths, params);
    } catch (err) {
      console.error(err);
    }
    return results;
  };

  const getIncomingGds = async () => {
    const paths = ["reports", "IncomingFiles"];
    const params = {
      startDateTime: `${tempStartDate}:00Z`,
      endDateTime: `${tempEndDate}:00Z`,
      reportType: "gds_ancillary",
    };
    let results = {};
    try {
      results = await makeAPIGet(paths, params);
    } catch (err) {
      console.error(err);
    }
    return results;
  };

  const getGeneratedSdsProducts = async () => {
    const paths = ["reports", "GeneratedSdsProducts"];
    const params = {
      startDateTime: `${tempStartDate}:00Z`,
      endDateTime: `${tempEndDate}:00Z`,
      reportType: "gds_ancillary",
    };
    let results = {};
    try {
      results = await makeAPIGet(paths, params);
    } catch (err) {
      console.error(err);
    }
    return results;
  };

  const getOutgoingDaacProducts = async () => {
    const paths = ["reports", "DaacOutgoingProducts"];
    const params = {
      startDateTime: `${tempStartDate}:00Z`,
      endDateTime: `${tempEndDate}:00Z`,
      reportType: "gds_ancillary",
    };
    let results = {};
    try {
      results = await makeAPIGet(paths, params);
    } catch (err) {
      console.error(err);
    }
    return results;
  };

  const formatReportData = (idField, reportData) => {
    const newData = reportData.map((val) => {
      const newVal = val;
      const id = newVal[idField];
      delete newVal[idField];
      newVal.id = id;
      return newVal;
    });

    return newData;
  };

  const getReport = async (reportName) => {
    switch (reportName) {
      case "incoming-nen":
        return getIncomingNen();
      case "incoming-gds":
        return getIncomingGds();
      case "generated-sds":
        return getGeneratedSdsProducts();
      case "outgoing-to-daac":
        return getOutgoingDaacProducts();
      default:
        throw new Error(`No such report: ${reportName}`);
    }
  };

  const setReportInfo = (reportName, results) => {
    switch (reportName) {
      case "incoming-nen":
        setNenSummary(results.data.header);
        setNenData(formatReportData("name", results.data.products));
        return true;
      case "incoming-gds":
        setGdsSummary(results.data.header);
        setGdsData(formatReportData("name", results.data.products));
        return true;
      case "generated-sds":
        setGeneratedSummary(results.data.header);
        setGeneratedData(formatReportData("name", results.data.products));
        return true;
      case "outgoing-to-daac":
        setOutgoingSummary(results.data.header);
        setOutgoingData(formatReportData("name", results.data.products));
        return true;
      default:
        throw new Error(`No such report: ${reportName}`);
    }
  };

  const getSummary = () => {
    const currentPath = getPathTail(history);
    switch (currentPath) {
      case "data-processing":
        return {};
      case "incoming-nen":
        return nenSummary || {};
      case "incoming-gds":
        return gdsSummary || {};
      case "generated-sds":
        return generatedSummary || {};
      case "outgoing-to-daac":
        return outgoingSummary || {};
      default:
        throw new Error(`No such summary associated with path: ${currentPath}`);
    }
  };

  const search = async () => {
    setLoading(true);
    pushTempToState(dispatch, tempState);

    pushUrlParams(getTempValues(state, tempState, true), history);
    const path = getPathTail(history);
    const results = await getReport(path);
    setLoading(false);
    setReportInfo(path, results);
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
        <div>
          <div className={classes.summaryTable}>
            <Typography variant="h6">Report Summary</Typography>
            <SummaryTable data={getSummary()} keyMap={keyMap} />
          </div>
          <Typography variant="h6">Report Data</Typography>
          <TabMenu links={links} match={match} classes={classes.reportTab} />

          <div className={classes.subPage}>
            {/* this allows to move to the first tab when clicking the link in the sidebar */}
            <Route
              exact
              path={`${match.path}`}
              render={() => <Redirect to={`${match.path}/incoming-nen`} />}
            />

            {/* todo: may move this to config file and map over array */}
            <Route
              path={`${match.path}/incoming-nen`}
              render={() => (
                <IncomingNenProducts data={nenData} loading={loading} />
              )}
            />
            <Route
              path={`${match.path}/incoming-gds`}
              render={() => (
                <IncomingGdsProducts data={gdsData} loading={loading} />
              )}
            />
            <Route
              path={`${match.path}/generated-sds`}
              render={() => (
                <GeneratedSdsProducts data={generatedData} loading={loading} />
              )}
            />
            <Route
              path={`${match.path}/outgoing-to-daac`}
              render={() => (
                <OutgoingDaacProducts data={outgoingData} loading={loading} />
              )}
            />
          </div>
        </div>
      </FilterTableGrid>
    </PageWrapper>
  );
}

DataProcessing.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(DataProcessing);
