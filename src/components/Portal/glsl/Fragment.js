import * as glsl from "glslify"

export const Fragment = glsl`
    varying float vElevation;

    void main(){
        vec4 ColorA = vec4(0.117, 0.125, 0.615, 1.0);
        vec4 ColorB = vec4(0.909, 0.121, 0.909, 1.0);
        float ColorMix = (vElevation * 0.4) * 7.0;
        vec4 ColorC = mix(ColorB, ColorA, ColorMix);

        gl_FragColor = ColorC;
    }
  `
