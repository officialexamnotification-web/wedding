import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { Model3DElement } from '../types/editor';

const GOLD = 0xd2a64b;
const GOLD_DARK = 0x79501a;
const IVORY = 0xfff4dd;
const RED = 0x8f2435;

function buildObject(item: Model3DElement) {
  const group = new THREE.Group();
  const gold = new THREE.MeshStandardMaterial({ color: item.primaryColor || GOLD, metalness: 0.86, roughness: 0.22 });
  const antiqueGold = new THREE.MeshStandardMaterial({ color: item.secondaryColor || GOLD_DARK, metalness: 0.78, roughness: 0.3 });
  const enamel = new THREE.MeshStandardMaterial({ color: RED, metalness: 0.22, roughness: 0.28, clearcoat: 0.85 });
  const gem = new THREE.MeshPhysicalMaterial({ color: 0x70c8ef, metalness: 0.04, roughness: 0.08, transmission: 0.35, thickness: 0.7, ior: 1.5, clearcoat: 1 });
  const flame = new THREE.MeshStandardMaterial({ color: 0xffa51f, emissive: 0xff5a08, emissiveIntensity: 1.4, roughness: 0.28 });
  const ivory = new THREE.MeshStandardMaterial({ color: IVORY, metalness: 0.12, roughness: 0.3, side: THREE.DoubleSide });
  const add = (geometry: THREE.BufferGeometry, material: THREE.Material, position?: [number, number, number], rotation?: [number, number, number]) => {
    const mesh = new THREE.Mesh(geometry, material);
    if (position) mesh.position.set(...position);
    if (rotation) mesh.rotation.set(...rotation);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };
  const lathe = (profile: [number, number][], material = gold, segments = 64) =>
    add(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), segments), material);
  const torus = (radius: number, tube: number, y: number, material = gold) =>
    add(new THREE.TorusGeometry(radius, tube, 12, 80), material, [0, y, 0], [Math.PI / 2, 0, 0]);

  const cakeCream = new THREE.MeshPhysicalMaterial({ color: 0xffe6d2, roughness: 0.48, sheen: 0.28, sheenColor: 0xf6b7a9 });
  const cakeIcing = new THREE.MeshPhysicalMaterial({ color: item.primaryColor || 0xe78aa7, roughness: 0.3, clearcoat: 0.38, clearcoatRoughness: 0.26 });
  const cakeGold = new THREE.MeshStandardMaterial({ color: item.secondaryColor || 0xe8b667, metalness: 0.72, roughness: 0.28 });
  const berry = new THREE.MeshPhysicalMaterial({ color: 0xb72b52, roughness: 0.23, clearcoat: 0.75 });

  switch (item.geometryType) {
    case 'kalash-3d': {
      lathe([[0,.12],[.38,.12],[.55,.22],[.66,.42],[.68,.7],[.58,.96],[.36,1.12],[.3,1.3],[.34,1.48],[.42,1.5],[.42,1.57],[.29,1.57],[.28,1.34],[.35,1.14],[.56,.94],[.61,.7],[.59,.43],[.48,.28],[0,.25]]);
      torus(.64,.035,.36,antiqueGold); torus(.34,.025,1.36,antiqueGold); torus(.42,.045,1.54);
      add(new THREE.SphereGeometry(.24,32,20), antiqueGold, [0,1.7,0]);
      for(let i=0;i<7;i++){ const a=i*Math.PI*2/7; add(new THREE.ConeGeometry(.1,.68,20), new THREE.MeshStandardMaterial({color:0x3f7d43,roughness:.42,side:THREE.DoubleSide}), [Math.cos(a)*.16,2.02,Math.sin(a)*.16], [Math.cos(a)*-.45,0,Math.sin(a)*.45]); }
      break;
    }
    case 'lotus-3d': {
      add(new THREE.SphereGeometry(.38,40,24), gold, [0,.28,0], [0,0,0]);
      for(let layer=0;layer<3;layer++) for(let i=0;i<10;i++){
        const a=(i/10)*Math.PI*2+(layer%2)*.31;
        const petal=add(new THREE.SphereGeometry(1,32,24), new THREE.MeshPhysicalMaterial({color:[0xe9a2b3,0xd66d91,0xf1c3c7][layer],roughness:.25,clearcoat:.7}), [Math.cos(a)*(.3+layer*.09),.12+layer*.12,Math.sin(a)*(.3+layer*.09)]);
        petal.scale.set(.19,.11,.43); petal.rotation.y=a; petal.rotation.x=-.28;
      }
      add(new THREE.SphereGeometry(.16,32,24), new THREE.MeshStandardMaterial({color:0xe9b33e,metalness:.75,roughness:.2}), [0,.35,0]);
      break;
    }
    case 'ring-torus': {
      add(new THREE.TorusGeometry(.58,.12,24,100), gold, [0,-.12,0], [Math.PI/2,0,0]);
      add(new THREE.TorusGeometry(.58,.025,12,100), antiqueGold, [0,-.18,0], [Math.PI/2,0,0]);
      add(new THREE.OctahedronGeometry(.34,1), gem, [0,.53,0]);
      for(let i=0;i<6;i++){ const a=i*Math.PI/3; add(new THREE.SphereGeometry(.055,16,12), ivory, [Math.cos(a)*.24,.5,Math.sin(a)*.24]); }
      break;
    }
    case 'royal-crown': {
      lathe([[0,.05],[.7,.05],[.75,.16],[.72,.3],[.62,.34],[.66,.43],[.52,.41],[.45,.4],[.4,.38],[0,.38]],gold);
      for(let i=0;i<9;i++){const a=i*Math.PI*2/9; const fin=add(new THREE.ConeGeometry(.14,.72,4),gold,[Math.cos(a)*.54,.63,Math.sin(a)*.54]); fin.rotation.z=-Math.cos(a)*.3; fin.rotation.x=Math.sin(a)*.3; add(new THREE.SphereGeometry(.09,18,12),gem,[Math.cos(a)*.56,1.02,Math.sin(a)*.56]);}
      torus(.67,.035,.27,antiqueGold); add(new THREE.SphereGeometry(.18,24,16),gem,[0,.5,0]);
      break;
    }
    case 'diya-3d': {
      lathe([[0,.1],[.24,.1],[.48,.17],[.7,.29],[.84,.46],[.78,.5],[.65,.36],[.42,.27],[0,.23]],gold);
      torus(.78,.035,.45,antiqueGold);
      const flameShape=new THREE.Shape(); flameShape.moveTo(0,0); flameShape.bezierCurveTo(-.3,.34,-.08,.73,0,.94); flameShape.bezierCurveTo(.1,.7,.34,.36,0,0);
      add(new THREE.ExtrudeGeometry(flameShape,{depth:.07,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.04,bevelThickness:.04}),flame,[0,.38,0]);
      break;
    }
    case 'mandap-pillar': {
      lathe([[0,.05],[.62,.05],[.62,.16],[.48,.23],[.4,.3],[.34,.34],[.34,1.26],[.46,1.32],[.54,1.43],[.68,1.5],[.68,1.62],[0,1.62]],gold);
      for(const y of [.27,.37,1.25,1.36]) torus(.39,y===.37||y===1.36?.035:.045,y,antiqueGold);
      for(let a=0;a<8;a++){const angle=a*Math.PI/4; add(new THREE.CylinderGeometry(.025,.025,.82,10),antiqueGold,[Math.cos(angle)*.345,.81,Math.sin(angle)*.345]);}
      break;
    }
    case 'diamond-gem': case 'heart-crystal': {
      add(new THREE.OctahedronGeometry(.78,0),gem,[0,.05,0]);
      add(new THREE.OctahedronGeometry(.8,0),new THREE.MeshBasicMaterial({color:0xffffff,wireframe:true,transparent:true,opacity:.18}),[0,.05,0]);
      break;
    }
    case 'sphere-orb': {
      add(new THREE.SphereGeometry(.68,64,48),new THREE.MeshPhysicalMaterial({color:item.primaryColor||0x7e2452,metalness:.48,roughness:.12,clearcoat:1,clearcoatRoughness:.08}),[0,.1,0]);
      add(new THREE.TorusGeometry(.69,.025,10,100),gold,[0,.1,0],[Math.PI/2,0,0]);
      break;
    }
    case 'cube-matrix': add(new THREE.BoxGeometry(1.25,1.25,1.25,4,4,4),gold,[0,.1,0]); break;
    case 'pyramid-prism': add(new THREE.ConeGeometry(.82,1.6,4,1),gold,[0,.1,0],[0,Math.PI/4,0]); break;
    case 'star-poly': {
      const s=new THREE.Shape(); for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?.38:.82,x=Math.cos(a)*r,y=Math.sin(a)*r;i?s.lineTo(x,y):s.moveTo(x,y);} s.closePath();
      add(new THREE.ExtrudeGeometry(s,{depth:.2,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.06,bevelThickness:.08}),gold,[0,-.4,0]); break;
    }
    case 'chandelier-3d': {
      add(new THREE.CylinderGeometry(.08,.14,1.4,24),gold,[0,.35,0]);
      for(const [r,y,t] of [[.26,.92,.09],[.65,.35,.09],[.45,-.18,.07]] as [number,number,number][]) torus(r,t,y);
      for(let i=0;i<8;i++){const a=i*Math.PI/4; const x=Math.cos(a),z=Math.sin(a); add(new THREE.CylinderGeometry(.025,.025,.65,10),gold,[x*.48,.62,z*.48],[z*.3,0,-x*.3]); add(new THREE.SphereGeometry(.085,16,12),new THREE.MeshPhysicalMaterial({color:0xffdf9c,emissive:0xffa728,emissiveIntensity:.3,roughness:.1}),[x*.68,.15,z*.68]);}
      break;
    }
    case 'drum-dhol': {
      add(new THREE.CylinderGeometry(.62,.62,1.25,48,1,true),enamel,[0,.05,0],[Math.PI/2,0,0]);
      for(const z of [-.64,.64]){ add(new THREE.CircleGeometry(.6,48),ivory,[0,.05,z],[z<0?Math.PI/2:-Math.PI/2,0,0]); torus(.61,.045,z,antiqueGold); }
      for(let i=0;i<12;i++){const a=i*Math.PI/6; add(new THREE.CylinderGeometry(.012,.012,1.24,6),gold,[Math.cos(a)*.62,.05,0],[0,0,a]);}
      break;
    }
    case 'helix-spiral': {
      for(let strand=0;strand<2;strand++){const pts=[];for(let i=0;i<=120;i++){const t=i/120*Math.PI*5.5+strand*Math.PI;pts.push(new THREE.Vector3(Math.cos(t)*(.35+.08*Math.sin(t)),(i/120)*1.5-.75,Math.sin(t)*(.35+.08*Math.sin(t))));} const curve=new THREE.CatmullRomCurve3(pts);add(new THREE.TubeGeometry(curve,180,.045,12,false),strand?ivory:gold);}
      break;
    }
    case 'celebration-cake': {
      const tier = (radius: number, bottom: number, height: number) => {
        const body = new THREE.Mesh(new THREE.LatheGeometry([
          new THREE.Vector2(0, 0), new THREE.Vector2(radius * 0.91, 0), new THREE.Vector2(radius * 0.98, height * 0.06),
          new THREE.Vector2(radius, height * 0.16), new THREE.Vector2(radius, height * 0.84),
          new THREE.Vector2(radius * 0.97, height * 0.95), new THREE.Vector2(radius * 0.88, height), new THREE.Vector2(0, height),
        ], 96), cakeCream);
        body.position.y = bottom; body.castShadow = true; body.receiveShadow = true; group.add(body);
        const icing = new THREE.Mesh(new THREE.LatheGeometry([
          new THREE.Vector2(0, 0), new THREE.Vector2(radius * 0.96, 0), new THREE.Vector2(radius * 1.025, height * 0.07),
          new THREE.Vector2(radius * 1.025, height * 0.84), new THREE.Vector2(radius * 1.015, height * 0.94),
          new THREE.Vector2(radius * 0.99, height * 0.99), new THREE.Vector2(0, height * 0.99),
        ], 96), cakeIcing);
        icing.position.y = bottom + height * 0.015; icing.castShadow = true; icing.receiveShadow = true; group.add(icing);
        const rim = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.99, radius * 0.035, 12, 96), cakeGold);
        rim.rotation.x = Math.PI / 2; rim.position.y = bottom + 0.035; group.add(rim);
        const dripCount = Math.max(14, Math.round(radius * 24));
        for (let i = 0; i < dripCount; i++) {
          const a = i * Math.PI * 2 / dripCount;
          const length = height * (0.09 + (i % 4) * 0.035);
          const drop = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.045, 16, 12), cakeIcing);
          drop.scale.set(0.82, Math.max(0.72, length / (radius * 0.09)), 0.82);
          drop.position.set(Math.cos(a) * radius * 1.016, bottom + height * 0.81 - length * 0.5, Math.sin(a) * radius * 1.016);
          drop.castShadow = true; group.add(drop);
        }
      };
      tier(0.91, -0.62, 0.64);
      tier(0.59, 0.02, 0.55);
      // Fine gold piping and pearl details around each tier.
      for (const [radius, y, count] of [[0.93, -0.06, 28], [0.61, 0.56, 22]] as [number, number, number][]) {
        for (let i = 0; i < count; i++) {
          const a = i * Math.PI * 2 / count;
          const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.027, 12, 10), i % 3 === 0 ? cakeGold : cakeCream);
          pearl.position.set(Math.cos(a) * radius, y, Math.sin(a) * radius); pearl.castShadow = true; group.add(pearl);
        }
      }
      // Hand-piped rosettes made from curved icing ribbons, with berry centers.
      const rosette = (x: number, z: number, y: number, size: number) => {
        const points: THREE.Vector3[] = [];
        for (let i = 0; i <= 64; i++) {
          const t = i / 64, a = t * Math.PI * 5.5;
          const r = size * (0.08 + t * 0.38);
          points.push(new THREE.Vector3(x + Math.cos(a) * r, y + t * size * 0.16, z + Math.sin(a) * r));
        }
        const ribbon = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 96, size * 0.105, 8, false), cakeIcing);
        ribbon.castShadow = true; group.add(ribbon);
        const center = new THREE.Mesh(new THREE.SphereGeometry(size * 0.14, 14, 10), berry);
        center.position.set(x, y + size * 0.12, z); center.castShadow = true; group.add(center);
      };
      for (let i = 0; i < 10; i++) {
        const a = i * Math.PI * 2 / 10;
        rosette(Math.cos(a) * 0.72, Math.sin(a) * 0.72, 0.57, 0.2);
      }
      rosette(0, 0, 0.57, 0.22);
      // A ring of small strawberries gives the top tier a recognizable celebration-cake finish.
      for (let i = 0; i < 8; i++) {
        const a = (i + 0.5) * Math.PI / 4;
        const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.075, 18, 14), berry);
        fruit.scale.set(0.82, 1.2, 0.82); fruit.position.set(Math.cos(a) * 0.39, 0.62, Math.sin(a) * 0.39); fruit.castShadow = true; group.add(fruit);
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.09, 5), new THREE.MeshStandardMaterial({ color: 0x4b854b, roughness: 0.68 }));
        leaf.position.set(Math.cos(a) * 0.39, 0.72, Math.sin(a) * 0.39); group.add(leaf);
      }
      break;
    }
    default: {
      lathe([[0,.05],[.58,.05],[.64,.16],[.55,.25],[.38,.31],[.34,.8],[.45,.9],[.52,1.05],[.4,1.18],[0,1.18]]);
      torus(.56,.035,.2,antiqueGold);
    }
  }
  const bounds = new THREE.Box3().setFromObject(group);
  const center = bounds.getCenter(new THREE.Vector3());
  group.position.sub(center);
  return group;
}

