import THREE from 'three';

export default class Particles extends THREE.Group {
	constructor(config = {}, behaviours = []) {
		config.count = config.count || 500000;
		config.pulse = config.pulse || 0;

		super();

		this.config = config;
		this.behaviours = behaviours;
		this.textureLoader = new THREE.TextureLoader();

		this.runBehaviour('init', this);

		let geometry = new THREE.BufferGeometry();
		for (let { name, size } of this.runBehaviour('attributes')) {
			geometry.addAttribute(name, new THREE.BufferAttribute(new Float32Array(config.count * size), size).setDynamic(true));
		}

		let uniforms = { uTime: { value: 0.0 } };
		for (let { name, ...value } of this.runBehaviour('uniforms')) {
			uniforms[name] = value;
		}

		let material = new THREE.ShaderMaterial({
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,

			uniforms,
			vertexShader: require('./vertex.glsl'),
			fragmentShader: require('./fragment.glsl'),
		});

		this.points = new THREE.Points(geometry, material);
		this.points.frustumCulled = false;

		this.add(this.points);

		this.index = 0;
		this.indexOverflow = 0;

		if (this.config.pulse) {
			this._nextPulse = 0;
		}
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
