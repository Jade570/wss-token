#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;   // 화면 해상도
uniform float u_time;        // 시간값
uniform vec3 u_ambientLightColor;         // 앰비언트 라이트 색상
uniform vec3 u_directionalLightColor;     // 방향성 라이트 색상
uniform vec3 u_directionalLightDirection; // 방향성 라이트의 방향
uniform vec3 u_cameraPosition; // 카메라 위치
uniform vec3 u_color;       // 색상 값 (r,g,b,a)   

// vertex shader에서 전달받은 varyings
varying vec2 vUv; // 텍스처 좌표
varying vec3 vWorldPosition; // 월드 좌표
varying vec3 vNormal; // 변환된 법선 벡터

// -- 조명 계산 함수 --
// 주어진 정규화된 법선(norm)을 기반으로 Lambert 조명 계산을 수행하여
// 앰비언트 라이트와 방향성 라이트의 기여를 합산하여 반환합니다.
vec3 computeLighting(vec3 norm) {
    float diff = max(dot(norm, normalize(u_directionalLightDirection)), 0.0);
    return u_ambientLightColor + u_directionalLightColor * diff;
}

// HSB를 RGB로 변환하는 함수
vec3 hsb2rgb(in vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x*6.0 + vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
  rgb = rgb*rgb*(3.0-2.0*rgb);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
  // gl_FragCoord는 (0,0)이 좌측하단, (width, height)이 우측상단입니다.
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;


  // 화면 대각선 방향의 좌표 (0~1 범위)
  float diag = (uv.x + uv.y) / 2.0;
  
  // speed는 이동 속도를 조절하는 상수입니다.
  float speed = 0.35;
  // sin 함수를 이용해 부드러운 진동값을 계산합니다.
  // sin 함수는 -1에서 1 사이의 값을 주므로 0.5를 더하고 0.5를 곱해 0~1 범위로 변환합니다.
  float t = 0.75 + 0.25 * 0.5 * sin(2.0 * 3.14159 * (diag + u_time * speed));
  
  // t에 따라 채도를 보간합니다.
  // t가 0일 때 채도 0.0 (하양), t가 1일 때 채도 1.0 (노랑)
  float saturation = mix(0.0, 1.0, t);
  float hue = float(u_color)/360.0;
  float brightness = 1.0;
  
  // vec3 col = hsb2rgb(vec3(hue, saturation, brightness));
  vec3 col = vec3(mix(0.0, u_color.r, t), mix(0.0, u_color.g, t), mix(0.0, u_color.b, t));
  // vec3 col = vec3(u_color);

 // 현재 픽셀의 화면 좌표를 [0,1] 범위로 정규화 (디버깅용으로 남겨둠)
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 초기 색상 (0으로 시작)
    vec3 bgcolor = vec3(0.0);
    
    // 화면 중앙(0.5,0.5)으로부터 현재 픽셀까지의 벡터 계산
    vec2 toCenter = vec2(0.5) - st;
    vec2 bgst = st;
    
    // 중심에서의 각도와 거리 계산
    float angle = atan(toCenter.y, toCenter.x);
    float radius = length(toCenter) * 100.0;
    
    // 법선(vNormal)을 정규화하여 조명 계산 함수에 전달
    vec3 norm = normalize(vNormal);
    vec3 lighting = computeLighting(norm);
    
    // 조명 결과를 곱하여 최종 색상에 적용
    col *= lighting;
    
    // -- 자체발광(emissive) 효과 추가 --  
    // 기본 색상과 별개로, 시간에 따라 진동하는 emissive 색상을 더합니다.
    // 이 부분은 조명 계산과 독립적으로 항상 빛을 내는 느낌을 줍니다.
    vec3 emissive = vec3(0.2, 0.2, 0.2) * (0.5*sin(u_time * 1.2));
    col += emissive;

    gl_FragColor = vec4(col, 1.0);

}
