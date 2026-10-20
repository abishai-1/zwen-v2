"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "@/motion/gsap";
import { activeStyle, lenisRef, pointer, reducedMotion, scrollVelocity } from "@/motion/store";
import { GLYPHS, GLYPH_FONT_VAR, STYLE_COLORS, STYLE_ORDER, type StyleKey } from "@/lib/styles";

const CELL_PX = 64;

async function buildAtlas() {
  const css = getComputedStyle(document.documentElement);
  const fams = STYLE_ORDER.map((s) => css.getPropertyValue(GLYPH_FONT_VAR[s]).trim() || "monospace");
  await Promise.all(
    STYLE_ORDER.map((s, i) => document.fonts.load(`48px ${fams[i]}`, GLYPHS[s].join("")).catch(() => undefined)),
  );
  const canvas = document.createElement("canvas");
  canvas.width = CELL_PX * 16;
  canvas.height = CELL_PX * STYLE_ORDER.length;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  STYLE_ORDER.forEach((s, row) => {
    ctx.font = `${s === "jp" ? 44 : 50}px ${fams[row]}`;
    GLYPHS[s].forEach((ch, col) => {
      if (ch === "█") ctx.fillRect(col * CELL_PX + 10, row * CELL_PX + 6, CELL_PX - 20, CELL_PX - 12);
      else ctx.fillText(ch, col * CELL_PX + CELL_PX / 2, row * CELL_PX + CELL_PX / 2 + 2);
    });
  });
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.flipY = false;
  return tex;
}

