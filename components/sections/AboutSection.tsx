import styles from '../../styles/Home.module.scss';
import Noise from '../effects/Noise';

export default function AboutSection({
  aboutSectionRef,
  aboutContentRef,
}) {
  return (
    <div id="about-section" ref={aboutSectionRef} className={`${styles.contentSection} ${styles.aboutSection}`}>
      <Noise />
      <div ref={aboutContentRef} className={styles.aboutContentInner}>
        <h2>终页摘要</h2>
        <div className={styles.sectionLead}>
        <span className={styles.sectionCode}>卷宗-006 // 终页摘要</span>
          <p className={styles.sectionSummary}>记录终端运行状态与卷宗访问情况，作为整份档案的归档落款。</p>
        </div>
        <div className={styles.footerInfo}>
          西风骑士团档案终端 / 可莉观察卷宗
        </div>

      </div>

    </div>
  );
}
