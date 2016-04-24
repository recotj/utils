module.exports.flow = (...methods) => {
	return function (/*arguments*/) {
		return methods.reduce((flowed, method) => {
			return reduceBody(flowed, method, this);
		}, undefined);
	};
};

module.exports.flowRight = (...methods) => {
	return function (/*arguments*/) {
		return methods.reduceRight((flowed, method) => {
			return reduceBody(flowed, method, this);
		}, undefined);
	};
};

function reduceBody(flowed, method, context) {
	if (typeof method !== 'function') return flowed;
	return Reflect.apply(method, context, [flowed]);
}
