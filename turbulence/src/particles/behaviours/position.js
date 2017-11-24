import THREE from 'three';
import Behaviour from '../behaviour';

export default class Position extends Behaviour {
	constructor({ initial, velocity, turbulence, noise } = {}) {
		super();

		this.initial = initial;
		this.velocity = velocity;
		this.turbulence = turbulence;
		this.noise = noise;
	}

	attributes = [
		{
			name: 'position',
			type: 'vec3',
		},
		{
			name: 'positionStart',
			type: 'vec3',
		},
		{
			name: 'velocity',
			type: 'vec3',
		},
		{
			name: 'turbulence',
			type: 'float',
		},
	];

	uniforms() {
		let texture = this.textureLoader.load(this.noise);
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

		return {
			name: 'tNoise',
			type: 'sampler2D',
			value: texture,
		};
	}

	spawn(index) {
		return [
			{
				name: 'positionStart',
				value: this.initial(index),
			},
			{
				name: 'velocity',
				value: this.velocity(index),
			},
			{
				name: 'turbulence',
				value: this.turbulence(index),
			},
		];
	}
}
