import { createElement as crEl, Fragment as crFr } from "react";

/** defines indentation size */
pre.tabSize = 2;

/** generates unique string */
const getID = () => Date.now() + "" + Math.random();

/** creates ndentation */
const createSpaces = (num, tabSize = pre.tabSize) =>
  [...Array(num * tabSize)].reduce(acc => acc + " ", "");

/** calculates number of tabs */
const getTabs = (str, tabSize = pre.tabSize) => {
  const selector = {
    2: str.match(/ {2}/g),
    3: str.match(/ {3}/g),
    4: str.match(/ {4}/g)
  };
  const tabs = selector[tabSize];

  if (tabs === undefined) {
    throw new Error("A number of tabs must be in range 2-4 inclusive!");
  }
  return !tabs ? 0 : tabs.length;
};

/** generates attributes object for React.createElement */
function setAttributes(str) {
  const attrsRaw = str.slice(str.indexOf("(") + 1, str.indexOf(") "));

  /** gets attributes with value */
  const attrs = attrsRaw.match(/\w*=".*?"/g) || [];

  /** gets attributes without value */
  attrsRaw.split(/\w*=".*?"/).map(item => {
    const singletons = item.trim().split(" ");
    singletons.map(singleton => {
      if (singleton) attrs.push(`${singleton}=""`);
    });
  });

  const obj = {};
  attrs.map(item => {
    let [attr, val] = item.split("=");
    val = val.replace(/"/g, "");
    Object.defineProperty(obj, attr, {
      value: val || true,
      enumerable: true
    });
  });

  obj.key = getID();
  return obj;
}

/** splits nested value to simple values */
function getValues(str) {
  let vals = str.match(/#\[.*?\]/g);
  let res = [];

  vals.reduce((acc, cur, i) => {
    const temp = acc.split(cur);
    cur = cur.slice(2, -1);

    res.push(temp[0], cur);
    if (i === vals.length - 1) res.push(temp[1]);
    return temp[1];
  }, str);

  const [first, ...preTail] = res.filter(item => item);
  return { first, preTail };
}

/** splits trimmed string to tag, attributes, value and tail */
function splitRow(str, tab, tail) {
  const case03 = str.match(/^\w*\(.*?\) .*/) || "",
    case1 = str.match(/^\w*\(.*?\)$/) || "",
    case3 = str.match(/#\[.*?\]/) || "";

  let tag = str.slice(0, str.indexOf("(")),
    attrs = str.slice(str.indexOf("(") + 1, str.indexOf(")")),
    val = str.slice(str.indexOf(")") + 2),
    preTail = [""];

  /** 1. string includes tag, attributes and nested value
   *  2. string includes tag, attributes and simple value
   *  3. string does not include value
   *  4. string includes simple value
   */
  if (case03 && case3) {
    const values = getValues(val);
    [val, preTail] = [values.first, values.preTail];
  } else if (case03 && !case3);
  else if (case1) val = null;
  else [tag, attrs, val] = [null, null, str];

  if (attrs) attrs = setAttributes(str);

  /** adds nested values to tail */
  const shift = createSpaces(tab + 1);
  preTail = preTail.reduce((acc, cur) => acc + shift + cur + "\n", "");
  if (preTail.trim()) tail = preTail + tail;

  return { tag, attrs, val, tail };
}

/** splits tail to tabs, tag, attributes, value and tail */
function splitTail(str) {
  const ind = str.indexOf("\n");
  let first, rest;
  if (ind === -1) [first, rest] = [str, null];
  else [first, rest] = [str.slice(0, ind), str.slice(ind + 1)];
  let tab = getTabs(first);

  first = first.trim();

  return { tab, ...splitRow(first, tab, rest) };
}

/** main function */
function pre(markup) {
  let tabPre, tree;
  const stack = [];
  markup = markup.trim();

  /** inserts elements recursively starting from the end of markup */
  function insertElement(str) {
    const { tab, tag, attrs, val, tail } = splitTail(str);

    if (tail) {
      insertElement(tail);
      if (tabPre > tab) tree = [crEl(tag, attrs, val, ...tree)];
      else if (tabPre === tab)
        tree = [tag ? crEl(tag, attrs, val) : val, ...tree];
      else {
        stack.push({ tree, tabPre });

        if (stack[stack.length - 1].tabPre === tab) tree = [];
        else tree = tag ? [crEl(tag, attrs, val)] : [val];
      }

      if (stack.length && stack[stack.length - 1].tabPre === tab) {
        tree = [...tree, ...stack[stack.length - 1].tree];
        stack.pop();
      }

      tabPre = tab;
      return crEl(crFr, null, ...tree);
    } else {
      tree = tag ? [crEl(tag, attrs, val)] : [val];
      tabPre = tab;
    }
  }

  return insertElement(markup);
}

export default pre;
