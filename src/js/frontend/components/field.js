import React, { Component } from "react";
//import pre from "pug-to-react-element";
import pre from "./pre";
//pre.tabSize = 4;

const markup = `

div(id="d00") 0#[span() 1]2#[span() 3]4
div(id="d0")
  div(id="d1") 3
    31
    div(id="d2") 4
div(onClick={handler}) pow: {cnt} W {cnt2} gyuj
  div() u7
    div(id="d21") m9
  div(id="d3") 6
    div() 87
      div(id="d4") 7
    input(className="input input-main" type="tel" autoFocus required)
       
  `;

class Field extends Component {
	state = { cnt: 0, cnt2: 0 };

	handler = () => {
		let { cnt, cnt2 } = this.state;
		this.setState({ cnt: cnt + 1, cnt2: cnt2 + 5 });
	};

	render() {
		return pre.call(this, markup);
	}
}

export default Field;
