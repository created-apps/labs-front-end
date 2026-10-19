// Hero 3D scene: a glass beaker on a magnetic stirrer on a laboratory workbench.
// First visit ("opening"): the CreatED Labs logo hangs in the same space, above the beaker. A pipette
// drops Sunglow liquid into the E's double-line tube; it runs through the arrow into the light-bulb D,
// which fills, and a stream leaves the bulb's base. The camera follows that stream down into the
// workbench framing, where the same stream fills the beaker; then the stir bar spins up the vortex.
// Repeat visits start at the workbench, with the stream already pouring from above.
// Illustrative only: it doesn't depict a specific student project or result.
import * as THREE from "three";
import { LOGO, type LogoArt } from "./logo";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export type Stage = {
  start: () => void;
  stop: () => void;
  dispose: () => void;
  setPointer: (x: number, y: number) => void;
};

// the liquid is hot pink; it deepens as the colour mixes in
const PALE = new THREE.Color("#FF5FAE");
const SUN = new THREE.Color("#F0127E");
const WARM = new THREE.Color("#C70A68");
const INK = new THREE.Color("#A3005A");
const PINK = "#FF2E93";
const PINK_GLOW = "#C8106A";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const inOut = (x: number) => {
  const c = clamp01(x);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};
const outCubic = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
const smooth = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function radialTexture(stops: [number, string][], size = 128) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([o, col]) => gr.addColorStop(o, col));
  g.fillStyle = gr;
  g.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

// soft rectangular falloff so the workbench never shows a hard edge
// vertical alpha for the pour stream: solid where it meets the liquid, fading out towards its
// top so it never draws a hard line through the hero copy on tall screens
function streamFade(from = 0.35, to = 0.85) {
  const n = 64, data = new Uint8Array(n * 4);
  for (let i = 0; i < n; i++) {
    const v = i / (n - 1); // 0 = bottom of the cylinder, 1 = top
    const a = Math.round(255 * (1 - THREE.MathUtils.smoothstep(v, from, to)));
    data.set([a, a, a, 255], i * 4);
  }
  const tex = new THREE.DataTexture(data, 1, n);
  tex.needsUpdate = true;
  return tex;
}

function edgeFade() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 144;
  const g = c.getContext("2d")!;
  const d = g.createImageData(256, 144);
  const ramp = (u: number, e: number) => {
    const t = Math.min(1, Math.min(u, 1 - u) / e);
    return t * t * (3 - 2 * t);
  };
  for (let y = 0; y < 144; y++)
    for (let x = 0; x < 256; x++) {
      const a = Math.round(255 * ramp(x / 255, 0.2) * ramp(y / 143, 0.26));
      const i = (y * 256 + x) * 4;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = a;
      d.data[i + 3] = 255;
    }
  g.putImageData(d, 0, 0);
  return new THREE.CanvasTexture(c);
}

