module.exports.objectMerge = (...objects) => {
	return objects.reduce((merged, object) => {
		return Object.assign(merged, object);
	}, {});
};

module.exports.objectMergeRight = (...objects) => {
	return objects.reduceRight((merged, object) => {
		return Object.assign(merged, object);
	}, {});
};

