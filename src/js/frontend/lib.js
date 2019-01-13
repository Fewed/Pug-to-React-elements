export { log, logFake, sel, sum };

const log = console.log.bind(console),
	logFake = () => {};

const sel = (target, mode = 0) => {
	const arr = document.querySelectorAll(target);

	return arr.length !== 1 ? [...arr] : mode !== 0 ? [arr[0]] : arr[0];
};

const sum = (...args) => args.reduce((acc, cur) => acc + cur, 0);
