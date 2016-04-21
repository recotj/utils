module.exports = (subClass, superClass) => {
	if (subClass === undefined || subClass === null)
		throw new TypeError(`The sub class to 'inherits' must not be null or undefined.`);

	if (superClass === undefined || superClass === null)
		throw new TypeError(`The super class to 'inherits' must not be null or undefined.`);

	if (superClass.prototype === undefined)
		throw new TypeError(`The super class to 'inherits' must have a prototype.`);

	Reflect.setPrototypeOf(subClass.prototype, superClass.prototype);
	Reflect.defineProperty(subClass.prototype, 'constructor', {
		value: subClass,
		enumerable: false,
		writable: true,
		configurable: true
	});
	Reflect.setPrototypeOf(subClass, superClass);
};
