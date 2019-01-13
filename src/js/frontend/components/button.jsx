import React, { Component } from "react";

/*
const markup = React.createElement(
  "div",
  { id: "d7", className: "i8" },
  React.createElement("div", null, React.createElement("div", null)),
  React.createElement("div", null, React.createElement("div", null))
);
*/

const log = console.log.bind(console);
const crel = React.createElement;
const frag = React.Fragment;

// const mark = `

// div(id="d0")
//   div(id="d1")
//     div(id="d2")
//   div(id="d3")
//     div(id="d4")

// `.trim();

// const mark = `

// div(id="d0")
//   div(id="d1")
//   div(id="d2")

// `.trim();

// const mark = `

// div(id="d0")
//   div(id="d1")
//     div(id="d2")
//     div(id="d21")
//       div(id="d3")
//   div(id="d4")

// `.trim();

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

/*
function ext() {
  let flatArr = [],
    nestArr = [],
    backArr = [],
    cnt = -1,
    children = {},
    tabPre = 0,
    backl = "default",
    store,
    returnFlag,
    acc,
    cur;

  function setMode(pre, cur) {
    if (pre < cur) return "nest";
    else if (pre > cur) return "back";
    return "flat";
  }

  function getMode(mode) {
    if (mode === "flat") return flatArr;
    else if (mode === "nest") return nestArr;
    return backArr;
  }

  function thr(str) {
    const { tab, tag, attrs, tail } = slicer(str);

    let mode = setMode(tabPre, tab);
    tabPre = tab;
    cnt++;

    if (tail) {
      if (!cnt) {
        log(1);
        log(mode, "doesnt matter");
        
        // thr(tail);
        // const arr = getMode(mode);
        // return crel(tag, attrs, ...arr);
        
        thr(tail);

        return crel(tag, attrs, ...nestArr);
      } else {
        log(2);
        log(mode);
        thr(tail);
        if (returnFlag) {
          returnFlag = false;
          mode = "back";
        }
        const arr = getMode(mode);
        children = crel(tag, attrs, ...arr);

        //    log(children); // d21 -> d3
        //      log("flatArr", ...flatArr);
        if (backl !== "default" && backl === tab) {
          backl = "default";
          backArr = [];
          flatArr = [children, ...flatArr, store];
          nestArr = [children, store];
        } else {
          flatArr = [children, ...flatArr];
          nestArr = [children];
        }

        
        // thr(tail);
        // const arr = getMode(mode);
        // children = crel(tag, attrs, ...arr);
        // nestArr = [children];
        // flatArr = [children, ...flatArr];
        
      }
    } else {
      log(3);
      log(mode);
      children = crel(tag, attrs);
      if (mode !== "back") {
        flatArr = [children, ...flatArr];
        nestArr = [children];
      } else {
        flatArr = [];
        nestArr = [];
        backArr = [];
        backl = 1;
        store = children;
        returnFlag = true;
      }

      
      // children = crel(tag, attrs);
      // nestArr = [children];
      // flatArr = [children, ...flatArr];
      
    }
  }

  return thr(mark);
}
*/

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

/*

создание элементов происходит в обратном порядке, поэтому текущий таб сравнивается со следущим

*/
