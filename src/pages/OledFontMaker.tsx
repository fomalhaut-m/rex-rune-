import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  asciiToGlyphs,
  cnToGlyphsByBrowser,
  imageToGlyph,
  formatCArray,
  formatImageCArray,
  bytesToCanvas,
  rgb565ToCanvas,
  GlyphResult,
} from '../utils/fontBit';

/* ── 动画 ── */
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

/* ── 布局 ── */
const Page = styled.div`
  min-height: 100vh;
  color: var(--color-text);
`;

const Content = styled(motion.main)`
  width: 85%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 8px;
  box-sizing: border-box;
  @media (max-width: 768px) {
    width: 100%;
    padding: 0 12px;
  }
`;

const Hero = styled.section`
  text-align: center;
  padding: 24px 8px 32px;
`;

const Title = styled(motion.h1)`
  font-size: clamp(1.6rem, 5vw, 3rem);
  font-weight: 900;
  margin-bottom: 12px;
  line-height: 1.2;
  word-break: break-word;
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(0.92rem, 2.2vw, 1rem);
  color: var(--color-text-secondary);
  max-width: 720px;
  margin: 0 auto 24px;
  line-height: 1.7;
  padding: 0 4px;
`;

/* ── Tabs ── */
const Tabs = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--color-border);
  @media (max-width: 600px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    > button {
      flex: 0 0 auto;
    }
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 12px 20px;
  font-size: clamp(0.85rem, 2.2vw, 0.95rem);
  font-weight: 600;
  border: 1px solid var(--color-border);
  border-bottom: none;
  background: ${({ $active }) => ($active ? 'var(--color-interactive)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--color-text-inverse)' : 'var(--color-text)')};
  cursor: pointer;
  transition: all 0.2s;
  min-height: 44px;
  white-space: nowrap;
  &:hover {
    background: ${({ $active }) => ($active ? 'var(--color-interactive)' : 'var(--color-surface-hover, rgba(0,0,0,0.04))')};
  }
`;

/* ── 卡片 ── */
const Card = styled(motion.section)`
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  margin-bottom: 24px;
`;

const CardHeader = styled.div`
  padding: 32px 40px 0;
  @media (max-width: 768px) {
    padding: 20px 16px 0;
  }
`;

const CardTitle = styled.h2`
  font-size: clamp(1.1rem, 2.8vw, 1.3rem);
  font-weight: 800;
  margin-bottom: 6px;
  line-height: 1.3;
  word-break: break-word;
`;

const CardDesc = styled.p`
  font-size: clamp(0.82rem, 2vw, 0.88rem);
  color: var(--color-text-secondary);
  margin-bottom: 16px;
  line-height: 1.6;
  word-break: break-word;
`;

const CardBody = styled.div`
  padding: 0 40px 32px;
  @media (max-width: 768px) {
    padding: 0 16px 20px;
  }
`;

/* ── 表单 ── */
const FormRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  align-items: flex-end;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const FormItem = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  min-width: 0;
  flex: 1 1 160px;
  @media (max-width: 600px) {
    flex: 1 1 100%;
    width: 100%;
  }
`;

const TextInput = styled.input`
  padding: 8px 12px;
  font-size: 0.95rem;
  border: 1px solid var(--color-border);
  background: var(--color-page-bg);
  color: var(--color-text);
  min-width: 0;
  width: 100%;
  max-width: 100%;
  min-height: 40px;
  font-family: inherit;
  box-sizing: border-box;
  &:focus { outline: 2px solid var(--color-interactive); outline-offset: -2px; }
`;

const NumberInput = styled.input`
  padding: 8px 12px;
  font-size: 0.95rem;
  border: 1px solid var(--color-border);
  background: var(--color-page-bg);
  color: var(--color-text);
  width: 100%;
  max-width: 120px;
  min-height: 40px;
  font-family: inherit;
  box-sizing: border-box;
  &:focus { outline: 2px solid var(--color-interactive); outline-offset: -2px; }
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.88rem;
  color: var(--color-text);
  cursor: pointer;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  background: var(--color-page-bg);
  min-height: 40px;
  box-sizing: border-box;
`;

const Select = styled.select`
  padding: 8px 12px;
  font-size: 0.95rem;
  border: 1px solid var(--color-border);
  background: var(--color-page-bg);
  color: var(--color-text);
  font-family: inherit;
  width: 100%;
  min-height: 40px;
  max-width: 100%;
  box-sizing: border-box;
  &:focus { outline: 2px solid var(--color-interactive); outline-offset: -2px; }
`;

/* ── 预览 & 输出 ── */
const SplitGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const Pane = styled.div`
  border: 1px solid var(--color-border);
  background: var(--color-page-bg);
  padding: 16px;
  min-width: 0;
  overflow: hidden;
  @media (max-width: 600px) {
    padding: 12px;
  }
`;

/* 预览容器：限高 + 居中，内部 img/canvas 等比自适应 */
const PreviewBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: 320px;
  min-height: 80px;
  background: #fff;
  border: 1px dashed var(--color-border);
  padding: 8px;
  overflow: hidden;
  box-sizing: border-box;
  @media (max-width: 900px) {
    max-height: 50vh;
  }
  @media (max-width: 600px) {
    max-height: 40vh;
    min-height: 60px;
    padding: 4px;
  }
  > img,
  > canvas {
    display: block;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    image-rendering: pixelated;
  }
`;

const PaneTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--color-text);
`;

/* 结果元信息：尺寸、字节数、模式等 */
const ResultMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-top: 12px;
  font-size: 0.82rem;
  color: var(--color-text-secondary);
`;

const MetaTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: var(--color-page-bg);
  border: 1px solid var(--color-border);
  border-radius: 3px;
  font-size: 0.78rem;
`;

/* 通用输出 Pane：标题 + C 数组 + 操作 + 元信息 */
const OutputPane: React.FC<{
  title?: string;
  code: string;
  onCopy: () => void;
  extraActions?: React.ReactNode;
  meta?: React.ReactNode;
}> = ({ title = 'C 数组输出', code, onCopy, extraActions, meta }) => (
  <Pane>
    <PaneTitle>{title}</PaneTitle>
    {code ? (
      <>
        <CodeBoxWide>{code}</CodeBoxWide>
        <ActionRow>
          <Button onClick={onCopy}>复制代码</Button>
          {extraActions}
        </ActionRow>
        {meta && <ResultMeta>{meta}</ResultMeta>}
      </>
    ) : (
      <Hint>暂无结果</Hint>
    )}
  </Pane>
);

const PreviewArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
`;

const CodeBox = styled.pre`
  font-family: 'Source Code Pro', Menlo, Consolas, monospace;
  font-size: clamp(0.72rem, 1.8vw, 0.8rem);
  line-height: 1.6;
  margin: 0 auto;
  padding: 12px;
  background: #1e1e1e;
  color: #e6e6e6;
  border: 1px solid var(--color-border);
  overflow: auto;
  max-height: 360px;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  white-space: pre;
  border-radius: 4px;
  -webkit-overflow-scrolling: touch;
  @media (max-width: 600px) {
    padding: 8px;
    max-height: 280px;
  }
`;

const CodeBoxWide = styled(CodeBox)`
  max-width: 960px;
  @media (max-width: 1024px) {
    max-width: 100%;
  }
`;

const ActionRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
  @media (max-width: 600px) {
    > button {
      flex: 1 1 calc(50% - 4px);
    }
  }
`;

const Button = styled.button`
  padding: 10px 18px;
  font-size: 0.88rem;
  font-weight: 600;
  border: 1px solid var(--color-border);
  background: var(--color-interactive);
  color: var(--color-text-inverse);
  cursor: pointer;
  transition: opacity 0.2s;
  min-height: 40px;
  white-space: nowrap;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const GhostButton = styled(Button)`
  background: transparent;
  color: var(--color-text);
  &:hover { background: var(--color-interactive); color: var(--color-text-inverse); opacity: 1; }
`;

const FileInput = styled.input`
  font-size: 0.88rem;
  font-family: inherit;
  width: 100%;
  max-width: 100%;
  min-height: 40px;
  box-sizing: border-box;
`;

const Hint = styled.p`
  font-size: 0.82rem;
  color: var(--color-text-muted);
  margin-top: 8px;
  line-height: 1.5;
`;

const StatusBadge = styled.span<{ $tone: 'ok' | 'warn' | 'err' }>`
  display: inline-block;
  padding: 4px 10px;
  font-size: 0.78rem;
  font-weight: 600;
  border: 1px solid var(--color-border);
  background: ${({ $tone }) =>
    $tone === 'ok' ? 'rgba(16,185,129,0.15)' :
    $tone === 'warn' ? 'rgba(245,158,11,0.15)' :
    'rgba(239,68,68,0.15)'};
  color: ${({ $tone }) =>
    $tone === 'ok' ? '#065f46' :
    $tone === 'warn' ? '#92400e' :
    '#991b1b'};
`;

/* ── Tabs 数据 ── */
type TabKey = 'ascii' | 'cn' | 'image';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'ascii', label: 'ASCII 去字模' },
  { key: 'cn', label: '汉字取模' },
  { key: 'image', label: '图片取模' },
];

/* ── 共享预览组件 ── */
const GlyphPreview: React.FC<{ result: GlyphResult | null }> = ({ result }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || !result) return;
    ref.current.innerHTML = '';
    // 根据容器宽度反推合适的 scale（保证所有字符 canvas 总宽不超过容器）
    const containerW = ref.current.clientWidth || 320;
    const totalCellsW = result.bytes.length * result.width;
    const maxScale = Math.max(1, Math.floor((containerW - 8) / totalCellsW));
    const scale = Math.min(4, maxScale);
    result.bytes.forEach((bytes) => {
      const cv = bytesToCanvas(bytes, result.width, result.height, scale);
      cv.style.maxWidth = '100%';
      cv.style.height = 'auto';
      cv.style.imageRendering = 'pixelated';
      ref.current!.appendChild(cv);
    });
  }, [result]);
  if (!result) return <Hint>暂无结果</Hint>;
  return (
    <PreviewArea
      ref={ref}
      style={{
        padding: 4,
        border: '1px dashed var(--color-border)',
        background: '#fff',
        minHeight: 60,
        maxHeight: 240,
        overflow: 'auto',
      }}
    />
  );
};

/* ── ASCII Tab ── */
type AsciiSizeKey = '5x7' | '8x8';

const AsciiTab: React.FC = () => {
  const [text, setText] = useState('Hello Glyph');
  const [size, setSize] = useState<AsciiSizeKey>('5x7');
  // 自定义尺寸开关：开启后忽略 size，使用下面两个 input
  const [customSize, setCustomSize] = useState(false);
  const [width, setWidth] = useState(8);
  const [height, setHeight] = useState(16);
  const [negative, setNegative] = useState(false);

  const result = useMemo(
    () => asciiToGlyphs(text, {
      size,
      width: customSize ? width : undefined,
      height: customSize ? height : undefined,
      negative,
    }),
    [text, size, customSize, width, height, negative],
  );

  const code = useMemo(
    () => `const uint8_t font_${result.width}x${result.height}[][${Math.ceil(result.width / 8) * result.height}] = {\n${formatCArray(result.bytes)}\n};`,
    [result],
  );

  return (
    <Card variants={fadeInUp}>
      <CardHeader>
        <CardTitle>ASCII 字模</CardTitle>
        <CardDesc>
          内置 5×7、8×8 两套字库；大于 8×8 的尺寸可启用「更多尺寸」按比例放大，或切到「汉字取模」用浏览器字体。
        </CardDesc>
      </CardHeader>
      <CardBody>
        <FormRow>
          <FormItem>
            <span>输入文本</span>
            <TextInput value={text} onChange={(e) => setText(e.target.value)} placeholder="Hello" />
          </FormItem>
          <FormItem>
            <span>内置字库</span>
            <Select value={size} onChange={(e) => setSize(e.target.value as AsciiSizeKey)} disabled={customSize}>
              <option value="5x7">5 × 7</option>
              <option value="8x8">8 × 8</option>
            </Select>
          </FormItem>
          <FormItem>
            <span>取模方式</span>
            <CheckboxLabel>
              <input type="checkbox" checked={negative} onChange={(e) => setNegative(e.target.checked)} />
              阴码
            </CheckboxLabel>
          </FormItem>
          <FormItem>
            <span>自定义尺寸</span>
            <CheckboxLabel>
              <input type="checkbox" checked={customSize} onChange={(e) => setCustomSize(e.target.checked)} />
              更多尺寸
            </CheckboxLabel>
          </FormItem>
        </FormRow>
        {customSize && (
          <FormRow>
            <FormItem>
              <span>字宽 W</span>
              <NumberInput type="number" min={1} max={32} value={width} onChange={(e) => setWidth(+e.target.value)} />
            </FormItem>
            <FormItem>
              <span>字高 H</span>
              <NumberInput type="number" min={1} max={64} value={height} onChange={(e) => setHeight(+e.target.value)} />
            </FormItem>
            <Hint style={{ margin: 0 }}>
              把内置字库按最近邻缩放到 W×H；比例失调会变形，建议按比例放大（如 10×14、16×22）。
            </Hint>
          </FormRow>
        )}
        <SplitGrid>
          <Pane>
            <PaneTitle>预览（{result.width} × {result.height}）</PaneTitle>
            <GlyphPreview result={result} />
            <ResultMeta>
              <MetaTag>字符数 {result.bytes.length}</MetaTag>
              <MetaTag>单字符 {Math.ceil(result.width / 8) * result.height} 字节</MetaTag>
              <MetaTag>合计 {result.bytes.length * Math.ceil(result.width / 8) * result.height} 字节</MetaTag>
            </ResultMeta>
          </Pane>
          <OutputPane
            title="C 数组输出"
            code={code}
            onCopy={() => navigator.clipboard.writeText(code)}
          />
        </SplitGrid>
        <Hint>
          每字符字节数 = ⌈W / 8⌉ × H；扫描方向：左→右、上→下；字节内 bit7(MSB) 在左。
        </Hint>
      </CardBody>
    </Card>
  );
};

/* ── 汉字 Tab ── */
const FONT_PRESETS: { label: string; value: string }[] = [
  { label: '系统无衬线', value: 'sans-serif' },
  { label: '系统衬线', value: 'serif' },
  { label: '等宽', value: 'monospace' },
  { label: '苹方 / 微软雅黑', value: '"PingFang SC", "Microsoft YaHei", "微软雅黑", sans-serif' },
  { label: '思源黑体 / 苹方', value: '"Source Han Sans CN", "Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif' },
  { label: '思源宋体 / 宋体', value: '"Source Han Serif CN", "Noto Serif CJK SC", "SimSun", "宋体", serif' },
  { label: '楷体', value: '"KaiTi", "STKaiti", "楷体", serif' },
];

const CnTab: React.FC = () => {
  const [fontFamily, setFontFamily] = useState(FONT_PRESETS[4].value);
  const [fontWeight, setFontWeight] = useState<number | string>(400);
  const [text, setText] = useState('你好世界');
  const [cellSize, setCellSize] = useState(32);
  const [negative, setNegative] = useState(true);

  const result = useMemo<GlyphResult>(() => {
    return cnToGlyphsByBrowser(text, {
      fontFamily,
      fontWeight,
      width: cellSize,
      height: cellSize,
      negative,
    });
  }, [fontFamily, fontWeight, text, cellSize, negative]);

  const code = useMemo(() => {
    const bpRow = Math.ceil(result.width / 8) * result.height;
    return `// 字模尺寸 ${result.width}x${result.height}\nconst uint8_t cn_font[][${bpRow}] = {\n${formatCArray(result.bytes)}\n};`;
  }, [result]);

  return (
    <Card variants={fadeInUp}>
      <CardHeader>
        <CardTitle>汉字取模（浏览器字体）</CardTitle>
        <CardDesc>
          直接调用浏览器内置字体（Canvas2D fillText）渲染，无需上传 .ttf 文件。
          字形取决于用户系统/浏览器提供的字体；可在下方选择常见字体栈。
        </CardDesc>
      </CardHeader>
      <CardBody>
        <FormRow>
          <FormItem>
            <span>字体</span>
            <Select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
              {FONT_PRESETS.map((p) => (
                <option key={p.label} value={p.value}>{p.label}</option>
              ))}
            </Select>
          </FormItem>
          <FormItem>
            <span>自定义字体栈</span>
            <TextInput
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              placeholder='"PingFang SC", "Microsoft YaHei", sans-serif'
            />
          </FormItem>
          <FormItem>
            <span>字重</span>
            <Select value={String(fontWeight)} onChange={(e) => setFontWeight(isNaN(+e.target.value) ? e.target.value : +e.target.value)}>
              <option value="300">300 细体</option>
              <option value="400">400 常规</option>
              <option value="500">500 中等</option>
              <option value="600">600 半粗</option>
              <option value="700">700 粗体</option>
              <option value="bold">bold</option>
            </Select>
          </FormItem>
        </FormRow>

        <FormRow>
          <FormItem>
            <span>汉字字符串</span>
            <TextInput value={text} onChange={(e) => setText(e.target.value)} placeholder="你好世界" />
          </FormItem>
          <FormItem>
            <span>栅格尺寸（像素）</span>
            <NumberInput type="number" min={8} max={128} value={cellSize} onChange={(e) => setCellSize(+e.target.value)} />
          </FormItem>
          <FormItem>
            <span>取模方式</span>
            <CheckboxLabel>
              <input type="checkbox" checked={negative} onChange={(e) => setNegative(e.target.checked)} />
              阴码
            </CheckboxLabel>
          </FormItem>
        </FormRow>

        <SplitGrid>
          <Pane>
            <PaneTitle>预览（{result.width} × {result.height}）</PaneTitle>
            <GlyphPreview result={result} />
            <ResultMeta>
              <MetaTag>字符数 {result.bytes.length}</MetaTag>
              <MetaTag>单字符 {Math.ceil(result.width / 8) * result.height} 字节</MetaTag>
              <MetaTag>合计 {result.bytes.length * Math.ceil(result.width / 8) * result.height} 字节</MetaTag>
            </ResultMeta>
            <div
              style={{
                fontFamily,
                fontWeight: String(fontWeight),
                fontSize: `min(${cellSize}px, 12vw)`,
                lineHeight: 1.2,
                marginTop: 12,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '100%',
                padding: '8px 12px',
                border: '1px dashed var(--color-border)',
                background: 'var(--color-page-bg)',
                borderRadius: 4,
              }}
            >
              {text || '（空）'}
            </div>
          </Pane>
          <OutputPane
            title="C 数组输出"
            code={code}
            onCopy={() => navigator.clipboard.writeText(code)}
          />
        </SplitGrid>

        <Hint>
          浏览器实际渲染效果如上预览下方文本所示。若某个汉字渲染为空（全是白点），说明当前浏览器/系统缺少该字符字形——可尝试上方"自定义字体栈"切换字体。
        </Hint>
      </CardBody>
    </Card>
  );
};

