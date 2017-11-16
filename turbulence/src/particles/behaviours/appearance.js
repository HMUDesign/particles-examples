import THREE from 'three';
import Behaviour from '../behaviour';

export default class Appearance extends Behaviour {
	constructor({ color, opacity, size, sprite } = {}) {
		super();

		this.color = color || new THREE.Color(0xaa88ff);
		this.opacity = opacity || 1;
		this.size = size || 2.5;
		this.sprite = sprite;
	}

	attributes = [
		{
			name: 'color',
			size: 3,
		},
		{
			name: 'opacity',
			size: 1,
		},
		{
			name: 'size',
			size: 1,
		},
	];

	uniforms() {
		return {
			name: 'tSprite',
			value: this.textureLoader.load(this.sprite),
		};
	}

	spawn(index) {
		return [
			this.spawnColor(index),
			this.spawnOpacity(index),
			this.spawnSize(index),
		];
	}

	spawnColor() {
		let initial = this.color;
		let randomness = 0.2;

		return {
			name: 'color',
			value: [
				initial.r + (Math.random() - 0.5) * randomness,
				initial.g + (Math.random() - 0.5) * randomness,
				initial.b + (Math.random() - 0.5) * randomness,
			],
		};
	}

	spawnOpacity() {
		let initial = this.opacity;
		let randomness = 0;

		return {
			name: 'opacity',
			value: initial + (Math.random() - 0.5) * randomness,
		};
	}

	spawnSize() {
		let initial = this.size * (window.devicePixelRatio || 1);
		let randomness = 1;

		return {
			name: 'size',
			value: initial + (Math.random() - 0.5) * randomness,
		};
	}
}
