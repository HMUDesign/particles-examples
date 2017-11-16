import THREE from 'three';
import Behaviour from '../behaviour';

export default class Appearance extends Behaviour {
	constructor({ color, opacity, size, sprite } = {}) {
		super();

		this.color = color || new THREE.Color(0xaa88ff);
		this.opacity = opacity;
		this.size = size;
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
			{
				name: 'color',
				value: this.color(index),
			},
			{
				name: 'opacity',
				value: this.opacity(index),
			},
			{
				name: 'size',
				value: this.size(index),
			},
		];
	}
}
