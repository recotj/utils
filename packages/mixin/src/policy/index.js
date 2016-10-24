import {flow, flowRight} from './presets/flow';
import {chain, chainRight} from './presets/chain';
import {merge, mergeRight} from './presets/merge';
import {objectMerge, objectMergeRight} from './presets/objectMerge';
import {override, overrideRight} from './presets/override';

const PRESET_MIXIN_POLICY = Symbol('preset-mixin-policy');

const presets = {
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

export default presets;

export const isPresetPolicy = (policy) => {
	return policy && policy[PRESET_MIXIN_POLICY];
};

function register(policy) {
	policy[PRESET_MIXIN_POLICY] = true;
}
