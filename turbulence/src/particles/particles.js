import THREE from 'three';

export default class Particles extends THREE.Points {
	static applyConfigDefaults(config) {
		/* static */
		config.count = 500000;
		// instant
		// lifespan
		// texture

		/* curvable */
		// color
		// opacity
		// size
		// position
	}

	constructor(config = {}) {
		Particles.applyConfigDefaults(config);

		let textureLoader = new THREE.TextureLoader();

		let geometry = new THREE.BufferGeometry();

		geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(config.count * 3), 3).setDynamic(true));
		geometry.addAttribute('positionStart', new THREE.BufferAttribute(new Float32Array(config.count * 3), 3).setDynamic(true));
		geometry.addAttribute('startTime', new THREE.BufferAttribute(new Float32Array(config.count), 1).setDynamic(true));
		geometry.addAttribute('velocity', new THREE.BufferAttribute(new Float32Array(config.count * 3), 3).setDynamic(true));
		geometry.addAttribute('turbulence', new THREE.BufferAttribute(new Float32Array(config.count), 1).setDynamic(true));
		geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(config.count * 3), 3).setDynamic(true));
		geometry.addAttribute('size', new THREE.BufferAttribute(new Float32Array(config.count), 1).setDynamic(true));
		geometry.addAttribute('lifeTime', new THREE.BufferAttribute(new Float32Array(config.count), 1).setDynamic(true));

		let material = new THREE.ShaderMaterial({
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,

			vertexShader: require('./vertex.glsl'),
			fragmentShader: require('./fragment.glsl'),
			uniforms: {
				uTime: { value: 0.0 },
				uScale: { value: 1.0 },
				tNoise: { value: textureLoader.load(require('./perlin-512.png')) },
				tSprite: { value: textureLoader.load(require('./sprite.png')) },
			},
		});

		material.uniforms.tNoise.value.wrapS = material.uniforms.tNoise.value.wrapT = THREE.RepeatWrapping;

		super(geometry, material);
		this.frustumCulled = false;
	}

	get time() {
		return this.material.uniforms.uTime.value;
	}

	set time(time) {
		this.material.uniforms.uTime.value = time;
	}

	spawn(i) {
		let positionStartAttribute = this.geometry.getAttribute('positionStart');
		let velocityAttribute = this.geometry.getAttribute('velocity');
		let colorAttribute = this.geometry.getAttribute('color');
		let turbulenceAttribute = this.geometry.getAttribute('turbulence');
		let sizeAttribute = this.geometry.getAttribute('size');
		let lifeTimeAttribute = this.geometry.getAttribute('lifeTime');
		let startTimeAttribute = this.geometry.getAttribute('startTime');

		let position = new THREE.Vector3(Math.random() * 20 - 10, 0, 0);
		let velocity = new THREE.Vector3(0, 0, 0);
		let color = new THREE.Color(0xaa88ff);

		let positionRandomness = 0;
		let velocityRandomness = 2.5;
		let colorRandomness = 0.2;
		let turbulence = 250;
		let lifetime = 20;
		let size = 2.5 * (window.devicePixelRatio || 1);
		let sizeRandomness = 1;

		// position
		positionStartAttribute.array[i * 3 + 0] = position.x + (Math.random() - 0.5) * positionRandomness;
		positionStartAttribute.array[i * 3 + 1] = position.y + (Math.random() - 0.5) * positionRandomness;
		positionStartAttribute.array[i * 3 + 2] = position.z + (Math.random() - 0.5) * positionRandomness;

		// velocity
		velocityAttribute.array[i * 3 + 0] = velocity.x + (Math.random() - 0.5) * velocityRandomness;
		velocityAttribute.array[i * 3 + 1] = velocity.y + (Math.random() - 0.5) * velocityRandomness;
		velocityAttribute.array[i * 3 + 2] = velocity.z + (Math.random() - 0.5) * velocityRandomness;

		// color
		colorAttribute.array[i * 3 + 0] = color.r + (Math.random() - 0.5) * colorRandomness;
		colorAttribute.array[i * 3 + 1] = color.g + (Math.random() - 0.5) * colorRandomness;
		colorAttribute.array[i * 3 + 2] = color.b + (Math.random() - 0.5) * colorRandomness;

		// turbulence, size, lifetime and starttime
		turbulenceAttribute.array[i] = turbulence;
		sizeAttribute.array[i] = size + (Math.random() - 0.5) * sizeRandomness;
		lifeTimeAttribute.array[i] = lifetime;
		startTimeAttribute.array[i] = this.time + (Math.random() - 0.5) * 2e-2;

		// updates
		positionStartAttribute.needsUpdate = true;
		velocityAttribute.needsUpdate = true;
		colorAttribute.needsUpdate = true;
		turbulenceAttribute.needsUpdate = true;
		sizeAttribute.needsUpdate = true;
		lifeTimeAttribute.needsUpdate = true;
		startTimeAttribute.needsUpdate = true;
	}

	update(delta, time) {
		this.time = time;

		let count = 2000 + Math.random() * 1000;
		for (let i = 0; i < count; i++) {
			this.spawn(x = (x + 1) % 500000);
		}
	}
}

let x = 0;
