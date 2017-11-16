import THREE from 'three';
import BaseApp from './base-app';
import Partices from './particles/particles';

import Basic from './particles/behaviours/basic';
import Position from './particles/behaviours/position';
import Rotation from './particles/behaviours/rotation';
import Appearance from './particles/behaviours/appearance';

export default class App extends BaseApp {
	static load() {
		return Promise.resolve();
	}

	constructor(config) {
		super(config);

		this.camera.position.set(0, 0, 25);
		this.camera.lookAt(this.scene.position);

		this.particles = new Partices({}, [
			new Basic({
				lifespan: 20,
				delay: 0,
			}),
			new Position({
				initial: new THREE.Vector3(0, 0, 0),
				velocity: new THREE.Vector3(0, 0, 0),
				turbulence: 250,
				noise: require('./perlin-512.png'),
			}),
			new Rotation({
				initial: 0,
			}),
			new Appearance({
				color: new THREE.Color(0xaa88ff),
				opacity: 1,
				size: 2.5,
				sprite: require('./sprites/star.png'),
			}),
		]);
		this.scene.add(this.particles);
	}

	render(delta, time) {
		this.particles.update(delta, time);

		return super.render(delta);
	}
}
