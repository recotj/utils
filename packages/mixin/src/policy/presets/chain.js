export const chain = (...methods) => {
	return function (/*...arguments*/) {
		methods.reduce((_, method) => {
			if (typeof method !== 'function') return;
			Reflect.apply(method, this, arguments);
		});
	};
};

export const chainRight = (...methods) => {
	return function (/*...arguments*/) {
		methods.reduceRight((_, method) => {
			if (typeof method !== 'function') return;
			Reflect.apply(method, this, arguments);
		});
	};
};
