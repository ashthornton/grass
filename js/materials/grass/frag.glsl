precision highp float;

uniform vec3 cameraPosition;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec4 vWorldPosition;
varying vec3 vViewPosition;
varying float vLight;

uniform sampler2D blade;
uniform sampler2D matcap;

void main() {
  vec4 c = texture2D(blade, vUv);
  if(c.r < .5) {
    discard;
  }
  vec3 color = vec3(0.15, 0.58, 0.28);
  vec3 lightColor = vec3(1, 0.9, 0.79);
  // color = mix(color, lightColor, vLight);
  gl_FragColor = vec4(color * (vUv.y + 0.3), 1.);

  // vec3 normal = normalize( vNormal );
	// vec3 viewDir = normalize( vViewPosition );
	// vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	// vec3 y = cross( viewDir, x );
	// vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks

	// vec4 matcapColor = texture2D( matcap, uv );
  // gl_FragColor = matcapColor;

  vec4 addedLights = vec4(0., 0., 0., 1.0);
	vec3 adjustedLight = vec3(1., 0., 2.) + cameraPosition;
	vec3 lightDirection = normalize(vPosition - adjustedLight);
	gl_FragColor.rgb += dot(-lightDirection, vNormal) * vec3(1.);
}