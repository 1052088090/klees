import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import gsap from 'gsap';
import type { GetStaticPaths, GetStaticProps } from 'next';
import styles from '../../styles/Minecraft.module.scss';
import hudStyles from '../../styles/Home.module.scss';
import { useApp } from '../../contexts/AppContext';
import { useTransition } from '../../contexts/TransitionContext';
import LazyImage from '../../components/shared/LazyImage';
import Lightbox from '../../components/interactive/Lightbox';
import { gameData, otherData, travelData } from '../../data/life';
import type { LifeItem } from '../../types';

const allItems: LifeItem[] = [...gameData, ...travelData, ...otherData];

function useScrollReveal(rootRef: React.RefObject<HTMLElement | null>) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number(entry.target.getAttribute('data-reveal-idx'));
          if (Number.isNaN(idx)) return;
          setVisible((prev) => new Set(prev).add(idx));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px', root: rootRef.current }
    );

    refs.current.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [ready, rootRef]);

  const setRef = useCallback((idx: number) => (element: HTMLElement | null) => {
    refs.current[idx] = element;
  }, []);

  return { visible, setRef };
}

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
  }, [displayed, speed, started, text]);

  return { displayed, done: displayed.length >= text.length };
}

interface PageProps {
  item: LifeItem;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = allItems.map((item) => ({ params: { slug: item.id } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const item = allItems.find((entry) => entry.id === params?.slug);
  if (!item) return { notFound: true };
  return { props: { item } };
};

export default function LifeDetailPage({ item }: PageProps) {
  return <LifeDetailContent key={item.id} item={item} />;
}

function LifeDetailContent({ item }: PageProps) {
  const { isInverted } = useApp();
  const { navigateTo } = useTransition();

  const currentIndex = allItems.findIndex((entry) => entry.id === item.id);
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  const subtitle = useTypingSubtitle(item.description, 120, 2200);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { visible, setRef } = useScrollReveal(wrapperRef);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const thumbRefs = useRef<Record<string, HTMLElement | null>>({});

  const paragraphs = item.articleContent
    ? item.articleContent
        .split(/\n\s*\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : [];

  const galleryImages = item.galleryImages || [];
  const links = item.links || [];
  const notes = item.notes || [];
  const dossierCode = item.dossierCode || `KL-IMG-${String(currentIndex + 1).padStart(2, '0')}`;

  const [activeNav, setActiveNav] = useState('hero');
  const [isPastHero, setIsPastHero] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [lightboxRect, setLightboxRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const background = heroBgRef.current;
    if (!wrapper || !background) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        background.style.transform = `translateY(${wrapper.scrollTop * 0.35}px)`;
      });
    };

    const timer = setTimeout(() => {
      wrapper.addEventListener('scroll', onScroll, { passive: true });
    }, 100);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      wrapper.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!titleRef.current) return;

    const timer = setTimeout(() => {
      if (!titleRef.current) return;
      const wrappers = titleRef.current.querySelectorAll(`.${styles.charWrapper}`);
      const inners = titleRef.current.querySelectorAll(`.${styles.charInner}`);

      wrappers.forEach((wrapper, index) => {
        const inner = inners[index];
        gsap.set(wrapper, { overflow: 'hidden', display: 'inline-block', position: 'relative', verticalAlign: 'top' });
        gsap.set(inner, { y: '110%', opacity: 0, display: 'inline-block' });
        gsap.to(inner, {
          y: '0%',
          opacity: 1,
          duration: 0.6,
          delay: 0.6 + index * 0.08,
          ease: 'power3.out',
        });
      });
    }, 50);

    return () => clearTimeout(timer);
  }, []);

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
  }, [galleryImages.length, links.length, notes.length, paragraphs.length]);

  const handleBack = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      navigateTo('/content#life');
    },
    [navigateTo]
  );

  const scrollToSection = useCallback((id: string) => {
    const element = sectionRefs.current[id];
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const navItems = useMemo(() => {
    const items: { id: string; label: string }[] = [
      { id: 'hero', label: '封面' },
      { id: 'meta', label: '概要' },
    ];
    if (paragraphs.length > 0) items.push({ id: 'story', label: '记录' });
    if (notes.length > 0) items.push({ id: 'notes', label: '批注' });
    if (galleryImages.length > 0) items.push({ id: 'archive', label: '图像' });
    if (links.length > 0) items.push({ id: 'links', label: '外链' });
    return items;
  }, [galleryImages.length, links.length, notes.length, paragraphs.length]);

  const openLightbox = (index: number, event: React.MouseEvent) => {
    setLightboxRect((event.currentTarget as HTMLElement).getBoundingClientRect());
    setLightboxIdx(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);
  const nextImage = () => {
    setLightboxIdx((prev) => (prev + 1) % galleryImages.length);
    setLightboxRect(null);
  };
  const prevImage = () => {
    setLightboxIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    setLightboxRect(null);
  };
  const getClosingRect = () => {
    const thumb = thumbRefs.current[`gallery_${lightboxIdx}`];
    return thumb ? thumb.getBoundingClientRect() : null;
  };

  const coverImg = item.imageUrl.split('?')[0];
  let revealIdx = 0;

  return (
    <div ref={wrapperRef} className={`${styles.pageWrapper} ${isInverted ? hudStyles.inverted : ''}`}>
      <Head>
        <title>{`${item.title} // 图像卷宗`}</title>
        <meta name="description" content={item.description} />
        <link rel="preload" as="image" href={coverImg} />
      </Head>

      <div className={styles.mainContent}>
        <section
          className={styles.hero}
          ref={(element) => {
            sectionRefs.current.hero = element;
          }}
          data-nav-id="hero"
        >
          <div ref={heroBgRef} className={styles.heroBg} style={{ backgroundImage: `url(${coverImg})` }} />
          <div className={styles.heroScanlines} />
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <div className={styles.heroRecordStrip}>
              <span className={styles.heroRecordChip}>{`卷宗号 // ${dossierCode}`}</span>
              <span className={styles.heroRecordChip}>分类 // 图像卷宗</span>
              <span className={styles.heroRecordChip}>状态 // 可读取</span>
            </div>
            <h1 ref={titleRef} className={styles.heroTitle}>
              {item.title.split('').map((char, index) => (
                <span key={`title-${index}`} className={styles.charWrapper}>
                  <span className={styles.charInner}>{char === ' ' ? '\u00A0' : char}</span>
                </span>
              ))}
            </h1>
            <p className={styles.heroSubtitle}>
              {subtitle.displayed}
              {!subtitle.done && <span className={styles.heroCursor} />}
            </p>
          </div>
        </section>

        <section
          className={styles.metaSection}
          ref={(element) => {
            sectionRefs.current.meta = element;
          }}
          data-nav-id="meta"
        >
          <h2 className={styles.sectionHeader}>// 卷宗概要</h2>
          {item.summary && (
            <div className={styles.summaryPanel}>
              <span className={styles.summaryLabel}>图像摘要</span>
              <p className={styles.summaryText}>{item.summary}</p>
            </div>
          )}
          <div className={styles.metaGrid}>
            <div className={styles.metaBlock}>
              <span className={styles.metaLabel}>卷宗编号</span>
              <span className={styles.metaValue}>{dossierCode}</span>
            </div>
            <div className={styles.metaBlock}>
              <span className={styles.metaLabel}>素材分类</span>
              <span className={styles.metaValue}>图像卷宗</span>
            </div>
            <div className={styles.metaBlock}>
              <span className={styles.metaLabel}>图像数量</span>
              <span className={styles.metaValue}>{galleryImages.length} 份</span>
            </div>
          </div>
          <div className={styles.techRow}>
            {item.tech.map((tag) => (
              <span key={tag} className={styles.techPill}>
                {tag}
              </span>
            ))}
          </div>
        </section>

        {paragraphs.length > 0 && (
          <section
            className={styles.timelineSection}
            ref={(element) => {
              sectionRefs.current.story = element;
            }}
            data-nav-id="story"
          >
            <h2 className={styles.sectionHeader}>// 图像说明</h2>
            {paragraphs.map((paragraph, index) => {
              const currentRevealIdx = revealIdx++;
              return (
                <div
                  key={`${item.id}-paragraph-${index}`}
                  className={`${styles.timelineTextOnly} ${visible.has(currentRevealIdx) ? styles.visible : ''}`}
                  data-reveal-idx={currentRevealIdx}
                  ref={setRef(currentRevealIdx)}
                >
                  <p className={styles.timelineText}>{paragraph}</p>
                </div>
              );
            })}
          </section>
        )}

        {notes.length > 0 && (
          <section
            className={styles.notesSection}
            ref={(element) => {
              sectionRefs.current.notes = element;
            }}
            data-nav-id="notes"
          >
            <h2 className={styles.sectionHeader}>// 卷宗批注</h2>
            <div className={styles.notesGrid}>
              {notes.map((note, index) => (
                <article key={`${item.id}-note-${index}`} className={styles.noteCard}>
                  <span className={styles.noteIndex}>{String(index + 1).padStart(2, '0')}</span>
                  <p className={styles.noteText}>{note}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {galleryImages.length > 0 && (
          <section
            className={styles.gallerySection}
            ref={(element) => {
              sectionRefs.current.archive = element;
            }}
            data-nav-id="archive"
          >
            <h2 className={styles.sectionHeader}>// 图像存档</h2>
            <div className={styles.galleryGrid}>
              {galleryImages.map((image, index) => {
                const currentRevealIdx = revealIdx++;
                return (
                  <div
                    key={`${item.id}-gallery-${index}`}
                    className={styles.galleryItem}
                    onClick={(event) => openLightbox(index, event)}
                    ref={(element) => {
                      thumbRefs.current[`gallery_${index}`] = element;
                      setRef(currentRevealIdx)(element);
                    }}
                    data-reveal-idx={currentRevealIdx}
                  >
                    <LazyImage src={image.src} alt={image.caption || `${item.title} gallery ${index + 1}`} quality="medium" />
                    <div className={styles.galleryOverlay} />
                    <div className={styles.galleryCornerTL} />
                    <div className={styles.galleryCornerBR} />
                    {image.caption && <div className={styles.galleryCaption}>{image.caption}</div>}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {links.length > 0 && (
          <section
            className={styles.linksSection}
            ref={(element) => {
              sectionRefs.current.links = element;
            }}
            data-nav-id="links"
          >
            <h2 className={styles.sectionHeader}>// 外部通道</h2>
            <div className={styles.linksGrid}>
              {links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
                  <div className={styles.linkIconWrap}>
                    <svg className={styles.linkIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path fill="currentColor" d="M18.223 3.086a1.25 1.25 0 0 1 0 1.768L17.08 5.996h1.17A3.75 3.75 0 0 1 22 9.747v7.5a3.75 3.75 0 0 1-3.75 3.75H5.75A3.75 3.75 0 0 1 2 17.247v-7.5a3.75 3.75 0 0 1 3.75-3.75h1.166L5.775 4.855a1.25 1.25 0 1 1 1.767-1.768l2.652 2.652c.079.079.145.165.198.257h3.213c.053-.092.12-.18.199-.258l2.651-2.652a1.25 1.25 0 0 1 1.768 0zm.027 5.42H5.75a1.25 1.25 0 0 0-1.247 1.157l-.003.094v7.5c0 .659.51 1.199 1.157 1.246l.093.004h12.5a1.25 1.25 0 0 0 1.247-1.157l.003-.093v-7.5c0-.69-.56-1.25-1.25-1.25zm-10 2.5c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25zm7.5 0c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25z" />
                    </svg>
                  </div>
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
          {prevItem ? (
            <a
              href={`/life/${prevItem.id}`}
              className={`${styles.footerNavButton} ${styles.footerNavPrev}`}
              onClick={(event) => {
                event.preventDefault();
                navigateTo(`/life/${prevItem.id}`);
              }}
              data-cursor-label="上一条"
            >
              <span className={styles.footerNavArrow}>←</span>
              <span className={styles.footerNavTitle}>{prevItem.title}</span>
            </a>
          ) : (
            <a href="/content#life" className={`${styles.footerNavButton} ${styles.footerNavPrev}`} onClick={handleBack} data-cursor-label="返回">
              <span className={styles.footerNavArrow}>←</span>
              <span className={styles.footerNavTitle}>返回图像档案</span>
            </a>
          )}

          {nextItem ? (
            <a
              href={`/life/${nextItem.id}`}
              className={`${styles.footerNavButton} ${styles.footerNavNext}`}
              onClick={(event) => {
                event.preventDefault();
                navigateTo(`/life/${nextItem.id}`);
              }}
              data-cursor-label="下一条"
            >
              <span className={styles.footerNavTitle}>{nextItem.title}</span>
              <span className={styles.footerNavArrow}>→</span>
            </a>
          ) : (
            <a href="/content#life" className={`${styles.footerNavButton} ${styles.footerNavNext}`} onClick={handleBack} data-cursor-label="返回">
              <span className={styles.footerNavTitle}>返回图像档案</span>
              <span className={styles.footerNavArrow}>→</span>
            </a>
          )}
        </footer>
      </div>

      <nav className={`${styles.rightNav} ${isPastHero ? styles.visible : ''}`}>
        <button className={styles.rightNavBack} onClick={handleBack} data-cursor-label="返回" aria-label="返回图像档案" />
        <div className={styles.rightNavDivider} />
        {navItems.map((nav) => (
          <button
            key={nav.id}
            className={`${styles.rightNavLink} ${activeNav === nav.id ? styles.active : ''}`}
            onClick={() => scrollToSection(nav.id)}
          >
            {nav.label}
          </button>
        ))}
      </nav>

      {lightboxOpen && galleryImages.length > 0 && (
        <Lightbox
          image={galleryImages[lightboxIdx]}
          onClose={closeLightbox}
          onPrev={galleryImages.length > 1 ? prevImage : null}
          onNext={galleryImages.length > 1 ? nextImage : null}
          thumbnailRect={lightboxRect}
          currentIndex={lightboxIdx}
          totalImages={galleryImages.length}
          getClosingRectForIndex={getClosingRect}
        />
      )}
    </div>
  );
}
