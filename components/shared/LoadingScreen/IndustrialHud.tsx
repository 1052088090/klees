import React, { forwardRef, useRef, useImperativeHandle, useEffect, useMemo } from 'react';
import styles from '../../../styles/HomeLoadingScreen.module.scss';
import gsap from 'gsap';

export interface IndustrialHudRef {
  container: HTMLDivElement | null;
  hudElements: HTMLDivElement | null;
  initAnimations: () => void;
}

const IndustrialHud = forwardRef<IndustrialHudRef>((_, ref) => {
  const bgHudLayerRef = useRef<HTMLDivElement>(null);
  const hudElementsRef = useRef<HTMLDivElement>(null);
  const clockTextRef = useRef<HTMLDivElement>(null);
  const scaleLeftRef = useRef<HTMLDivElement>(null);
  const scaleRightRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    container: bgHudLayerRef.current,
    hudElements: hudElementsRef.current,
    initAnimations: () => {
      const isTablet = window.matchMedia('(max-width: 1023px)').matches;
      if (!isTablet) {
        if (scaleLeftRef.current) {
          gsap.to(scaleLeftRef.current, { y: '-50%', duration: 10, ease: 'none', repeat: -1 });
        }
        if (scaleRightRef.current) {
          gsap.to(scaleRightRef.current, { y: '-50%', duration: 10, ease: 'none', repeat: -1 });
        }
      }
    }
  }));

  // ===================== Clock (direct DOM update, no re-render) =====================
  useEffect(() => {
    const update = () => {
      if (clockTextRef.current) clockTextRef.current.textContent = new Date().toLocaleTimeString();
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Background HUD Layer with Corner Brackets */}
      <div ref={bgHudLayerRef} className={styles.background_hud_layer} style={{ opacity: 0 }}>
        <div className={`${styles.corner_bracket} ${styles.tl}`}></div>
        <div className={`${styles.corner_bracket} ${styles.tr}`}></div>
        <div className={`${styles.corner_bracket} ${styles.bl}`}></div>
        <div className={`${styles.corner_bracket} ${styles.br}`}></div>

        <div className={styles.right_stripe_gradient}></div>

        <div className={styles.hud_scale_left}>
          <div className={styles.scale_animation_container}>
            <div ref={scaleLeftRef} className={styles.scale_animation_content}>
              <div className={styles.scale_connecting_line}></div>
              {[...Array(20)].map((_, i) => (
                <div key={`scale-l-${i}`} className={styles.scale_marker} style={{ top: `${5 + i * 10}%` }}></div>
              ))}
            </div>
          </div>
          <span className={styles.scale_label_v}>档位</span>
        </div>

        <div className={styles.hud_scale_right}>
          <div className={styles.scale_animation_container}>
            <div ref={scaleRightRef} className={styles.scale_animation_content}>
              <div className={styles.scale_connecting_line}></div>
              {[...Array(20)].map((_, i) => (
                <div key={`scale-r-${i}`} className={styles.scale_marker} style={{ top: `${5 + i * 10}%` }}></div>
              ))}
            </div>
          </div>
          <span className={styles.scale_label_v}>脉冲</span>
        </div>
      </div>

      {/* Foreground Corner text HUD elements */}
      <div ref={hudElementsRef} className={styles.hud_elements}>
        <div className={`${styles.hud_element} ${styles.top_left}`}>
          <div className={styles.hud_line}></div>
          <div className={styles.hud_text}>卷宗监测</div>
        </div>
        <div className={`${styles.hud_element} ${styles.top_right}`}>
          <div className={styles.hud_line}></div>
          <div className={styles.hud_text_with_signal}>
            <div className={styles.hud_text}>监护签名已识别</div>
            <div className={styles.signal_ekg}>
              <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                <polyline points="0,15 20,15 25,5 30,25 35,15 50,15 55,5 65,28 75,15 100,15" className={styles.ekg_line} />
              </svg>
            </div>
          </div>
        </div>
        <div className={`${styles.hud_element} ${styles.bottom_left}`}>
          <div className={styles.hud_line}></div>
          <div className={styles.hud_text}>FILE-KL-01</div>
        </div>
        <div className={`${styles.hud_element} ${styles.bottom_right}`}>
          <div className={styles.hud_line}></div>
          <div className={styles.hud_text} ref={clockTextRef}>--:--:--</div>
        </div>
      </div>
    </>
  );
});

IndustrialHud.displayName = 'IndustrialHud';

export default IndustrialHud;