export function createStage(
  canvas: HTMLCanvasElement,
  opts: {
    mobile: boolean;
    benchUrl: string;
    causticsUrl: string;
    startAt?: number;
    /** first visit: start on the logo (prepared by buildLogo) */
    opening?: LogoArt;
    onFirstFrame: () => void;
    /** opening only: the moment the hero copy should come in */
    onSettle?: () => void;
  },
): Stage {
  const opening = opts.opening;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.mobile ? 1.35 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.setClearColor(0x000000, 0);
  renderer.localClippingEnabled = true;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.8;

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 400) // far enough for the wide opening shot on tall phone screens;
  const lookAt = new THREE.Vector3(0, 1.45, 0);

  const key = new THREE.DirectionalLight(0xfff0d8, 2.3);
  key.position.set(-5, 8, 3);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xe8f6ff, 0.9);
  rim.position.set(4, 3, -5);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0xf4f8ff, 0.22));

  /* ---------- workbench: polished epoxy that picks up reflections ---------- */
  const bench = new THREE.Group();
  scene.add(bench);
  const loader = new THREE.TextureLoader();
  const benchTex = loader.load(opts.benchUrl);
  benchTex.colorSpace = THREE.SRGBColorSpace;
  benchTex.anisotropy = 8;
  const benchMat = new THREE.MeshPhysicalMaterial({
    map: benchTex,
    alphaMap: edgeFade(),
    transparent: true,
    opacity: 0.84, // lets the mirrored rig below read as a reflection in the glossy epoxy
    roughness: 0.38,
    metalness: 0,
    clearcoat: 0.7,
    clearcoatRoughness: 0.2,
    envMapIntensity: 0.7,
  });
  const benchPlane = new THREE.Mesh(new THREE.PlaneGeometry(22, 12.28), benchMat);
  benchPlane.rotation.x = -Math.PI / 2;
  benchPlane.position.z = -0.6; // the clear centre of the worktop sits under the stirrer
  bench.add(benchPlane);
  const longShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: radialTexture([[0, "rgba(0,0,0,0.6)"], [0.55, "rgba(0,0,0,0.26)"], [1, "rgba(0,0,0,0)"]]), transparent: true, depthWrite: false }),
  );
  longShadow.rotation.x = -Math.PI / 2;
  longShadow.rotation.z = -0.62;
  longShadow.scale.set(7.4, 3.6, 1);
  longShadow.position.set(2.2, 0.01, 1.2);
  bench.add(longShadow);
  // caustics: light focused through the glass and liquid, drifting on the worktop
  const causticTex = loader.load(opts.causticsUrl);
  causticTex.wrapS = causticTex.wrapT = THREE.RepeatWrapping;
  causticTex.colorSpace = THREE.SRGBColorSpace;
  const causticMat = new THREE.MeshBasicMaterial({
    map: causticTex,
    alphaMap: radialTexture([[0, "#fff"], [0.5, "#888"], [1, "#000"]], 64),
    color: new THREE.Color("#FF6FB5"),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const caustics = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), causticMat);
  caustics.rotation.x = -Math.PI / 2;
  caustics.position.set(1.15, 0.015, 0.95);
  bench.add(caustics);

  /* ---------- stirrer ---------- */
  const rig = new THREE.Group();
  scene.add(rig);
  const contact = new THREE.Mesh(
    new THREE.PlaneGeometry(5.6, 5.6),
    new THREE.MeshBasicMaterial({ map: radialTexture([[0, "rgba(0,0,0,0.55)"], [1, "rgba(0,0,0,0)"]]), transparent: true, depthWrite: false }),
  );
  contact.rotation.x = -Math.PI / 2;
  contact.position.y = 0.012;
  rig.add(contact);
  const body = new THREE.Mesh(
    new RoundedBoxGeometry(3.3, 0.9, 3.1, 4, 0.2),
    new THREE.MeshPhysicalMaterial({ color: "#1f2223", roughness: 0.45, metalness: 0.15, clearcoat: 0.5, clearcoatRoughness: 0.35 }),
  );
  body.position.y = 0.45;
  rig.add(body);
  const plate = new THREE.Mesh(new RoundedBoxGeometry(3.0, 0.1, 2.8, 3, 0.04), new THREE.MeshPhysicalMaterial({ color: "#cdd4d6", roughness: 0.4, clearcoat: 0.4 }));
  plate.position.y = 0.94;
  rig.add(plate);
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.18, 32), new THREE.MeshStandardMaterial({ color: "#3c4243", roughness: 0.4 }));
  knob.rotation.x = Math.PI / 2;
  knob.position.set(0.95, 0.45, 1.6);
  rig.add(knob);
  const ledMat = new THREE.MeshStandardMaterial({ color: "#F1CA01", emissive: "#F1CA01", emissiveIntensity: 0.2 });
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), ledMat);
  led.position.set(-1.0, 0.45, 1.56);
  rig.add(led);

  /* ---------- beaker ---------- */
  const R = 1.05, T = 0.05, H = 2.35, BASE = 0.99;
  const prof = [
    [0, 0], [R + T - 0.08, 0], [R + T, 0.08], [R + T, H], [R + T + 0.07, H + 0.04], [R + T + 0.05, H + 0.075],
    [R - 0.005, H + 0.03], [R, 0.12], [R - 0.07, 0.07], [0, 0.07],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const beakerGeo = new THREE.LatheGeometry(prof, 72);
  const beaker = new THREE.Mesh(
    beakerGeo,
    new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      roughness: opts.mobile ? 0.08 : 0.03,
      transmission: 1,
      thickness: 0.15,
      ior: 1.47,
      specularIntensity: 1,
      clearcoat: 0.6,
      clearcoatRoughness: 0.02,
      envMapIntensity: 1.1,
      depthWrite: false,
    }),
  );
  beaker.position.y = BASE;
  beaker.renderOrder = 1;
  rig.add(beaker);
  const rimMat = new THREE.ShaderMaterial({
    vertexShader: /* glsl */ `
      varying float vF;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vec3 n = normalize(normalMatrix * normal);
        vF = pow(1.0 - abs(dot(n, normalize(-mv.xyz))), 2.6);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      varying float vF;
      void main() { gl_FragColor = vec4(1.0, 0.98, 0.92, vF * 0.24); }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const rimMesh = new THREE.Mesh(beakerGeo, rimMat);
  rimMesh.position.y = BASE;
  rimMesh.renderOrder = 6;
  rig.add(rimMesh);
  const gradMat = new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.7, depthWrite: false });
  for (let i = 0; i < 6; i++) {
    const long = i % 2 === 0;
    const arc = new THREE.Mesh(new THREE.TorusGeometry(R + T + 0.004, 0.007, 4, 24, long ? 0.34 : 0.18), gradMat);
    arc.rotation.x = Math.PI / 2;
    arc.rotation.z = Math.PI * 0.18 - (long ? 0 : 0.08);
    arc.position.y = BASE + 0.55 + i * 0.27;
    arc.renderOrder = 4;
    rig.add(arc);
  }

  /* ---------- liquid (level animates during the pour) ---------- */
  const FULL = 1.55;
  const floorY = BASE + 0.07;
  const liquidMat = new THREE.MeshPhysicalMaterial({
    color: PALE.clone(),
    roughness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    transparent: true,
    opacity: 0.72, // dense enough to read as a saturated hot pink over the white plate
    emissive: new THREE.Color(PINK),
    emissiveIntensity: 0.14,
    depthWrite: false,
  });
  const bodyGeo = new THREE.CylinderGeometry(R - 0.012, R - 0.04, 1, 72, 1, true);
  bodyGeo.translate(0, 0.5, 0); // grows upward from the floor
  const liquid = new THREE.Mesh(bodyGeo, liquidMat);
  liquid.position.y = floorY;
  liquid.renderOrder = 2;
  rig.add(liquid);
  const coreGeo = new THREE.CylinderGeometry(R * 0.72, R * 0.6, 1, 48, 1, true);
  coreGeo.translate(0, 0.5, 0);
  const core = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({ color: "#B0125F", transparent: true, opacity: 0.28, depthWrite: false, side: THREE.BackSide }));
  core.position.y = floorY + 0.02;
  core.renderOrder = 2;
  rig.add(core);

  const RINGS = opts.mobile ? 16 : 24, SEGS = opts.mobile ? 48 : 72;
  const surfGeo = new THREE.BufferGeometry();
  const pos = new Float32Array((RINGS * SEGS + 1) * 3);
  const idx: number[] = [];
  for (let r = 0; r < RINGS; r++)
    for (let s = 0; s < SEGS; s++) {
      const a = 1 + r * SEGS + s, b = 1 + r * SEGS + ((s + 1) % SEGS);
      if (r === 0) idx.push(0, b, a);
      else {
        const c = 1 + (r - 1) * SEGS + s, d = 1 + (r - 1) * SEGS + ((s + 1) % SEGS);
        idx.push(c, d, a, d, b, a);
      }
    }
  surfGeo.setIndex(idx);
  surfGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const surfMat = liquidMat.clone();
  surfMat.opacity = 0.9;
  surfMat.side = THREE.DoubleSide;
  const surface = new THREE.Mesh(surfGeo, surfMat);
  surface.renderOrder = 3;
  rig.add(surface);

  // pour stream enters off-centre, so ripples radiate from that point
  const POUR_X = -0.38, POUR_Z = 0.12;
  const writeSurface = (depth: number, t: number, pourAmp: number, pourAge: number) => {
    const Rs = R - 0.012;
    pos[0] = 0;
    pos[1] = -depth;
    pos[2] = 0;
    for (let r = 0; r < RINGS; r++) {
      const rr = ((r + 1) / RINGS) * Rs;
      const u = rr / Rs;
      const base = -depth * Math.exp(-(u * u) / 0.16) + depth * 0.18 * u * u;
      for (let s = 0; s < SEGS; s++) {
        const th = (s / SEGS) * Math.PI * 2;
        const x = Math.cos(th) * rr, z = Math.sin(th) * rr;
        let y = base + 0.006 * Math.sin(5 * th - 7 * u + t * 2.2) * u;
        if (pourAmp > 0.001) {
          const d = Math.hypot(x - POUR_X, z - POUR_Z);
          y += pourAmp * 0.045 * Math.sin(d * 14 - pourAge * 11) * Math.exp(-d * 1.6) - pourAmp * 0.06 * Math.exp(-d * d * 40);
        }
        const i = (1 + r * SEGS + s) * 3;
        pos[i] = x;
        pos[i + 1] = y;
        pos[i + 2] = z;
      }
    }
    surfGeo.attributes.position.needsUpdate = true;
    surfGeo.computeVertexNormals();
  };

  // the stream: a slender column from above, anchored at its top so it can grow and retract
  const streamGeo = new THREE.CylinderGeometry(0.05, 0.075, 1, 20, 12, true);
  streamGeo.translate(0, -0.5, 0);
  const streamPos = streamGeo.attributes.position as THREE.BufferAttribute;
  const streamBase = Float32Array.from(streamPos.array as Float32Array);
  const streamMat = new THREE.MeshPhysicalMaterial({
    color: PINK,
    roughness: 0.05,
    clearcoat: 1,
    transparent: true,
    opacity: opening ? 0.92 : 0.85,
    emissive: new THREE.Color(PINK_GLOW),
    emissiveIntensity: 0.25,
    depthWrite: false,
    // opening: the stream visibly leaves the bulb; otherwise it fades in a little above the rim
    alphaMap: opening ? streamFade(0.93, 1) : streamFade(),
  });
  const stream = new THREE.Mesh(streamGeo, streamMat);
  // opening: the stream leaves the logo's bulb, high enough that the logo is out of the final framing;
  // otherwise it fades in a little above the rim (see streamFade)
  const STREAM_TOP = BASE + H + (opening ? 5.6 : 2.6);
  stream.position.set(POUR_X, STREAM_TOP, POUR_Z);
  stream.renderOrder = 3;
  stream.visible = false;
  rig.add(stream);

  const bar = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.52, 6, 16), new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.35, clearcoat: 0.5 }));
  bar.rotation.z = Math.PI / 2;
  const barPivot = new THREE.Group();
  barPivot.position.y = floorY + 0.085;
  barPivot.add(bar);
  rig.add(barPivot);

  /* ---------- colour dispersion ---------- */
  const N = opts.mobile ? 220 : 460;
  const inkGeo = new THREE.BufferGeometry();
  const ip = new Float32Array(N * 3), ic = new Float32Array(N * 4), isz = new Float32Array(N);
  inkGeo.setAttribute("position", new THREE.BufferAttribute(ip, 3));
  inkGeo.setAttribute("aColor", new THREE.BufferAttribute(ic, 4));
  inkGeo.setAttribute("aSize", new THREE.BufferAttribute(isz, 1));
  const inkMat = new THREE.ShaderMaterial({
    uniforms: { uScale: { value: 300 } },
    vertexShader: /* glsl */ `
      attribute vec4 aColor; attribute float aSize; uniform float uScale; varying vec4 vColor;
      void main() {
        vColor = aColor;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * uScale / -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      varying vec4 vColor;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = pow(max(0.0, 1.0 - d), 1.8);
        gl_FragColor = vec4(vColor.rgb, vColor.a * a);
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
  });
  const ink = new THREE.Points(inkGeo, inkMat);
  ink.renderOrder = 3;
  ink.frustumCulled = false;
  rig.add(ink);
  type P = { r: number; th: number; y: number; vr: number; vy: number; born: number; life: number };
  const parts: P[] = Array.from({ length: N }, () => ({ r: 0, th: 0, y: -99, vr: 0, vy: 0, born: -1, life: 0 }));
  let spawned = 0;

  /* ---------- opening: the logo, the pipette and the drop ---------- */
  // The logo hangs above the beaker: the bottom of the bulb's screw base sits right over the pour
  // point, so the stream that leaves it is the stream that fills the beaker.
  const LS = 8.4 / LOGO.w; // world units per logo pixel (the logo itself is 8.4 units wide)
  const logoLeft = POUR_X - LOGO.tip.x * LS;
  const logoTop = STREAM_TOP + LOGO.tip.y * LS;
  const lockW = (opening?.width ?? LOGO.w) * LS, lockH = LOGO.h * LS;
  const lockCentre = new THREE.Vector3(logoLeft + lockW / 2, logoTop - lockH / 2, POUR_Z);
  const dropX = logoLeft + LOGO.drop.x * LS, tubeY = logoTop - LOGO.drop.y * LS;
  const TIP_GAP = 0.42; // pipette tip above the tube
  const logoU = {
    uInk: { value: null as THREE.Texture | null },
    uInterior: { value: null as THREE.Texture | null },
    uSize: { value: new THREE.Vector2(opening?.width ?? LOGO.w, LOGO.h) },
    uFront: { value: 0 },
    uTail: { value: 0 },
    uLevel: { value: LOGO.bulb.bottom + 6 },
    uWob: { value: 0 },
    uTime: { value: 0 },
    uPink: { value: new THREE.Color(PINK) },
    uTint: { value: 1 }, // 1: the bulb fills with the pink liquid; 0: it has lit up in the logo's own Sunglow
    uFade: { value: 1 },
  };
  const logoTextures: THREE.Texture[] = [];
  let logoMesh: THREE.Mesh | null = null, pipette: THREE.Group | null = null, drop: THREE.Mesh | null = null;
  let pipetteLiquid: THREE.MeshPhysicalMaterial | null = null;
  const pipetteClip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
  if (opening) {
    for (const [k, c] of [["uInk", opening.ink], ["uInterior", opening.interior]] as const) {
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      logoU[k].value = tex;
      logoTextures.push(tex);
    }
    const t = LOGO.tube, a = LOGO.arrow;
    const logoMat = new THREE.ShaderMaterial({
      uniforms: logoU,
      alphaToCoverage: true, // opaque, so the pipette's glass refracts it; MSAA smooths the edges
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D uInk, uInterior;
        uniform vec2 uSize;
        uniform float uFront, uTail, uLevel, uWob, uTime, uFade;
        uniform vec3 uPink;
        uniform float uTint;
        varying vec2 vUv;
        void main() {
          vec2 p = vec2(vUv.x, 1.0 - vUv.y) * uSize; // logo pixels, y down
          vec4 ink = texture2D(uInk, vUv);
          vec4 inside = texture2D(uInterior, vUv);
          // the bulb fills from the bottom; its own Sunglow and filament appear under the surface
          float surf = uLevel + uWob * sin(p.x * 0.045 - uTime * 10.0);
          // the bulb's own Sunglow is shown pink while it fills, then lights up to the logo's colour
          float sunglow = smoothstep(0.15, 0.45, inside.r - inside.b);
          vec3 bulb = mix(inside.rgb, uPink, uTint * sunglow);
          vec4 col = vec4(bulb, inside.a * smoothstep(surf - 1.2, surf + 1.2, p.y));
          // the run of liquid through the E's tube and the arrow
          float inTube = step(${t.x0.toFixed(1)}, p.x) * step(p.x, ${t.x1.toFixed(1)}) * step(${t.y0.toFixed(1)}, p.y) * step(p.y, ${t.y1.toFixed(1)});
          float k = (p.x - ${a.x0.toFixed(1)}) / ${(a.x1 - a.x0).toFixed(1)};
          float inArrow = step(0.0, k) * step(k, 1.0) * step(abs(p.y - ${((a.yTop + a.yBot) / 2).toFixed(1)}), ${((a.yBot - a.yTop) / 2).toFixed(1)} * (1.0 - k));
          float run = max(inTube, inArrow) * step(uTail, p.x) * step(p.x, uFront);
          col = mix(col, vec4(uPink, 1.0), run);
          // a soft Sunglow halo travels with it, so the run reads even when the logo is small
          float near = step(uTail - 6.0, p.x) * step(p.x, uFront + 6.0) * step(${t.x0.toFixed(1)} - 8.0, p.x) * step(p.x, ${(a.x1 + 8).toFixed(1)});
          float halo = near * exp(-pow((p.y - ${((t.y0 + t.y1) / 2).toFixed(1)}) / 14.0, 2.0)) * 0.7;
          col = vec4(mix(col.rgb, uPink, halo * (1.0 - col.a)), max(col.a, halo));
          vec4 o = vec4(mix(col.rgb, ink.rgb, ink.a), ink.a + col.a * (1.0 - ink.a));
          o.a *= uFade;
          if (o.a < 0.02) discard;
          gl_FragColor = o;
          #include <colorspace_fragment>
        }`,
    });
    logoMesh = new THREE.Mesh(new THREE.PlaneGeometry(lockW, lockH), logoMat);
    logoMesh.position.copy(lockCentre);
    rig.add(logoMesh);

    // a glass Pasteur pipette with a graphite rubber bulb, holding Sunglow liquid
    pipette = new THREE.Group();
    const outer = [[0, 0], [0.02, 0], [0.024, 0.03], [0.028, 0.9], [0.078, 1.32], [0.082, 2.62], [0.07, 2.78], [0.068, 2.95]];
    const inner = [[0.058, 2.95], [0.06, 2.78], [0.072, 2.62], [0.068, 1.32], [0.018, 0.9], [0.014, 0.03], [0, 0.03]];
    const pipetteGlass = new THREE.Mesh(
      new THREE.LatheGeometry([...outer, ...inner].map(([x, y]) => new THREE.Vector2(x, y)), 40),
      (beaker.material as THREE.MeshPhysicalMaterial).clone(),
    );
    pipetteGlass.renderOrder = 1;
    pipette.add(pipetteGlass);
    const pipRim = new THREE.Mesh(pipetteGlass.geometry, rimMat);
    pipRim.renderOrder = 6;
    pipette.add(pipRim);
    pipetteLiquid = new THREE.MeshPhysicalMaterial({
      color: PINK,
      roughness: 0.12,
      clearcoat: 1,
      emissive: new THREE.Color(PINK_GLOW),
      emissiveIntensity: 0.3,
      clippingPlanes: [pipetteClip],
    });
    const liquidProfile = [[0, 0.04], [0.013, 0.04], [0.013, 0.9], [0.064, 1.32], [0.068, 2.5], [0, 2.5]];
    pipette.add(new THREE.Mesh(new THREE.LatheGeometry(liquidProfile.map(([x, y]) => new THREE.Vector2(x, y)), 24), pipetteLiquid));
    const rubber = new THREE.MeshPhysicalMaterial({ color: "#2c2f30", roughness: 0.55, clearcoat: 0.3, clearcoatRoughness: 0.4 });
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.098, 0.098, 0.26, 28), rubber);
    collar.position.y = 2.92;
    pipette.add(collar);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), rubber);
    bulb.scale.set(0.15, 0.32, 0.15);
    bulb.position.y = 3.3;
    pipette.add(bulb);
    pipette.position.set(dropX, tubeY + TIP_GAP, POUR_Z + 0.24);
    rig.add(pipette);

    drop = new THREE.Mesh(new THREE.SphereGeometry(0.07, 20, 14), pipetteLiquid.clone());
    (drop.material as THREE.MeshPhysicalMaterial).clippingPlanes = [];
    drop.visible = false;
    rig.add(drop);
  }

  /* ---------- reflection in the epoxy ---------- */
  rig.children.forEach((c) => (c.userData.src = c.uuid));
  const reflection = rig.clone();
  reflection.scale.y = -1;
  reflection.remove(...reflection.children.filter((c) => c.userData.src === contact.uuid || c.userData.src === stream.uuid || c instanceof THREE.Points));
  reflection.traverse((o) => (o.renderOrder = -1));
  scene.add(reflection);

  /* ---------- timeline ---------- */
  // The opening runs first; the hero's own timeline (pour, fill, stir) starts OPEN seconds in, as the
  // stream leaves the bulb. The opening pour is shorter, so it's finished as the hero copy arrives.
  const OPEN = opening ? 1.55 : 0;
  const T_POUR = opening ? [0.25, 1.95] : [0.25, 2.7]; // stream on
  const T_LEVEL = opening ? [0.55, 2.0] : [0.45, 2.75]; // level rises
  const T_SPIN = opening ? [1.85, 3.05] : [2.6, 3.8];
  const T_IDLE = opening ? 6 : 8;
  const SETTLE_AT = 3.15; // opening: when the hero copy comes in
  let settled = !opening;
  let logoLift = 0;
  const POUR_START_LEVEL = 0.06;

  let elapsed = opts.startAt ?? 0;
  let last = 0, raf = 0, running = false, first = true, barAngle = 0;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let W = 1, Hh = 1, viewH = 1, sx = -0.01, sy = 0.12, scale = 0.52, elev = 0.82;

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    W = w;
    Hh = h;
    // the part of the canvas on screen at the top of the page: below the header, and on phones the
    // hero is taller than the screen
    const top = Math.max(0, canvas.getBoundingClientRect().top + window.scrollY);
    viewH = Math.min(h, (window.innerHeight || h) - top);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const portrait = camera.aspect < 1;
    bench.scale.setScalar(portrait ? 1.7 : 1);
    sx = portrait ? 0 : -0.01;
    sy = portrait ? -0.11 : 0.12;
    scale = portrait ? 0.42 : 0.52;
    elev = portrait ? 0.8 : 0.82;
    inkMat.uniforms.uScale.value = (h * renderer.getPixelRatio()) / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // Opening: the camera starts level with the logo, then follows the stream down and eases into the
  // workbench framing (target, distance and tilt each blend on slightly offset curves, like a crane).
  const target = new THREE.Vector3(), openTarget = new THREE.Vector3();
  let blend = 1;
  const placeCamera = (tw: number) => {
    const vF = THREE.MathUtils.degToRad(camera.fov);
    const fitH = 4.8 / 2 / Math.tan(vF / 2);
    const fitW = 4.4 / 2 / (Math.tan(vF / 2) * camera.aspect);
    let dist = Math.max(fitH, fitW) / scale;
    let el = elev, ox = sx, oy = sy;
    target.copy(lookAt);
    if (opening) {
      const portrait = camera.aspect < 1;
      const seen = viewH / Hh; // the share of the canvas that's on screen at the top of the page
      const d0 =
        Math.max((lockW * (portrait ? 1.08 : 1.14)) / 2 / (Math.tan(vF / 2) * camera.aspect), 6.2 / (Math.tan(vF / 2) * seen)) *
        (1 - 0.035 * smooth(0, 1.75, tw)); // a slow drift in while the bulb fills
      const oy0 = -(1 - seen) / 2; // centre the logo on the screen, not on the whole (taller) canvas
      openTarget.set(lockCentre.x, lockCentre.y + 0.25, lockCentre.z);
      const kT = inOut((tw - 1.68) / 1.45), kD = inOut((tw - 1.8) / 1.5);
      blend = inOut((tw - 1.75) / 1.55);
      target.lerpVectors(openTarget, lookAt, kT);
      dist = Math.exp(THREE.MathUtils.lerp(Math.log(d0), Math.log(dist), kD));
      el = THREE.MathUtils.lerp(0.06, elev, blend);
      ox = sx * blend;
      oy = lerp(oy0, sy, blend);
    }
    camera.position.set(target.x, target.y + Math.sin(el) * dist, target.z + Math.cos(el) * dist);
    camera.lookAt(target);
    camera.setViewOffset(W, Hh, -ox * W, -oy * Hh, W, Hh);
    camera.updateProjectionMatrix();
  };

  const step = (now: number) => {
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    elapsed += dt;
    const tw = elapsed; // wall time since the scene started
    const t = tw - OPEN; // the hero's own timeline

    if (opening) {
      // the pipette lets go of one drop, then lifts away
      if (pipette && drop && pipetteLiquid) {
        const tipY = tubeY + TIP_GAP;
        pipette.position.y = tipY + Math.pow(clamp01((tw - 0.72) / 0.95), 2.2) * 7.5;
        pipetteClip.constant = pipette.position.y + lerp(2.15, 1.84, smooth(0.38, 0.6, tw));
        const form = smooth(0.12, 0.45, tw), fall = (tw - 0.45) / 0.16;
        drop.visible = form > 0.01 && fall < 1;
        if (fall <= 0) {
          drop.scale.set(form, form * 1.2, form);
          drop.position.set(dropX, tipY - 0.06 * form, POUR_Z + 0.24);
        } else {
          drop.scale.set(0.95, 1.18, 0.95);
          drop.position.set(dropX, tipY - 0.06 - (tipY - 0.06 - tubeY) * fall * fall, POUR_Z + 0.24 * (1 - fall));
        }
      }
      // it runs along the E's tube and through the arrow, and the bulb fills from the bottom
      logoU.uTime.value = tw;
      logoU.uFront.value = lerp(LOGO.tube.x0, LOGO.arrow.x1 + 4, inOut((tw - 0.6) / 0.36));
      logoU.uTail.value = lerp(LOGO.tube.x0 - 1, LOGO.arrow.x1 + 6, inOut((tw - 0.8) / 0.34));
      logoU.uLevel.value = lerp(LOGO.bulb.bottom + 6, LOGO.bulb.top - 4, outCubic((tw - 0.92) / 0.85));
      logoU.uWob.value = 2.2 * smooth(0.95, 1.2, tw) * (1 - smooth(1.7, 2.4, tw));
      logoU.uTint.value = 1 - smooth(1.75, 2.15, tw); // full bulb: the light comes on
      // once the stream is in the beaker the logo recedes: it rises out of view and fades
      logoLift = 3.2 * inOut((tw - 2.3) / 1.0);
      logoU.uFade.value = 1 - smooth(2.5, 3.05, tw); // gone before the hero copy arrives
      if (logoMesh) {
        logoMesh.position.y = lockCentre.y + logoLift;
        logoMesh.visible = logoU.uFade.value > 0.001;
      }
      // the lab warms up as the bulb lights
      scene.environmentIntensity = lerp(0.55, 0.8, smooth(0.95, 1.8, tw));
      if (!settled && tw >= SETTLE_AT) {
        settled = true;
        opts.onSettle?.();
      }
    }

    // pour: stream grows down, level rises with ripples, stream thins and lifts away
    const grow = opening ? Math.pow(clamp01((t - T_POUR[0]) / 0.5), 1.7) : smooth(T_POUR[0], T_POUR[0] + 0.35, t); // falls
    const stop = smooth(T_POUR[1] - 0.3, T_POUR[1] + 0.2, t);
    const level = lerp(POUR_START_LEVEL, FULL, smooth(T_LEVEL[0], T_LEVEL[1], t) ** 0.85);
    const surfaceY = floorY + level;
    stream.visible = grow > 0.001 && stop < 0.999;
    if (stream.visible) {
      const streamTop = STREAM_TOP + logoLift;
      const fullLen = streamTop - surfaceY;
      const top = streamTop - fullLen * stop; // the tail lifts away as the pour stops
      stream.position.y = top;
      stream.scale.set(1 - stop * 0.6, Math.max(0.001, (top - surfaceY) * grow), 1 - stop * 0.6);
      for (let i = 0; i < streamPos.count; i++) {
        const y = streamBase[i * 3 + 1];
        streamPos.setX(i, streamBase[i * 3] + Math.sin(y * 9 + t * 20) * 0.012 * -y);
      }
      streamPos.needsUpdate = true;
    }
    const pourAmp = (1 - stop) * grow + 0.4 * smooth(T_POUR[1], T_POUR[1] + 0.2, t) * (1 - smooth(T_POUR[1] + 0.2, T_POUR[1] + 1.6, t));
    liquid.scale.y = Math.max(0.001, level);
    core.scale.y = Math.max(0.001, level * 0.9);
    surface.position.y = surfaceY;

    // stirring: spin-up after the pour, easing to a slow idle
    const spinUp = smooth(T_SPIN[0], T_SPIN[1], t);
    const settle = smooth(T_IDLE - 2, T_IDLE + 2, t);
    const omega = 13 * spinUp * (1 - 0.55 * settle);
    barAngle += omega * dt;
    barPivot.rotation.y = barAngle;
    ledMat.emissiveIntensity = 0.2 + 1.6 * spinUp;
    const depth = 0.24 * Math.pow(omega / 13, 2) * smooth(0.3, 1.0, level);
    writeSurface(depth, t, pourAmp, t - T_POUR[0]);

    // the poured colour enters at the stream and is wound through by the vortex
    if (stream.visible && grow > 0.5 && spawned < N) {
      const want = Math.min(N, Math.floor(N * smooth(T_POUR[0] + 0.3, T_POUR[1], t)));
      for (; spawned < want; spawned++) {
        const p = parts[spawned];
        p.r = Math.hypot(POUR_X, POUR_Z) + (Math.random() - 0.5) * 0.08;
        p.th = Math.atan2(POUR_Z, POUR_X) + (Math.random() - 0.5) * 0.3;
        p.y = surfaceY - 0.05 - Math.random() * 0.1;
        p.vy = -(0.6 + Math.random() * 0.9);
        p.vr = 0.04 + Math.random() * 0.12;
        p.born = t;
        p.life = 4 + Math.random() * 3.5;
      }
    }
    const rc = 0.35;
    for (let i = 0; i < N; i++) {
      const p = parts[i];
      const o = i * 3, c = i * 4;
      if (p.born < 0 || t - p.born > p.life) {
        ic[c + 3] = 0;
        isz[i] = 0;
        if (p.born < 0) ip[o + 1] = -99;
        continue;
      }
      const age = t - p.born;
      const w = omega * 0.85 * (p.r < rc ? 1 : (rc / p.r) ** 2) + 0.15;
      p.th += w * dt;
      p.r = Math.max(0.05, Math.min(R - 0.3, p.r + p.vr * dt * (spinUp > 0.2 ? 1 : 0.3) + (Math.random() - 0.5) * 0.01));
      p.vy *= 1 - 1.4 * dt;
      p.y = Math.max(floorY + 0.06, Math.min(surfaceY - 0.04, p.y + p.vy * dt + Math.sin(age * 3 + i) * 0.002));
      if (p.y <= floorY + 0.25) p.vr += 0.25 * dt;
      if (p.r > R - 0.35) p.vy = Math.max(p.vy, 0.12);
      ip[o] = Math.cos(p.th) * p.r;
      ip[o + 1] = p.y;
      ip[o + 2] = Math.sin(p.th) * p.r;
      const a = smooth(0, 0.15, age) * (1 - smooth(p.life * 0.35, p.life, age));
      ic[c] = INK.r;
      ic[c + 1] = INK.g;
      ic[c + 2] = INK.b;
      ic[c + 3] = (0.3 * a) / (1 + age * 0.5);
      isz[i] = Math.min(0.62, 0.16 + age * 0.24);
    }
    inkGeo.attributes.position.needsUpdate = true;
    inkGeo.attributes.aColor.needsUpdate = true;
    inkGeo.attributes.aSize.needsUpdate = true;

    // the liquid warms from pale to Sunglow as the colour mixes in
    const mix = smooth(T_POUR[0] + 0.4, T_SPIN[1] + 2.5, t);
    liquidMat.color.copy(PALE).lerp(SUN, mix).lerp(WARM, mix * 0.25);
    surfMat.color.copy(liquidMat.color);

    // caustics brighten with the liquid and drift slowly
    causticMat.opacity = 0.22 * smooth(0.2, 1.2, level);
    causticTex.offset.set(t * 0.012, t * 0.007);
    caustics.rotation.z = t * 0.02;

    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    // pointer parallax and the idle sway only once the camera has reached the workbench
    rig.rotation.y = (pointer.x * 0.22 + Math.sin(t * 0.25) * 0.04) * blend;
    rig.rotation.x = pointer.y * 0.04 * blend;
    reflection.rotation.y = rig.rotation.y;
    reflection.rotation.x = -rig.rotation.x;
    syncReflection();
    placeCamera(tw);
    renderer.render(scene, camera);
    if (first) {
      first = false;
      opts.onFirstFrame();
    }
  };

  // the clone shares geometry and materials; mirror the animated children's transforms
  const rigKids = rig.children, refKids = reflection.children;
  function syncReflection() {
    for (const rk of refKids) {
      const src = rigKids.find((c) => c.uuid === (rk.userData.src as string));
      if (!src) continue;
      rk.position.copy(src.position);
      rk.rotation.copy(src.rotation);
      rk.scale.copy(src.scale);
      rk.visible = src.visible;
    }
  }

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    step(now);
  };

  if (process.env.NODE_ENV !== "production") {
    const w = window as unknown as { __stageStep?: (secs: number) => number; __stageTime?: () => number };
    w.__stageTime = () => elapsed;
    w.__stageStep = (secs: number) => {
      const target = elapsed + secs;
      do step((last || performance.now()) + 16.7);
      while (elapsed < target);
      return elapsed;
    };
  }

  const ready: Promise<unknown> = renderer.compileAsync(scene, camera).catch(() => undefined);

  return {
    start() {
      if (running) return;
      running = true;
      last = 0;
      ready.then(() => {
        if (running) raf = requestAnimationFrame(frame);
      });
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    setPointer(x, y) {
      pointer.tx = x;
      pointer.ty = y;
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
      });
      logoTextures.forEach((x) => x.dispose());
      benchTex.dispose();
      causticTex.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
