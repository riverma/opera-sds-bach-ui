import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { Grid } from "@material-ui/core";

import Table from "@bach/components/Table";

import { toByteString } from "@bach/pages/Reporting/DataProcessing/utils";

import useStyles from "./style";

function OutgoingDaacProducts(props) {
  const classes = useStyles();

  const { data, loading } = props;

  const columns = [
    {
      field: "id",
      headerName: "File Name",
      flex: 0,
      minWidth: 200,
    },
    {
      field: "products_delivered",
      headerName: "Files Published",
      flex: 0,
      minWidth: 170,
    },
    {
      field: "volume",
      headerName: "Volume",
      flex: 0,
      minWidth: 180,
      valueFormatter: (params) => {
        const { value } = params;
        return toByteString(value);
      },
    },
  ];

  return (
    <Grid item xs={12} className={classes.reportTable}>
      <Table data={data} columns={columns} loading={loading} />
    </Grid>
  );
}

OutgoingDaacProducts.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape),
};

OutgoingDaacProducts.defaultProps = {
  data: [],
};

export default withRouter(OutgoingDaacProducts);
