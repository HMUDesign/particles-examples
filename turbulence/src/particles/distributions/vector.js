export default function vectorWrapper(values) {
	return function vector(index) {
		return values.map(value => value.call(this, index));
	};
}
