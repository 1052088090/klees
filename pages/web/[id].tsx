import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import type { GetStaticPaths, GetStaticProps } from 'next';
import styles from '../../styles/Minecraft.module.scss';
import hudStyles from '../../styles/Home.module.scss';
import { useApp } from '../../contexts/AppContext';
import { useTransition } from '../../contexts/TransitionContext';
import LazyImage from '../../components/shared/LazyImage';
import Lightbox from '../../components/interactive/Lightbox';
import { earlyProjects, gameProjects, webProjects } from '../../data/projects';
import type { Project } from '../../types';

const dossierCollections = [webProjects, gameProjects, earlyProjects];
const allDossierProjects = [...webProjects, ...gameProjects, ...earlyProjects];

const getProjectCollection = (projectId: number) =>
  dossierCollections.find((collection) => collection.some((item) => item.id === projectId)) ?? allDossierProjects;

const getStatusLabel = (status?: Project['status']) => {
  switch (status) {
    case 'shipped':
      return '已核验';
    case 'wip':
      return '持续补录';
    case 'archived':
      return '归档封存';
    default:
      return '限制读取';
  }
};

function useTypingSubtitle(text: string, speed = 100, delay = 1200) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started || displayed.length >= text.length) return;
    const timer = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed);
    return () => clearTimeout(timer);
  }, [started, displayed, text, speed]);

  return { displayed, done: displayed.length >= text.length };
}

