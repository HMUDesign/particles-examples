varying vec4 vColor;
varying float vRotation;

uniform sampler2D tSprite;

void main() {
	float c = cos(vRotation);
	float s = sin(vRotation);

	vec2 rotatedUV = vec2(
		c * (gl_PointCoord.x - 0.5) + s * (gl_PointCoord.y - 0.5) + 0.5,
		c * (gl_PointCoord.y - 0.5) - s * (gl_PointCoord.x - 0.5) + 0.5
	);

	vec4 rotatedTexture = texture2D(tSprite, rotatedUV);
	gl_FragColor = vColor * rotatedTexture;
}
