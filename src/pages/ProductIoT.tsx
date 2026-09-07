import React from 'react';
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
const ScreenshotNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  margin-bottom: 24px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
`;

const ScreenshotNavLink = styled.a`
  padding: 6px 14px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
  &:hover {
    border-color: var(--color-interactive);
    color: var(--color-text);
  }
`;

const ModuleBlock = styled.div`
  margin-bottom: 40px;
  &:last-child { margin-bottom: 0; }
`;

const ModuleHeader = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
`;

const ModuleTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-text);
`;

const ModuleSummary = styled.span`
  font-size: 0.85rem;
  color: var(--color-text-secondary);
`;

const ScreenshotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 20px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ScreenshotCard = styled.figure`
  margin: 0;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  overflow: hidden;
`;

const ScreenshotImgWrap = styled.div<{ $app: boolean }>`
  background: #0A1020;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ $app }) => ($app ? '20px' : '0')};
  height: ${({ $app }) => ($app ? '420px' : '320px')};
  overflow: hidden;
`;

const ScreenshotImg = styled(motion.img)<{ $app: boolean }>`
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: ${({ $app }) => ($app ? 'auto' : '100%')};
  height: ${({ $app }) => ($app ? '100%' : 'auto')};
  object-fit: ${({ $app }) => ($app ? 'contain' : 'cover')};
  object-position: top center;
`;

const ScreenshotCaption = styled.figcaption`
  padding: 14px 16px;
  border-top: 1px solid var(--color-border);
`;

const CaptionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
`;

const CaptionLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
`;

const PlatformBadge = styled.span<{ $platform: Platform }>`
  padding: 2px 10px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  border: 1px solid ${({ $platform }) => ($platform === 'PC' ? 'var(--color-interactive)' : '#7FC8FF')};
  color: ${({ $platform }) => ($platform === 'PC' ? 'var(--color-interactive-hover)' : '#7FC8FF')};
  background: ${({ $platform }) =>
    $platform === 'PC' ? 'rgba(0, 109, 221, 0.12)' : 'rgba(127, 200, 255, 0.12)'};
  flex-shrink: 0;
