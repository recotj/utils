const PresetPolicy = require('./policy');

const mixin = module.exports = ({mixins, policy, handleConflict}) => {
	if (!Array.isArray(mixins) || mixins.length <= 0) {
		throw new TypeError('expect mixins as a non-empty array');
	}

	const result = {};
	const handlers = getHandlers(handleConflict, policy);

	mixins.forEach((mixin) => {
		const mixinKeys = Object.keys(mixin);

		if (mixinKeys.length === 0) return;

		mixinKeys.forEach((key) => {
			if (isMixedIn(key)) return;

			const args = mixins.map((mixin) => mixin[key]);
			args.unshift(key);

			handlers.some((handle) => {
				const value = Reflect.apply(handle, null, args);
				const valid = (value !== undefined);
				if (valid) result[key] = value;
				return valid;
			});
		});
	});

	return result;

	function isMixedIn(key) {
		return Reflect.apply(hasOwnProperty, result, [key]);
	}
};

mixin.PresetPolicy = PresetPolicy;

function getHandlers(handleConflict, policy) {
	const handlers = [];

	const conflictHandler = normalizeConflictHandler(handleConflict);
	if (conflictHandler) handlers.push(conflictHandler);

	const policyHandler = normalizePolicyHandler(policy);
	if (policyHandler) handlers.push(policyHandler);

	handlers.push(PresetPolicy.OVERRIDE);

	return handlers;
}

function normalizeConflictHandler(handler) {
	if (typeof handler !== 'function') return;
	return handler;
}

function normalizePolicyHandler(handler) {
	if (typeof handler !== 'object') return;

	const keys = Object.keys(handler);
	if (keys.length === 0) return;

	const filtered = keys.reduce((r, k) => {
		const p = handler[k];
		if (PresetPolicy.isPresetPolicy(p)) r[k] = p;
		return r;
	}, {});

	if (Object.keys(filtered).length === 0) return;

	return (key, ...methods) => {
		const func = filtered[key];
		if (typeof func !== 'function') return;
		return Reflect.apply(func, null, methods);
	};
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
