import Behaviour from '../behaviour';

export default class Basic extends Behaviour {
	constructor({ lifespan, delay } = {}) {
		super();

		this.lifespan = lifespan;
		this.delay = delay;
	}

	attributes = [
		{
			name: 'lifespan',
			size: 1,
		},
		{
			name: 'delay',
			size: 1,
		},
	];

	init(particles) {
		particles.config.lifespan = this.lifespan(-1);

		super.init(particles);
	}

	spawn(index) {
		return [
			{
				name: 'lifespan',
				value: this.lifespan(index),
			},
			{
				name: 'delay',
				value: this.delay(index) + this.particles.points.material.uniforms.uTime.value,
			},
		];
	}
}
