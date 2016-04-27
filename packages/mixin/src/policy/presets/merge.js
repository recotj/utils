module.exports.merge = (...methods) => {
	return function (/*arguments*/) {
		return methods.reduce((merged, method) => {
			return reduceBody(merged, method, this, arguments);
		}, {});
	};
};

module.exports.mergeRight = (...methods) => {
	return function (/*arguments*/) {
		return methods.reduceRight((merged, method) => {
			return reduceBody(merged, method, this, arguments);
		}, {});
	};
};

function reduceBody(merged, method, context, args) {
	if (typeof method !== 'function') return merged;
	const partial = Reflect.apply(method, context, args);
	return Object.assign(merged, partial);
}
