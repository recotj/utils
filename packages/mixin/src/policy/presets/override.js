module.exports.override = (...methods) => {
	let result;

	methods.some((method) => {
		const valid = (method !== undefined);
		if (valid) result = method;
		return valid;
	});

	return result;
};

module.exports.overrideRight = (...methods) => {
	let result;

	methods.reverse().some((method) => {
		const valid = (method !== undefined);
		if (valid) result = method;
		return valid;
	});

	return result;
};
