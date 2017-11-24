import Behaviour from '../behaviour';

export default class Rotation extends Behaviour {
	constructor({ initial } = {}) {
		super();

		this.initial = initial;
	}

	attributes = {
		name: 'rotation',
		type: 'float',
	};

	varyings = {
		name: 'vRotation',
		type: 'float',
	};

	spawn(index) {
		return {
			name: 'rotation',
			value: this.initial(index),
		};
	}
}
