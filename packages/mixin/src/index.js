const {flow, flowRight} = require('./policy/flow');
const {chain, chainRight} = require('./policy/chain');
const {merge, mergeRight} = require('./policy/merge');
const {objectMerge, objectMergeRight} = require('./policy/objectMerge');
const {override, overrideRight} = require('./policy/override');

const FLOW = Symbol('flow');
const FLOW_RIGHT = Symbol('flow-right');
const CHAIN = Symbol('chain');
const CHAIN_RIGHT = Symbol('chain-right');
const MERGE = Symbol('merge');
const MERGE_RIGHT = Symbol('merge-right');
const OVERRIDE = Symbol('override');
const OVERRIDE_RIGHT = Symbol('override-right');
const OBJECT_MERGE = Symbol('object-merge');
const OBJECT_MERGE_RIGHT = Symbol('object-merge-right');

const predefinedPolicy = {
	[FLOW]: flow,
	[FLOW_RIGHT]: flowRight,
	[CHAIN]: chain,
	[CHAIN_RIGHT]: chainRight,
	[MERGE]: merge,
	[MERGE_RIGHT]: mergeRight,
	[OVERRIDE]: override,
	[OVERRIDE_RIGHT]: overrideRight,
	[OBJECT_MERGE]: objectMerge,
	[OBJECT_MERGE_RIGHT]: objectMergeRight
};

const mixin = module.exports = ({mixins, policy, handleConflict}) => {
	if (!Array.isArray(mixins) || mixins.length <= 0) {
		throw new TypeError('expect mixins as a non-empty array');
	}

	const result = {};
	const handlers = getHandlers(handleConflict, policy, override);

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

mixin.policy = {
	FLOW,
	FLOW_RIGHT,
	CHAIN,
	CHAIN_RIGHT,
	MERGE,
	MERGE_RIGHT,
	OVERRIDE,
	OVERRIDE_RIGHT,
	OBJECT_MERGE,
	OBJECT_MERGE_RIGHT
};

function getHandlers(handleConflict, policy, overrides) {
	const handlers = [];

	if (typeof handleConflict === 'function') {
		handlers.push(handleConflict);
	}

	if (typeof policy === 'object' && Object.keys(policy) > 0) {
		const policyHandler = (key, ...methods) => {
			const func = predefinedPolicy[policy[key]];
			if (typeof func !== 'function') return;
			return Reflect.apply(func, null, methods);
		};
		handlers.push(policyHandler);
	}

	handlers.push(overrides);

	return handlers;
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
