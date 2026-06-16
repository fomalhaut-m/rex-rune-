/**
 * ============================================================
 * 3D 模型展示页 — 使用 Three.js 加载 OBJ 模型
 * ============================================================
 *
 * 【功能说明】
 * - 加载阿里云 OSS 上的 OBJ 模型文件
 * - 鼠标左键拖拽：旋转模型
 * - 鼠标滚轮：缩放模型
 * - 鼠标右键拖拽：平移视角
 *
 * 【新增模型方法】
 * 1. 把 OBJ 文件上传到 OSS（确保开启 CORS）
 * 2. 在下方 MODELS 数组中添加一行：
 *    {
 *      name: '模型显示名称',       // tab 按钮上显示的文字
 *      url: 'OSS 完整地址',         // .obj 文件的 URL
 *    }
 * 3. 保存后自动显示，tab 会自动更新
 *
 * 【OBJ 文件要求】
 * - 推荐导出时包含 .mtl 材质文件（同名文件，与 .obj 同目录）
 * - 如果模型显示为黑色，可能是缺少 mtl 文件或光照不足
 * - 推荐导出为 glTF/.glb 格式，加载更稳定
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

/**
 * ============================================================
 * 在这里添加/删除模型
 * ============================================================
 *
 * 配置项说明：
 *   name : tab 按钮上显示的名称
 *   url  : OBJ 文件在 OSS 上的完整 URL
 *
 * 示例：
 *   { name: '主机外壳', url: 'https://xxx.com/model.obj' },
 *   { name: '内部结构', url: 'https://xxx.com/internal.obj' },
 */
const MODELS = [
  {
    name: '主机外壳',
    url: 'https://vex-static.oss-cn-beijing.aliyuncs.com/iotbox/iotbox%20-%20%E4%B8%BB%E6%9C%BA%E5%A4%96%E5%A3%B3.obj',
  },
  {
    name: '部件',
    url: 'https://vex-static.oss-cn-beijing.aliyuncs.com/iotbox/iotbix-%E9%83%A8%E4%BB%B6.obj',
  },
];

/**
 * ============================================================
 * 组件入口
 * ============================================================
 */
