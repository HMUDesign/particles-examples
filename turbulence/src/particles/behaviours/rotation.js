import Behaviour from '../behaviour';

export default class Rotation extends Behaviour {
	constructor({ initial } = {}) {
		super();

		this.initial = initial || 0;
	}

	attributes = {
		name: 'rotation',
		size: 1,
	};

	spawn() {
		let initial = this.initial;
		let randomness = Math.PI * 2.0;

		return {
			name: 'rotation',
			value: initial + (Math.random() - 0.5) * randomness,
		};
	}
}
