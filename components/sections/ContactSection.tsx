import styles from '../../styles/Home.module.scss';

const contacts = [
  { name: '琴', href: 'https://ys.mihoyo.com/main/character/mondstadt?char=0', img: '/images/characters/jean.png', cls: 'radarContact1' },
  { name: '温迪', href: 'https://ys.mihoyo.com/main/character/mondstadt?char=7', img: '/images/characters/venti.png', cls: 'radarContact2' },
  { name: '可莉', href: 'https://ys.mihoyo.com/main/character/mondstadt?char=8', img: '/images/characters/klee.png', cls: 'radarContact3' },
  { name: '阿贝多', href: 'https://ys.mihoyo.com/main/character/mondstadt?char=15', img: '/images/characters/albedo.png', cls: 'radarContact4' },
  { name: '杜林', href: 'https://ys.mihoyo.com/main/character/mondstadt?char=21', img: '/images/characters/durin.png', cls: 'radarContact5' },
  { name: '法尔伽', href: 'https://ys.mihoyo.com/main/character/mondstadt?char=22', img: '/images/characters/varka.png', cls: 'radarContact6' },
];

export default function ContactSection({
  contactSectionRef,
  handleCopyEmail,
  isEmailCopied,
  handleShowFriendLinks,
}) {
  return (
    <div id="contact-section" ref={contactSectionRef} className={`${styles.contentSection} ${styles.contactSection}`}>
      <h2>附录备注</h2>
      <div className={styles.sectionLead}>
        <span className={styles.sectionCode}>卷宗-005 // 附录备注</span>
        <p className={styles.sectionSummary}>放置外链、陪同批注与关联资料入口，模拟骑士团终端中的附录和跳转节点。</p>
      </div>
      {/* Radar animation — part of the HUD design, not a replaceable image */}
      <div className={styles.radarDisplay}>
        <div className={styles.scanner}></div>
        <div className={`${styles.radarRipple} ${styles.ripple1}`}></div>
        <div className={`${styles.radarRipple} ${styles.radarRippleSmall} ${styles.smallRipple1}`}></div>
        <div className={`${styles.radarRipple} ${styles.radarRippleSmall} ${styles.smallRipple2}`}></div>
        <div className={`${styles.radarRipple} ${styles.radarRippleSmall} ${styles.smallRipple3}`}></div>
      </div>

      {contacts.map((c) => (
        <div key={c.name} className={`${styles.logItem} ${styles[c.cls]}`}>
          <a href={c.href} target="_blank" rel="noopener noreferrer" className={styles.logLink} aria-label={c.name}>
            <div className={styles.logIconContainer}>
              <img src={c.img} alt={c.name} className={styles.logIcon} />
            </div>
            <div className={styles.contactIconRipple}></div>
          </a>
        </div>
      ))}
    </div>
  );
}
