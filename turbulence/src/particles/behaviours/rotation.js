import Behaviour from '../behaviour';

export default class Rotation extends Behaviour {
	constructor({ initial } = {}) {
		super();

		this.initial = initial;
	}

	attributes = {
		name: 'rotation',
		size: 1,
	};

	spawn(index) {
		return {
			name: 'rotation',
			value: this.initial(index),
		};
	}
}
