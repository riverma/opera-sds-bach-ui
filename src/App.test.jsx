import React from "react";
import { render } from "@testing-library/react";
import "babel-polyfill";
import "@testing-library/jest-dom";

import App from "./App";

describe("App", () => {
  test("renders App component", () => {
    render(<App />);
  });
});
