import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

/* ── Animation Variants ── */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Layout ── */
const Page = styled.div`
  min-height: 100vh;
  color: var(--color-text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const Content = styled(motion.main)`
  width: 85%;
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

/* ── Hero ── */
const HeroSection = styled.section`
  text-align: center;
  padding: 24px 0 48px;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 900;
  color: var(--color-text);
  margin-bottom: 16px;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  max-width: 640px;
  margin: 0 auto 32px;
  line-height: 1.7;
`;

const HeroTagRow = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
`;

const HeroTag = styled.span<{ $color: string }>`
  padding: 6px 16px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  background: ${({ $color }) => $color};
`;

/* ── Card ── */
const BorderedCard = styled(motion.section)`
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  margin-bottom: 24px;
`;

const CardHeader = styled.div`
  padding: 40px 48px 0;
  @media (max-width: 768px) {
    padding: 24px 20px 0;
  }
`;

const CardTitle = styled.h2`
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 8px;
`;

const CardSubtitle = styled.p`
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
`;

const CardBody = styled.div`
  padding: 0 48px 40px;
  @media (max-width: 768px) {
    padding: 0 20px 24px;
  }
`;

/* ── Positioning Table ── */
const PosTable = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 1px;
  border: 1px solid var(--color-border);
  background: var(--color-border);
`;

const PosLabel = styled.div`
  padding: 12px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
  background: var(--color-surface);
`;

const PosValue = styled.div`
  padding: 12px 16px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  background: var(--color-surface);
  line-height: 1.6;
`;

/* ── Workflow ── */
const WorkflowRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const WorkflowStep = styled.div<{ $accent: string }>`
  flex: 1;
  min-width: 180px;
  padding: 24px 20px;
  text-align: center;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  position: relative;
  &::after {
    content: '';
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    border-right: 2px solid var(--color-border);
    border-top: 2px solid var(--color-border);
    transform: translateY(-50%) rotate(45deg);
    @media (max-width: 768px) {
      display: none;
    }
  }
  &:last-child::after { display: none; }
`;

const StepNum = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  background: ${({ $color }) => $color};
  margin-bottom: 12px;
`;

const StepTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
`;

const StepDesc = styled.p`
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
`;

/* ── Feature Grid ── */
const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
`;

const FeatureCard = styled.div<{ $accent: string }>`
  padding: 24px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-top: 3px solid ${({ $accent }) => $accent};
`;

const FeatureTitle = styled.h4`
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 12px;
`;

const FeatureList = styled.ul`
  margin: 0;
  padding: 0 0 0 18px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  line-height: 1.8;
`;

/* ── Screenshot ── */
const ScreenshotTabs = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const ScreenshotTab = styled.button<{ $active: boolean }>`
  padding: 8px 20px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid var(--color-border);
  background: ${({ $active }) => ($active ? 'var(--color-interactive)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--color-text-inverse)' : 'var(--color-text)')};
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: ${({ $active }) => ($active ? 'var(--color-interactive)' : 'var(--color-surface-hover)')};
  }
`;

const ScreenshotImg = styled(motion.img)`
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 4px;
`;

const ScreenshotLabel = styled.p`
  text-align: center;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-top: 8px;
`;

/* ── Spec Table ── */
const SpecTable = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 1px;
  border: 1px solid var(--color-border);
  background: var(--color-border);
`;

const SpecLabel = styled.div`
  padding: 10px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
  background: var(--color-surface);
`;

const SpecValue = styled.div`
  padding: 10px 16px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  background: var(--color-surface);
`;

/* ── Section Block ── */
const SectionBlock = styled.div`
  margin-bottom: 32px;
  &:last-child { margin-bottom: 0; }
`;