/* ── 图片 Tab ── */
type ImgMode = 'mono' | 'rgb565';

/** 常见 OLED / LCD 屏幕尺寸预设（宽 × 高） */
const SIZE_PRESETS: { label: string; w: number; h: number }[] = [
  { label: '原图尺寸', w: 0, h: 0 },
  { label: '128 × 64  （SSD1306 0.96"）', w: 128, h: 64 },
  { label: '128 × 32  （SSD1306 0.91"）', w: 128, h: 32 },
  { label: '64 × 48', w: 64, h: 48 },
  { label: '64 × 32', w: 64, h: 32 },
  { label: '96 × 16', w: 96, h: 16 },
  { label: '240 × 135  （1.14" ST7789）', w: 240, h: 135 },
  { label: '320 × 240  （QVGA）', w: 320, h: 240 },
  { label: '160 × 80  （0.96" ST7735）', w: 160, h: 80 },
  { label: '自定义', w: -1, h: -1 },
];

const ImageTab: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [mode, setMode] = useState<ImgMode>('mono');
  const [threshold, setThreshold] = useState(128);
  const [dither, setDither] = useState(false);
  const [targetW, setTargetW] = useState(0);
  const [targetH, setTargetH] = useState(0);
  const [presetIdx, setPresetIdx] = useState(1); // 默认 128×64
  const [bytes, setBytes] = useState<number[]>([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [bpp, setBpp] = useState(1);
  const [status, setStatus] = useState<{ tone: 'ok' | 'warn' | 'err'; msg: string } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!previewRef.current || !bytes.length) return;
    previewRef.current.innerHTML = '';
    const cv = mode === 'mono'
      ? bytesToCanvas(bytes, width, height, 1)
      : rgb565ToCanvas(bytes, width, height, 1);
    cv.style.maxWidth = '100%';
    cv.style.maxHeight = '100%';
    cv.style.width = 'auto';
    cv.style.height = 'auto';
    cv.style.imageRendering = 'pixelated';
    previewRef.current.appendChild(cv);
  }, [bytes, width, height, mode]);

  const handlePresetChange = (idx: number) => {
    setPresetIdx(idx);
    const p = SIZE_PRESETS[idx];
    if (p.w < 0) return; // 自定义：保持当前值不变
    setTargetW(p.w);
    setTargetH(p.h);
  };

  const run = async () => {
    if (!file) return;
    setStatus({ tone: 'warn', msg: '处理中…' });
    try {
      const r = await imageToGlyph(file, {
        mode,
        threshold,
        targetWidth: targetW,
        targetHeight: targetH,
        dither,
      });
      setBytes(r.bytes);
      setWidth(r.width);
      setHeight(r.height);
      setBpp(r.bytesPerPixel);
      setStatus({
        tone: 'ok',
        msg: `完成：${r.width}×${r.height}，${r.bytes.length} 字节（${r.bytesPerPixel} B/px）`,
      });
    } catch (e) {
      setStatus({ tone: 'err', msg: `处理失败：${(e as Error).message}` });
    }
  };

  const code = useMemo(() => {
    if (!bytes.length) return '';
    return `// ${width}x${height} ${mode === 'mono' ? '单色' : 'RGB565'}\nconst uint8_t img_${width}x${height}[] = {\n${formatImageCArray(bytes, 16)}\n};`;
  }, [bytes, width, height, mode]);

  return (
    <Card variants={fadeInUp}>
      <CardHeader>
        <CardTitle>图片取模</CardTitle>
        <CardDesc>
          单色模式支持阈值 / Floyd-Steinberg 抖动；原色模式输出 RGB565 大端字节流。
        </CardDesc>
      </CardHeader>
      <CardBody>
        <FormRow>
          <FormItem>
            <span>图片文件</span>
            <FileInput type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
          </FormItem>
          <FormItem>
            <span>输出模式</span>
            <Select value={mode} onChange={(e) => setMode(e.target.value as ImgMode)}>
              <option value="mono">单色 mono</option>
              <option value="rgb565">原色 RGB565</option>
            </Select>
          </FormItem>
          <FormItem>
            <span>目标尺寸</span>
            <Select
              value={String(presetIdx)}
              onChange={(e) => handlePresetChange(+e.target.value)}
            >
              {SIZE_PRESETS.map((p, i) => (
                <option key={p.label} value={i}>{p.label}</option>
              ))}
            </Select>
          </FormItem>
          <FormItem>
            <span>宽 W（0=原图）</span>
            <NumberInput
              type="number"
              min={0}
              max={1024}
              value={targetW}
              onChange={(e) => { setTargetW(+e.target.value); setPresetIdx(SIZE_PRESETS.length - 1); }}
            />
          </FormItem>
          <FormItem>
            <span>高 H（0=原图）</span>
            <NumberInput
              type="number"
              min={0}
              max={1024}
              value={targetH}
              onChange={(e) => { setTargetH(+e.target.value); setPresetIdx(SIZE_PRESETS.length - 1); }}
            />
          </FormItem>
          {mode === 'mono' && (
            <>
              <FormItem>
                <span>阈值 0-255</span>
                <NumberInput type="number" min={0} max={255} value={threshold} onChange={(e) => setThreshold(+e.target.value)} />
              </FormItem>
              <FormItem>
                <span>抖动</span>
                <CheckboxLabel>
                  <input type="checkbox" checked={dither} onChange={(e) => setDither(e.target.checked)} />
                  Floyd-Steinberg
                </CheckboxLabel>
              </FormItem>
            </>
          )}
          <Button onClick={run} disabled={!file}>开始取模</Button>
        </FormRow>

        {status && (
          <Hint><StatusBadge $tone={status.tone}>{status.msg}</StatusBadge></Hint>
        )}

        <SplitGrid>
          <Pane>
            <PaneTitle>预览（{width} × {height}）</PaneTitle>
            <PreviewBox>
              {previewUrl
                ? <img src={previewUrl} alt="原图" />
                : <Hint>请先选择图片</Hint>}
            </PreviewBox>
            <ResultMeta>
              <MetaTag>尺寸 {width} × {height}</MetaTag>
              <MetaTag>每像素 {bpp} 字节</MetaTag>
              <MetaTag>合计 {bytes.length} 字节</MetaTag>
              <MetaTag>模式 {mode === 'mono' ? '单色' : 'RGB565'}</MetaTag>
            </ResultMeta>
            <Hint style={{ marginTop: 12, marginBottom: 0 }}>取模结果</Hint>
            <PreviewBox style={{ marginTop: 4 }}>
              {bytes.length > 0
                ? <div ref={previewRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }} />
                : <Hint>点击「开始取模」生成</Hint>}
            </PreviewBox>
          </Pane>
          <OutputPane
            title="C 数组输出"
            code={code}
            onCopy={() => navigator.clipboard.writeText(code)}
            extraActions={bytes.length > 0 ? (
              <GhostButton onClick={() => {
                const blob = new Blob([code], { type: 'text/plain' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `${width}x${height}_${mode}.h`;
                a.click();
                URL.revokeObjectURL(a.href);
              }}>下载 .h 文件</GhostButton>
            ) : undefined}
          />
        </SplitGrid>

        <Hint>
          单色模式支持阈值 / Floyd-Steinberg 抖动；原色模式输出 RGB565 大端字节流。
        </Hint>
      </CardBody>
    </Card>
  );
};

/* ── Page ── */
export default function OledFontMaker() {
  const [tab, setTab] = useState<TabKey>('ascii');

  return (
    <Page>
      <Content initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
        <Hero>
          <Title variants={fadeInUp}>Vex Glyph · OLED 取模工具</Title>
          <Subtitle variants={fadeInUp}>
            嵌入式点阵字模生成器：ASCII 去字模、汉字取模、图片取模（单色 / 原色）。
            全部计算在浏览器本地完成，结果可直接复制到 C / Arduino / STM32 工程。
          </Subtitle>
        </Hero>

        <Tabs>
          {TABS.map((t) => (
            <Tab key={t.key} $active={tab === t.key} onClick={() => setTab(t.key)}>
              {t.label}
            </Tab>
          ))}
        </Tabs>

        {tab === 'ascii' && <AsciiTab />}
        {tab === 'cn' && <CnTab />}
        {tab === 'image' && <ImageTab />}
      </Content>
    </Page>
  );
}