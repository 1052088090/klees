import { useState } from 'react';
import styles from '../../styles/Home.module.scss';
import ProjectCard from '../cards/ProjectCard';

export default function LifeSection({
  lifeSectionRef,
  activeSection,
  activeLifeTab,
  handleLifeTabClick,
  lifeContentAreaRef,
  lifeGameTabRef,
  lifeTravelTabRef,
  lifeArtTabRef,
  lifeOtherTabRef,
  gameData,
  travelData,
  otherData,
  handleLifeItemClick,
}) {
  const alsoPlayGames = [
    '便签角标',
    '炸弹图样',
    '四叶草纹样',
    '禁闭室门牌',
    '火花粒子',
    '骑士团章记',
    '页边批注',
    '警示贴纸',
  ];
  const sceneArchiveSlots = [
    {
      code: 'SCENE-01',
      title: '蒙德街区巡览',
      summary: '适合放城内行走、摊位停留和被居民认出的日常画面，承担“她属于蒙德”的空间感。',
      status: '优先补图',
      tags: ['街区日常', '城市氛围'],
    },
    {
      code: 'SCENE-02',
      title: '禁闭室周边记录',
      summary: '补门牌、桌面、签核页和门口等局部画面，用来支撑禁闭室条目的温柔处理语境。',
      status: '建议成组整理',
      tags: ['门牌', '签核页'],
    },
    {
      code: 'SCENE-03',
      title: '野外冒险现场',
      summary: '优先保留炸弹落点、探索过程和陪同行动的环境截图，让故事条目能引用真实场景。',
      status: '适合联动故事卷宗',
      tags: ['冒险', '爆破痕迹'],
    },
  ];

  const [alsoPlayExpanded, setAlsoPlayExpanded] = useState(false);

  return (
    <div
      id="life-section"
      ref={lifeSectionRef}
      className={`${styles.contentSection} ${styles.lifeSection} ${activeSection === 'lifeDetail' ? styles.detailActive : ''}`}
    >
      <h2 className={styles.lifeTitleWithBackground}>图像档案</h2>
      <div className={styles.sectionLead}>
        <span className={styles.sectionCode}>卷宗-004 // 图像档案</span>
        <p className={styles.sectionSummary}>预留立绘、表情、场景截图与补充视觉物料，作为整份档案的图像附卷。</p>
      </div>
      <div className={styles.lifeTabButtons}>
        <button
          className={`${styles.lifeTabButton} ${activeLifeTab === 'game' ? styles.activeTab : ''}`}
          onClick={() => handleLifeTabClick('game')}
        >
          立绘
        </button>
        <button
          className={`${styles.lifeTabButton} ${activeLifeTab === 'travel' ? styles.activeTab : ''}`}
          onClick={() => handleLifeTabClick('travel')}
        >
          表情
        </button>
        <button
          className={`${styles.lifeTabButton} ${activeLifeTab === 'art' ? styles.activeTab : ''}`}
          onClick={() => handleLifeTabClick('art')}
        >
          场景
        </button>
        <button
          className={`${styles.lifeTabButton} ${activeLifeTab === 'other' ? styles.activeTab : ''}`}
          onClick={() => handleLifeTabClick('other')}
        >
          附加
        </button>
      </div>
      <div ref={lifeContentAreaRef} className={styles.lifeContentArea}>
        {/* Game Tab */}
        <div ref={lifeGameTabRef} className={`${styles.lifeTabContent} ${activeLifeTab === 'game' ? styles.activeContent : ''}`}>
          <div className={styles.gameGrid}>
            {gameData.map(game => (
              <ProjectCard
                key={game.id}
                project={game}
                onClick={handleLifeItemClick}
              />
            ))}
          </div>
          <div className={styles.earlySection}>
            <button
              className={`${styles.earlySectionToggle} ${alsoPlayExpanded ? styles.expanded : ''}`}
              onClick={() => setAlsoPlayExpanded(prev => !prev)}
            >
              <span className={styles.earlySectionToggleIcon}>{alsoPlayExpanded ? '▾' : '▸'}</span>
              <span>可追加素材 / 备用条目</span>
              <span className={styles.earlySectionCount}>{alsoPlayGames.length}</span>
            </button>
            <div className={`${styles.earlySectionContent} ${alsoPlayExpanded ? styles.expanded : ''}`}>
              <div className={styles.smallGameGrid}>
                {alsoPlayGames.map((gameName) => (
                  <div key={gameName} className={styles.smallGameCard}>
                    {gameName}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Travel Tab */}
        <div ref={lifeTravelTabRef} className={`${styles.lifeTabContent} ${activeLifeTab === 'travel' ? styles.activeContent : ''}`}>
          <div className={styles.travelGrid}>
            {travelData.map(place => (
              <ProjectCard
                key={place.id}
                project={place}
                onClick={handleLifeItemClick}
              />
            ))}
          </div>
        </div>
        {/* Art Tab */}
        <div ref={lifeArtTabRef} className={`${styles.lifeTabContent} ${activeLifeTab === 'art' ? styles.activeContent : ''}`}>
          <div className={styles.lifeArchiveBoard}>
            <div className={styles.lifeArchiveIntro}>
              <span className={styles.lifeArchiveCode}>附录-图像 / 场景预案</span>
              <p className={styles.lifeArchiveSummary}>
                这一栏不再只放说明文字，而是直接列出三组最值得先补的场景素材。它们会同时服务故事卷宗、关系记录和图像详情页。
              </p>
            </div>
            <div className={styles.lifeArchiveGrid}>
              {sceneArchiveSlots.map((slot) => (
                <article key={slot.code} className={styles.lifeArchiveCard}>
                  <div className={styles.lifeArchiveCardTop}>
                    <span className={styles.lifeArchiveCardCode}>{slot.code}</span>
                    <span className={styles.lifeArchiveCardStatus}>{slot.status}</span>
                  </div>
                  <div className={styles.lifeArchiveThumb} aria-hidden="true">
                    <span className={styles.lifeArchiveThumbLabel}>{slot.title}</span>
                  </div>
                  <div className={styles.lifeArchiveBody}>
                    <h3 className={styles.lifeArchiveTitle}>{slot.title}</h3>
                    <p className={styles.lifeArchiveText}>{slot.summary}</p>
                    <div className={styles.lifeArchiveTags}>
                      {slot.tags.map((tag) => (
                        <span key={`${slot.code}-${tag}`} className={styles.lifeArchiveTag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
        {/* Other Tab */}
        <div ref={lifeOtherTabRef} className={`${styles.lifeTabContent} ${activeLifeTab === 'other' ? styles.activeContent : ''} ${styles.compactTabContent}`}>
          <div className={styles.gameGrid}>
            {otherData.map(item => (
              <ProjectCard
                key={item.id}
                project={item}
                onClick={handleLifeItemClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
