uniform float uTime;
uniform sampler2D tNoise;

attribute vec3 positionStart;
attribute vec3 velocity;
attribute float rotation;
attribute vec3 color;
attribute float opacity;
attribute float size;
attribute float lifespan;
attribute float delay;
attribute float turbulence;

varying vec4 vColor;
varying float vRotation;

float scaleLinear( float value, vec2 valueDomain ) {
	return ( value - valueDomain.x ) / ( valueDomain.y - valueDomain.x );
}

float scaleLinear( float value, vec2 valueDomain, vec2 valueRange ) {
	return mix( valueRange.x, valueRange.y, scaleLinear( value, valueDomain ) );
}

void main() {
	float timeElapsed = uTime - delay;
	if (timeElapsed < 0.0 || timeElapsed > lifespan) {
		vColor = vec4(color, 0);
		vRotation = rotation;
		gl_PointSize = 0.0;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		return;
	}

	float remaining = 1.0 - (timeElapsed / lifespan);
	if (remaining > 0.995) {
		remaining = scaleLinear(remaining, vec2(1.0, 0.995), vec2(0.0, 1.0));
	}

	vec3 newPosition = positionStart + velocity * timeElapsed;

	vColor = vec4(color, opacity * remaining);
	vRotation = rotation;

	vec3 noise = texture2D(tNoise, vec2(newPosition.x * 0.015 + (uTime * 0.05), newPosition.y * 0.02 + (uTime * 0.06))).rgb;
	vec3 noiseVel = (noise.rgb - 0.5) * 2.0 * turbulence;
	newPosition = mix(newPosition, newPosition + noiseVel, timeElapsed / lifespan);

	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
	gl_PointSize = size * remaining;
}
