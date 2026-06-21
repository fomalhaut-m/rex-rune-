/**
 * ============================================================
 * 3D 模型展示页
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

import { useState } from 'react';
import ThreeViewer from '../components/ThreeViewer';

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

export default function ModelViewerPage() {
  // 当前选中的模型索引（0 = 第一个，1 = 第二个...）
  const [active, setActive] = useState(0);

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
        <ThreeViewer
          models={MODELS}
          activeIndex={active}
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