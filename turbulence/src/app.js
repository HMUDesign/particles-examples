import BaseApp from './base-app';
import Partices from './particles/particles';
import distributions from './particles/distributions';

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

		this.particles = new Partices({
			count: 500000,
			pulse: 0,
		}, [
			new Basic({
				lifespan: distributions.uniform({ average: 20, size: 10 }),
				delay: distributions.uniform({ min: 0, max: 2e-2 }),
			}),
			new Position({
				initial: distributions.fixed([ 0, 0, 0 ]),
				velocity: distributions.sphere({ radius: 1 }),
				turbulence: distributions.uniform({ average: 250, size: 100 }),
				noise: require('./perlin-512.png'),
			}),
			new Rotation({
				initial: distributions.uniform({ min: 0, max: Math.PI * 2.0 }),
			}),
			new Appearance({
				color: distributions.vector([
					distributions.uniform({ average: 0xaa / 255, size: 0.2 }),
					distributions.uniform({ average: 0x88 / 255, size: 0.2 }),
					distributions.uniform({ average: 0xff / 255, size: 0.2 }),
				]),
				opacity: distributions.fixed(1),
				size: distributions.uniform({ average: 2.5, size: 1 }),
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
