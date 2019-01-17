import React, { Component } from "react";
import pre from "./pre";
// pre.tabSize = 2;

/*
const mark = `

div(id="d00") 7
div(id="d0")
  div(id="d1")
    div(id="d2")
    div(id="d21")
      div(id="d3")
    div(id="d4")
      div(id="d5")
        input(className="input input-main" type="tel" autoFocus required)

`;
*/

const mark = `

div(id="d00") 0#[span() 1]2#[span() 3]4
div(id="d0")
  div(id="d1") 3
    31
    div(id="d2") 4
    div(id="d21") 5
      div(id="d3") 6
    div(id="d4") 7
     

`;

class Field extends Component {
	render() {
		return pre(mark);
	}
}

export default Field;
