import * as THREE from 'three';

/* =====================================================================
   Real-time 3D journey (procedural) — scroll progress 0..1 drives:
   camera along a spline · sky dawn→day→sunset→night · stars · aurora
   Mountains (fBm simplex) · glassy lake · lodge with warm windows · fireflies
   ===================================================================== */

// --- compact 2D simplex noise ---
const F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
const perm = new Uint8Array(512); { const p = new Uint8Array(256); for (let i = 0; i < 256; i++) p[i] = i; let s = 1337; for (let i = 255; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); [p[i], p[j]] = [p[j], p[i]]; } for (let i = 0; i < 512; i++) perm[i] = p[i & 255]; }
const grad = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
function simplex(x: number, y: number) {
  const s = (x + y) * F2, i = Math.floor(x + s), j = Math.floor(y + s), t = (i + j) * G2;
  const x0 = x - (i - t), y0 = y - (j - t); const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1;
  const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
  const ii = i & 255, jj = j & 255; let n = 0;
  const c = (gx: number, gy: number, xx: number, yy: number) => { let tt = .5 - xx * xx - yy * yy; if (tt < 0) return 0; tt *= tt; return tt * tt * (gx * xx + gy * yy); };
  let g = grad[perm[ii + perm[jj]] & 7]; n += c(g[0], g[1], x0, y0);
  g = grad[perm[ii + i1 + perm[jj + j1]] & 7]; n += c(g[0], g[1], x1, y1);
  g = grad[perm[ii + 1 + perm[jj + 1]] & 7]; n += c(g[0], g[1], x2, y2);
  return 70 * n;
}
function dotTexture() { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d')!; const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.35, 'rgba(255,255,255,.85)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.beginPath(); g.arc(32, 32, 32, 0, Math.PI * 2); g.fill(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
const fbm = (x: number, y: number) => { let a = 0, f = 1, amp = 1; for (let o = 0; o < 5; o++) { a += amp * simplex(x * f, y * f); f *= 2.03; amp *= .5; } return a; };

// Terrain height: valley along z with a lake basin near origin, ridges on the sides
export function heightAt(x: number, z: number) {
  const valley = Math.min(1, Math.abs(x) / 38);                       // 0 at centre line, 1 at sides
  const ridge = Math.pow(valley, 1.6) * 34;                            // tall mountains on sides
  const n = fbm(x * .018, z * .018) * 9 * (.35 + valley) + fbm(x * .06, z * .06) * 1.6;
  const lake = Math.exp(-((x * x) / 900 + ((z + 40) * (z + 40)) / 2600)) * 10; // basin
  const far = Math.max(0, (-z - 160) * .25);                          // mountains closing the valley far away
  return ridge + n - lake + far - 1.5;
}

interface Key { t: number; top: THREE.Color; bot: THREE.Color; sun: THREE.Color; fog: THREE.Color; light: number; night: number; }
const C = (h: string) => new THREE.Color(h);
const KEYS: Key[] = [
  { t: 0.00, top: C('#2b2453'), bot: C('#f6a77a'), sun: C('#ffb37a'), fog: C('#e7a08c'), light: .55, night: 0 },   // dawn
  { t: 0.30, top: C('#3d7fd1'), bot: C('#cfe6f5'), sun: C('#fff3dc'), fog: C('#bcd6e6'), light: 1.15, night: 0 },  // day
  { t: 0.58, top: C('#3a2a6b'), bot: C('#ff8a5b'), sun: C('#ff9a5c'), fog: C('#d98872'), light: .7, night: .1 },   // sunset
  { t: 0.78, top: C('#05081a'), bot: C('#1d2550'), sun: C('#7c8cff'), fog: C('#141b3a'), light: .18, night: 1 },   // night
  { t: 1.00, top: C('#03040d'), bot: C('#10183a'), sun: C('#7c8cff'), fog: C('#0c1230'), light: .15, night: 1 },
];

export class Journey {
  private r: THREE.WebGLRenderer; private scene = new THREE.Scene(); private cam: THREE.PerspectiveCamera;
  private sky!: THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial>; private stars!: THREE.Points; private aurora!: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  private sun = new THREE.DirectionalLight(0xffffff, 1); private hemi = new THREE.HemisphereLight(0xffffff, 0x334433, .6);
  private water!: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>; private flies!: THREE.Points; private windows: THREE.MeshStandardMaterial[] = [];
  private path: THREE.CatmullRomCurve3; private look: THREE.CatmullRomCurve3;
  private clock = new THREE.Clock(); private raf = 0; private target = 0; private prog = 0; private mouse = new THREE.Vector2(); private mt = new THREE.Vector2();
  private running = false; private disposed = false;
  constructor(private canvas: HTMLCanvasElement, private opts: { mobile: boolean; reduced: boolean }) {
    this.r = new THREE.WebGLRenderer({ canvas, antialias: !opts.mobile, powerPreference: 'high-performance' });
    this.r.setPixelRatio(Math.min(devicePixelRatio, opts.mobile ? 1.25 : 1.6));
    this.r.toneMapping = THREE.ACESFilmicToneMapping; this.r.outputColorSpace = THREE.SRGBColorSpace;
    this.cam = new THREE.PerspectiveCamera(55, 1, .5, 900);
    this.scene.fog = new THREE.Fog(0xbcd6e6, 60, 420);
    this.scene.add(this.sun, this.hemi); this.sun.position.set(-60, 80, -120);
    this.build();
    // camera rail: high aerial approach → glide over lake → lodge → rise for aurora → settle
    this.path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 60, 150), new THREE.Vector3(-8, 38, 80), new THREE.Vector3(6, 18, 20), new THREE.Vector3(-4, 7, -20),
      new THREE.Vector3(2, 6, -48), new THREE.Vector3(4, 7, -64), new THREE.Vector3(-2, 14, -82), new THREE.Vector3(-8, 24, -102), new THREE.Vector3(-12, 30, -116),
    ]);
    this.look = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 10, 0), new THREE.Vector3(0, 6, -40), new THREE.Vector3(0, 2, -50), new THREE.Vector3(14, 3, -76),
      new THREE.Vector3(28, 4, -92), new THREE.Vector3(30, 6, -95), new THREE.Vector3(10, 40, -260), new THREE.Vector3(0, 60, -320), new THREE.Vector3(0, 70, -340),
    ]);
    addEventListener('resize', this.resize); addEventListener('pointermove', this.pm, { passive: true });
    this.resize();
  }
  private build() {
    const seg = this.opts.mobile ? 150 : 260;
    // sky dome
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(700, 32, 16), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new THREE.Color() }, bot: { value: new THREE.Color() }, sunDir: { value: new THREE.Vector3(-.4, .3, -1).normalize() }, sunCol: { value: new THREE.Color() } },
      vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform vec3 top; uniform vec3 bot; uniform vec3 sunDir; uniform vec3 sunCol; varying vec3 vP;
        void main(){ float h = clamp(vP.y*1.6+.15,0.,1.); vec3 c = mix(bot, top, pow(h,.8));
          float s = max(dot(vP, sunDir),0.); c += sunCol*pow(s,90.)*1.4 + sunCol*pow(s,6.)*.25; gl_FragColor = vec4(c,1.); }`,
    }));
    this.scene.add(this.sky);
    // stars
    const sg = new THREE.BufferGeometry(); const n = 2200; const sp = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const th = Math.random() * Math.PI * 2, ph = Math.acos(Math.random() * .9 + .1), R = 600; sp.set([R * Math.sin(ph) * Math.cos(th), R * Math.cos(ph), R * Math.sin(ph) * Math.sin(th)], i * 3); }
    sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    this.stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 2.4, sizeAttenuation: false, map: dotTexture(), alphaTest: .02, transparent: true, opacity: 0, fog: false, depthWrite: false }));
    this.scene.add(this.stars);
    // aurora ribbon
    this.aurora = new THREE.Mesh(new THREE.PlaneGeometry(700, 160, 120, 1), new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { t: { value: 0 }, a: { value: 0 } },
      vertexShader: `uniform float t; varying vec2 vU; void main(){ vU=uv; vec3 p=position; p.z += sin(p.x*.012+t*.4)*60. + sin(p.x*.031-t*.25)*25.; p.y += sin(p.x*.02+t*.3)*10.; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.); }`,
      fragmentShader: `uniform float t; uniform float a; varying vec2 vU;
        void main(){ float band = smoothstep(0.,.25,vU.y)*smoothstep(1.,.35,vU.y);
          float stripes = .55+.45*sin(vU.x*120.+t*1.5+sin(vU.x*30.+t)*3.);
          vec3 c = mix(vec3(.2,1.,.6), vec3(.6,.35,1.), vU.y); c = mix(c, vec3(1.,.45,.7), smoothstep(.75,1.,vU.y)*.6);
          gl_FragColor = vec4(c, band*stripes*a*.85); }`,
    }));
    this.aurora.position.set(0, 150, -380); this.aurora.rotation.x = -.15; this.scene.add(this.aurora);
    // terrain
    const tg = new THREE.PlaneGeometry(320, 520, seg, Math.round(seg * 1.6)); tg.rotateX(-Math.PI / 2); tg.translate(0, 0, -100);
    const pos = tg.attributes['position'] as THREE.BufferAttribute; const cols = new Float32Array(pos.count * 3);
    const rock = C('#6f6a66'), snow = C('#f4f6fb'), forest = C('#2f4a33'), meadow = C('#6e8b4e'), sand = C('#bfae8a');
    const tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i), y = heightAt(x, z); pos.setY(i, y);
      const sn = THREE.MathUtils.smoothstep(y, 18, 26) * (.7 + .3 * simplex(x * .1, z * .1));
      if (y < .4) tmp.copy(sand); else if (y < 6) tmp.copy(meadow).lerp(forest, THREE.MathUtils.smoothstep(y, 1, 6)); else tmp.copy(forest).lerp(rock, THREE.MathUtils.smoothstep(y, 8, 16));
      tmp.lerp(snow, Math.max(0, Math.min(1, sn)));
      cols.set([tmp.r, tmp.g, tmp.b], i * 3);
    }
    tg.setAttribute('color', new THREE.BufferAttribute(cols, 3)); tg.computeVertexNormals();
    this.scene.add(new THREE.Mesh(tg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95, flatShading: true })));
    // pine trees (instanced cones) on lower slopes
    const tree = new THREE.ConeGeometry(.9, 3.6, 6); tree.translate(0, 1.8, 0);
    const count = this.opts.mobile ? 900 : 2200; const inst = new THREE.InstancedMesh(tree, new THREE.MeshStandardMaterial({ color: '#1f3a28', roughness: 1, flatShading: true }), count);
    const m = new THREE.Matrix4(); let placed = 0;
    for (let k = 0; k < count * 4 && placed < count; k++) {
      const x = (Math.random() - .5) * 220, z = -Math.random() * 300 + 40, y = heightAt(x, z);
      if (y < 1.2 || y > 15) continue; const s = .7 + Math.random() * .9;
      m.compose(new THREE.Vector3(x, y - .2, z), new THREE.Quaternion(), new THREE.Vector3(s, s * (1 + Math.random() * .4), s)); inst.setMatrixAt(placed++, m);
    }
    inst.count = placed; this.scene.add(inst);
    // water
    this.water = new THREE.Mesh(new THREE.PlaneGeometry(240, 260, 1, 1), new THREE.ShaderMaterial({
      transparent: true, fog: true,
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib['fog'], { t: { value: 0 }, deep: { value: C('#0e4d5c') }, shal: { value: C('#3fb8b0') }, sky: { value: C('#bcd6e6') }, glow: { value: 0 } }]),
      vertexShader: `#include <fog_pars_vertex>
        varying vec3 vW;
        void main(){ vec4 w = modelMatrix*vec4(position,1.); vW=w.xyz; vec4 mvPosition = viewMatrix*w; gl_Position=projectionMatrix*mvPosition;
        #include <fog_vertex>
        }`,
      fragmentShader: `#include <fog_pars_fragment>
        uniform float t; uniform vec3 deep; uniform vec3 shal; uniform vec3 sky; uniform float glow; varying vec3 vW;
        void main(){ vec3 V = normalize(cameraPosition - vW);
          float rip = sin(vW.x*.6+t*1.3)*.5+sin(vW.z*.9-t*1.1)*.5+sin((vW.x+vW.z)*1.7+t*2.)*.25;
          float fres = pow(1.-max(V.y,0.),3.);
          vec3 c = mix(mix(shal,deep,.55+rip*.06), sky, clamp(fres*.9+.1,0.,1.));
          c += vec3(1.,.7,.35)*glow*smoothstep(.6,1.,sin(vW.x*.8+t)*.5+.5)*.15;
          gl_FragColor = vec4(c,.94);
          #include <fog_fragment>
        }`,
    }));
    this.water.rotation.x = -Math.PI / 2; this.water.position.set(0, .15, -45); this.scene.add(this.water);
    // lodge on the east shore
    const lodge = new THREE.Group(); const wood = new THREE.MeshStandardMaterial({ color: '#5a3b26', roughness: .8, flatShading: true }); const roofM = new THREE.MeshStandardMaterial({ color: '#2b2522', roughness: .9, flatShading: true });
    const addCabin = (x: number, z: number, w: number, d: number, h: number, ry: number) => {
      const g = new THREE.Group(); const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wood); body.position.y = h / 2; g.add(body);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, d) * .78, h * .9, 4), roofM); roof.position.y = h + h * .45; roof.rotation.y = Math.PI / 4; g.add(roof);
      const wm = new THREE.MeshStandardMaterial({ color: '#ffcc80', emissive: '#ffae4a', emissiveIntensity: .2 }); this.windows.push(wm);
      for (let k = -1; k <= 1; k++) { const win = new THREE.Mesh(new THREE.PlaneGeometry(w * .18, h * .35), wm); win.position.set(k * w * .28, h * .5, d / 2 + .02); g.add(win); }
      g.position.set(x, heightAt(x, z), z); g.rotation.y = ry; lodge.add(g);
    };
    addCabin(30, -94, 10, 7, 5, -.9); addCabin(38, -84, 6, 5, 3.6, -1.1); addCabin(24, -104, 6, 5, 3.4, -.7); addCabin(42, -100, 5, 4, 3, -1);
    const dock = new THREE.Mesh(new THREE.BoxGeometry(2, .3, 16), wood); dock.position.set(22, .5, -86); dock.rotation.y = -1; lodge.add(dock);
    const lamp = new THREE.PointLight('#ffb35c', 0, 60, 1.6); lamp.position.set(30, 6, -88); lodge.add(lamp); (lodge as any).lamp = lamp;
    this.scene.add(lodge); (this as any).lodge = lodge;
    // fireflies / lantern sparks near lodge
    const fg = new THREE.BufferGeometry(); const fp = new Float32Array(300 * 3); for (let i = 0; i < 300; i++) fp.set([20 + Math.random() * 30, 1 + Math.random() * 8, -110 + Math.random() * 35], i * 3);
    fg.setAttribute('position', new THREE.BufferAttribute(fp, 3));
    this.flies = new THREE.Points(fg, new THREE.PointsMaterial({ color: '#ffd08a', size: .45, map: dotTexture(), alphaTest: .02, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.scene.add(this.flies);
  }
  private pm = (e: PointerEvent) => { this.mt.set(e.clientX / innerWidth - .5, e.clientY / innerHeight - .5); };
  resize = () => { const w = this.canvas.clientWidth || innerWidth, h = this.canvas.clientHeight || innerHeight; this.r.setSize(w, h, false); this.cam.aspect = w / h; this.cam.fov = w < h ? 70 : 55; this.cam.updateProjectionMatrix(); };
  setProgress(p: number) { this.target = Math.min(1, Math.max(0, p)); if (!this.running) this.frame(); }
  start() { if (this.running || this.disposed) return; this.running = true; const loop = () => { if (!this.running) return; this.frame(); this.raf = requestAnimationFrame(loop); }; loop(); }
  stop() { this.running = false; cancelAnimationFrame(this.raf); }
  private envAt(p: number) {
    let a = KEYS[0], b = KEYS[KEYS.length - 1];
    for (let i = 0; i < KEYS.length - 1; i++) if (p >= KEYS[i].t && p <= KEYS[i + 1].t) { a = KEYS[i]; b = KEYS[i + 1]; break; }
    const k = (p - a.t) / Math.max(1e-4, b.t - a.t), s = k * k * (3 - 2 * k);
    return { top: a.top.clone().lerp(b.top, s), bot: a.bot.clone().lerp(b.bot, s), sun: a.sun.clone().lerp(b.sun, s), fog: a.fog.clone().lerp(b.fog, s), light: THREE.MathUtils.lerp(a.light, b.light, s), night: THREE.MathUtils.lerp(a.night, b.night, s) };
  }
  private frame() {
    const t = this.clock.getElapsedTime();
    this.prog += (this.target - this.prog) * (this.opts.reduced ? 1 : .07);
    this.mouse.lerp(this.mt, .05);
    const p = this.prog; const e = this.envAt(p);
    // camera
    const pos = this.path.getPointAt(p), look = this.look.getPointAt(Math.min(1, p + .02));
    pos.x += this.mouse.x * 4; pos.y += -this.mouse.y * 2 + Math.sin(t * .6) * .25;
    this.cam.position.copy(pos); this.cam.lookAt(look);
    // environment
    const sm = this.sky.material.uniforms; sm['top'].value.copy(e.top); sm['bot'].value.copy(e.bot); sm['sunCol'].value.copy(e.sun);
    const sunY = THREE.MathUtils.lerp(.25, -.25, THREE.MathUtils.smoothstep(p, .2, .8)); sm['sunDir'].value.set(-.35, sunY + .1, -1).normalize();
    (this.scene.fog as THREE.Fog).color.copy(e.fog); this.r.setClearColor(e.fog);
    this.sun.color.copy(e.sun); this.sun.intensity = e.light * 2.2; this.sun.position.set(-60, 30 + sunY * 160, -120);
    this.hemi.intensity = .35 + e.light * .5; this.hemi.color.copy(e.top).lerp(new THREE.Color('#ffffff'), .5);
    (this.stars.material as THREE.PointsMaterial).opacity = e.night; this.stars.rotation.y = t * .004;
    this.aurora.material.uniforms['t'].value = t; this.aurora.material.uniforms['a'].value = THREE.MathUtils.smoothstep(p, .74, .9);
    const wu = this.water.material.uniforms; wu['t'].value = t; wu['sky'].value.copy(e.bot).lerp(e.top, .35); wu['glow'].value = e.night;
    const warm = THREE.MathUtils.smoothstep(p, .5, .7); this.windows.forEach(w => w.emissiveIntensity = .2 + warm * 2.6);
    ((this as any).lodge.lamp as THREE.PointLight).intensity = warm * 45;
    const fm = this.flies.material as THREE.PointsMaterial; fm.opacity = warm * (.6 + .4 * Math.sin(t * 3)); this.flies.position.y = Math.sin(t * .8) * .4;
    this.r.render(this.scene, this.cam);
  }
  dispose() { this.disposed = true; this.stop(); removeEventListener('resize', this.resize); removeEventListener('pointermove', this.pm); this.r.dispose(); this.scene.traverse(o => { const m = o as THREE.Mesh; m.geometry?.dispose?.(); const mat = m.material as THREE.Material | THREE.Material[]; Array.isArray(mat) ? mat.forEach(x => x.dispose()) : mat?.dispose?.(); }); }
}

/* =====================================================================
   Frame-sequence scrubber (Apple-style) for the user's rendered videos.
   Looks for /frames/manifest.json:
   { "scenes": [ { "path": "frames/s1/", "count": 240, "ext": "webp", "pad": 4 }, ... ] }
   ===================================================================== */
export class FrameScrubber {
  private frames: (HTMLImageElement | null)[] = []; private ctx: CanvasRenderingContext2D; private last = -1; total = 0;
  constructor(private canvas: HTMLCanvasElement, private list: string[]) {
    this.ctx = canvas.getContext('2d')!; this.total = list.length; this.frames = new Array(list.length).fill(null);
    addEventListener('resize', this.resize); this.resize();
    // progressive preload: keyframes first, then fill in
    const order: number[] = []; for (let step = 16; step >= 1; step = step >> 1) for (let i = 0; i < list.length; i += step) if (!order.includes(i)) order.push(i);
    let k = 0; const next = () => { if (k >= order.length) return; const i = order[k++]; const im = new Image(); im.decoding = 'async'; im.onload = () => { this.frames[i] = im; if (this.last < 0) this.draw(0); next(); }; im.onerror = next; im.src = list[i]; };
    for (let c = 0; c < 6; c++) next();
  }
  static async load(): Promise<string[] | null> {
    try {
      const r = await fetch('frames/manifest.json', { cache: 'no-cache' }); if (!r.ok) return null; const m = await r.json();
      const out: string[] = []; for (const s of m.scenes || []) for (let i = 1; i <= s.count; i++) out.push(`${s.path}${String(i).padStart(s.pad || 4, '0')}.${s.ext || 'webp'}`);
      return out.length ? out : null;
    } catch { return null; }
  }
  resize = () => { const d = Math.min(devicePixelRatio, 2); this.canvas.width = this.canvas.clientWidth * d; this.canvas.height = this.canvas.clientHeight * d; this.last = -1; };
  setProgress(p: number) { this.draw(Math.round(Math.min(1, Math.max(0, p)) * (this.total - 1))); }
  private draw(i: number) {
    let j = i; while (j > 0 && !this.frames[j]) j--; const im = this.frames[j]; if (!im || j === this.last) return; this.last = j;
    const cw = this.canvas.width, ch = this.canvas.height, s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
    const w = im.naturalWidth * s, h = im.naturalHeight * s; this.ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);
  }
  dispose() { removeEventListener('resize', this.resize); }
}
