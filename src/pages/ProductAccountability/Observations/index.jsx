import React from "react";
import { withRouter, useHistory } from "react-router-dom";

import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@material-ui/icons/ErrorOutlineOutlined";
import WarningIcon from "@material-ui/icons/Warning";
import moment from "moment";

import PageWrapper from "../../../components/PageWrapper";
import FilterTableGrid from "../../../components/FilterTableGrid";

import {
  DispatchContext,
  StateContext,
} from "../../../contexts/ProductAccountabilityContexts";

import useStyles from "./style";
import CompleteIcon from "../../../images/complete.svg";
import PartialIcon from "../../../images/partial.svg";
import NoneIcon from "../../../images/none.svg";

import {
  StateContext as DataStateContext,
  DispatchContext as DataDispatchContext,
} from "../../../contexts/DataContexts/ObservationsData";

import {
  onMount,
  pushUrlParams,
  pushTempToState,
  getTempValues,
  makeAPIGet,
} from "../../../api/DataUtils";

import FilterMenu from "../../../components/FilterMenu";
import FilterController from "../../../components/FilterController";
import Table from "../../../components/Table";
import DateFilter from "../../../components/Filters/DateFilter";
import StringFilter from "../../../components/Filters/StringFilter";
import CheckboxFilter from "../../../components/Filters/CheckboxFilter";
import RadioFilter from "../../../components/Filters/RadioFilter";

import makeLabel from "../../../components/Filters/Labeler";