const SectionLabel = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 12px;
`;

/* ── Screenshot Data ── */
const screenshots = [
  { key: 'home', label: '首页总览', src: '/images/msa/首页.png' },
  { key: 'recognition', label: '图片识别', src: '/images/msa/图片识别.png' },
  { key: 'qc1', label: '质量检查', src: '/images/msa/质检1.png' },
  { key: 'qc2', label: '截面列表', src: '/images/msa/质检2.png' },
  { key: 'detail', label: '质检详情', src: '/images/msa/质检详情.png' },
];

/* ── Page ── */
export default function ProductMSA() {
  const [activeScreenshot, setActiveScreenshot] = useState('home');

  return (
    <Page>
      <Content initial="hidden" animate="visible" variants={stagger}>
        {/* ===== Hero ===== */}
        <HeroSection>
          <HeroTitle variants={fadeInUp}>
            Vex MSA
          </HeroTitle>
          <HeroSubtitle variants={fadeInUp}>
            面向材料质检实验室的一体化工作台，将大图分块、截面提取、智能质检、人工复核、数据沉淀整合为单桌面程序。
          </HeroSubtitle>
          <HeroTagRow variants={fadeInUp}>
            <HeroTag $color="var(--color-primary-bg, #EBF0FF)">Windows 桌面</HeroTag>
            <HeroTag $color="var(--color-success-bg, #ECFDF5)">离线运行</HeroTag>
            <HeroTag $color="var(--color-warning-bg, #FFFBEB)">智能质检</HeroTag>
            <HeroTag $color="var(--color-info-bg, #EFF6FF)">本地数据</HeroTag>
          </HeroTagRow>
        </HeroSection>

        {/* ===== 产品定位 ===== */}
        <BorderedCard variants={fadeInUp}>
          <CardHeader>
            <CardTitle>产品定位</CardTitle>
            <CardSubtitle>
              工业检测现场及材料实验室专用，覆盖从原材料扫描到质检报告的全流程。
            </CardSubtitle>
          </CardHeader>
          <CardBody>
            <PosTable>
              <PosLabel>产品形态</PosLabel>
              <PosValue>Windows 桌面 GUI 程序，单 EXE 安装包，数据本地化</PosValue>
              <PosLabel>适用场景</PosLabel>
              <PosValue>金属 / 复合材料截面质量抽检、缺陷分析、批量质检报告</PosValue>
              <PosLabel>目标用户</PosLabel>
              <PosValue>质检工程师、工艺工程师、产线主管</PosValue>
              <PosLabel>数据存储</PosLabel>
              <PosValue>SQLite 本地数据库，配置文件、原始图、缩略图均在安装目录</PosValue>
              <PosLabel>运行方式</PosLabel>
              <PosValue>完全离线运行，不需要联网授权</PosValue>
            </PosTable>
          </CardBody>
        </BorderedCard>

        {/* ===== 核心流程 ===== */}
        <BorderedCard variants={fadeInUp}>
          <CardHeader>
            <CardTitle>核心工作流</CardTitle>
            <CardSubtitle>从扫描仪输出到质检报告的一站式闭环流程。</CardSubtitle>
          </CardHeader>
          <CardBody>
            <WorkflowRow>
              <WorkflowStep $accent="#2563EB">
                <StepNum $color="#2563EB">1</StepNum>
                <StepTitle>图片录入</StepTitle>
                <StepDesc>导入扫描大图，自动计算 MD5 去重，支持单张或批量导入</StepDesc>
              </WorkflowStep>
              <WorkflowStep $accent="#3B82F6">
                <StepNum $color="#3B82F6">2</StepNum>
                <StepTitle>智能切分</StepTitle>
                <StepDesc>自动检测切分大图为独立截面，支持 grid / block / smart 多种策略</StepDesc>
              </WorkflowStep>
              <WorkflowStep $accent="#F59E0B">
                <StepNum $color="#F59E0B">3</StepNum>
                <StepTitle>智能质检</StepTitle>
                <StepDesc>6 项可配置策略：面积、直径、圆形度、裂缝、边缘平滑度、颜色范围</StepDesc>
              </WorkflowStep>
              <WorkflowStep $accent="#10B981">
                <StepNum $color="#10B981">4</StepNum>
                <StepTitle>人工复核</StepTitle>
                <StepDesc>边界值自动标记待复核，质检员二次确认合格 / 不合格 / 重置</StepDesc>
              </WorkflowStep>
              <WorkflowStep $accent="#EF4444">
                <StepNum $color="#EF4444">5</StepNum>
                <StepTitle>数据沉淀</StepTitle>
                <StepDesc>质检结果入库，支持按批次、状态、日期筛选和导出</StepDesc>
              </WorkflowStep>
            </WorkflowRow>
          </CardBody>
        </BorderedCard>

        {/* ===== 核心功能 ===== */}
        <BorderedCard variants={fadeInUp}>
          <CardHeader>
            <CardTitle>核心功能</CardTitle>
            <CardSubtitle>
              覆盖总览、录入、质检、设置、关于五个功能页面，配合侧边栏与操作员管理。
            </CardSubtitle>
          </CardHeader>
          <CardBody>
            <FeatureGrid>
              <FeatureCard $accent="#2563EB">
                <FeatureTitle>总览 Dashboard</FeatureTitle>
                <FeatureList>
                  <li>5 个核心指标卡：总数、合格、待检、待复核、不合格</li>
                  <li>实时统计当前批次状态</li>
                  <li>快捷入口：质检录入 / 质量检查 / 参数设置</li>
                </FeatureList>
              </FeatureCard>
              <FeatureCard $accent="#10B981">
                <FeatureTitle>质检录入 Process</FeatureTitle>
                <FeatureList>
                  <li>支持单张 / 多选图片导入</li>
                  <li>自动生成批次号 BYYYYMMDD_HHMMSS</li>
                  <li>自动分块 + 检测，生成待质检截面</li>
                  <li>实时操作日志滚动输出</li>
                </FeatureList>
              </FeatureCard>
              <FeatureCard $accent="#F59E0B">
                <FeatureTitle>质量检查 Quality</FeatureTitle>
                <FeatureList>
                  <li>多维度筛选：状态、ID、批次、日期</li>
                  <li>6 项可独立启用的智能质检策略</li>
                  <li>勾选批量检测，支持断电恢复</li>
                  <li>详情弹窗：人工复核、备注、状态重置</li>
                </FeatureList>
              </FeatureCard>
              <FeatureCard $accent="#3B82F6">
                <FeatureTitle>系统设置 Settings</FeatureTitle>
                <FeatureList>
                  <li>11 组可调参数，即时生效</li>
                  <li>截面检测 / 缺陷检测 / 图像切分 / 颜色检查</li>
                  <li>策略开关与阈值调优</li>
                </FeatureList>
              </FeatureCard>
            </FeatureGrid>
          </CardBody>
        </BorderedCard>

        {/* ===== 质检策略 ===== */}
        <BorderedCard variants={fadeInUp}>
          <CardHeader>
            <CardTitle>智能质检策略</CardTitle>
            <CardSubtitle>6 项可独立启用的责任链策略，按需组合。</CardSubtitle>
          </CardHeader>
          <CardBody>
            <SectionBlock>
              <PosTable>
                <PosLabel>面积检查</PosLabel>
                <PosValue>截面面积是否在合理区间内</PosValue>
                <PosLabel>直径检查</PosLabel>
                <PosValue>等效直径是否达到标准阈值</PosValue>
                <PosLabel>圆形度检查</PosLabel>
                <PosValue>截面形状偏离圆的程度（可禁用处理多边形截面）</PosValue>
                <PosLabel>裂缝检测</PosLabel>
                <PosValue>基于黑帽+形态学的裂纹自动识别</PosValue>
                <PosLabel>边缘平滑度</PosLabel>
                <PosValue>截面边缘锯齿/毛刺程度评估</PosValue>
                <PosLabel>颜色范围</PosLabel>
                <PosValue>CIE Lab ΔE 颜色偏差比对</PosValue>
              </PosTable>
            </SectionBlock>
          </CardBody>
        </BorderedCard>

        {/* ===== 界面截图 ===== */}
        <BorderedCard variants={fadeInUp}>
          <CardHeader>
            <CardTitle>界面预览</CardTitle>
            <CardSubtitle>桌面端操作界面截图，点击切换查看各功能页面。</CardSubtitle>
          </CardHeader>
          <CardBody>
            <ScreenshotTabs>
              {screenshots.map((s) => (
                <ScreenshotTab
                  key={s.key}
                  $active={activeScreenshot === s.key}
                  onClick={() => setActiveScreenshot(s.key)}
                >
                  {s.label}
                </ScreenshotTab>
              ))}
            </ScreenshotTabs>
            <ScreenshotImg
              key={activeScreenshot}
              src={screenshots.find((s) => s.key === activeScreenshot)?.src ?? ''}
              alt={screenshots.find((s) => s.key === activeScreenshot)?.label ?? ''}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            />
            <ScreenshotLabel>
              {screenshots.find((s) => s.key === activeScreenshot)?.label}
            </ScreenshotLabel>
          </CardBody>
        </BorderedCard>

        {/* ===== 技术规格 ===== */}
        <BorderedCard variants={fadeInUp}>
          <CardHeader>
            <CardTitle>技术规格</CardTitle>
            <CardSubtitle>运行环境、数据存储与安全机制。</CardSubtitle>
          </CardHeader>
          <CardBody>
            <SectionBlock>
              <SectionLabel>运行环境</SectionLabel>
              <SpecTable>
                <SpecLabel>操作系统</SpecLabel>
                <SpecValue>Windows 10+（64 位）</SpecValue>
                <SpecLabel>运行时</SpecLabel>
                <SpecValue>Python 3.9+，GUI 基于 tkinter</SpecValue>
                <SpecLabel>安装包</SpecLabel>
                <SpecValue>单 EXE 安装包（PyInstaller 打包），默认安装 c:/msa/</SpecValue>
                <SpecLabel>离线运行</SpecLabel>
                <SpecValue>完全离线，无需联网授权、无需注册登录</SpecValue>
              </SpecTable>
            </SectionBlock>

            <SectionBlock>
              <SectionLabel>数据存储</SectionLabel>
              <SpecTable>
                <SpecLabel>数据库</SpecLabel>
                <SpecValue>SQLite（peewee ORM），含 Operator / Batch / Section 等表</SpecValue>
                <SpecLabel>配置文件</SpecLabel>
                <SpecValue>JSON 格式，所有运行参数热更新即时生效</SpecValue>
                <SpecLabel>图片存储</SpecLabel>
                <SpecValue>原始图片 + 缩略图，按时间戳+随机后缀命名，确保唯一</SpecValue>
                <SpecLabel>存放路径</SpecLabel>
                <SpecValue>c:/msa/output/sections/ 及其子目录</SpecValue>
              </SpecTable>
            </SectionBlock>

            <SectionBlock>
              <SectionLabel>安全机制</SectionLabel>
              <SpecTable>
                <SpecLabel>防时钟回滚</SpecLabel>
                <SpecValue>.clock 文件记录上次毫秒时间戳，回滚时拒绝启动</SpecValue>
                <SpecLabel>单实例运行</SpecLabel>
                <SpecValue>TCP 端口绑定，防止重复启动</SpecValue>
                <SpecLabel>MD5 去重</SpecLabel>
                <SpecValue>录入时校验原图 MD5，重复图片弹窗提示确认</SpecValue>
                <SpecLabel>断电恢复</SpecLabel>
                <SpecValue>质检任务入队标记进行中，意外关闭后下次启动自动重试</SpecValue>
              </SpecTable>
            </SectionBlock>
          </CardBody>
        </BorderedCard>
      </Content>
    </Page>
  );
}
