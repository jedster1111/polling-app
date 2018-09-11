import * as React from "react";
import { PollInput } from "../../../server/models/database";

class PollForm extends React.Component<{}, PollInput> {
  constructor(props: {}) {
    super(props);
    this.state = {
      creatorName: "",
      pollName: "",
      description: "",
      options: []
    };
  }
}

export default PollForm;
