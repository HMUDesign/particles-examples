export default function uniformWrapper({ center, radius } = {}) {
	if (typeof center === 'undefined') {
		center = [ 0, 0, 0 ];
	}
	if (typeof redius === 'undefined') {
		radius = 1;
	}

	return function uniform(index) {
		let u = Math.random() * 2 - 1;
		let v = Math.sqrt(1 - u * u);
		let phi = 2 * Math.PI * Math.random();

		return [
			center[0] + radius * v * Math.cos(phi),
			center[1] + radius * u,
			center[2] + radius * v * Math.sin(phi),
		];
	};
}
