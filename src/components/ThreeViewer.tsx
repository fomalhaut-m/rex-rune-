/**
 * ============================================================
 * Three.js 3D 模型展示组件
 * ============================================================
 *
 * 【功能】
 * - 加载 OBJ 模型并居中展示
 * - 鼠标左键拖拽：旋转
 * - 滚轮：缩放
 * - 右键拖拽：平移
 * - 自动适配模型尺寸
 *
 * 【入参】
 *   url        : OBJ 文件 URL（支持多个，同 MODELS 格式）
 *   onReady?   : 模型加载完成回调 (count: number) => void
 *   background?: 背景色，默认 #2a2a2a
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

interface Model {
  name: string;
  url: string;
}

interface Props {
  models: Model[];
  activeIndex?: number;
  onReady?: (count: number) => void;
  background?: string;
}

export default function ThreeViewer({ models, activeIndex = 0, onReady, background = '#2a2a2a' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 加载完成的模型对象
  const objectsRef = useRef<THREE.Object3D[]>([]);
  // Three.js 核心对象
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<any>(null);

  // ============================================================
  // 初始化 Three.js 场景（仅执行一次）
  // ============================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── 1. 场景 ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(background);
    sceneRef.current = scene;

    // ── 2. 相机 ──
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight);
    camera.position.set(0, 20, 60);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // ── 3. 渲染器 ──
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // ── 4. 光照 ──
    scene.add(new THREE.AmbientLight('#ffffff', 0.8));

    const dirLight = new THREE.DirectionalLight('#ffffff', 1.2);
    dirLight.position.set(50, 100, 80);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight('#ffffff', 0.4);
    fillLight.position.set(-50, 50, -80);
    scene.add(fillLight);

    // ── 5. 加载模型 ──
    const loader = new OBJLoader();
    const objects: THREE.Object3D[] = [];
    let loadedCount = 0;

    models.forEach(({ name, url }, idx) => {
      loader.load(
        url,
        (object) => {
          // 计算包围盒并居中缩放
          const box = new THREE.Box3().setFromObject(object);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 80 / maxDim;

          object.position.sub(center.clone().multiplyScalar(scale));
          object.scale.setScalar(scale);

          // 材质：第一个白，第二个灰
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              child.material = new THREE.MeshStandardMaterial({
                color: idx === 0 ? '#f0f0f0' : '#d0d0d0',
                roughness: 0.4,
                metalness: 0.1,
                side: THREE.DoubleSide,
              });
            }
          });

          object.visible = idx === activeIndex;
          objects.push(object);
          scene.add(object);
          loadedCount++;

          if (loadedCount === models.length) {
            objectsRef.current = objects;
            onReady?.(loadedCount);
            fitCamera(objects, activeIndex, camera, scene, controlsRef.current);
          }
        },
        undefined,
        (err) => {
          console.error(`模型加载失败 [${name}]:`, err);
        }
      );
    });

    // ── 6. 控制器 ──
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 200;
    controlsRef.current = controls;

    // ── 7. 窗口缩放 ──
    const handleResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // ── 8. 渲染循环 ──
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // ============================================================
  // 切换模型可见性 + 重新适配相机
  // ============================================================
  useEffect(() => {
    fitCamera(objectsRef.current, activeIndex, cameraRef.current, sceneRef.current, controlsRef.current);
    objectsRef.current.forEach((obj, i) => {
      obj.visible = i === activeIndex;
    });
  }, [activeIndex]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}

/**
 * 根据模型包围盒计算相机位置，让模型正好填充视口
 */
function fitCamera(
  models: THREE.Object3D[],
  idx: number,
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  controls: any
) {
  const model = models[idx];
  if (!model || !camera || !scene || !controls) return;

  const box = new THREE.Box3().setFromObject(model);
  box.expandByScalar(1.2);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const fovRad = (camera.fov * Math.PI) / 180;
  const distance = maxDim / (2 * Math.tan(fovRad / 2));

  camera.position.set(0, size.y * 0.3, distance * 1.2);
  camera.lookAt(0, size.y * 0.1, 0);
  controls.target.set(0, size.y * 0.1, 0);
  controls.update();
}