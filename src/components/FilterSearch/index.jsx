import React from "react";
import PropTypes from "prop-types";

import clsx from "clsx";

import { Button } from "@material-ui/core";

import useStyles from "./style";

export default function FilterSearch(props) {
  const classes = useStyles();

  const { onClick } = props;

  return (
    <div className={classes.searchDiv}>
      <Button
        variant="contained"
        className={clsx(classes.searchBtn, classes.text)}
        onClick={onClick}
        data-testid="search-filter-button"
      >
        SEARCH
      </Button>
    </div>
  );
}

FilterSearch.propTypes = {
  onClick: PropTypes.func.isRequired,
};
