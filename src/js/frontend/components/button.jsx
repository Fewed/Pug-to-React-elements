import React, { Component } from "react";

const log = console.log.bind(console);
const crel = React.createElement;
const frag = React.Fragment;

const mark = `

div(id="d0")
  div(id="d1")
    div(id="d2")
    div(id="d21")
      div(id="d3")
    div(id="d4")
      div(id="d5")

`.trim();

function slicer(str) {
  const ind = str.indexOf("\n");
  let first, tail;
  if (ind === -1) [first, tail] = [str, null];
  else [first, tail] = [str.slice(0, ind), str.slice(ind + 1)];
  let tab = first.match(/ {2}/g);
  tab = tab === null ? 0 : tab.length;
  first = first.trim();
  let [tag, attrs] = [first.match(/\w*/)[0], first.match(/\w*="\w*"/)[0]]; // simplified
  attrs = Object.defineProperty({}, attrs.split("=")[0], {
    value: attrs.split("=")[1].replace(/"/g, ""),
    enumerable: true
  });
  attrs.key = "key" + Math.round(1e15 * Math.random());
  return { tab, tag, attrs, tail };
}

function ext() {
  let cnt = 0,
    tabPre,
    depth,
    res,
    store;

  function thr(str) {
    const { tab, tag, attrs, tail } = slicer(str);

    if (tail) {
      if (!cnt) {
        log(1);
        cnt++;
        thr(tail);
        return crel(tag, attrs, ...res);
        //return crel(frag, null, ...res);
      } else {
        log(2);
        cnt++;
        thr(tail);
        if (tabPre > tab) res = [crel(tag, attrs, ...res)];
        else if (tabPre === tab) res = [crel(tag, attrs), ...res];
        else {
          depth = tabPre;
          store = res;
          res = tab === depth ? [] : [crel(tag, attrs)];
        }
        if (tab === depth) {
          res = [...res, ...store];
          depth = undefined;
        }
        //      log(tab, tabPre, res);
        tabPre = tab;
      }
    } else {
      log(3);
      res = [crel(tag, attrs)];
      //     log(tab, tabPre, res);
      tabPre = tab;
    }
  }

  return thr(mark);
}

class Button extends Component {
  render() {
    return ext();
  }
}

export default Button;
