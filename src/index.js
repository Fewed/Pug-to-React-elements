import React from "react";

pre.tabSize = 2;

const crEl = React.createElement;
const crFr = React.Fragment;

const getID = () => Date.now() + "" + Math.random();

const createSpaces = (num, tabSize = pre.tabSize) =>
	[...Array(num * tabSize)].reduce((acc) => acc + " ", "");

const findTabs = (str, tabSize = pre.tabSize) => {
	if (tabSize === 2) return str.match(/ {2}/g);
	else if (tabSize === 3) return str.match(/ {3}/g);
	else if (tabSize === 4) return str.match(/ {4}/g);
	throw new Error("A number of tabs must be in range 2-4 inclusive!");
};

function setAttributes(str) {
	const attrStr = str.slice(str.indexOf("(") + 1, str.indexOf(") "));
	const attrs = attrStr.match(/\w*=".*?"/g) || [];
	attrStr.split(/\w*=".*?"/).map((item) => {
		const items = item.trim().split(" ");
		items.map((sn) => {
			if (sn) attrs.push(`${sn}=""`);
		});
	});

	const obj = {};
	attrs.map((item) => {
		let [attr, val] = item.split("=");
		val = val.replace(/"/g, "");
		Object.defineProperty(obj, attr, {
			value: val || true,
			enumerable: true,
		});
	});

	obj.key = getID();
	return obj;
}

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

	const [first, ...preTail] = res.filter((item) => item);
	return { first, preTail };
}

function splitRow(str, tab, tail) {
	const case03 = str.match(/^\w*\(.*?\) .*/) || "",
		case1 = str.match(/^\w*\(.*?\)$/) || "",
		case3 = str.match(/#\[.*?\]/) || "";

	let tag = str.slice(0, str.indexOf("(")),
		attrs = str.slice(str.indexOf("(") + 1, str.indexOf(")")),
		val = str.slice(str.indexOf(")") + 2),
		preTail = [""];

	if (case03 && case3) {
		const values = getValues(val);
		[val, preTail] = [values.first, values.preTail];
	} else if (case03 && !case3);
	else if (case1) val = null;
	else [tag, attrs, val] = [null, null, str];

	if (attrs) attrs = setAttributes(str);

	const shift = createSpaces(tab + 1);
	preTail = preTail.reduce((acc, cur) => acc + shift + cur + "\n", "");
	if (preTail.trim()) tail = preTail + tail;

	return { tag, attrs, val, tail };
}

function slicer(str) {
	const ind = str.indexOf("\n");
	let first, rest;
	if (ind === -1) [first, rest] = [str, null];
	else [first, rest] = [str.slice(0, ind), str.slice(ind + 1)];
	let tab = findTabs(first);
	tab = !tab ? 0 : tab.length;
	first = first.trim();

	return { tab, ...splitRow(first, tab, rest) };
}

function pre(mark) {
	let tabPre, depth, res, store;
	mark = mark.trim();

	function thr(str) {
		const { tab, tag, attrs, val, tail } = slicer(str);

		if (tail) {
			thr(tail);
			if (tabPre > tab) res = [crEl(tag, attrs, val, ...res)];
			else if (tabPre === tab) res = [tag ? crEl(tag, attrs, val) : val, ...res];
			else {
				depth = tabPre;
				store = res;
				res = tab === depth ? [] : tag ? [crEl(tag, attrs, val)] : [val];
			}
			if (tab === depth) {
				res = [...res, ...store];
				depth = undefined;
			}
			tabPre = tab;
			return crEl(crFr, null, ...res);
		} else {
			res = tag ? [crEl(tag, attrs, val)] : [val];
			tabPre = tab;
		}
	}

	return thr(mark);
}

export default pre;
