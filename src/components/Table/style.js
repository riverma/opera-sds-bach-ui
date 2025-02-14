import { makeStyles } from "@material-ui/core/styles";

export default makeStyles(() => ({
  parentDiv: {
    height: "inherit",
    minHeight: "500px",
  },
  dataGridDiv: {
    paddingRight: "18px",
    display: "flex",
    height: "100%",
  },
  innerDataGridDiv: {
    flexGrow: 1,
  },
  dataGrid: {
    height: "auto",
  },
}));
