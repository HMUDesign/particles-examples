import Behaviour from '../behaviour';

export default class Basic extends Behaviour {
	constructor({ lifespan, delay } = {}) {
		super();

		this.lifespan = lifespan || 20;
		this.delay = delay || 0;
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
		particles.config.lifespan = this.lifespan;

		super.init(particles);
	}

	spawn(index) {
		return [
			this.spawnLifespan(index),
			this.spawnDelay(index),
		];
	}

	spawnLifespan() {
		let initial = this.lifespan;
		let randomness = 10;

		return {
			name: 'lifespan',
			value: initial + (Math.random() - 0.5) * randomness,
		};
	}

	spawnDelay() {
		let initial = this.delay + this.particles.points.material.uniforms.uTime.value;
		let randomness = 2e-2;

		return {
			name: 'delay',
			value: initial + (Math.random() - 0.5) * randomness,
		};
	}
}
