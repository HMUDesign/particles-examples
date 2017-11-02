import THREE from 'three';
import TWEEN from 'tween';

export default class BaseApp {
	constructor(config) {
		if (config.parent === document.body) {
			config.width = window.innerWidth;
			config.height = window.innerHeight;

			document.body.style.overflow = 'hidden';
			document.body.style.margin = '0';
			document.body.style.backgroundColor = 'gray';

			window.addEventListener('resize', () => this._resize(), false);
		}
		else if (!config.width && !config.height) {
			config.width = config.parent.offsetWidth;
			config.height = config.parent.offsetHeight;
		}

		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(75, config.width / config.height, 0.1, 1000);
		this.camera.position.copy(config.camera || new THREE.Vector3(0, 0, 0));
		this.scene.add(this.camera);

		this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setClearColor(0x000000, 0);
		this.renderer.setSize(config.width, config.height);

		this.renderer.domElement.style.display = 'block';
		config.parent.appendChild(this.renderer.domElement);

		this.clock = new THREE.Clock(false);

		if (typeof TWEEN !== 'undefined') {
			TWEEN._time = 0;
		}

		if (typeof window.Stats !== 'undefined') {
			this.stats = new window.Stats();

			this.stats.domElement.style.position = 'absolute';
			this.stats.domElement.style.top  = '0';
			this.stats.domElement.style.left = '0';
			config.parent.appendChild(this.stats.domElement);
		}

		setTimeout(() => this.play(), 0);
	}

	_resize() {
		let width = window.innerWidth;
		let height = window.innerHeight;

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(width, height);
	}

	play() {
		this.clock.start();
		requestAnimationFrame(() => this._frame());

		return this;
	}

	pause() {
		this.clock.stop();

		return this;
	}

	_frame() {
		if (this.clock.running) {
			requestAnimationFrame(() => this._frame());
		}

		let delta = this.clock.getDelta();
		let time = this.clock.getElapsedTime();

		if (typeof TWEEN !== 'undefined') {
			TWEEN._time = time;
			TWEEN.update(time);
		}

		this.render(delta, time);

		if (this.stats) {
			this.stats.update();
		}

		return this;
	}

	render(delta, time) {
		this.renderer.render(this.scene, this.camera);

		return this;
	}
}
