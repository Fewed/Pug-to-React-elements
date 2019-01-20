"use strict";

import "babel-polyfill";
import { log, sel } from "../common/lib";

import ReactDOM from "react-dom";
import React, { Component } from "react";
import Field from "./components/field.js";

//const field = new Field().render();
ReactDOM.render(<Field />, sel(".container"));
