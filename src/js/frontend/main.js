"use strict";

import "babel-polyfill";
import { log, sel } from "../common/lib";

import ReactDOM from "react-dom";
import React, { Component } from "react";
import Button from "./components/button.jsx";
import Button2 from "./components/button.pug";

ReactDOM.render(<Button />, sel(".container"));
