import styles from '../../styles/Home.module.scss';

export default function ExperienceSection({
  experienceSectionRef,
  experienceData,
  handleExperienceItemClick,
}) {
  return (
    <div id="experience-section" ref={experienceSectionRef} className={`${styles.contentSection} ${styles.experienceSection}`}>
      <h2 className={styles.experienceTitleWithBackground}>作战天赋</h2>
      <div className={styles.sectionLead}>
        <span className={styles.sectionCode}>卷宗-002 // 作战天赋</span>
        <p className={styles.sectionSummary}>按核心战技、固有倾向与探索权限三层归档，呈现可莉从爆破输出到辅助观察的完整作战画像。</p>
      </div>
      <div className={styles.experienceTimeline}>
        {experienceData.map((item) => (
          <div
            key={item.id}
            className={`
              ${styles.timelineItem}
              ${item.alignment === 'left' ? styles.timelineItemLeft : styles.timelineItemRight}
              ${item.type === 'education' ? styles.educationItem : ''}
            `}
            onClick={(e) => handleExperienceItemClick(item, e)}
          >
            <div className={styles.timelinePoint} />
            <div className={styles.timelineBranch} />
            <div className={styles.timelineContent}>
              <div className={styles.timelineHeader}>
                <div className={styles.timelineTopline}>
                  <span className={styles.timelineYear}>{item.duration}</span>
                  {item.category && <span className={styles.timelineCategory}>{item.category}</span>}
                </div>
                <h3>{item.title}</h3>
              </div>
              {item.summary && <p className={styles.timelineSummary}>{item.summary}</p>}
              <div className={styles.timelineDetails}>
                {item.location && <p className={styles.timelineLocation}>{item.location}</p>}
                {item.details && item.details.length > 0 && <p className={styles.timelineObservation}>{item.details[0]}</p>}
              </div>
              {item.keywords && item.keywords.length > 0 && (
                <div className={styles.timelineKeywords}>
                  {item.keywords.map((keyword) => (
                    <span key={keyword} className={styles.timelineKeyword}>
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
              <span className={styles.timelineInspect}>展开卷宗</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