const frag = /* glsl */ `
precision highp float;
uniform sampler2D uAtlas;
uniform vec2 uRes;
uniform float uTime, uCell, uFrom, uTo, uMix, uScroll, uVel, uDpr;
uniform vec2 uMouse;
uniform vec3 uFg, uAccent;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }

// 0 ascii plasma | 1 ink flow | 2 rising embers | 3 digital rain
float pattern(float s, vec2 c, float t) {
  vec2 uv = c / 38.0;
  if (s < 0.5) {
    float v = fbm(uv * 1.4 + vec2(t * 0.05, -t * 0.03));
    return smoothstep(0.5, 0.95, v + 0.12 * sin(uv.x * 3.0 + t * 0.4));
  } else if (s < 1.5) {
    vec2 q = vec2(fbm(uv + t * 0.02), fbm(uv + vec2(5.2, 1.3) - t * 0.015));
    float v = fbm(uv + 2.4 * q);
    return smoothstep(0.6, 0.95, v);
  } else if (s < 2.5) {
    float v = fbm(vec2(uv.x * 2.2, uv.y * 1.2 - t * 0.12));
    float sparks = step(0.985, hash(floor(c + vec2(0.0, floor(t * 6.0)))));
    return smoothstep(0.55, 0.95, v) + sparks * 0.8;
  }
  float col = c.x;
  float speed = 0.6 + hash(vec2(col, 1.0)) * 1.6;
  float head = fract(hash(vec2(col, 7.0)) - t * speed * 0.08 + c.y * 0.012);
  float trail = smoothstep(0.0, 0.35, head) * step(head, 0.35);
  float base = step(0.97, hash(c + floor(t * 2.0))) * 0.3;
  return max(trail * (0.4 + 0.6 * (1.0 - head / 0.35)), base);
}

void main() {
  vec2 frag = gl_FragCoord.xy / uDpr;
  frag.y = uRes.y - frag.y;
  vec2 p = frag + vec2(sin(floor(frag.y / uCell) * 1.7 + uTime * 20.0) * uVel * 0.6, uScroll * 0.35);
  vec2 cell = floor(p / uCell);
  vec2 local = fract(p / uCell);

  float h = hash(cell);
  float choose = step(h, uMix);
  float s = mix(uFrom, uTo, choose);
  float front = 1.0 - smoothstep(0.0, 0.08, abs(h - uMix));
  front *= step(0.001, uMix) * step(uMix, 0.999);

  float v = pattern(s, cell, uTime);

  vec2 cc = (cell + 0.5) * uCell - vec2(0.0, uScroll * 0.35);
  float d = distance(cc, uMouse);
  float halo = exp(-d * 0.006);
  float ripple = sin(d * 0.045 - uTime * 3.2) * 0.5 + 0.5;
  v += halo * (0.35 + 0.4 * ripple);
  if (halo > 0.35) v = mix(v, hash(cell + floor(uTime * 10.0)), 0.6);
  v = clamp(v + front * 0.45, 0.0, 0.87);

  float g = floor(v * 16.0);
  vec2 auv = (vec2(g, s) + local) / vec2(16.0, 4.0);
  float a = texture2D(uAtlas, auv).a;

  float accent = max(front, step(0.992, hash(cell + 3.1)) * 0.9);
  vec3 col = mix(uFg, uAccent, accent);
  float alpha = a * (0.07 + halo * 0.4 + front * 0.3 + min(abs(uVel) * 0.006, 0.12));
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

const vert = /* glsl */ `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`;

export function GlyphField() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const atlas = await buildAtlas();
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
      let dpr = Math.min(window.devicePixelRatio, 1.5);
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);
      renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

      const idx = (s: StyleKey) => STYLE_ORDER.indexOf(s);
      const start = activeStyle.get();
      const col = (hex: string) => {
        const c = rgb(hex);
        return new THREE.Color().setRGB(c.r, c.g, c.b, THREE.LinearSRGBColorSpace);
      };
      const uniforms = {
        uAtlas: { value: atlas },
        uRes: { value: new THREE.Vector2() },
        uTime: { value: 0 },
        uCell: { value: window.innerWidth < 768 ? 13 : 16 },
        uFrom: { value: idx(start) },
        uTo: { value: idx(start) },
        uMix: { value: 0 },
        uScroll: { value: 0 },
        uVel: { value: 0 },
        uDpr: { value: dpr },
        uMouse: { value: new THREE.Vector2(-9999, -9999) },
        uFg: { value: col(STYLE_COLORS[start].fg) },
        uAccent: { value: col(STYLE_COLORS[start].accent) },
      };
      const scene = new THREE.Scene();
      const camera = new THREE.Camera();
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({ uniforms, vertexShader: vert, fragmentShader: frag, transparent: true, premultipliedAlpha: true, depthTest: false }),
      );
      scene.add(mesh);

      const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
      };
      resize();
      window.addEventListener("resize", resize);

      // Style morph: cells flip from the old glyph set to the new one in a scattered wave.
      let morph: gsap.core.Tween | null = null;
      const offStyle = activeStyle.subscribe((next) => {
        morph?.kill();
        uniforms.uFrom.value = uniforms.uMix.value > 0.5 ? uniforms.uTo.value : uniforms.uFrom.value;
        uniforms.uTo.value = idx(next);
        uniforms.uMix.value = 0;
        morph = gsap.to(uniforms.uMix, {
          value: 1,
          duration: 1.4,
          ease: "power2.inOut",
          onComplete: () => {
            uniforms.uFrom.value = uniforms.uTo.value;
            uniforms.uMix.value = 0;
          },
        });
        const c = STYLE_COLORS[next];
        gsap.to(uniforms.uFg.value, { ...rgb(c.fg), duration: 1, ease: "power2.inOut" });
        gsap.to(uniforms.uAccent.value, { ...rgb(c.accent), duration: 1, ease: "power2.inOut" });
        if (reduced) render();
      });

      const reduced = reducedMotion();
      const mouse = { x: -9999, y: -9999 };
      let frames = 0;
      let slow = 0;
      let last = performance.now();
      const render = () => renderer.render(scene, camera);
      const tick = (time: number) => {
        const now = performance.now();
        const dt = now - last;
        last = now;
        if (!reduced) uniforms.uTime.value = time;
        mouse.x += (pointer.px - mouse.x) * 0.12;
        mouse.y += (pointer.py - mouse.y) * 0.12;
        uniforms.uMouse.value.set(mouse.x, mouse.y);
        uniforms.uScroll.value = lenisRef.current?.scroll ?? window.scrollY;
        uniforms.uVel.value = scrollVelocity.get();
        render();
        // Adaptive quality: drop resolution if frames are consistently slow.
        if (++frames < 240 && dpr > 1) {
          slow = dt > 24 ? slow + 1 : Math.max(0, slow - 1);
          if (slow > 40) {
            dpr = 1;
            renderer.setPixelRatio(1);
            uniforms.uDpr.value = 1;
            resize();
          }
        }
      };
      if (reduced) render();
      else gsap.ticker.add(tick);
      gsap.from(renderer.domElement, { opacity: 0, duration: 2, ease: "power2.out" });

      cleanup = () => {
        gsap.ticker.remove(tick);
        offStyle();
        morph?.kill();
        window.removeEventListener("resize", resize);
        renderer.dispose();
        atlas.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={host} aria-hidden className="pointer-events-none fixed inset-0 z-0" />;
}

/** Raw sRGB components (no colour-management conversion; the shader outputs them as-is). */
function rgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}
