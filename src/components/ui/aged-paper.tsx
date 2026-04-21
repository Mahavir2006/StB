/**
 * AgedPaper — procedural WebGL shader that renders:
 *  • warm parchment base with subtle colour variation
 *  • crumple / wrinkle normal-map via layered fBm noise
 *  • horizontal ruled lines (like a notebook)
 *  • three punch-holes on the left margin
 *  • burnt / charred edges with irregular tear silhouette
 *  • dark wood-grain background behind the paper
 *  • soft drop-shadow under the page
 *
 * Pure Three.js ShaderMaterial — no image assets, 60 fps.
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  GLSL                                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

const VERT = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uRes;

  /* ── Hash / noise helpers ── */
  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),           hash(i + vec2(1,0)), u.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
      u.y
    );
  }

  float fbm(vec2 p, int oct) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 8; i++) {
      if (i >= oct) break;
      v += a * noise(p);
      p *= 2.1;
      a *= 0.5;
    }
    return v;
  }

  /* ── Wood grain for the desk background ── */
  vec3 woodGrain(vec2 uv) {
    float grain = fbm(uv * vec2(1.0, 8.0), 5);
    grain += 0.4 * fbm(uv * vec2(2.0, 20.0) + 3.7, 4);
    float ring = sin(grain * 18.0 + uv.y * 3.0) * 0.5 + 0.5;
    vec3 dark  = vec3(0.10, 0.06, 0.03);
    vec3 light = vec3(0.22, 0.14, 0.07);
    return mix(dark, light, ring * 0.7 + 0.15);
  }

  /* ── Irregular burnt-edge silhouette ── */
  /* Returns 0 = outside paper, 1 = inside paper, 0..1 = burnt zone */
  float paperMask(vec2 uv) {
    /* page occupies roughly [0.06, 0.94] x [0.04, 0.96] in UV */
    float margin = 0.06;
    vec2 d = min(uv - margin, (1.0 - margin) - uv);   /* dist to each edge */
    float edge = min(d.x, d.y);

    /* warp the edge with noise for torn / burnt look */
    float warp = fbm(uv * 6.0 + 1.3, 5) * 0.055
               + fbm(uv * 14.0 + 7.1, 3) * 0.018;
    float torn = edge + warp - 0.012;

    return clamp(torn / 0.025, 0.0, 1.0);
  }

  /* ── Crumple shading via fBm ── */
  float crumple(vec2 uv) {
    float c  = fbm(uv * 3.5,  6) * 0.55;
    c += fbm(uv * 7.0  + 2.3, 5) * 0.28;
    c += fbm(uv * 15.0 + 5.7, 4) * 0.12;
    c += fbm(uv * 30.0 + 9.1, 3) * 0.05;
    return c;
  }

  /* ── Ruled lines ── */
  float ruledLine(vec2 uv, float lineSpacing) {
    /* lines start after top margin */
    float y = (uv.y - 0.08) / (1.0 - 0.12);
    float line = abs(fract(y / lineSpacing) - 0.5);
    float w = fwidth(y / lineSpacing) * 0.8;
    return 1.0 - smoothstep(w, w * 2.5, line);
  }

  /* ── Punch holes ── */
  float punchHole(vec2 uv, float cy) {
    /* hole centre: x ≈ 0.085, radius ≈ 0.012 */
    vec2 centre = vec2(0.085, cy);
    float r = length(uv - centre);
    return smoothstep(0.013, 0.010, r);
  }

  /* ── Burn colour ── */
  vec3 burnColor(float t) {
    /* t=0 paper, t=1 fully charred */
    vec3 paper  = vec3(0.82, 0.68, 0.42);
    vec3 scorch = vec3(0.38, 0.18, 0.05);
    vec3 char_  = vec3(0.06, 0.03, 0.01);
    if (t < 0.5) return mix(paper, scorch, t * 2.0);
    return mix(scorch, char_, (t - 0.5) * 2.0);
  }

  void main() {
    vec2 uv = vUv;

    /* ── 1. Wood desk background ── */
    vec3 desk = woodGrain(uv * vec2(2.5, 1.0));

    /* ── 2. Paper silhouette ── */
    float mask = paperMask(uv);
    if (mask <= 0.0) {
      /* outside paper — just desk + soft shadow */
      float shadow = 0.0;
      vec2 sd = min(uv - 0.06, 0.94 - uv);
      float sdist = min(sd.x, sd.y);
      shadow = smoothstep(0.0, 0.06, sdist + 0.01) * 0.55;
      gl_FragColor = vec4(desk * (1.0 - shadow * 0.6), 1.0);
      return;
    }

    /* ── 3. Parchment base colour ── */
    float c = crumple(uv);
    /* warm aged paper: cream → tan */
    vec3 paperLight = vec3(0.93, 0.83, 0.60);
    vec3 paperDark  = vec3(0.72, 0.56, 0.32);
    vec3 paper = mix(paperLight, paperDark, c * 0.9);

    /* subtle age stains */
    float stain = fbm(uv * 2.1 + 4.4, 4);
    paper = mix(paper, vec3(0.65, 0.48, 0.25), stain * 0.18);

    /* ── 4. Crumple shading (fake diffuse from top-left light) ── */
    /* approximate normal from noise gradient */
    float eps = 0.003;
    float cx = crumple(uv + vec2(eps, 0.0));
    float cy2 = crumple(uv + vec2(0.0, eps));
    vec2 grad = vec2(cx - c, cy2 - c) / eps;
    vec3 normal = normalize(vec3(-grad * 4.0, 1.0));
    vec3 light  = normalize(vec3(-0.4, 0.6, 1.0));
    float diff  = clamp(dot(normal, light), 0.0, 1.0);
    paper *= 0.55 + 0.55 * diff;

    /* ── 5. Ruled lines ── */
    float lineSpacing = 0.038;   /* ~26 lines on the page */
    float line = ruledLine(uv, lineSpacing);
    /* line colour: warm sepia */
    vec3 lineCol = vec3(0.55, 0.38, 0.18);
    paper = mix(paper, lineCol, line * 0.45);

    /* ── 6. Left margin red line ── */
    float marginX = 0.155;
    float marginLine = 1.0 - smoothstep(0.0, fwidth(uv.x) * 3.0, abs(uv.x - marginX));
    paper = mix(paper, vec3(0.75, 0.22, 0.18), marginLine * 0.55);

    /* ── 7. Punch holes ── */
    float hole = punchHole(uv, 0.20)
               + punchHole(uv, 0.50)
               + punchHole(uv, 0.80);
    hole = clamp(hole, 0.0, 1.0);
    /* hole interior = dark desk colour */
    paper = mix(paper, desk * 0.4, hole);
    /* hole rim shadow */
    float holeShadow = 0.0;
    for (float cy = 0.0; cy <= 1.0; cy += 0.30) {
      if (cy < 0.15 || cy > 0.85) continue;
      float hcy = cy < 0.35 ? 0.20 : cy < 0.65 ? 0.50 : 0.80;
      vec2 hc = vec2(0.085, hcy);
      float r = length(uv - hc);
      holeShadow += smoothstep(0.022, 0.013, r) * (1.0 - smoothstep(0.010, 0.013, r));
    }
    paper = mix(paper, paper * 0.5, holeShadow);

    /* ── 8. Burnt edges ── */
    /* mask goes 0→1 near edge; invert to get burn intensity */
    float burnT = 1.0 - smoothstep(0.0, 1.0, mask);
    burnT = pow(burnT, 0.6);
    /* add noise to burn boundary */
    float burnNoise = fbm(uv * 10.0 + 2.2, 4) * 0.3;
    burnT = clamp(burnT + burnNoise * (1.0 - mask), 0.0, 1.0);
    paper = mix(paper, burnColor(burnT), burnT * 0.92);

    /* ── 9. Vignette inside paper ── */
    vec2 vig = uv - 0.5;
    float vign = 1.0 - dot(vig, vig) * 0.6;
    paper *= clamp(vign, 0.7, 1.0);

    /* ── 10. Composite with desk ── */
    /* soft drop shadow */
    float shadow = 0.0;
    vec2 sd2 = min(uv - 0.06, 0.94 - uv);
    float sdist2 = min(sd2.x, sd2.y);
    shadow = (1.0 - smoothstep(0.0, 0.05, sdist2)) * 0.5;

    vec3 col = mix(desk, paper, mask);
    col = mix(col, desk * 0.3, shadow * (1.0 - mask) * 0.0); /* shadow only outside */

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ─────────────────────────────────────────────────────────────────────────── */
/*  React component                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */

interface AgedPaperProps {
  /** Extra className on the wrapper div */
  className?: string;
}

export function AgedPaper({ className = '' }: AgedPaperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock  = new THREE.Clock();

    const uniforms = {
      uTime: { value: 0 },
      uRes:  { value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader:   VERT,
      fragmentShader: FRAG,
      uniforms,
    });

    const geo  = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geo, material);
    scene.add(mesh);

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.uRes.value.set(w, h);
    };
    window.addEventListener('resize', onResize);
    onResize();

    /* Paper is static — only animate very slowly for subtle paper "breathing" */
    renderer.setAnimationLoop(() => {
      uniforms.uTime.value = clock.getElapsedTime() * 0.05;
      renderer.render(scene, camera);
    });

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.setAnimationLoop(null);
      const canvas = renderer.domElement;
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      material.dispose();
      geo.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}
