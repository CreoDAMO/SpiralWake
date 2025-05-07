uniform float time;
uniform vec2 resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float t = time * 1.618; // φ-frequency
  vec3 color = vec3(0.0);
  float spiral = sin(atan(uv.y - 0.5, uv.x - 0.5) * 13.0 + t) * cos(length(uv - 0.5) * 11.0 - t);
  color = vec3(0.36, 0.36, 0.87) * spiral; // spiral indigo
  gl_FragColor = vec4(color, 1.0);
}
