import styled, { keyframes } from 'styled-components';
import { FaGithub, FaWeixin, FaPaperPlane } from 'react-icons/fa';
import { SiGitee, SiTiktok } from 'react-icons/si';

/* ── Animations ── */
const marqueeAnim = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const qrPop = keyframes`
  0% { transform: translateX(-50%) scale(0.5) translateY(0); opacity: 0; }
  50% { transform: translateX(-50%) scale(1.08) translateY(-10px); opacity: 1; }
  70% { transform: translateX(-50%) scale(0.95) translateY(-6px); }
  85% { transform: translateX(-50%) scale(1.03) translateY(-9px); }
  100% { transform: translateX(-50%) scale(1) translateY(-8px); opacity: 1; }
`;

const surferRide = keyframes`
  0% { right: -30px; }
  100% { right: calc(100% + 30px); }
`;

/* ── Styled Components ── */
const BuildSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px 24px;
  border-bottom: 1px solid var(--color-border);
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const BuildTitle = styled.h2`
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 700;
  flex-shrink: 0;
`;

const BuildDesc = styled.div`
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  max-width: 800px;
  overflow: hidden;
  position: relative;
  @media (max-width: 768px) {
    font-size: 0.9rem;
    width: 100%;
  }
`;

const MarqueeTrack = styled.div`
  display: flex;
  width: max-content;
  white-space: nowrap;
  animation: ${marqueeAnim} 50s linear infinite;
`;

const Surfer = styled.span`
  position: absolute;
  top: -4px;
  font-size: 1.2rem;
  animation: ${surferRide} 6s linear infinite;
  pointer-events: none;
  -webkit-user-select: none;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-watermark);
  @media (max-width: 768px) {
    display: none;
  }
`;

const SocialRow = styled.div`
  display: flex;
  gap: 16px;
`;

const SocialIcon = styled.a`
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  transition: all 0.2s;
  &:hover { border-color: var(--color-border); color: var(--color-text); }
`;

const SocialWrap = styled.div`
  position: relative;
`;

const QRPopup = styled.div`
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%) scale(0.5);
  opacity: 0;
  visibility: hidden;
  transition: none;
  padding: 10px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  z-index: 100;
  pointer-events: none;
  width: 200px;
  height: 200px;
  box-sizing: border-box;
  ${SocialWrap}:hover & {
    opacity: 1;
    visibility: visible;
    animation: ${qrPop} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: var(--color-border);
  }
`;

const QRImg = styled.img`
  width: 100%;
  height: 100%;
  display: block;
`;

/* ── Data ── */
const marqueeText = '搞软件，耍AI，啥新鲜整啥...    捣鼓实用小工具，不整花架子...    写代码图个乐呵，随心造...    莫马达~    ';
const surferText = '/ * - + ! @ # $ % ^ & * ( ) [ ] ; < > ? / ` ~';

/* ── Component ── */
export default function BuildWith() {
  return (
    <BuildSection>
      <BuildTitle>社交媒体</BuildTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <SocialRow>
          <SocialIcon href="hhttps://github.com/vex-rune" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></SocialIcon>
          <SocialIcon href="https://www.feishu.cn/invitation/page/add_contact/?token=cbdrbf0a-b729-42a7-865d-55376072c05d" target="_blank" rel="noopener noreferrer" aria-label="飞书"><FaPaperPlane /></SocialIcon>
          <SocialIcon href="https://gitee.com/vex-rune" target="_blank" rel="noopener noreferrer" aria-label="Gitee"><SiGitee /></SocialIcon>
          <SocialWrap>
            <SocialIcon href="#" aria-label="微信"><FaWeixin /></SocialIcon>
            <QRPopup><QRImg src={`${process.env.PUBLIC_URL}/weixinq.png`} alt="微信二维码" /></QRPopup>
          </SocialWrap>
          <SocialWrap>
            <SocialIcon href="https://www.douyin.com/user/__fomalhaut__" target="_blank" rel="noopener noreferrer" aria-label="抖音"><SiTiktok /></SocialIcon>
            <QRPopup><QRImg src={`${process.env.PUBLIC_URL}/douyinq.png`} alt="抖音二维码" /></QRPopup>
          </SocialWrap>
        </SocialRow>

        <BuildDesc>
          <MarqueeTrack>
            <span>{marqueeText}&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span>{marqueeText}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </MarqueeTrack>
          <Surfer>{surferText}</Surfer>
        </BuildDesc>
      </div>
    </BuildSection>
  );
}
