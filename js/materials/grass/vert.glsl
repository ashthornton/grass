precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute mat4 instanceMatrix;
attribute vec3 instanceColor;
uniform mat3 normalMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform float time;
uniform sampler2D noise;
uniform vec3 mouse;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec4 vWorldPosition;
varying vec3 vViewPosition;
varying vec2 vUv;
varying float vLight;

float inCubic(in float t) {
  return t * t * t;
}

float outCubic(in float t ) {
  return --t * t * t + 1.;
}

mat4 inverse(mat4 m) {
  float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],
      a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],
      a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],
      a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],

      b00 = a00 * a11 - a01 * a10,
      b01 = a00 * a12 - a02 * a10,
      b02 = a00 * a13 - a03 * a10,
      b03 = a01 * a12 - a02 * a11,
      b04 = a01 * a13 - a03 * a11,
      b05 = a02 * a13 - a03 * a12,
      b06 = a20 * a31 - a21 * a30,
      b07 = a20 * a32 - a22 * a30,
      b08 = a20 * a33 - a23 * a30,
      b09 = a21 * a32 - a22 * a31,
      b10 = a21 * a33 - a23 * a31,
      b11 = a22 * a33 - a23 * a32,

      det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  return mat4(
      a11 * b11 - a12 * b10 + a13 * b09,
      a02 * b10 - a01 * b11 - a03 * b09,
      a31 * b05 - a32 * b04 + a33 * b03,
      a22 * b04 - a21 * b05 - a23 * b03,
      a12 * b08 - a10 * b11 - a13 * b07,
      a00 * b11 - a02 * b08 + a03 * b07,
      a32 * b02 - a30 * b05 - a33 * b01,
      a20 * b05 - a22 * b02 + a23 * b01,
      a10 * b10 - a11 * b08 + a13 * b06,
      a01 * b08 - a00 * b10 - a03 * b06,
      a30 * b04 - a31 * b02 + a33 * b00,
      a21 * b02 - a20 * b04 - a23 * b00,
      a11 * b07 - a10 * b09 - a12 * b06,
      a00 * b09 - a01 * b07 + a02 * b06,
      a31 * b01 - a30 * b03 - a32 * b00,
      a20 * b03 - a21 * b01 + a22 * b00) / det;
}

mat4 transpose(mat4 m) {
  return mat4(m[0][0], m[1][0], m[2][0], m[3][0],
              m[0][1], m[1][1], m[2][1], m[3][1],
              m[0][2], m[1][2], m[2][2], m[3][2],
              m[0][3], m[1][3], m[2][3], m[3][3]);
}

void main() {
  vUv = vec2(uv.x, 1.-uv.y);
  vec3 base = (instanceMatrix * vec4(position.xy, 0., 1.)).xyz;
  vec3 dBoulder = (mouse-base);
  vLight = clamp((1./length(dBoulder))/10., 0., 1.);
  
  vec2 size = vec2(256.);
  float id = float(int(instanceColor.x));
  vec2 curlUv = instanceColor.yz;
  curlUv = vec2(mod(id, size.x)/(size.x), (id/size.x)/(size.y));
  vec4 c = texture2D(noise, curlUv);
  float noise2 = texture2D(noise, curlUv * 1. + time * 0.01).r;
  vec3 n = c.xyz;
  float h = (1. + noise2);
  
  vec3 pNormal = (transpose(inverse(modelMatrix)) * vec4(normalize(vec3((noise2 - 0.5) * n.xy, 1.)), 1.)).xyz;
  vec3 target = normalize(position + pNormal ) * h;
  vNormal = normalMatrix * pNormal;
  vec3 offset;
  float f = inCubic(position.z);
  offset = mix(position, target, f);
  
  vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(offset, 1.0);
  vPosition = mvPosition.xyz;
  vViewPosition = -mvPosition.xyz;
  vWorldPosition = modelMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;;
}