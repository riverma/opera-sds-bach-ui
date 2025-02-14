import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import InfoIcon from "@material-ui/icons/Info";

import MenuLink from "./index";

describe("Menu Link", () => {
  const renderComponent = ({ label, icon, opened }) =>
    render(<MenuLink label={label} icon={icon} opened={opened} />);

  test("renders MenuLink component", () => {
    const label = "Information";

    const { getByText } = renderComponent({
      label,
      icon: <InfoIcon />,
    });

    expect(getByText("Information")).toBeInTheDocument();
  });
});