export function renderModel3DToDataUrl(item: Model3DElement, size = 640): string {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power', preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(size, size, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 1.1, 3.3);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xfff2d6, 0x26140d, 2.2));
  const key = new THREE.DirectionalLight(0xffe2af, 4.2); key.position.set(-3, 5, 5); key.castShadow = true; scene.add(key);
  const fill = new THREE.DirectionalLight(0xc5ddff, 2.1); fill.position.set(4, 1, 3); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffb547, 3.2); rim.position.set(1, 4, -4); scene.add(rim);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  room.dispose();
  const floor = new THREE.Mesh(new THREE.CircleGeometry(1.05, 64), new THREE.ShadowMaterial({ opacity: 0.2 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -1.16; floor.receiveShadow = true; scene.add(floor);
  const model = buildObject(item);
  model.rotation.set(THREE.MathUtils.degToRad(item.pitch ?? 0), THREE.MathUtils.degToRad(item.yaw ?? 0), THREE.MathUtils.degToRad(item.roll ?? 0));
  const bounds = new THREE.Box3().setFromObject(model);
  const modelSize = bounds.getSize(new THREE.Vector3());
  model.scale.setScalar(2.2 / Math.max(modelSize.x, modelSize.y, modelSize.z, 1));
  scene.add(model);
  renderer.render(scene, camera);
  const result = renderer.domElement.toDataURL('image/png');
  model.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();
      (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => material.dispose());
    }
  });
  scene.environment?.dispose();
  pmrem.dispose();
  renderer.dispose();
  return result;
}

