export default function uniformWrapper({ min, max, average, size } = {}) {
	const hasMin = typeof min !== 'undefined';
	const hasMax = typeof max !== 'undefined';
	const hasAverage = typeof average !== 'undefined';
	const hasSize = typeof size !== 'undefined';

	const hasBounds = hasMin || hasMax;
	const hasParameters = hasAverage || hasSize;

	if (!hasBounds && !hasParameters) {
		throw new Error('Uniform Value: must specify bounds or parameters.');
	}

	if (hasBounds && hasParameters) {
		throw new Error('Uniform Value: cannot specify bounds and parameters.');
	}

	if (hasParameters) {
		if (!hasAverage) {
			average = 0.5;
		}
		if (!hasSize) {
			size = 1;
		}

		min = average - size / 2;
		max = average + size / 2;
	}

	if (hasBounds) {
		if (!hasMin) {
			min = 0;
		}
		if (!hasMax) {
			max = 1;
		}
	}

	return function uniform(index) {
		return min + (max - min) * Math.random();
	};
}
