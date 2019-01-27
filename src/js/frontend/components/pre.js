import { createElement as crEl, Fragment as crFr } from "react";

/** defines indentation size */
pre.tabSize = 2;

const regExComplex = new RegExp(/#\[.*?\]|{\w*} */);

/** generates unique string */
const getID = () => Date.now() + "" + Math.random();

/** creates ndentation */
const createSpaces = (num, tabSize = pre.tabSize) =>
	[...Array(num * tabSize)].reduce((acc) => acc + " ", "");

/** main function */
function pre(markup) {
	/** calculates number of tabs */
	const getTabs = (str, tabSize = pre.tabSize) => {
		const selector = {
			2: str.match(/ {2}/g),
			3: str.match(/ {3}/g),
			4: str.match(/ {4}/g),
		};
		const tabs = selector[tabSize];

		if (tabs === undefined) {
			throw new Error("A number of tabs must be in range 2-4 inclusive!");
		}
		return !tabs ? 0 : tabs.length;
	};

	/** splits nested value to simple values */
	const getValues = (str) => {
		let simpleVals = [];

		while (str) {
			let ind = str.search(regExComplex);

			if (ind > 0) {
				simpleVals.push(str.slice(0, ind));
				str = str.slice(ind);
			} else if (!ind) {
				ind = str.match(regExComplex)[0].length;
				simpleVals.push(str.slice(0, ind));
				str = str.slice(ind);
			} else {
				simpleVals.push(str);
				str = "";
			}
		}

		const [first, ...preTail] = simpleVals.map((val) => {
			if (val.match(/#\[.*?\]/)) return val.slice(2, -1);
			return val;
		});

		return { first, preTail };
	};

	/** generates attributes object for React.createElement */
	const setAttributes = (str) => {
		const attrsRaw = str.slice(str.indexOf("(") + 1, str.indexOf(") "));

		/** gets attributes with value */
		const attrs = attrsRaw.match(/\w*=".*?"/g) || [];

		/** gets attributes without value */
		attrsRaw.split(/\w*=".*?"/).map((item) => {
			const singletons = item.trim().split(" ");
			singletons.map((singleton) => {
				if (singleton) attrs.push(`${singleton}=""`);
			});
		});

		const obj = {};
		attrs.map((item) => {
			let [attr, val] = item.split("=");
			val = val.replace(/"/g, "");
			/** replaces handler */
			if (val.match(/{\w*}/)) val = this[val.replace(/{|}/g, "")];
			Object.defineProperty(obj, attr, {
				value: val || true,
				enumerable: true,
			});
		});

		obj.key = getID();
		return obj;
	};

	/** splits trimmed string to tag, attributes, value and tail */
	const splitRow = (str, tab, tail) => {
		const case03 = str.match(/^\w*\(.*?\) .*/),
			case1 = str.match(/^\w*\(.*?\)$/),
			case3 = str.match(regExComplex);

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

		/** replaces dynamically value */
		if (val && val.match(/{\w*}/)) {
			const res = this.state[val.match(/{\w*}/)[0].replace(/{|}/g, "")];
			val = val.replace(/{\w*}/, res);
		}

		return { tag, attrs, val, tail };
	};

	/** splits tail to tabs, tag, attributes, value and tail */
	const splitTail = (str) => {
		const ind = str.indexOf("\n");
		let first, rest;
		if (ind === -1) [first, rest] = [str, ""];
		else [first, rest] = [str.slice(0, ind), str.slice(ind + 1)];

		let tab = getTabs(first);

		/** trims first spaces */
		first = (first + "$").trim().slice(0, -1);

		return { tab, ...splitRow(first, tab, rest) };
	};

	/** main part */
	let tabPre, tree;
	const stack = [];
	markup = markup.trim();

	/** inserts elements recursively starting from the end of markup */
	const insertElement = (str) => {
		const { tab, tag, attrs, val, tail } = splitTail(str);

		if (tail) {
			insertElement(tail);
			if (tabPre > tab) tree = [crEl(tag, attrs, val, ...tree)];
			else if (tabPre === tab) tree = [tag ? crEl(tag, attrs, val) : val, ...tree];
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
	};

	return insertElement(markup);
}

export { pre as default, getID };
