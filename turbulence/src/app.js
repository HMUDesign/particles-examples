import BaseApp from './base-app';
import Partices from './particles/particles';

export default class App extends BaseApp {
	static load() {
		return Promise.resolve();
	}

	constructor(config) {
		super(config);

		this.camera.position.set(0, 0, 25);
		this.camera.lookAt(this.scene.position);

		this.particles = new Partices({
			sprite: require('./sprites/star.png'),
			noise: require('./perlin-512.png'),
		});
		this.scene.add(this.particles);
	}

	render(delta, time) {
		this.particles.update(delta, time);

		return super.render(delta);
	}
}
