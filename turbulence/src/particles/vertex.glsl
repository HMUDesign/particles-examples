uniform float uTime;
uniform sampler2D tNoise;

attribute vec3 positionStart;
attribute vec3 velocity;
attribute vec3 color;
attribute float opacity;
attribute float size;
attribute float lifespan;
attribute float startTime;
attribute float turbulence;

varying vec4 vColor;
varying float lifeLeft;

void main() {
	float timeElapsed = uTime - startTime;
	if (timeElapsed < 0.0 || timeElapsed > lifespan) {
		lifeLeft = 0.0;
		gl_PointSize = 0.;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		return;
	}

	vColor = vec4(color, opacity);
	lifeLeft = 1.0 - (timeElapsed / lifespan);
	gl_PointSize = size * lifeLeft;

	vec3 newPosition = positionStart + velocity * timeElapsed;

	vec3 noise = texture2D(tNoise, vec2(newPosition.x * 0.015 + (uTime * 0.05), newPosition.y * 0.02 + (uTime * 0.06))).rgb;
	vec3 noiseVel = (noise.rgb - 0.5) * 2.0 * turbulence;

	newPosition = mix(newPosition, newPosition + noiseVel, timeElapsed / lifespan);

	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
