import { Color } from 'three/src/math/Color';
import Behaviour from '../behaviour';

export default class Appearance extends Behaviour {
	constructor({ color, opacity, size, sprite } = {}) {
		super();

		this.color = color || new Color(0xaa88ff);
		this.opacity = opacity;
		this.size = size;
		this.sprite = sprite;
	}

	attributes = [
		{
			name: 'color',
			type: 'vec3',
		},
		{
			name: 'opacity',
			type: 'float',
		},
		{
			name: 'size',
			type: 'float',
		},
	];

	varyings = [
		{
			name: 'vColor',
			type: 'vec4',
		},
	];

	uniforms() {
		return {
			name: 'tSprite',
			type: 'sampler2D',
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
