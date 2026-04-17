import { memo, useEffect, useRef, useState } from 'react';
import styles from '../../styles/Home.module.scss';
import { useResponsive } from '../../hooks/useMediaQuery';

function formatTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}

function GlobalHud({ hudVisible, isGamePage = false }) {
  const { isMobile } = useResponsive();
  const cursorXRef = useRef<HTMLSpanElement>(null);
  const cursorYRef = useRef<HTMLSpanElement>(null);
  const [currentTime, setCurrentTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setCurrentTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const onMouseMove = (e: MouseEvent) => {
      if (cursorXRef.current) cursorXRef.current.textContent = String(Math.round(e.clientX)).padStart(4, '0');
      if (cursorYRef.current) cursorYRef.current.textContent = String(Math.round(e.clientY)).padStart(4, '0');
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [isMobile]);

  if (isMobile) {
    return (
      <>
        <div className={`${styles.hudElement} ${styles.topLeft} ${hudVisible ? styles.visible : ''}`}>
          <div>TIME: {currentTime}</div>
          <div>卷宗在线</div>
        </div>
        <div className={`${styles.hudElement} ${styles.topRight} ${hudVisible ? styles.visible : ''}`}>
          <div>骑士团链路已接通</div>
          <div>权限: 限制读取</div>
        </div>
        <div className={`${styles.hudElement} ${styles.bottomLeft} ${hudVisible ? styles.visible : ''}`}>
        <div>可莉档案袋</div>
        <div>西风骑士团</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={`${styles.hudElement} ${styles.topLeft} ${hudVisible ? styles.visible : ''}`}>
        <div>TIME: {currentTime}</div>
        <div>卷宗在线</div>
      </div>
      <div className={`${styles.hudElement} ${styles.topRight} ${hudVisible ? styles.visible : ''}`}>
        <div>CURSOR_X: <span ref={cursorXRef}>0000</span></div>
        <div>CURSOR_Y: <span ref={cursorYRef}>0000</span></div>
      </div>
      <div className={`${styles.hudElement} ${styles.bottomLeft} ${hudVisible ? styles.visible : ''}`}>
        <div>可莉档案袋</div>
        <div>西风卷宗 v1.0</div>
      </div>
      {!isGamePage && (
        <div className={`${styles.hudElement} ${styles.bottomRight} ${hudVisible ? styles.visible : ''}`}>
          <div>火花骑士</div>
          <div>请谨慎翻阅</div>
        </div>
      )}
    </>
  );
}

export default memo(GlobalHud);
