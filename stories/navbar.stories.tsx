import { storiesOf } from "@storybook/react";
import { Button } from "antd";
import "antd/dist/antd.css";
import * as React from "react";

storiesOf("Navbar", module).add("menu", () => (
  <Button type="primary">Test</Button>
));
