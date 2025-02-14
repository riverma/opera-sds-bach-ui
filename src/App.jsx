import React from "react";

import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import Routes from "./pages/Routes";

import Contexts from "./contexts";

const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#007DFF",
    },
    secondary: {
      main: "#EEEEEE",
    },
    background: {
      main: "#FFFFFF",
    },
  },
});

function App() {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ThemeProvider theme={defaultTheme}>
        <Contexts>
          <Routes />
        </Contexts>
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  );
}

export default App;
