import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Hero from '../components/Hero';
import BuildWith from '../components/BuildWith';
import ProjectCards from '../components/ProjectCards';
import ListSection, { ListItem } from '../components/ListSection';
import ChatWidget from '../components/ChatWidget';

/* ── Layout ── */
const Container = styled.div`
  width: 85%;
  max-width: 1600px;
  margin: 0 auto;
  border: 1px solid var(--color-border);
  background: var(--color-surface-alpha);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  @media (max-width: 768px) {
    width: 100%;
    border-left: none;
    border-right: none;
  }
`;

/* ── Data ── */
const projectItems: ListItem[] = [
  { num: '01', title: 'Vex MSA 材料检测', desc: '面向材料质检实验室的一体化桌面工作台', href: '/product/msa' },
  { num: '02', title: 'Vex 云物联', desc: '面向 ESP32 自组网的物联网监控告警平台', href: '/product/iot' },
  { num: '03', title: 'Vex Glyph 字模生成器', desc: 'ASCII / 汉字 / 图片点阵字模生成器', href: '/tools/oled-font' },
  { num: '04', title: '个人 Wiki 知识库', desc: '基于现代化知识管理系统的个人 Wiki 平台', href: 'http://wiki.vexrune.top/' },
  { num: '05', title: 'Owl 智能体', desc: '自主决策的 Owl，执行多步骤任务', href: 'https://github.com/vex-rune/vex-owl' },
];

const aboutItems: ListItem[] = [
  { id: 'skills', num: '01', title: '后端开发', desc: 'Java 微服务、AWS 云服务、Datadog 监控运维' },
  { id: 'ai', num: '02', title: 'AI 工程化探索', desc: 'Spring AI、RAG、AI Agent、Function Calling' },
  { id: 'transition', num: '03', title: '电气工程转型', desc: '工业自动化到互联网后端的跨界之路' },
  { id: '3dprint', num: '04', title: '3D 打印', desc: '拓竹 A1、Autodesk Fusion，纯粹玩玩' },
  { id: 'iot', num: '05', title: 'ESP32 IoT 探索', desc: 'ESP32 开发板、传感器、MQTT，想搞点东西' },
];

const blogItems: ListItem[] = [
  { title: '软件技术笔记', desc: 'Java、Spring Boot、AI Agent、Flutter 等学习记录', href: 'https://wiki.vexrune.top/%E8%BD%AF%E4%BB%B6/' },
  { title: '数据库技术', desc: 'MySQL、Redis、MongoDB、Milvus 向量数据库', href: 'https://wiki.vexrune.top/%E6%95%B0%E6%8D%AE%E5%BA%93/' },
  { title: '运维与云原生', desc: 'Docker、ELK、GitLab CI/CD、AWS 部署实践', href: 'https://wiki.vexrune.top/%E8%BF%90%E7%BB%B4%E6%8A%80%E6%9C%AF/' },
  { title: '项目管理', desc: 'PMP 认证知识、敏捷开发实践', href: 'https://wiki.vexrune.top/%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86/' },
  { title: '3D 建模探索', desc: 'Blender、Ae 动画、Autodesk Fusion 建模', href: 'https://wiki.vexrune.top/3D%E5%BB%BA%E6%A8%A1/' },
];

/* ── Page ── */
export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Container>
        <Hero />
        <BuildWith />
        <ProjectCards />
        <ListSection title="小打小闹" items={projectItems} id="showcase" />
        <ListSection
          title="关于我"
          items={aboutItems.map(item => ({
            ...item,
            onClick: () => navigate(`/about#${item.id}`),
          }))}
        />
        <ListSection title="博客" items={blogItems} id="blog" />
      </Container>

      <ChatWidget />
    </>
  );
}
