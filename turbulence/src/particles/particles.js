import { Group } from 'three/src/objects/Group';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { BufferAttribute } from 'three/src/core/BufferAttribute';
import { BufferGeometry } from 'three/src/core/BufferGeometry';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial';
import { AdditiveBlending } from 'three/src/constants';
import { Points } from 'three/src/objects/Points';

const TYPE_SIZES = {
	float: 1,
	vec2: 2,
	vec3: 3,
	vec4: 4,
};

export default class Particles extends Group {
	constructor(config = {}, behaviours = []) {
		config.count = config.count || 500000;
		config.pulse = config.pulse || 0;

		super();

		this.config = config;
		this.behaviours = behaviours;
		this.textureLoader = new TextureLoader();

		this.runBehaviour('init', this);

		let geometry = new BufferGeometry();
		for (let { name, type } of this.runBehaviour('attributes')) {
			const size = TYPE_SIZES[type];
			geometry.addAttribute(name, new BufferAttribute(new Float32Array(config.count * size), size).setDynamic(true));
		}

		let uniforms = { uTime: { value: 0.0 } };
		for (let { name, ...value } of this.runBehaviour('uniforms')) {
			uniforms[name] = value;
		}

		let material = new ShaderMaterial({
			transparent: true,
			depthWrite: false,
			blending: AdditiveBlending,

			uniforms,
			vertexShader: this.vertexShader,
			fragmentShader: this.fragmentShader,
		});

		this.points = new Points(geometry, material);
		this.points.frustumCulled = false;

		this.add(this.points);

		this.index = 0;
		this.indexOverflow = 0;

		if (this.config.pulse) {
			this._nextPulse = 0;
		}
	}

	get vertexShader() {
		/* eslint-disable indent */
		return [
			'uniform float uTime;',
			...this.runBehaviour('uniforms').map(({ name, type }) => `uniform ${type} ${name};`),
			...this.runBehaviour('attributes').filter(({ name }) => name !== 'position').map(({ name, type }) => `attribute ${type} ${name};`),
			...this.runBehaviour('varyings').map(({ name, type }) => `varying ${type} ${name};`),

			...this.runBehaviour('vertexMethods'),

			'void main() {',
				'float timeElapsed = uTime - delay;',
				'if (timeElapsed < 0.0 || timeElapsed > lifespan) {',
					'vColor = vec4(color, 0);',
					'vRotation = rotation;',
					'gl_PointSize = 0.0;',
					'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
					'return;',
				'}',

				'float remaining = 1.0 - (timeElapsed / lifespan);',
				'if (remaining > 0.995) {',
					'remaining = scaleLinear(remaining, vec2(1.0, 0.995), vec2(0.0, 1.0));',
				'}',

				'vec3 newPosition = positionStart + velocity * timeElapsed;',

				'vColor = vec4(color, opacity * remaining);',
				'vRotation = rotation;',

				'vec3 noise = texture2D(tNoise, vec2(newPosition.x * 0.015 + (uTime * 0.05), newPosition.y * 0.02 + (uTime * 0.06))).rgb;',
				'vec3 noiseVel = (noise.rgb - 0.5) * 2.0 * turbulence;',
				'newPosition = mix(newPosition, newPosition + noiseVel, timeElapsed / lifespan);',

				'gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);',
				'gl_PointSize = size * remaining;',
			'}',
		].join('\n');
		/* eslint-enable indent */
	}

	get fragmentShader() {
		/* eslint-disable indent */
		return [
			'uniform float uTime;',
			...this.runBehaviour('uniforms').map(({ name, type }) => `uniform ${type} ${name};`),
			...this.runBehaviour('varyings').map(({ name, type }) => `varying ${type} ${name};`),

			...this.runBehaviour('fragmentMethods'),

			'void main() {',
				'float c = cos(vRotation);',
				'float s = sin(vRotation);',

				'vec2 rotatedUV = vec2(',
					'c * (gl_PointCoord.x - 0.5) + s * (gl_PointCoord.y - 0.5) + 0.5,',
					'c * (gl_PointCoord.y - 0.5) - s * (gl_PointCoord.x - 0.5) + 0.5',
				');',

				'vec4 rotatedTexture = texture2D(tSprite, rotatedUV);',
				'gl_FragColor = vColor * rotatedTexture;',
			'}',
		].join('\n');
		/* eslint-enable indent */
	}

	runBehaviour(name, ...args) {
		let output = [];

		for (let behaviour of this.behaviours) {
			if (!behaviour[name]) {
				continue;
			}

			let result = behaviour[name];
			if (typeof result === 'function') {
				result = result.apply(behaviour, args);
			}

			if (Array.isArray(result)) {
				output.push(...result.filter(v => v));
			}
			else if (result) {
				output.push(result);
			}
		}

		return output;
	}

	spawn() {
		let index = this.index;
		this.index = (this.index + 1) % this.config.count;

		for (let { name, value } of this.runBehaviour('spawn', index)) {
			let attribute = this.points.geometry.getAttribute(name);
			attribute.needsUpdate = true;

			if (Array.isArray(value)) {
				let length = value.length;
				for (let i = 0; i < length; i++) {
					attribute.array[index * length + i] = value[i];
				}
			}
			else {
				attribute.array[index] = value;
			}
		}
	}

	update(delta, time) {
		this.points.material.uniforms.uTime.value = time;

		let count = 0;
		if (this.config.pulse) {
			if (time < this._nextPulse) {
				return;
			}

			count = this.config.count / this.config.pulse;
			this._nextPulse = time + this.config.lifespan / this.config.pulse;
		}
		else {
			count = Math.min(delta, this.config.lifespan) * this.config.count / this.config.lifespan - this.indexOverflow;
			if (count > 0) {
				this.indexOverflow = Math.ceil(count) - count;
				count = Math.ceil(count);
			}
			else {
				this.indexOverflow = -count;
				count = 0;
			}
		}

		for (let i = 0; i < count; i++) {
			this.spawn();
		}
	}
}