`;

const CaptionText = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
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

/* ── Screenshot Modules ── */
type Platform = 'PC' | 'App';
interface ScreenshotItem {
  key: string;
  label: string;
  platform: Platform;
  src: string;
  caption: string;
}
interface ScreenshotModule {
  id: string;
  title: string;
  summary: string;
  items: ScreenshotItem[];
}

const screenshotModules: ScreenshotModule[] = [
  {
    id: 'login',
    title: '登录与品牌',
    summary: '左侧产品价值主张 + 右侧登录卡，强调安全加密与运维便捷。',
    items: [
      {
        key: 'login',
        label: '登录入口',
        platform: 'PC',
        src: '/images/iot/登录页.png',
        caption: '用户名密码登录，传输全程 TLS 加密，记住登录态多端同步。',
      },
    ],
  },
  {
    id: 'console',
    title: '控制台',
    summary: '核心指标 + 设备列表 + 实时趋势 + 告警流，一个屏幕掌握全局。',
    items: [
      {
        key: 'console-pc',
        label: 'PC 控制台',
        platform: 'PC',
        src: '/images/iot/控制台_pc_1.png',
        caption: '4 项指标卡 + 设备列表面板 + 设备详情与温度趋势 + 告警滚动流。',
      },
      {
        key: 'console-app',
        label: 'App 控制台',
        platform: 'App',
        src: '/images/iot/控制台_app_1.png',
        caption: '指标卡与设备卡片化排版，移动端一眼看清在线 / 告警情况。',
      },
    ],
  },
  {
    id: 'device',
    title: '设备管理',
    summary: '从列表到点位、定时控制与面板配置，覆盖设备全生命周期。',
    items: [
      {
        key: 'device-pc-1',
        label: '设备列表',
        platform: 'PC',
        src: '/images/iot/设备管理_pc_1.png',
        caption: '标签 / 网关 / 状态 / 最近心跳多维筛选，10 台设备一目了然。',
      },
      {
        key: 'device-pc-2',
        label: '设备信息',
        platform: 'PC',
        src: '/images/iot/设备管理_pc_2.png',
        caption: '基础信息编辑：名称、网关 ID、网关类型、影子同步开关、三级标签。',
      },
      {
        key: 'device-pc-3',
        label: '点位设置',
        platform: 'PC',
        src: '/images/iot/设备管理_pc_3.png',
        caption: '点位元数据建模：编码、数据类型、读写权限、单位、分组与描述。',
      },
      {
        key: 'device-pc-4',
        label: '定时控制',
        platform: 'PC',
        src: '/images/iot/设备管理_pc_4.png',
        caption: '定时规则：执行频率、时间点、表达式、动作链，支持复制 / 删除。',
      },
      {
        key: 'device-pc-5',
        label: '面板信息',
        platform: 'PC',
        src: '/images/iot/设备管理_pc_5.png',
        caption: '编辑面板：开关指示灯、数值卡片、趋势曲线等组件自由组合。',
      },
      {
        key: 'device-app-1',
        label: '设备列表',
        platform: 'App',
        src: '/images/iot/设备管理_app_1.png',
        caption: '卡片化列表，三级标签 + 网关 + 最近心跳，按手型操作就近布置。',
      },
      {
        key: 'device-app-2',
        label: '设备面板',
        platform: 'App',
        src: '/images/iot/设备管理_app_2.png',
        caption: 'Tab 切换：面板 / 点位 / 告警 / 执行，移动端主控一屏即达。',
      },
      {
        key: 'device-app-3',
        label: '设备信息',
        platform: 'App',
        src: '/images/iot/设备管理_app_3.png',
        caption: '设备信息编辑，PC / App 数据实时双向同步。',
      },
      {
        key: 'device-app-4',
        label: '点位设置',
        platform: 'App',
        src: '/images/iot/设备管理_app_4.png',
        caption: '点位详情：数据类型、读写模式、单位与分组，竖屏单列长表单。',
      },
      {
        key: 'device-app-5',
        label: '定时控制',
        platform: 'App',
        src: '/images/iot/设备管理_app_5.png',
        caption: '定时规则：频率、规则、表达式、动作，移动端也能编排定时任务。',
      },
      {
        key: 'device-app-6',
        label: '面板编辑',
        platform: 'App',
        src: '/images/iot/设备管理_app_6.png',
        caption: '面板组件拖拽排序与编辑，PC 与 App 同一份数据源。',
      },
      {
        key: 'device-app-7',
        label: '组件配置',
        platform: 'App',
        src: '/images/iot/设备管理_app_7.png',
        caption: '配置弹窗：绑定点位、数据源（历史 / 实时）、时间范围与点数。',
      },
    ],
  },
  {
    id: 'alert',
    title: '告警中心',
    summary: '事件级 + 卡片级两种形态，PC 大表格便于追溯，App 卡片便于随时确认。',
    items: [
      {
        key: 'alert-pc',
        label: '告警事件',
        platform: 'PC',
        src: '/images/iot/告警_pc_1.png',
        caption: '16 条事件表格：等级 / 信息 / 触发值 / 状态 / 恢复 / 确认时间。',
      },
      {
        key: 'alert-app',
        label: '告警事件',
        platform: 'App',
        src: '/images/iot/告警_app_1.png',
        caption: '卡片列表：消息、触发值、状态徽标、确认时间，移动端快速处置。',
      },
    ],
  },
  {
    id: 'notify',
    title: '通知管理',
    summary: '用户 / 模板 / 记录三段式管理，短信、邮件、Webhook 等多渠道触达。',
    items: [
      {
        key: 'notify-pc',
        label: '通知总览',
        platform: 'PC',
        src: '/images/iot/通知管理_pc_1.png',
        caption: '通知用户 + 通知模板 + 通知记录三栏并行，全局可视化。',
      },
      {
        key: 'notify-app',
        label: '通知总览',
        platform: 'App',
        src: '/images/iot/通知管理_app_1.png',
        caption: '用户与模板下拉切换，记录卡片展示事件 / 通知人 / 内容。',
      },
    ],
  },
];

/* ── Page ── */
export default function ProductIoT() {
  return (
    <Page>
      <Content initial="hidden" animate="visible" variants={stagger}>
        {/* ===== Hero ===== */}
        <HeroSection>
          <HeroTitle variants={fadeInUp}>
            Vex 云物联
          </HeroTitle>
          <HeroSubtitle variants={fadeInUp}>
            面向 ESP32 自组网设备的物联网监控告警平台，覆盖设备接入、远程控制、告警订阅与多端推送，构建从端到云到人的完整链路。
          </HeroSubtitle>
          <HeroTagRow variants={fadeInUp}>
            <HeroTag $color="var(--color-primary-bg, rgba(0, 109, 221, 0.15))">PC Web</HeroTag>
            <HeroTag $color="var(--color-success-bg, rgba(0, 200, 150, 0.15))">移动 App</HeroTag>
            <HeroTag $color="var(--color-warning-bg, rgba(255, 180, 0, 0.15))">MQTT 接入</HeroTag>
            <HeroTag $color="var(--color-info-bg, rgba(127, 200, 255, 0.15))">实时告警</HeroTag>
            <HeroTag $color="var(--color-danger-bg, rgba(255, 80, 80, 0.15))">多端推送</HeroTag>
          </HeroTagRow>
        </HeroSection>

        {/* ===== 产品定位 ===== */}
        <BorderedCard variants={fadeInUp}>
          <CardHeader>
            <CardTitle>产品定位</CardTitle>
            <CardSubtitle>
              工业 IoT 与边缘自组网设备的统一管理平面，承接设备上下行数据并提供可订阅的告警通道。
            </CardSubtitle>
          </CardHeader>
          <CardBody>
            <PosTable>
              <PosLabel>产品形态</PosLabel>
              <PosValue>云端 SaaS 平台 + PC Web 控制台 + 移动 App，多端同步</PosValue>
              <PosLabel>适用场景</PosLabel>
              <PosValue>ESP32 / 自组网设备远程监控、产线状态看板、机房环境告警、边缘网关集中纳管</PosValue>
              <PosLabel>目标用户</PosLabel>
              <PosValue>运维工程师、设备管理员、产线值班人员、IoT 项目集成方</PosValue>
              <PosLabel>通信协议</PosLabel>
              <PosValue>MQTT（设备上行 / 下行控制）、WebSocket（实时推送）、HTTP（管理 API）</PosValue>
              <PosLabel>数据存储</PosLabel>
              <PosValue>云端时序数据库，设备影子、告警事件、消息订阅记录持久化</PosValue>
              <PosLabel>运行方式</PosLabel>
              <PosValue>7×24 在线服务，公网 / 私有化部署均可</PosValue>
            </PosTable>
          </CardBody>
        </BorderedCard>

        {/* ===== 核心流程 ===== */}
        <BorderedCard variants={fadeInUp}>
          <CardHeader>
            <CardTitle>核心工作流</CardTitle>
            <CardSubtitle>从设备入网到告警触达的端到端闭环。</CardSubtitle>
          </CardHeader>
          <CardBody>
            <WorkflowRow>
              <WorkflowStep $accent="#006DDD">
                <StepNum $color="#006DDD">1</StepNum>
                <StepTitle>设备接入</StepTitle>
                <StepDesc>ESP32 端通过 MQTT 上线注册，平台下发影子配置，自动建立会话</StepDesc>
              </WorkflowStep>
              <WorkflowStep $accent="#3B82F6">
                <StepNum $color="#3B82F6">2</StepNum>
                <StepTitle>数据采集</StepTitle>
                <StepDesc>设备周期性上报状态、传感器数据，平台写入时序库并实时推送控制台</StepDesc>
              </WorkflowStep>
              <WorkflowStep $accent="#7FC8FF">
                <StepNum $color="#7FC8FF">3</StepNum>
                <StepTitle>远程控制</StepTitle>
                <StepDesc>Web / App 端下发指令，平台经 MQTT 反向送达设备，指令全程可追踪</StepDesc>
              </WorkflowStep>
              <WorkflowStep $accent="#F59E0B">
                <StepNum $color="#F59E0B">4</StepNum>
                <StepTitle>规则告警</StepTitle>
                <StepDesc>阈值 / 离线 / 异常事件触发告警规则，匹配订阅渠道实时下发</StepDesc>
              </WorkflowStep>
              <WorkflowStep $accent="#EF4444">
                <StepNum $color="#EF4444">5</StepNum>
                <StepTitle>多端触达</StepTitle>
                <StepDesc>告警通过站内、App 推送、邮件、Webhook 等渠道送达责任人</StepDesc>
              </WorkflowStep>
            </WorkflowRow>
          </CardBody>
        </BorderedCard>

        {/* ===== 核心功能 ===== */}
        <BorderedCard variants={fadeInUp}>
          <CardHeader>
            <CardTitle>核心功能</CardTitle>
            <CardSubtitle>
              覆盖控制台、设备管理、告警、通知、登录五大模块，PC 与移动端体验对齐。
            </CardSubtitle>
          </CardHeader>
          <CardBody>
            <FeatureGrid>
              <FeatureCard $accent="#006DDD">
                <FeatureTitle>控制台 Dashboard</FeatureTitle>
                <FeatureList>
                  <li>设备总数、在线、离线、告警 4 项核心指标卡</li>
                  <li>实时设备状态分布与最近告警滚动</li>
                  <li>快捷入口：设备管理 / 告警 / 通知</li>
                  <li>PC 大屏 + App 移动端布局自适应</li>
                </FeatureList>
              </FeatureCard>
              <FeatureCard $accent="#10B981">
                <FeatureTitle>设备管理 Device</FeatureTitle>
                <FeatureList>
                  <li>设备列表：分组筛选、状态筛选、关键字搜索</li>
                  <li>设备详情：影子状态、最近心跳、属性快照</li>
                  <li>设备分组：树形结构，按区域 / 业务线聚合</li>
                  <li>设备拓扑：可视化自组网连接关系</li>
                  <li>固件升级：批量推送 OTA 任务与进度跟踪</li>
                </FeatureList>
              </FeatureCard>
              <FeatureCard $accent="#F59E0B">
                <FeatureTitle>告警中心 Alert</FeatureTitle>
                <FeatureList>
                  <li>告警事件流：按等级 / 设备 / 时间多维筛选</li>
                  <li>告警详情：触发规则、设备快照、处置记录</li>
                  <li>告警确认 / 关闭 / 转派全流程闭环</li>
                  <li>PC 大表格 + App 卡片列表双形态</li>
                </FeatureList>
              </FeatureCard>
              <FeatureCard $accent="#7FC8FF">
                <FeatureTitle>通知管理 Notify</FeatureTitle>
                <FeatureList>
                  <li>通知渠道配置：站内、App 推送、邮件、Webhook</li>
                  <li>订阅规则：按设备 / 分组 / 告警等级订阅</li>
                  <li>通知模板：标题、正文、变量插值可编辑</li>
                  <li>发送历史与失败重试</li>
                </FeatureList>
              </FeatureCard>
              <FeatureCard $accent="#3B82F6">
                <FeatureTitle>登录与权限</FeatureTitle>
                <FeatureList>
                  <li>账号密码登录 + 记住登录态</li>
                  <li>多端会话管理，PC / App 同时在线</li>
                  <li>后续接入组织 / 角色 / 资源权限</li>
                </FeatureList>
              </FeatureCard>
            </FeatureGrid>
          </CardBody>
        </BorderedCard>

        {/* ===== 通信架构 ===== */}
        <BorderedCard variants={fadeInUp}>
          <CardHeader>
            <CardTitle>通信与接入架构</CardTitle>
            <CardSubtitle>设备 ↔ 平台 ↔ 人 三层链路，每一段都有明确职责。</CardSubtitle>
          </CardHeader>
          <CardBody>
            <PosTable>
              <PosLabel>设备 → 平台</PosLabel>
              <PosValue>MQTT over TLS，主题按 productKey/deviceKey 路由，心跳保活与遗嘱消息</PosValue>
              <PosLabel>平台 → 设备</PosLabel>
              <PosValue>基于设备影子的下行指令，QoS 1 保证至少一次送达，指令 ID 可回执</PosValue>
              <PosLabel>平台 → 用户</PosLabel>
              <PosValue>WebSocket 实时推送控制台状态变化，App 走长连接 + 系统推送</PosValue>
              <PosLabel>用户 → 平台</PosLabel>
              <PosValue>REST API 管理面，OpenAPI 风格，便于三方系统对接</PosValue>
              <PosLabel>设备影子</PosLabel>
              <PosValue>desired / reported 双状态机，离线期间指令缓存，上线后自动同步</PosValue>
              <PosLabel>时序数据</PosLabel>
              <PosValue>高频指标按设备 + 时间窗口聚合，保留周期可配，支撑趋势分析</PosValue>
            </PosTable>
          </CardBody>
        </BorderedCard>

        {/* ===== 界面预览 ===== */}
        <BorderedCard variants={fadeInUp}>
          <CardHeader>
            <CardTitle>界面预览</CardTitle>
            <CardSubtitle>
              PC Web 与移动 App 真实截图，按业务模块分组，便于快速对照两端体验。
            </CardSubtitle>
          </CardHeader>
          <CardBody>
            <ScreenshotNav aria-label="界面预览导航">
              {screenshotModules.map((m) => (
                <ScreenshotNavLink key={m.id} href={`#shot-${m.id}`}>
                  {m.title}
                </ScreenshotNavLink>
              ))}
            </ScreenshotNav>

            {screenshotModules.map((m) => (
              <ModuleBlock key={m.id} id={`shot-${m.id}`}>
                <ModuleHeader>
                  <ModuleTitle>{m.title}</ModuleTitle>
                  <ModuleSummary>{m.summary}</ModuleSummary>
                </ModuleHeader>
                <ScreenshotGrid>
                  {m.items.map((item) => {
                    const isApp = item.platform === 'App';
                    return (
                      <ScreenshotCard key={item.key}>
                        <ScreenshotImgWrap $app={isApp}>
                          <ScreenshotImg
                            src={item.src}
                            alt={`${item.label} - ${item.platform}`}
                            $app={isApp}
                            loading="lazy"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.35 }}
                          />
                        </ScreenshotImgWrap>
                        <ScreenshotCaption>
                          <CaptionHeader>
                            <CaptionLabel>{item.label}</CaptionLabel>
                            <PlatformBadge $platform={item.platform}>{item.platform}</PlatformBadge>
                          </CaptionHeader>
                          <CaptionText>{item.caption}</CaptionText>
                        </ScreenshotCaption>
                      </ScreenshotCard>
                    );
                  })}
                </ScreenshotGrid>
              </ModuleBlock>
            ))}
          </CardBody>
        </BorderedCard>

        {/* ===== 技术规格 ===== */}
        <BorderedCard variants={fadeInUp}>
          <CardHeader>
            <CardTitle>技术规格</CardTitle>
            <CardSubtitle>平台组成、端侧能力与对接规范。</CardSubtitle>
          </CardHeader>
          <CardBody>
            <SectionBlock>
              <SectionLabel>平台组成</SectionLabel>
              <SpecTable>
                <SpecLabel>接入层</SpecLabel>
                <SpecValue>MQTT Broker（EMQX），支持万级设备并发长连接</SpecValue>
                <SpecLabel>API 层</SpecLabel>
                <SpecValue>Spring Boot / Java 21，提供设备、告警、通知 REST API</SpecValue>
                <SpecLabel>推送层</SpecLabel>
                <SpecValue>SSE 网关 + 移动推送通道（APNs / 厂商通道）</SpecValue>
                <SpecLabel>存储层</SpecLabel>
                <SpecValue>关系库（PostgreSql）+ 时序库 + Redis 缓存</SpecValue>
                <SpecLabel>前端</SpecLabel>
                <SpecValue>React + TypeScript，PC Web 与 React Native App 共用业务模型</SpecValue>
              </SpecTable>
            </SectionBlock>

            <SectionBlock>
              <SectionLabel>设备端</SectionLabel>
              <SpecTable>
                <SpecLabel>通信</SpecLabel>
                <SpecValue>Wi-Fi + MQTT，自动重连，遗嘱消息上报离线</SpecValue>
                <SpecLabel>固件</SpecLabel>
                <SpecValue>支持 OTA 升级，差分包推送，断点续传</SpecValue>
                <SpecLabel>数据上报</SpecLabel>
                <SpecValue>属性上报 + 事件上报 + 影子同步，频率可配</SpecValue>
              </SpecTable>
            </SectionBlock>

            <SectionBlock>
              <SectionLabel>安全与可靠性</SectionLabel>
              <SpecTable>
                <SpecLabel>链路加密</SpecLabel>
                <SpecValue>MQTT over TLS 1.2+，设备一机一密（productKey / deviceSecret）</SpecValue>
                <SpecLabel>指令安全</SpecLabel>
                <SpecValue>下行指令签名 + 时间戳防重放，影子状态机保证幂等</SpecValue>
                <SpecLabel>权限隔离</SpecLabel>
                <SpecValue>租户空间隔离，设备按分组授权，避免越权访问</SpecValue>
                <SpecLabel>可观测</SpecLabel>
                <SpecValue>设备在线率、消息到达率、告警时延全链路指标埋点</SpecValue>
              </SpecTable>
            </SectionBlock>
          </CardBody>
        </BorderedCard>
      </Content>
    </Page>
  );
}
