export default function fixedWrapper(value) {
	return function fixed(index) {
		return value;
	};
}
