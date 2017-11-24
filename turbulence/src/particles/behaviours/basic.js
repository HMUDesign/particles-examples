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
			type: 'float',
		},
		{
			name: 'delay',
			type: 'float',
		},
	];

	vertexMethods = [
		[
			'float scaleLinear( float value, vec2 valueDomain ) {',
			'	return ( value - valueDomain.x ) / ( valueDomain.y - valueDomain.x );',
			'}',
		].join('\n'),

		[
			'float scaleLinear( float value, vec2 valueDomain, vec2 valueRange ) {',
			'	return mix( valueRange.x, valueRange.y, scaleLinear( value, valueDomain ) );',
			'}',
		].join('\n'),
	]

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
