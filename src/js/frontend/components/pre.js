import React from "react";

const log = console.log.bind(console);
const crel = React.createElement;
const frag = React.Fragment;

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

	obj.key = "key" + Math.round(1e15 * Math.random());
	return obj;
}

//log(setAttributes(`input(class="input input-main" type="tel" autoFocus required)`));

function findValues(str) {
	log(str);
	let vals = str.match(/#\[.*?\]/g);
	let res = [];

	if (!str) return { first: "", tail: [] };
	if (!vals) return { first: str, tail: [] };

	vals.reduce((acc, cur, i) => {
		const temp = acc.split(cur);
		cur = cur.slice(2, -1);

		res.push(temp[0], cur);
		if (i === vals.length - 1) res.push(temp[1]);
		return temp[1];
	}, str);

	const [first, ...tail] = res.filter((item) => item);
	return { first, tail };
}

let mark = `

div(class="input input-main" id="d5") 15

`;

//log(findValues(mark));

const createSpaces = (num = 0, tabSize = 2) =>
	[...Array(num)].reduce((acc) => acc + "	", "");

function findValues2(str) {
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

const test = [
	`div(class="input input-main" type="tel" required) 10`,
	`div(class="input input-main" type="tel" required)`,
	`5`,
	`div(class="input input-main" type="tel" required) 1#[span 2]3#[span 4]5`,
];

function splitRow(str, tab, tail) {
	const case03 = str.match(/^\w*\(.*?\) .*/) || "",
		case1 = str.match(/^\w*\(.*?\)$/) || "",
		case3 = str.match(/#\[.*?\]/) || "";

	let tag = str.slice(0, str.indexOf("(")),
		attr = str.slice(str.indexOf("(") + 1, str.indexOf(")")),
		val = str.slice(str.indexOf(")") + 2),
		preTail = [""];

	if (case03 && case3) {
		const values = findValues2(val);
		[val, preTail] = [values.first, values.preTail];
	} else if (case03 && !case3);
	else if (case1) val = null;
	else [tag, attr, val] = [null, null, str];

	if (attr) attr = setAttributes(str);

	const shift = createSpaces(tab + 1);
	preTail = preTail.reduce((acc, cur) => acc + shift + cur + "\n", "");
	if (preTail.trim()) tail = preTail + tail;

	return { tag, attr, val, tail };
}

//test.map((item) => splitRow(item, 1, ""));

function slicer(str, tabSize = 2) {
	//	const val = str.match(/^\s*?\w*\(.*?\) .*/g);
	// get first row
	const ind = str.indexOf("\n");
	let first, tail;
	if (ind === -1) [first, tail] = [str, null];
	else [first, tail] = [str.slice(0, ind), str.slice(ind + 1)];
	let tab = first.match(/ {2}/g);
	tab = tab === null ? 0 : tab.length;
	first = first.trim();

	// process first row
	const s = splitRow(first, tab, tail);
	const { tag, val } = s;
	tail = s.tail;
	const attrs = s.attr;

	// let [tag, attrs, val] = [
	// 	first.match(/\w*/)[0],
	// 	setAttributes(first),
	// 	first.slice(first.indexOf(") ") + 2),
	// ];

	return { tab, tag, attrs, val, tail };
}

function ext(mark) {
	let tabPre, depth, res, store;
	mark = mark.trim();

	function thr(str) {
		const { tab, tag, attrs, val, tail } = slicer(str);
		log({ tab, tag, attrs, val, tail });

		if (tail) {
			thr(tail);
			if (tabPre > tab) res = [crel(tag, attrs, val, ...res)];
			else if (tabPre === tab) res = [crel(tag, attrs, val), ...res];
			else {
				depth = tabPre;
				store = res;
				res = tab === depth ? [] : [crel(tag, attrs, val)];
			}
			if (tab === depth) {
				res = [...res, ...store];
				depth = undefined;
			}
			tabPre = tab;
			return crel(frag, null, ...res);
		} else {
			res = [crel(tag, attrs, val)];
			tabPre = tab;
		}
	}

	return thr(mark);
}

export { ext as pre };
