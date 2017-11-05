import THREE from 'three';

export default class Particles extends THREE.Points {
	static applyConfigDefaults(config) {
		if (!config.sprite) {
			throw new Error('Particles: You must provide a sprite.');
		}

		if (!config.noise) {
			throw new Error('Particles: You must provide a noise.');
		}

		config.count = config.count || 500000;
		config.instant = config.instant || false;

		/* configurable */
		config.lifespan = config.lifespan || 20;
		config.position = config.position || new THREE.Vector3(0, 0, 0);
		config.velocity = config.velocity || new THREE.Vector3(0, 0, 0);
		config.color = config.color || new THREE.Color(0xaa88ff);
		config.opacity = config.opacity || 1;
		config.size = config.size || 2.5;
		config.startTime = config.startTime || 0;
		config.turbulence = config.turbulence || 250;
	}

	constructor(config = {}) {
		Particles.applyConfigDefaults(config);

		let textureLoader = new THREE.TextureLoader();

		let geometry = new THREE.BufferGeometry();

		geometry.addAttribute('lifespan', new THREE.BufferAttribute(new Float32Array(config.count), 1).setDynamic(true));
		geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(config.count * 3), 3).setDynamic(true));
		geometry.addAttribute('positionStart', new THREE.BufferAttribute(new Float32Array(config.count * 3), 3).setDynamic(true));
		geometry.addAttribute('velocity', new THREE.BufferAttribute(new Float32Array(config.count * 3), 3).setDynamic(true));
		geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(config.count * 3), 3).setDynamic(true));
		geometry.addAttribute('opacity', new THREE.BufferAttribute(new Float32Array(config.count), 1).setDynamic(true));
		geometry.addAttribute('size', new THREE.BufferAttribute(new Float32Array(config.count), 1).setDynamic(true));
		geometry.addAttribute('startTime', new THREE.BufferAttribute(new Float32Array(config.count), 1).setDynamic(true));
		geometry.addAttribute('turbulence', new THREE.BufferAttribute(new Float32Array(config.count), 1).setDynamic(true));

		let uniforms = {
			uTime: { value: 0.0 },
			tSprite: { value: textureLoader.load(config.sprite) },
			tNoise: { value: textureLoader.load(config.noise) },
		};

		uniforms.tNoise.value.wrapS = uniforms.tNoise.value.wrapT = THREE.RepeatWrapping;

		let material = new THREE.ShaderMaterial({
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,

			uniforms,
			vertexShader: require('./vertex.glsl'),
			fragmentShader: require('./fragment.glsl'),
		});

		super(geometry, material);
		this.frustumCulled = false;

		this.config = config;
		this.count = 0;

		if (this.config.instant) {
			this._nextInstant = 0;
		}
	}

	spawn() {
		let index = this.count;
		this.count = (this.count + 1) % this.config.count;

		// lifespan
		let lifespanAttribute = this.geometry.getAttribute('lifespan');
		let lifespan = this.config.lifespan;
		let lifespanRandomness = 10;
		lifespanAttribute.array[index] = lifespan + (Math.random() - 0.5) * lifespanRandomness;
		lifespanAttribute.needsUpdate = true;

		// position
		let positionStartAttribute = this.geometry.getAttribute('positionStart');
		let positionStart = this.config.position.clone();
		let positionRandomness = 0;
		positionStartAttribute.array[index * 3 + 0] = positionStart.x + (Math.random() - 0.5) * positionRandomness;
		positionStartAttribute.array[index * 3 + 1] = positionStart.y + (Math.random() - 0.5) * positionRandomness;
		positionStartAttribute.array[index * 3 + 2] = positionStart.z + (Math.random() - 0.5) * positionRandomness;
		positionStartAttribute.needsUpdate = true;

		// velocity
		let velocityAttribute = this.geometry.getAttribute('velocity');
		let velocity = this.config.velocity.clone();
		let velocityRandomness = 2.5;
		velocityAttribute.array[index * 3 + 0] = velocity.x + (Math.random() - 0.5) * velocityRandomness;
		velocityAttribute.array[index * 3 + 1] = velocity.y + (Math.random() - 0.5) * velocityRandomness;
		velocityAttribute.array[index * 3 + 2] = velocity.z + (Math.random() - 0.5) * velocityRandomness;
		velocityAttribute.needsUpdate = true;

		// color
		let colorAttribute = this.geometry.getAttribute('color');
		let color = this.config.color.clone();
		let colorRandomness = 0.2;
		colorAttribute.array[index * 3 + 0] = color.r + (Math.random() - 0.5) * colorRandomness;
		colorAttribute.array[index * 3 + 1] = color.g + (Math.random() - 0.5) * colorRandomness;
		colorAttribute.array[index * 3 + 2] = color.b + (Math.random() - 0.5) * colorRandomness;
		colorAttribute.needsUpdate = true;

		// opacity
		let opacityAttribute = this.geometry.getAttribute('opacity');
		let opacity = this.config.opacity;
		let opacityRandomness = 0;
		opacityAttribute.array[index] = opacity + (Math.random() - 0.5) * opacityRandomness;
		opacityAttribute.needsUpdate = true;

		// size
		let sizeAttribute = this.geometry.getAttribute('size');
		let size = this.config.size * (window.devicePixelRatio || 1);
		let sizeRandomness = 1;
		sizeAttribute.array[index] = size + (Math.random() - 0.5) * sizeRandomness;
		sizeAttribute.needsUpdate = true;

		// startTime
		let startTimeAttribute = this.geometry.getAttribute('startTime');
		let startTime = this.material.uniforms.uTime.value;
		let startTimeRandomness = 2e-2;
		startTimeAttribute.array[index] = startTime + (Math.random() - 0.5) * startTimeRandomness;
		startTimeAttribute.needsUpdate = true;

		// turbulence
		let turbulenceAttribute = this.geometry.getAttribute('turbulence');
		let turbulence = this.config.turbulence;
		let turbulenceRandomness = 100;
		turbulenceAttribute.array[index] = turbulence + (Math.random() - 0.5) * turbulenceRandomness;
		turbulenceAttribute.needsUpdate = true;
	}

	update(delta, time) {
		this.material.uniforms.uTime.value = time;

		let count = 0;
		if (this.config.instant) {
			if (time < this._nextInstant) {
				return;
			}

			count = this.config.count;
			this._nextInstant = time + this.config.lifespan;
		}
		else {
			count = Math.min(delta, this.config.lifespan) * this.config.count / this.config.lifespan;
		}

		for (let i = 0; i < count; i++) {
			this.spawn();
		}
	}
}
