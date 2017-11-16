export default class Behaviour {
	init(particles) {
		this.particles = particles;
	}

	get textureLoader() {
		return this.particles.textureLoader;
	}
}
