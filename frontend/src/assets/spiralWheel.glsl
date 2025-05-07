uniform float time;
uniform vec3 color;
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float angle = atan(uv.y - 0.5, uv.x - 0.5) * 13.0 + time * 1.618;
  float radius = length(uv - 0.5);
  float spokes = sin(angle) * cos(radius * 3.14159 * 13.0);
  gl_FragColor = vec4(color * spokes, 1.0);
}
