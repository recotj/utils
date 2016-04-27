const {flow, flowRight} = require('./presets/flow');
const {chain, chainRight} = require('./presets/chain');
const {merge, mergeRight} = require('./presets/merge');
const {objectMerge, objectMergeRight} = require('./presets/objectMerge');
const {override, overrideRight} = require('./presets/override');

const PRESET_MIXIN_POLICY = Symbol('preset-mixin-policy');

const presets = module.exports = {
	FLOW: flow,
	FLOW_RIGHT: flowRight,
	CHAIN: chain,
	CHAIN_RIGHT: chainRight,
	MERGE: merge,
	MERGE_RIGHT: mergeRight,
	OVERRIDE: override,
	OVERRIDE_RIGHT: overrideRight,
	OBJECT_MERGE: objectMerge,
	OBJECT_MERGE_RIGHT: objectMergeRight
};

Object.keys(presets).forEach((k) => {
	register(presets[k]);
});

module.exports.isPresetPolicy = (policy) => {
	return policy && policy[PRESET_MIXIN_POLICY];
};

function register(policy) {
	policy[PRESET_MIXIN_POLICY] = true;
}
