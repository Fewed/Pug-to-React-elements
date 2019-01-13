import React from "react";

const log = console.log.bind(console);
const crel = React.createElement;
const frag = React.Fragment;

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
		enumerable: true,
	});
	attrs.key = "key" + Math.round(1e15 * Math.random());
	return { tab, tag, attrs, tail };
}

function ext(mark) {
	let tabPre, depth, res, store;
	mark = mark.trim();

	function thr(str) {
		const { tab, tag, attrs, tail } = slicer(str);

		if (tail) {
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
			tabPre = tab;
			return crel(frag, null, ...res);
		} else {
			res = [crel(tag, attrs)];
			tabPre = tab;
		}
	}

	return thr(mark);
}

export { ext as pre };
