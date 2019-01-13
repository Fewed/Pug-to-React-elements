(function(root, factory) {
	// https://github.com/umdjs/umd
	if (typeof module === "object" && module.exports) module.exports = factory();
	else root.returnExports = factory();
})(typeof self !== "undefined" ? self : this, function() {
	/*  ---------------------- CODE -------------------------------  */

	const log = console.log.bind(console),
		logFake = () => {};

	const sel = (target, mode = 0) => {
		const arr = document.querySelectorAll(target);

		return arr.length !== 1 ? [...arr] : mode !== 0 ? [arr[0]] : arr[0];
	};

	return { log, logFake, sel };
});
