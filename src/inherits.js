module.exports = (subClass, superClass) => {
	Reflect.setPrototypeOf(subClass.prototype, superClass.prototype);
	Reflect.defineProperty(subClass.prototype, 'constructor', {
		value: subClass,
		enumerable: false,
		writable: true,
		configurable: true
	});
	Reflect.setPrototypeOf(subClass, superClass);
};
