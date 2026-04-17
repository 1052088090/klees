import { forwardRef, useState, type Ref, type RefObject } from 'react';
import styles from '../../styles/Home.module.scss';
import ProjectCard from '../cards/ProjectCard';
import SkillTree from '../shared/SkillTree';
import type { Project, SkillCategory } from '../../types';

interface WorksSectionProps {
  worksSectionRef: RefObject<HTMLDivElement>;
  activeWorkTab: string;
  handleWorkTabClick: (tab: string) => void;
  workContentAreaRef: RefObject<HTMLDivElement>;
  webTabRef: RefObject<HTMLDivElement>;
  gameTabRef: RefObject<HTMLDivElement>;
  webProjects: Project[];
  gameProjects: Project[];
  earlyProjects: Project[];
  handleWorkItemClick: (project: Project, e: React.MouseEvent) => void;
  skillCategories: SkillCategory[];
}

const WorksSection = forwardRef(function WorksSection({
  worksSectionRef,
  activeWorkTab,
  handleWorkTabClick,
  workContentAreaRef,
  webTabRef,
  gameTabRef,
  webProjects,
  gameProjects,
  earlyProjects,
  handleWorkItemClick,
  skillCategories,
}: WorksSectionProps, ref: Ref<HTMLDivElement>) {
  const [earlyExpanded, setEarlyExpanded] = useState(false);
  const [skillsExpanded, setSkillsExpanded] = useState(false);

  return (
    <div id="works-section" ref={worksSectionRef} className={`${styles.contentSection} ${styles.worksSection}`}>
      <h2 className={styles.worksTitleWithBackground}>基础档案</h2>
      <div className={styles.sectionLead}>
        <span className={styles.sectionCode}>卷宗-001 // 身份档案</span>
        <p className={styles.sectionSummary}>汇总火花骑士的身份、命座节点与监护记录，作为整份卷宗的起始页。</p>
      </div>
      <div className={styles.workTabButtons}>
        <button
          className={`${styles.workTabButton} ${activeWorkTab === 'web' ? styles.activeTab : ''}`}
          onClick={() => handleWorkTabClick('web')}
        >
          档案概览
        </button>
        <button
          className={`${styles.workTabButton} ${activeWorkTab === 'game' ? styles.activeTab : ''}`}
          onClick={() => handleWorkTabClick('game')}
        >
          命座节点
        </button>
      </div>
      <div ref={workContentAreaRef} className={styles.workContentArea}>
        <div ref={webTabRef} className={`${styles.workTabContent} ${activeWorkTab === 'web' ? styles.activeWorkContent : ''}`}>
          <div className={styles.identityPanel}>
            <div className={styles.identityPanelHeader}>
              <span className={styles.identityKicker}>身份总览</span>
              <p className={styles.identitySummary}>先读取身份、监护与行为判断，再继续进入命座、天赋与附录，整份卷宗的阅读顺序会更稳定。</p>
            </div>
            <div className={styles.identityMetaRow}>
              <div className={styles.identityMetaCard}>
                <span className={styles.identityMetaLabel}>登记代号</span>
                <span className={styles.identityMetaValue}>KLEE / 可莉</span>
              </div>
              <div className={styles.identityMetaCard}>
                <span className={styles.identityMetaLabel}>所属条目</span>
                <span className={styles.identityMetaValue}>西风骑士团 / 火花骑士</span>
              </div>
              <div className={styles.identityMetaCard}>
                <span className={styles.identityMetaLabel}>陪同判断</span>
                <span className={styles.identityMetaValue}>需陪同观察 / 限制单独爆破</span>
              </div>
            </div>
          </div>
          <div className={styles.projectGrid}>
            {webProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={handleWorkItemClick}
              />
            ))}
          </div>
        </div>
        <div ref={gameTabRef} className={`${styles.workTabContent} ${activeWorkTab === 'game' ? styles.activeWorkContent : ''}`}>
          <div className={styles.constellationPanel}>
            <div className={styles.constellationPanelHeader}>
              <span className={styles.constellationKicker}>星轨总览</span>
              <p className={styles.constellationSummary}>命之座按六个节点逐步解封，路径从火花追加、战技压制一路延伸到团队层面的火花共振。</p>
            </div>
            <div className={styles.constellationRail}>
              {gameProjects.map(project => (
                <button
                  key={`rail-${project.id}`}
                  type="button"
                  className={styles.constellationNode}
                  onClick={(e) => handleWorkItemClick(project, e)}
                >
                  <span className={styles.constellationNodeCode}>{project.year}</span>
                  <span className={styles.constellationNodeTitle}>{project.title}</span>
                  <span className={styles.constellationNodeHint}>{project.tech?.[0] || '节点解封'}</span>
                </button>
              ))}
            </div>
          </div>
          <div className={styles.projectGrid}>
            {gameProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={handleWorkItemClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 早期学习折叠区 */}
      {earlyProjects.length > 0 && (
        <div className={styles.earlySection}>
          <div className={styles.appendixPanel}>
            <div className={styles.appendixPanelHeader}>
              <span className={styles.appendixKicker}>附录总览</span>
              <p className={styles.appendixSummary}>这一组条目负责解释“可莉为什么会被这样照看”，以及“那些可爱危险品在现场应该如何被处理”。</p>
            </div>
            <div className={styles.appendixMetaRow}>
              <div className={styles.appendixMetaCard}>
                <span className={styles.appendixMetaLabel}>监护逻辑</span>
                <span className={styles.appendixMetaValue}>陪同、说明边界、温和纠正</span>
              </div>
              <div className={styles.appendixMetaCard}>
                <span className={styles.appendixMetaLabel}>危险品判断</span>
                <span className={styles.appendixMetaValue}>先疏散、再确认、禁止擅自拆解</span>
              </div>
            </div>
          </div>
          <button
            className={`${styles.earlySectionToggle} ${earlyExpanded ? styles.expanded : ''}`}
            onClick={() => setEarlyExpanded(prev => !prev)}
          >
            <span className={styles.earlySectionToggleIcon}>{earlyExpanded ? '▾' : '▸'}</span>
            <span>监护记录 / 附注条目</span>
            <span className={styles.earlySectionCount}>{earlyProjects.length}</span>
          </button>
          <div className={`${styles.earlySectionContent} ${earlyExpanded ? styles.expanded : ''}`}>
            <div className={styles.projectGrid}>
              {earlyProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={handleWorkItemClick}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={styles.earlySection}>
        <button
          className={`${styles.earlySectionToggle} ${skillsExpanded ? styles.expanded : ''}`}
          onClick={() => setSkillsExpanded(prev => !prev)}
        >
          <span className={styles.earlySectionToggleIcon}>{skillsExpanded ? '▾' : '▸'}</span>
          <span>特征索引 / 危险特征</span>
          <span className={styles.earlySectionCount}>
            {skillCategories.reduce((sum, cat) => sum + cat.skills.length, 0)}
          </span>
        </button>
        <div className={`${styles.earlySectionContent} ${skillsExpanded ? styles.expanded : ''}`}>
          <SkillTree categories={skillCategories} expanded={skillsExpanded} />
        </div>
      </div>
    </div>
  );
});

export default WorksSection;