export default function ModelViewerPage() {
  // canvas 引用，用于获取 DOM 尺寸和绑定 Three.js
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // sceneRef 保存 Three.js 场景的所有关键对象
  // 这样在 tab 切换时可以访问 camera、controls 等进行调整
  const sceneRef = useRef<{
    models: THREE.Object3D[];
    camera: THREE.PerspectiveCamera;
    controls: any;
    fitCamera: (idx: number) => void;
  } | null>(null);

  // 当前选中的模型索引（0 = 第一个，1 = 第二个...）
  const [active, setActive] = useState(0);

  // ============================================================
  // tab 切换逻辑：当 active 变化时，切换模型可见性 + 重新适配相机
  // ============================================================
  useEffect(() => {
    if (!sceneRef.current) return;

    // 遍历所有模型，只有当前选中的显示，其他隐藏
    sceneRef.current.models.forEach((m, i) => {
      m.visible = i === active;
    });

    // 重新计算相机位置，让新模型正好填充视口
    sceneRef.current.fitCamera(active);
  }, [active]);

  // ============================================================
  // Three.js 初始化（只在组件挂载时执行一次）
  // ============================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── 1. 创建场景 ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#2a2a2a'); // 深灰色背景，突出白色模型

    // ── 2. 创建相机 ──
    //   PerspectiveCamera(视野角度, 宽高比, 近裁切面, 远裁切面)
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight);
    camera.position.set(0, 20, 60); // 相机位置：x=0, y=20(稍上方), z=60(正前方)
    camera.lookAt(0, 0, 0);        // 相机朝向原点

    // ── 3. 创建渲染器 ──
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 适配高清屏
    renderer.shadowMap.enabled = true; // 开启阴影

    // ── 4. 添加光照 ──
    // 环境光：基础照明强度，让暗面不至于完全黑
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.8);
    scene.add(ambientLight);

    // 主方向光：从右上前方打过来，产生立体感
    const dirLight = new THREE.DirectionalLight('#ffffff', 1.2);
    dirLight.position.set(50, 100, 80);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // 补光：从左后方打过来，减少阴影面过暗
    const fillLight = new THREE.DirectionalLight('#ffffff', 0.4);
    fillLight.position.set(-50, 50, -80);
    scene.add(fillLight);

    // Load models
    const loader = new OBJLoader();
    const models: THREE.Object3D[] = [];
    let loadedCount = 0;

    MODELS.forEach(({ name, url }, idx) => {
      loader.load(
        url,
        (object) => {
          // ── 5.1 计算模型包围盒 ──
          // Box3 是一个 3D 边界框，能告诉我们模型的 宽/高/深
          const box = new THREE.Box3().setFromObject(object);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          // ── 5.2 自动缩放模型 ──
          // 让最大维度统一缩放到 80 单位，保证不同尺寸模型显示大小一致
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 80 / maxDim;

          // 先把模型中心移到原点，再缩放
          // 否则模型可能偏离画面中心
          object.position.sub(center.clone().multiplyScalar(scale));
          object.scale.setScalar(scale);

          // ── 5.3 设置材质 ──
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              child.material = new THREE.MeshStandardMaterial({
                color: idx === 0 ? '#f0f0f0' : '#d0d0d0', // 第一个白，第二个灰
                roughness: 0.4,   // 粗糙度，越小越光滑
                metalness: 0.1,   // 金属感
                side: THREE.DoubleSide, // 双面渲染，背面也可见
              });
            }
          });

          // ── 5.4 初始只显示第一个模型 ──
          object.visible = idx === 0;
          models.push(object);
          scene.add(object);
          loadedCount++;
        },
        undefined,
        (err) => {
          console.error(`模型加载失败 [${name}]:`, err);
        }
      );
    });

    // ── 6. 创建交互控制器 ──
    // OrbitControls 让相机围绕原点旋转，支持鼠标/触摸操作
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;     // 开启阻尼，旋转有惯性
    controls.dampingFactor = 0.05;    // 阻尼系数，越小惯性越久
    controls.minDistance = 5;          // 最小缩放距离
    controls.maxDistance = 200;        // 最大缩放距离

    // ── 7. 相机自动适配函数 ──
    // 根据模型尺寸计算合适的相机距离，让模型正好填充视口
    const fitCamera = (idx: number) => {
      const model = models[idx];
      if (!model) return;

      // 计算包围盒
      const box = new THREE.Box3().setFromObject(model);
      box.expandByScalar(1.2); // 四周留 20% 边距，避免贴边
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      // 用 FOV 公式精确计算相机距离
      // 推导：tan(fov/2) = (maxDim/2) / distance → distance = maxDim / (2 * tan(fov/2))
      const fovRad = (camera.fov * Math.PI) / 180;
      const distance = maxDim / (2 * Math.tan(fovRad / 2));

      // 设置相机位置（稍上方，从正面看）
      camera.position.set(0, size.y * 0.3, distance * 1.2);
      camera.lookAt(0, size.y * 0.1, 0);
      controls.target.set(0, size.y * 0.1, 0);
      controls.update();
    };

    // 初始适配（第一个模型加载完后就执行）
    fitCamera(active);

    // ── 8. 保存引用，供外部访问 ──
    sceneRef.current = { models, camera, controls, fitCamera };

    // ── 9. 窗口大小变化时重新计算 ──
    const handleResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // ── 10. 渲染循环 ──
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update(); // 更新阻尼
      renderer.render(scene, camera);
    };
    animate();

    // ── 11. 清理函数 ──
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []); // 空数组：仅在挂载/卸载时执行

  // ============================================================
  // 渲染 JSX
  // ============================================================
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '80px 20px 40px',
      gap: '24px',
    }}>
      {/* 标题 */}
      <h1 style={{
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 700,
        color: 'var(--color-text)',
      }}>
        IoT Box 模型
      </h1>

      {/* tab 切换按钮 */}
      <div style={{
        display: 'flex',
        gap: '4px',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        {MODELS.map((m, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              padding: '8px 24px',
              fontSize: '0.9rem',
              background: active === i ? 'var(--color-interactive)' : 'transparent',
              color: active === i ? 'var(--color-text-inverse)' : 'var(--color-text)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* 3D 画布 */}
      <div style={{
        width: '100%',
        maxWidth: '900px',
        aspectRatio: '16 / 9',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--color-border-light)',
      }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      {/* 操作提示 */}
      <p style={{
        fontSize: '0.85rem',
        color: 'var(--color-text-muted)',
      }}>
        拖拽旋转 · 滚轮缩放 · 右键平移
      </p>
    </div>
  );
}