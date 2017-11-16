import THREE from 'three';
import Behaviour from '../behaviour';

export default class Position extends Behaviour {
	constructor({ initial, velocity, turbulence, noise } = {}) {
		super();

		this.initial = initial || new THREE.Vector3(0, 0, 0);
		this.velocity = velocity || new THREE.Vector3(0, 0, 0);
		this.turbulence = turbulence || 250;
		this.noise = noise;
	}

	attributes = [
		{
			name: 'position',
			size: 3,
		},
		{
			name: 'positionStart',
			size: 3,
		},
		{
			name: 'velocity',
			size: 3,
		},
		{
			name: 'turbulence',
			size: 1,
		},
	];

	uniforms() {
		let texture = this.textureLoader.load(this.noise);
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

		return {
			name: 'tNoise',
			value: texture,
		};
	}

	spawn(index) {
		return [
			this.spawnPosition(index),
			this.spawnVelocity(index),
			this.spawnTurbulence(index),
		];
	}

	spawnPosition() {
		let initial = this.initial;
		let randomness = 0;

		return {
			name: 'positionStart',
			value: [
				initial.x + (Math.random() - 0.5) * randomness,
				initial.y + (Math.random() - 0.5) * randomness,
				initial.z + (Math.random() - 0.5) * randomness,
			],
		};
	}

	spawnVelocity() {
		let initial = this.velocity;
		let randomness = 2.5;

		return {
			name: 'velocity',
			value: [
				initial.x + (Math.random() - 0.5) * randomness,
				initial.y + (Math.random() - 0.5) * randomness,
				initial.z + (Math.random() - 0.5) * randomness,
			],
		};
	}

	spawnTurbulence() {
		let initial = this.turbulence;
		let randomness = 100;

		return {
			name: 'turbulence',
			value: initial + (Math.random() - 0.5) * randomness,
		};
	}
}