interface PageProps {
  project: Project;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = allDossierProjects.map((project) => ({ params: { id: String(project.id) } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const project = allDossierProjects.find((item) => String(item.id) === params?.id);
  if (!project) return { notFound: true };
  return { props: { project } };
};

export default function WebDetailPage({ project }: PageProps) {
  const { isInverted } = useApp();
  const { navigateTo } = useTransition();
  const collection = getProjectCollection(project.id);
  const currentIndex = collection.findIndex((item) => item.id === project.id);
  const prevProject = currentIndex > 0 ? collection[currentIndex - 1] : null;
  const nextProject = currentIndex < collection.length - 1 ? collection[currentIndex + 1] : null;

  const subtitle = useTypingSubtitle(project.description, 120, 2200);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeNav, setActiveNav] = useState('hero');
  const [isPastHero, setIsPastHero] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [lightboxRect, setLightboxRect] = useState<DOMRect | null>(null);

  const paragraphs = project.articleContent
    ? project.articleContent
        .split(/\n\s*\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : [];

  const dossierCode = project.dossierCode || `KL-WEB-${String(project.id).padStart(3, '0')}`;
  const statusLabel = getStatusLabel(project.status);
  const primaryTagLabel = project.id >= 101 && project.id < 200 ? '星轨索引' : '归档字段';
  const notes = project.notes || [];
  const highlights = project.highlights || [];
  const galleryImages = project.galleryImages || [];

  const signalLinks = useMemo(() => {
    const links: { href: string; text: string; sub: string; type: string }[] = [];
    if (project.liveUrl) links.push({ href: project.liveUrl, text: '访问终端', sub: new URL(project.liveUrl).hostname, type: 'external' });
    if (project.githubUrl) links.push({ href: project.githubUrl, text: '参考档案', sub: 'GITHUB', type: 'github' });
    if (project.videoUrl) {
      const urls = Array.isArray(project.videoUrl) ? project.videoUrl : [project.videoUrl];
      urls.forEach((url, index) => {
        const bvMatch = url.match(/BV[\w]+/);
        links.push({ href: url, text: urls.length > 1 ? `影像 ${index + 1}` : '影像记录', sub: bvMatch ? bvMatch[0] : '影像记录', type: 'video' });
      });
    }
    return links;
  }, [project.githubUrl, project.liveUrl, project.videoUrl]);

  const navItems = useMemo(() => {
    const items: { id: string; label: string }[] = [{ id: 'hero', label: '封面' }, { id: 'meta', label: '概要' }];
    if (paragraphs.length > 0) items.push({ id: 'brief', label: '记录' });
    if (notes.length > 0) items.push({ id: 'notes', label: '批注' });
    if (galleryImages.length > 0) items.push({ id: 'archive', label: '图像' });
    if (signalLinks.length > 0) items.push({ id: 'signal', label: '外链' });
    return items;
  }, [galleryImages.length, notes.length, paragraphs.length, signalLinks.length]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('data-nav-id');
          if (id) setActiveNav(id);
        });
      },
      { threshold: 0.3, root: wrapper }
    );

    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.getAttribute('data-nav-id') === 'hero') {
            setIsPastHero(!entry.isIntersecting);
          }
        });
      },
      { threshold: 0.55, root: wrapper }
    );

    Object.values(sectionRefs.current).forEach((element) => {
      if (!element) return;
      navObserver.observe(element);
      if (element.getAttribute('data-nav-id') === 'hero') heroObserver.observe(element);
    });

    return () => {
      navObserver.disconnect();
      heroObserver.disconnect();
    };
  }, [galleryImages.length, notes.length, paragraphs.length, signalLinks.length]);

  const scrollToSection = useCallback((id: string) => {
    const element = sectionRefs.current[id];
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleBack = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      navigateTo('/content#works');
    },
    [navigateTo]
  );

  const openLightbox = (index: number, event: React.MouseEvent) => {
    setLightboxRect((event.currentTarget as HTMLElement).getBoundingClientRect());
    setLightboxIdx(index);
    setLightboxOpen(true);
  };

  const showHero = !project.noHero && !project.isConfidential && !!project.imageUrl;
  const baseCover = project.imageUrl.split('?')[0];
  const invertedCover = project.invertedImageUrl?.split('?')[0];
  const coverImg = isInverted && invertedCover ? invertedCover : baseCover;

  return (
    <div ref={wrapperRef} className={`${styles.pageWrapper} ${isInverted ? hudStyles.inverted : ''}`}>
      <Head>
        <title>{`${project.title} // ${project.role ?? '角色卷宗'}`}</title>
        <meta name="description" content={project.summary || project.description} />
        {showHero && coverImg && <link rel="preload" as="image" href={coverImg} />}
      </Head>

      <div className={styles.mainContent}>
        {showHero ? (
          <section className={styles.hero} ref={(element) => { sectionRefs.current.hero = element; }} data-nav-id="hero">
            <div className={styles.heroBg} style={coverImg ? { backgroundImage: `url(${coverImg})` } : undefined} />
            <div className={styles.heroScanlines} />
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
              <div className={styles.heroRecordStrip}>
                <span className={styles.heroRecordChip}>{`卷宗号 // ${dossierCode}`}</span>
                <span className={styles.heroRecordChip}>{`分类 // ${project.role ?? '角色卷宗'}`}</span>
                <span className={styles.heroRecordChip}>{`状态 // ${statusLabel}`}</span>
              </div>
              <h1 className={styles.heroTitle}>{project.title}</h1>
              <p className={styles.heroSubtitle}>
                {subtitle.displayed}
                {!subtitle.done && <span className={styles.heroCursor} />}
              </p>
            </div>
          </section>
        ) : (
          <section className={styles.compactHeader} ref={(element) => { sectionRefs.current.hero = element; }} data-nav-id="hero">
            <div className={styles.heroRecordStrip}>
              <span className={styles.heroRecordChip}>{`卷宗号 // ${dossierCode}`}</span>
              <span className={styles.heroRecordChip}>{`分类 // ${project.role ?? '角色卷宗'}`}</span>
              <span className={styles.heroRecordChip}>{`状态 // ${statusLabel}`}</span>
            </div>
            <h1 className={styles.compactTitle}>{project.title}</h1>
            <p className={styles.heroSubtitle}>
              {subtitle.displayed}
              {!subtitle.done && <span className={styles.heroCursor} />}
            </p>
          </section>
        )}

        <section className={styles.metaSection} ref={(element) => { sectionRefs.current.meta = element; }} data-nav-id="meta">
          <h2 className={styles.sectionHeader}>// 卷宗概要</h2>
          {project.summary && (
            <div className={styles.summaryPanel}>
              <span className={styles.summaryLabel}>卷宗摘要</span>
              <p className={styles.summaryText}>{project.summary}</p>
            </div>
          )}
          <div className={styles.metaGrid}>
            <div className={styles.metaBlock}>
              <span className={styles.metaLabel}>卷宗编号</span>
              <span className={styles.metaValue}>{dossierCode}</span>
            </div>
            {project.year && (
              <div className={styles.metaBlock}>
                <span className={styles.metaLabel}>{primaryTagLabel}</span>
                <span className={styles.metaValue}>{project.year}</span>
              </div>
            )}
            {project.role && (
              <div className={styles.metaBlock}>
                <span className={styles.metaLabel}>分类</span>
                <span className={styles.metaValue}>{project.role}</span>
              </div>
            )}
            <div className={styles.metaBlock}>
              <span className={styles.metaLabel}>状态</span>
              <span className={`${styles.metaValue} ${styles.statusBadge}`}>{statusLabel}</span>
            </div>
          </div>
          <div className={styles.techRow}>
            {project.tech.map((tag) => (
              <span key={tag} className={styles.techPill}>{tag}</span>
            ))}
          </div>
          {highlights.length > 0 && (
            <div className={styles.highlightBlock}>
              <span className={styles.metaLabel}>重点记录</span>
              <ul className={styles.highlightList}>
                {highlights.map((highlight) => (
                  <li key={highlight} className={`${styles.highlightItem} ${styles.visible}`}>
                    <span className={styles.highlightMarker}>›</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {paragraphs.length > 0 && (
          <section className={styles.timelineSection} ref={(element) => { sectionRefs.current.brief = element; }} data-nav-id="brief">
            <h2 className={styles.sectionHeader}>// 条目记录</h2>
            {paragraphs.map((paragraph, index) => (
              <div key={`${project.id}-paragraph-${index}`} className={`${styles.timelineTextOnly} ${styles.visible}`}>
                <p className={styles.timelineText}>{paragraph}</p>
              </div>
            ))}
          </section>
        )}

        {notes.length > 0 && (
          <section className={styles.notesSection} ref={(element) => { sectionRefs.current.notes = element; }} data-nav-id="notes">
            <h2 className={styles.sectionHeader}>// 卷宗批注</h2>
            <div className={styles.notesGrid}>
              {notes.map((note, index) => (
                <article key={`${project.id}-note-${index}`} className={`${styles.noteCard} ${styles.visible}`}>
                  <span className={styles.noteIndex}>{String(index + 1).padStart(2, '0')}</span>
                  <p className={styles.noteText}>{note}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {galleryImages.length > 0 && (
          <section className={styles.webGallerySection} ref={(element) => { sectionRefs.current.archive = element; }} data-nav-id="archive">
            <h2 className={styles.sectionHeader}>// 图像存档</h2>
            <div className={styles.webGalleryStack}>
              {galleryImages.map((image, index) => {
                const imageSrc = isInverted && image.invertedSrc ? image.invertedSrc : image.src;
                return (
                  <div
                    key={`${project.id}-gallery-${index}`}
                    className={`${image.isMobile ? styles.mobileGalleryItem : styles.webGalleryItem} ${styles.visible}`}
                    onClick={(event) => openLightbox(index, event)}
                  >
                    <LazyImage src={imageSrc} alt={image.caption || `${project.title} gallery ${index + 1}`} quality="high" />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {signalLinks.length > 0 && (
          <section className={styles.linksSection} ref={(element) => { sectionRefs.current.signal = element; }} data-nav-id="signal">
            <h2 className={styles.sectionHeader}>// 外部通道</h2>
            <div className={styles.linksGrid}>
              {signalLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
                  <div className={styles.linkInfo}>
                    <span className={styles.linkTitle}>{link.text}</span>
                    <span className={styles.linkSub}>{link.sub}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        <footer className={styles.footer}>
          {prevProject ? (
            <a href={`/web/${prevProject.id}`} className={`${styles.footerNavButton} ${styles.footerNavPrev}`} onClick={(event) => { event.preventDefault(); navigateTo(`/web/${prevProject.id}`); }}>
              <span className={styles.footerNavArrow}>←</span>
              <span className={styles.footerNavTitle}>{prevProject.title}</span>
            </a>
          ) : (
            <a href="/content#works" className={`${styles.footerNavButton} ${styles.footerNavPrev}`} onClick={handleBack}>
              <span className={styles.footerNavArrow}>←</span>
              <span className={styles.footerNavTitle}>返回档案总页</span>
            </a>
          )}
          {nextProject ? (
            <a href={`/web/${nextProject.id}`} className={`${styles.footerNavButton} ${styles.footerNavNext}`} onClick={(event) => { event.preventDefault(); navigateTo(`/web/${nextProject.id}`); }}>
              <span className={styles.footerNavTitle}>{nextProject.title}</span>
              <span className={styles.footerNavArrow}>→</span>
            </a>
          ) : (
            <a href="/content#works" className={`${styles.footerNavButton} ${styles.footerNavNext}`} onClick={handleBack}>
              <span className={styles.footerNavTitle}>返回档案总页</span>
              <span className={styles.footerNavArrow}>→</span>
            </a>
          )}
        </footer>
      </div>

      <nav className={`${styles.rightNav} ${isPastHero ? styles.visible : ''}`}>
        <button className={styles.rightNavBack} onClick={handleBack} aria-label="返回档案总页" />
        <div className={styles.rightNavDivider} />
        {navItems.map((nav) => (
          <button key={nav.id} className={`${styles.rightNavLink} ${activeNav === nav.id ? styles.active : ''}`} onClick={() => scrollToSection(nav.id)}>
            {nav.label}
          </button>
        ))}
      </nav>

      {lightboxOpen && galleryImages.length > 0 && (
        <Lightbox
          image={isInverted && galleryImages[lightboxIdx].invertedSrc ? { ...galleryImages[lightboxIdx], src: galleryImages[lightboxIdx].invertedSrc! } : galleryImages[lightboxIdx]}
          onClose={() => setLightboxOpen(false)}
          onPrev={galleryImages.length > 1 ? () => setLightboxIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length) : null}
          onNext={galleryImages.length > 1 ? () => setLightboxIdx((prev) => (prev + 1) % galleryImages.length) : null}
          thumbnailRect={lightboxRect}
          currentIndex={lightboxIdx}
          totalImages={galleryImages.length}
          getClosingRectForIndex={() => null}
        />
      )}
    </div>
  );
}