function Observations() {
  const classes = useStyles();
  const history = useHistory();

  const state = React.useContext(StateContext);
  const dispatch = React.useContext(DispatchContext);
  const dataState = React.useContext(DataStateContext);
  const dataDispatch = React.useContext(DataDispatchContext);

  const {
    lastModifiedStartDate,
    lastModifiedEndDate,
    lastModifiedPreset,
    observationStartDate,
    observationEndDate,
    observationPreset,
    observationID,
    datatakeID,
    vcid,
    showLatestVersion,
  } = state;

  const { data } = dataState;
  const { setData } = dataDispatch;

  const [
    tempLastModifiedStartDate,
    setTempLastModifiedStartDate,
  ] = React.useState(lastModifiedStartDate);
  const [tempLastModifiedEndDate, setTempLastModifiedEndDate] = React.useState(
    lastModifiedEndDate
  );
  const [tempLastModifiedPreset, setTempLastModifiedPreset] = React.useState(
    lastModifiedPreset
  );
  const [
    tempObservationStartDate,
    setTempObservationStartDate,
  ] = React.useState(observationStartDate);
  const [tempObservationEndDate, setTempObservationEndDate] = React.useState(
    observationEndDate
  );
  const [tempObservationPreset, setTempObservationPreset] = React.useState(
    observationPreset
  );
  const [tempObservationID, setTempObservationID] = React.useState(
    observationID
  );
  const [tempDatatakeID, setTempDatatakeID] = React.useState(datatakeID);
  const [tempVCID, setTempVCID] = React.useState(vcid);
  const [tempShowLatestVersion, setTempShowLatestVersion] = React.useState(
    showLatestVersion
  );
  const [tempFinished, setTempFinished] = React.useState(false);
  const [tempWarning, setTempWarning] = React.useState(false);
  const [tempProcessing, setTempProcessing] = React.useState(false);
  const [tempFailed, setTempFailed] = React.useState(false);

  const [tempComplete, setTemplComplete] = React.useState(false);
  const [tempPartial, setTempPartial] = React.useState(false);
  const [tempNone, setTempNone] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  const [filtersHidden, setFiltersHidden] = React.useState(false);

  const [showLatestVersionStr, setShowLatestVersionStr] = React.useState(
    tempShowLatestVersion ? "yes" : "no"
  );

  const tempState = {
    tempObservationStartDate,
    tempObservationEndDate,
    tempObservationPreset,
    tempLastModifiedStartDate,
    tempLastModifiedEndDate,
    tempLastModifiedPreset,
    tempObservationID,
    tempDatatakeID,
    tempVCID,
    tempShowLatestVersion,
  };

  const tempDispatch = {
    setObservationStartDate: setTempObservationStartDate,
    setObservationEndDate: setTempObservationEndDate,
    setObservationPreset: setTempObservationPreset,
    setLastModifiedStartDate: setTempLastModifiedStartDate,
    setLastModifiedEndDate: setTempLastModifiedEndDate,
    setLastModifiedPreset: setTempLastModifiedPreset,
    setObservationID: setTempObservationID,
    setDatasetID: setTempDatatakeID,
    setVCID: setTempVCID,
    setShowLatestVersion: setTempShowLatestVersion,
  };

  const toggleFinished = () => setTempFinished(!tempFinished);
  const toggleWarning = () => setTempWarning(!tempWarning);
  const toggleProcessing = () => setTempProcessing(!tempProcessing);
  const toggleFailed = () => setTempFailed(!tempFailed);

  const toggleComplete = () => setTemplComplete(!tempComplete);
  const togglePartial = () => setTempPartial(!tempPartial);
  const toggleNone = () => setTempNone(!tempNone);

  const columns = [
    { field: "datatake_id", headerName: "Datatake ID (DTID)", width: 190 },
    {
      field: "observation_id",
      headerName: "Observation ID (OBS_ID)",
      width: 190,
    },
    {
      field: "CompositeReleaseID",
      headerName: "CRID",
      width: 140,
    },
    {
      field: "CycleNumber",
      headerName: "Cycle",
      width: 90,
    },
    {
      field: "RangeStartDateTime",
      headerName: "Observation Start Time",
      width: 200,
      valueFormatter: (params) => {
        const formattedDate = moment(params.value).format(
          "YYYY/MM/DD h:mm:ss a"
        );
        return formattedDate;
      },
    },
    {
      field: "RangeStopDateTime",
      headerName: "Observation End Time",
      width: 195,
      valueFormatter: (params) => {
        if (params.value !== "N/A") {
          const formattedDate = moment(params.value).format(
            "YYYY/MM/DD h:mm:ss a"
          );
          return formattedDate;
        }
        return params.value;
      },
    },
    {
      field: "last_modified",
      headerName: "Last Modified",
      width: 300,
      valueFormatter: (params) => {
        const formattedDate = moment(params.value).format(
          "YYYY/MM/DD h:mm:ss a"
        );
        return formattedDate;
      },
    },
    {
      field: "Progress",
      headerName: "Progress",
      width: 200,
      valueFormatter: () => {
        return "Not Implemented";
      },
    },
    {
      field: "in_cop_catalog",
      headerName: "Source In COP Catalog",
      width: 220,
    },
    { field: "processing_type", headerName: "Processing Mode", width: 240 },
  ];

  const radioFilterOptions = [
    {
      label: "Yes",
      color: "primary",
      value: "true",
      name: "yes",
      labelColor: "primary",
    },
    {
      label: "No",
      color: "primary",
      value: "false",
      name: "no",
      labelColor: "primary",
    },
  ];

  const workflowStatusFormats = {
    workflowFinished: {
      label: makeLabel(
        <CheckCircleOutlineIcon />,
        "Finished",
        "finished workflow",
        "#4CAF50",
        classes
      ),
      name: "finished",
      value: tempFinished,
      setValue: toggleFinished,
      color: "primary",
      labelColor: "#4CAF50",
    },
    workflowProcessing: {
      name: "processing",
      label: makeLabel(
        <HourglassEmptyIcon />,
        "Processing",
        "Sent to CNM",
        "#007DFF",
        classes
      ),
      value: tempProcessing,
      setValue: toggleProcessing,
      color: "primary",
      labelColor: "#007DFF",
    },
    workflowFailed: {
      label: makeLabel(
        <ErrorOutlineOutlinedIcon />,
        "Failed",
        "Failed to send to DAAC",
        "#F44336",
        classes
      ),
      name: "failed",
      value: tempFailed,
      setValue: toggleFailed,
      color: "primary",
      labelColor: "#F44336",
    },
    workflowWarning: {
      label: makeLabel(
        <WarningIcon />,
        "Warning",
        "Warning encountered during processing",
        "#FF9800",
        classes
      ),
      name: "warning",
      value: tempWarning,
      setValue: toggleWarning,
      color: "primary",
      labelColor: "#FF9800",
    },
  };

  const workflowStatusOptions = [
    workflowStatusFormats.workflowFinished,
    workflowStatusFormats.workflowProcessing,
    workflowStatusFormats.workflowWarning,
    workflowStatusFormats.workflowFailed,
  ];

  const productCoverageFormats = {
    coverageComplete: {
      label: makeLabel(
        <img alt="complete" src={CompleteIcon} />,
        "Complete",
        "Partial Coverage",
        "rgba(0, 0, 0, 0.54)",
        classes
      ),
      name: "complete",
      value: tempComplete,
      setValue: toggleComplete,
      color: "primary",
      labelColor: "rgba(0, 0, 0, 0.54)",
    },
    coveragePartial: {
      name: "partial",
      label: makeLabel(
        <img alt="complete" src={PartialIcon} />,
        "Partial",
        "Partial Coverage",
        "rgba(0, 0, 0, 0.54)",
        classes
      ),
      value: tempPartial,
      setValue: togglePartial,
      color: "primary",
      labelColor: "rgba(0, 0, 0, 0.54)",
    },
    coverageNone: {
      label: makeLabel(
        <img alt="complete" src={NoneIcon} />,
        "None",
        "No Coverage",
        "rgba(0, 0, 0, 0.54)",
        classes
      ),
      name: "failed",
      value: tempNone,
      setValue: toggleNone,
      color: "primary",
      labelColor: "rgba(0, 0, 0, 0.54)",
    },
  };

  const productCoverageOptions = [
    productCoverageFormats.coverageComplete,
    productCoverageFormats.coveragePartial,
    productCoverageFormats.coverageNone,
  ];

  async function getObservationAccountabilityData() {
    const paths = ["observation"];
    const params = {
      // will be added later on.
      // obs_start: `${tempObservationStartDate}:00Z`,
      // obs_end: `${tempObservationEndDate}:00Z`,
      start: `${tempLastModifiedStartDate}:00Z`,
      end: `${tempLastModifiedEndDate}:00Z`,
    };
    if (tempObservationID !== "") {
      params.observation_id = tempObservationID;
    }
    if (tempDatatakeID !== "") {
      params.datatake_id = tempDatatakeID;
    }
    if (tempVCID !== "") {
      params.vcid = tempVCID;
    }
    let results = {};
    try {
      results = await makeAPIGet(paths, params);
    } catch (err) {
      console.error(err);
    }
    return results;
  }

  const toggleFilters = () => setFiltersHidden(!filtersHidden);

  const search = async () => {
    setLoading(true);

    setTempShowLatestVersion(showLatestVersionStr === "yes");

    pushTempToState(dispatch, tempState);

    pushUrlParams(getTempValues(state, tempState, true), history);

    const results = await getObservationAccountabilityData();
    setLoading(false);
    setData(results.data);
  };

  const reset = () => {
    setTempObservationStartDate(
      moment().startOf("day").format("YYYY-MM-DDTHH:mm")
    );
    setTempObservationEndDate(moment().endOf("day").format("YYYY-MM-DDTHH:mm"));
    setTempObservationPreset("Today");
    setTempLastModifiedStartDate(
      moment().startOf("day").format("YYYY-MM-DDTHH:mm")
    );
    setTempLastModifiedEndDate(
      moment().endOf("day").format("YYYY-MM-DDTHH:mm")
    );
    setTempLastModifiedPreset("Today");
    setShowLatestVersionStr("true");
    setTempObservationID("");
    setTempDatatakeID("");
    setTempVCID("");
  };

  React.useEffect(() => {
    onMount(history, getTempValues(state, null, false), tempDispatch);
  }, [history.location.pathname]);

  return (
    <PageWrapper>
      <FilterController hidden={filtersHidden} toggleFilters={toggleFilters} />
      <FilterTableGrid filtersHidden={filtersHidden}>
        <FilterMenu title="FILTERS" search={search} reset={reset}>
          <RadioFilter
            label="Only Show Latest Versions?"
            value={showLatestVersionStr}
            setValue={setShowLatestVersionStr}
            options={radioFilterOptions}
          />
          <CheckboxFilter
            label="Product Workflow Status"
            options={workflowStatusOptions}
          />
          <CheckboxFilter
            label="Product Coverage"
            options={productCoverageOptions}
          />
          <DateFilter
            label="Observation Date"
            startValue={tempObservationStartDate}
            setStartValue={setTempObservationStartDate}
            endValue={tempObservationEndDate}
            setEndValue={setTempObservationEndDate}
            presetValue={tempObservationPreset}
            setPresetValue={setTempObservationPreset}
            disabled
            presets
          />
          <DateFilter
            label="Last Modified Date"
            startValue={tempLastModifiedStartDate}
            setStartValue={setTempLastModifiedStartDate}
            endValue={tempLastModifiedEndDate}
            setEndValue={setTempLastModifiedEndDate}
            presetValue={tempLastModifiedPreset}
            setPresetValue={setTempLastModifiedPreset}
            presets
          />
          <StringFilter
            label="Observation ID (OBS_ID)"
            value={tempObservationID}
            setValue={setTempObservationID}
          />
          <StringFilter
            label="Datatake ID (DT_ID)"
            value={tempDatatakeID}
            setValue={setTempDatatakeID}
          />
          <StringFilter
            label="Virtual Channel ID (VCID)"
            value={tempVCID}
            setValue={setTempVCID}
            disabled
          />
        </FilterMenu>
        <Table data={data} columns={columns} loading={loading} />
      </FilterTableGrid>
    </PageWrapper>
  );
}

export default withRouter(Observations);
