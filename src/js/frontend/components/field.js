import React, { Component } from "react";
import { pre } from "./pre";

const mark = `

div(id="d00")
div(id="d0")
  div(id="d1")
    div(id="d2")
    div(id="d21")
      div(id="d3")
    div(id="d4")
      div(id="d5")

`;

class Field extends Component {
	render() {
		return pre(mark);
	}
}

export default Field;
