import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { maturity, tree, relationsFor, nodeById, type TreeNode } from '../roadmap/model';

type View = { camera: THREE.Vector3; target: THREE.Vector3; reset: number; focus: number };
export default function RoadmapScene({ nodes, selected, depth, reset, focus, onSelect }: { nodes: TreeNode[]; selected: string; depth: number; reset: number; focus: number; onSelect: (id: string) => void }) {
 const host = useRef<HTMLDivElement>(null);
 const callback = useRef(onSelect); callback.current = onSelect;
 const view = useRef<View | null>(null);
 useEffect(() => {
  const element = host.current; if (!element) return;
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); element.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-label', 'Albero tridimensionale Roadmap'); renderer.domElement.setAttribute('role', 'img');
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 180);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.minDistance = 5; controls.maxDistance = 95; controls.enablePan = true;
  const css = getComputedStyle(element); const pixel = document.createElement('canvas'); pixel.width = pixel.height = 1; const ctx = pixel.getContext('2d');
  const color = (token: string) => { if (!ctx) return new THREE.Color(); ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = css.getPropertyValue(token).trim(); ctx.fillRect(0, 0, 1, 1); const rgb = ctx.getImageData(0, 0, 1, 1).data; return new THREE.Color(`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`); };
  const hitObjects: THREE.Object3D[] = []; const resources: Array<{ dispose: () => void }> = [];
  const labels: Array<{ short: THREE.Sprite; full: THREE.Sprite; group: boolean; selected: boolean }> = [];
  const rings: THREE.Mesh[] = [];
  const point = (n: TreeNode) => new THREE.Vector3(n.position[0], n.position[1], n.position[2] * depth);
  const line = (points: THREE.Vector3[], tone: THREE.Color, opacity = .3, dashed = false) => {
   const geo = new THREE.BufferGeometry().setFromPoints(points);
   const mat = dashed ? new THREE.LineDashedMaterial({ color: tone, dashSize: .12, gapSize: .1, opacity, transparent: true }) : new THREE.LineBasicMaterial({ color: tone, opacity, transparent: true });
   const path = new THREE.Line(geo, mat); path.computeLineDistances(); scene.add(path); resources.push(geo, mat);
  };
  const sprite = (text: string, tone: THREE.Color, pos: THREE.Vector3, width: number, id?: string, fontSize = 29) => {
   const canvas = document.createElement('canvas'); canvas.width = 768; canvas.height = 100; const c = canvas.getContext('2d');
   if (c) { c.textAlign = 'center'; c.fillStyle = tone.getStyle(); c.font = `500 ${fontSize}px monospace`; let fs = fontSize; while (c.measureText(text).width > 744 && fs > 16) { fs -= 1; c.font = `500 ${fs}px monospace`; } c.fillText(text, 384, 78); }
   const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace;
   const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }); const s = new THREE.Sprite(mat); s.scale.set(width, width * 100 / 768, 1); s.position.copy(pos); scene.add(s); resources.push(tex, mat); if (id) { s.userData['nodeId'] = id; hitObjects.push(s); } return s;
  };
  // Faint structural scaffold: taxonomy only, never a runtime dependency through the trunk.
  for (const y of [-4.1, 4.2]) {
   const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-9, y * 1.1, -.8), new THREE.Vector3(-4, y, -.8), new THREE.Vector3(0, y * .7, -.8), new THREE.Vector3(4, y, -.8), new THREE.Vector3(9, y * 1.1, -.8)]);
   line(curve.getPoints(80), color('--ops-network'), .2, true);
  }
  sprite('RAMI / CAPACITÀ', color('--ops-muted'), new THREE.Vector3(0, 12, -1), 5);
  sprite('TRONCO / SISTEMI CONDIVISI', color('--ops-muted'), new THREE.Vector3(0, 3.6, -1), 5);
  sprite('RADICI / REQUISITI', color('--ops-muted'), new THREE.Vector3(0, -10.6, -1), 5);
  const connected = new Set(relationsFor(selected).map(r => r.otherId));
  nodes.forEach(n => {
   const pos = point(n); const tone = color(maturity[n.status].token); const active = selected === n.id;
   const parent = nodes.find(p => p.id === n.parent);
   if (parent && n.kind === 'star') {
    const start = point(parent); const control = new THREE.Vector3(start.x, (start.y + pos.y) / 2, (start.z + pos.z) / 2);
    line(new THREE.QuadraticBezierCurve3(start, control, pos).getPoints(36), active || selected === parent.id ? tone : color('--ops-network'), active ? .85 : .4, n.status === 'placeholder');
   }
   const radius = n.kind === 'group' ? .21 : active ? .19 : .12;
   const geo = n.status === 'placeholder' ? new THREE.OctahedronGeometry(radius * 1.4) : new THREE.SphereGeometry(radius, 16, 12);
   const mat = new THREE.MeshBasicMaterial({ color: tone, wireframe: n.status === 'placeholder', transparent: true, opacity: active || connected.has(n.id) ? 1 : .85 });
   const mesh = new THREE.Mesh(geo, mat); mesh.position.copy(pos); mesh.userData['nodeId'] = n.id; scene.add(mesh); hitObjects.push(mesh); resources.push(geo, mat);
   const rg = new THREE.RingGeometry(active ? .3 : .21, active ? .33 : .22, 40); const rm = new THREE.MeshBasicMaterial({ color: tone, side: THREE.DoubleSide, transparent: true, opacity: active ? 1 : n.kind === 'group' ? .6 : .18 });
   const ring = new THREE.Mesh(rg, rm); ring.position.copy(pos); scene.add(ring); rings.push(ring); resources.push(rg, rm);
   const labelPos = pos.clone().add(new THREE.Vector3(0, -.42, 0));
   const short = sprite(n.code, active ? tone : color('--ops-text'), labelPos, 1.7, n.id, 85);
   const full = sprite(`${n.code} · ${n.title}`, tone, labelPos, 3.6, n.id); full.visible = false;
   labels.push({ short, full, group: n.kind === 'group', selected: active });
  });
  const seen = new Set<string>();
  for (const r of relationsFor(selected)) { const other = nodeById(r.otherId); const current = nodeById(selected); if (!other || !current || !nodes.some(n => n.id === other.id)) continue; const key = [selected, other.id].sort().join(':'); if (seen.has(key)) continue; seen.add(key); const start = point(current), end = point(other); const middle = start.clone().lerp(end, .5).add(new THREE.Vector3(0, 0, 1.2)); line(new THREE.QuadraticBezierCurve3(start, middle, end).getPoints(40), color('--rm-future'), .8, true); }
  const fit = () => {
   const aspect = element.clientWidth / Math.max(element.clientHeight, 1); const distance = Math.max(36, 11.8 / Math.tan(THREE.MathUtils.degToRad(19)), 10.8 / (Math.tan(THREE.MathUtils.degToRad(19)) * aspect));
   camera.position.set(1, .8, Math.min(distance, 90)); controls.target.set(0, .8, .6);
  };
  const saved = view.current;
  if (saved && saved.reset === reset) { camera.position.copy(saved.camera); controls.target.copy(saved.target); } else fit();
  if (saved && saved.focus !== focus) { const n = nodeById(selected); if (n) { const target = point(n); controls.target.copy(target); camera.position.copy(target).add(new THREE.Vector3(.8, .8, n.kind === 'group' ? 17 : 11)); } }
  let down = [0, 0]; const ray = new THREE.Raycaster();
  const pointerDown = (e: PointerEvent) => { down = [e.clientX, e.clientY]; };
  const pointerUp = (e: PointerEvent) => { if (Math.hypot(e.clientX - (down[0] ?? 0), e.clientY - (down[1] ?? 0)) > 6) return; const rect = renderer.domElement.getBoundingClientRect(); ray.setFromCamera(new THREE.Vector2((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1), camera); const id = ray.intersectObjects(hitObjects.filter(o => o.visible))[0]?.object.userData['nodeId']; if (typeof id === 'string') callback.current(id); };
  renderer.domElement.addEventListener('pointerdown', pointerDown); renderer.domElement.addEventListener('pointerup', pointerUp);
  let firstResize = true;
  const observer = new ResizeObserver(() => { const w = element.clientWidth, h = element.clientHeight; if (!w || !h) return; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); if (!firstResize) fit(); firstResize = false; }); observer.observe(element);
  let frame = 0; const draw = () => { controls.update(); const zoomed = camera.position.distanceTo(controls.target) < 25; labels.forEach(l => { l.short.visible = l.group || (!zoomed && !l.selected); l.full.visible = !l.group && (zoomed || l.selected); }); rings.forEach(r => r.quaternion.copy(camera.quaternion)); renderer.render(scene, camera); frame = requestAnimationFrame(draw); }; draw();
  return () => { view.current = { camera: camera.position.clone(), target: controls.target.clone(), reset, focus }; cancelAnimationFrame(frame); observer.disconnect(); renderer.domElement.removeEventListener('pointerdown', pointerDown); renderer.domElement.removeEventListener('pointerup', pointerUp); controls.dispose(); resources.forEach(r => r.dispose()); renderer.dispose(); renderer.domElement.remove(); };
 }, [nodes, selected, depth, reset, focus]);
 return <div ref={host} className="rm-scene" />;
}
