export const objectMerge = (...objects) => {
	return objects.reduce(Object.assign, {});
};

export const objectMergeRight = (...objects) => {
	return objects.reduceRight(Object.assign, {});
};

