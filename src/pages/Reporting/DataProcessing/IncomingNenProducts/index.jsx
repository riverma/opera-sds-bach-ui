import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { Grid } from "@material-ui/core";

import Table from "../../../../components/Table";

import useStyles from "./style";

function GeneratedSdsProducts(props) {
  const classes = useStyles();

  const { data, loading } = props;

  const columns = [
    { field: "id", headerName: "File Name", width: 360 },
    {
      field: "num_ingested",
      headerName: "Files Ingested",
      width: 360,
    },
    {
      field: "volume",
      headerName: "Volume (Bytes)",
      width: 360,
      valueFormatter: (params) => {
        return `${String(params.value)}`;
      },
    },
  ];

  return (
    <>
      <Grid item xs={12} className={classes.reportTable}>
        <Table data={data} columns={columns} loading={loading} />
      </Grid>
    </>
  );
}

GeneratedSdsProducts.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.shape),
};

GeneratedSdsProducts.defaultProps = {
  data: [],
  loading: false,
};

export default withRouter(GeneratedSdsProducts);