export default function RealisticModel3D({ item }: { item: Model3DElement }) {
  const host = useRef<HTMLDivElement>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const scene = useRef<THREE.Scene | null>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const model = useRef<THREE.Group | null>(null);
  const pmrem = useRef<THREE.PMREMGenerator | null>(null);

  useEffect(() => {
    if (!host.current) return;
    let webgl: THREE.WebGLRenderer;
    try { webgl = new THREE.WebGLRenderer({ alpha:true, antialias:true, powerPreference:'low-power', preserveDrawingBuffer:true }); }
    catch { if(host.current) host.current.dataset.webgl='unavailable'; return; }
    renderer.current=webgl;
    webgl.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    webgl.outputColorSpace=THREE.SRGBColorSpace;
    webgl.toneMapping=THREE.ACESFilmicToneMapping;
    webgl.toneMappingExposure=1.15;
    webgl.shadowMap.enabled=true; webgl.shadowMap.type=THREE.PCFSoftShadowMap;
    host.current.appendChild(webgl.domElement);
    const world=new THREE.Scene(); scene.current=world;
    const cam=new THREE.PerspectiveCamera(30,1,.1,50); cam.position.set(0,1.1,3.3); cam.lookAt(0,0,0); camera.current=cam;
    const hemi=new THREE.HemisphereLight(0xfff2d6,0x26140d,2.2); world.add(hemi);
    const key=new THREE.DirectionalLight(0xffe2af,4.2); key.position.set(-3,5,5); key.castShadow=true; world.add(key);
    const fill=new THREE.DirectionalLight(0xc5ddff,2.1); fill.position.set(4,1,3); world.add(fill);
    const rim=new THREE.DirectionalLight(0xffb547,3.2); rim.position.set(1,4,-4); world.add(rim);
    const env= new THREE.PMREMGenerator(webgl); pmrem.current=env;
    const room=new RoomEnvironment(); world.environment=env.fromScene(room,.04).texture; room.dispose();
    const floor=new THREE.Mesh(new THREE.CircleGeometry(1.05,64),new THREE.ShadowMaterial({opacity:.18})); floor.rotation.x=-Math.PI/2;floor.position.y=-1.15;floor.receiveShadow=true;world.add(floor);
    const resize=()=>{ if(!host.current)return; const w=Math.max(1,host.current.clientWidth),h=Math.max(1,host.current.clientHeight); cam.aspect=w/h;cam.updateProjectionMatrix();webgl.setSize(w,h,false); if(model.current){const box=new THREE.Box3().setFromObject(model.current); const size=box.getSize(new THREE.Vector3()); const max=Math.max(size.x,size.y,size.z)||1; model.current.scale.setScalar(2.1/max);} webgl.render(world,cam); };
    const observer=new ResizeObserver(resize);observer.observe(host.current);resize();
    return ()=>{observer.disconnect(); if(model.current){model.current.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose());}});world.remove(model.current);model.current=null;} world.environment?.dispose();env.dispose();webgl.dispose();webgl.domElement.remove();renderer.current=null;scene.current=null;};
  },[]);

  useEffect(()=>{
    const world=scene.current,webgl=renderer.current,cam=camera.current;if(!world||!webgl||!cam)return;
    if(model.current){model.current.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose());}});world.remove(model.current);}
    const next=buildObject(item);next.rotation.set(THREE.MathUtils.degToRad(item.pitch??0),THREE.MathUtils.degToRad(item.yaw??0),THREE.MathUtils.degToRad(item.roll??0));world.add(next);model.current=next;
    const box=new THREE.Box3().setFromObject(next),size=box.getSize(new THREE.Vector3());const max=Math.max(size.x,size.y,size.z)||1;next.scale.setScalar(2.1/max);
    webgl.render(world,cam);
  },[item.geometryType,item.primaryColor,item.secondaryColor,item.pitch,item.yaw,item.roll]);

  return <div ref={host} className="h-full w-full pointer-events-none select-none" aria-label={`${item.modelName}, realistic 3D model`} />;
}
