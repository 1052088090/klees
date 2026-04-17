import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import gsap from 'gsap';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import MDXComponents from '../../components/mdx/MDXComponents';
import { getAllPosts, getPostBySlug, getPostSlugs } from '../../lib/blog';
import type { BlogPostMeta } from '../../types';
import styles from '../../styles/BlogDetailView.module.scss';
import hudStyles from '../../styles/Home.module.scss';
import { useApp } from '../../contexts/AppContext';
import { useTransition } from '../../contexts/TransitionContext';

interface BlogPostPageProps {
  meta: BlogPostMeta;
  mdxSource: MDXRemoteSerializeResult;
  allPosts: BlogPostMeta[];
}

const formatReadingTime = (value: string) => {
  const match = value.match(/(\d+)/);
  if (!match) return value;
  return `${match[1]} 分钟阅读`;
};

export default function BlogPostPage({ meta, mdxSource, allPosts }: BlogPostPageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <BlogLoadingShell />;
  }

  return <BlogDetailContent key={meta.slug} meta={meta} mdxSource={mdxSource} allPosts={allPosts} />;
}

function BlogLoadingShell() {
  const { isInverted } = useApp();

  return (
    <div className={`${styles.pageWrapper} ${isInverted ? hudStyles.inverted : ''}`}>
      <Head>
        <title>故事卷宗读取中</title>
      </Head>
      <div className={styles.mainContent}>
        <header className={`${styles.headerSection} ${styles.entered}`}>
          <div className={styles.headerContent}>
            <span className={styles.headerSignal}>// 故事卷宗</span>
            <h1 className={styles.headerTitle}>正在展开记录</h1>
          </div>
        </header>
        <section className={styles.contentSection}>
          <div className={styles.loadingIndicator}>
            <span className={styles.loadingText}>正在读取故事条目...</span>
          </div>
        </section>
      </div>
    </div>
  );
}

function BlogDetailContent({ meta, mdxSource, allPosts }: BlogPostPageProps) {
  const { isInverted } = useApp();
  const { navigateTo } = useTransition();

  const currentIndex = allPosts.findIndex((post) => post.slug === meta.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentBodyRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const [entered, setEntered] = useState(false);
  const [titleDone, setTitleDone] = useState(false);
  const [activeNav, setActiveNav] = useState('header');
  const [isPastHeader, setIsPastHeader] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!titleRef.current) {
      setTitleDone(true);
      return;
    }

    const timer = setTimeout(() => {
      if (!titleRef.current) {
        setTitleDone(true);
        return;
      }

      const wrappers = titleRef.current.querySelectorAll(`.${styles.charWrapper}`);
      const inners = titleRef.current.querySelectorAll(`.${styles.charInner}`);
      if (inners.length === 0) {
        setTitleDone(true);
        return;
      }

      wrappers.forEach((wrapper, index) => {
        const inner = inners[index];
        gsap.set(wrapper, { overflow: 'hidden', display: 'inline-block', position: 'relative', verticalAlign: 'top' });
        gsap.set(inner, { y: '110%', opacity: 0, display: 'inline-block' });
        gsap.to(inner, {
          y: '0%',
          opacity: 1,
          duration: 0.6,
          delay: 0.4 + index * 0.06,
          ease: 'power3.out',
          onComplete: index === inners.length - 1 ? () => setTitleDone(true) : undefined,
        });
      });
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!titleDone) return;
    const body = contentBodyRef.current;
    const wrapper = wrapperRef.current;
    if (!body || !wrapper) return;

    const children = Array.from(body.children) as HTMLElement[];
    if (children.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.filter((entry) => entry.isIntersecting);
        entering.forEach((entry, index) => {
          const element = entry.target as HTMLElement;
          element.style.transitionDelay = `${index * 0.07}s`;
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          observer.unobserve(element);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px', root: wrapper }
    );

    const timer = setTimeout(() => {
      children.forEach((child) => observer.observe(child));
    }, 180);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [titleDone]);

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

    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.getAttribute('data-nav-id') === 'header') {
            setIsPastHeader(!entry.isIntersecting);
          }
        });
      },
      { threshold: 0.55, root: wrapper }
    );

    Object.values(sectionRefs.current).forEach((element) => {
      if (!element) return;
      navObserver.observe(element);
      if (element.getAttribute('data-nav-id') === 'header') {
        headerObserver.observe(element);
      }
    });

    return () => {
      navObserver.disconnect();
      headerObserver.disconnect();
    };
  }, []);

  const handleBack = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      navigateTo('/blog');
    },
    [navigateTo]
  );

  const scrollToSection = useCallback((id: string) => {
    const element = sectionRefs.current[id];
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const navItems = useMemo(
    () => [
      { id: 'header', label: '封面' },
      { id: 'summary', label: '概要' },
      { id: 'content', label: '正文' },
      ...(meta.notes && meta.notes.length > 0 ? [{ id: 'notes', label: '批注' }] : []),
      { id: 'end', label: '尾注' },
    ],
    [meta.notes]
  );

  return (
    <div ref={wrapperRef} className={`${styles.pageWrapper} ${isInverted ? hudStyles.inverted : ''}`}>
      <Head>
        <title>{`${meta.title} // 故事卷宗`}</title>
        <meta name="description" content={meta.excerpt} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/blog/${meta.slug}`} />
        <meta property="article:published_time" content={meta.date} />
        {meta.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Head>

      <div className={styles.mainContent}>
        <header
          className={`${styles.headerSection} ${entered ? styles.entered : ''}`}
          ref={(element) => {
            sectionRefs.current.header = element;
          }}
          data-nav-id="header"
        >
          <div className={styles.headerContent}>
            <span className={styles.headerSignal}>// 故事卷宗</span>
            <h1 ref={titleRef} className={styles.headerTitle}>
              {meta.title.split('').map((char, index) => (
                <span key={`title-${index}`} className={styles.charWrapper}>
                  <span className={styles.charInner}>{char === ' ' ? '\u00A0' : char}</span>
                </span>
              ))}
            </h1>
            <div className={styles.headerMeta}>
              {meta.date && <span className={styles.headerDate}>{meta.date}</span>}
              {meta.readingTime && <span className={styles.headerReadingTime}>{formatReadingTime(meta.readingTime)}</span>}
            </div>
            <div className={styles.headerChips}>
              {meta.dossierCode && <span className={styles.headerChip}>卷宗号 // {meta.dossierCode}</span>}
              {meta.recordType && <span className={styles.headerChip}>类型 // {meta.recordType}</span>}
              {meta.relation && <span className={styles.headerChip}>关系 // {meta.relation}</span>}
            </div>
            {meta.tags.length > 0 && (
              <div className={styles.headerTags}>
                {meta.tags.map((tag) => (
                  <span key={tag} className={styles.headerTag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <section
          className={styles.metaSection}
          ref={(element) => {
            sectionRefs.current.summary = element;
          }}
          data-nav-id="summary"
        >
          <div className={styles.metaHeader}>
            <span className={styles.metaSignal}>// 卷宗概要</span>
          </div>

          <div className={styles.summaryPanel}>
            <span className={styles.summaryLabel}>记录摘要</span>
            <p className={styles.summaryText}>{meta.summary || meta.excerpt}</p>
          </div>

          <div className={styles.metaGrid}>
            <div className={styles.metaBlock}>
              <span className={styles.metaLabel}>卷宗编号</span>
              <span className={styles.metaValue}>{meta.dossierCode || '--'}</span>
            </div>
            <div className={styles.metaBlock}>
              <span className={styles.metaLabel}>记录类型</span>
              <span className={styles.metaValue}>{meta.recordType || '故事卷宗'}</span>
            </div>
            <div className={styles.metaBlock}>
              <span className={styles.metaLabel}>关系定位</span>
              <span className={styles.metaValue}>{meta.relation || '角色记录'}</span>
            </div>
            <div className={styles.metaBlock}>
              <span className={styles.metaLabel}>阅读时长</span>
              <span className={styles.metaValue}>{meta.readingTime ? formatReadingTime(meta.readingTime) : '--'}</span>
            </div>
          </div>

          {meta.tags.length > 0 && (
            <div className={styles.metaTags}>
              {meta.tags.map((tag) => (
                <span key={`meta-${tag}`} className={styles.metaTag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </section>

        <section
          className={styles.contentSection}
          ref={(element) => {
            sectionRefs.current.content = element;
          }}
          data-nav-id="content"
        >
          <div className={`${styles.loadingIndicator} ${titleDone ? styles.hidden : ''}`}>
            <span className={styles.loadingText}>正在展开卷宗内容...</span>
          </div>
          <div ref={contentBodyRef} className={styles.contentBody}>
            <MDXRemote {...mdxSource} components={MDXComponents} />
          </div>
        </section>

        {meta.notes && meta.notes.length > 0 && (
          <section
            className={styles.notesSection}
            ref={(element) => {
              sectionRefs.current.notes = element;
            }}
            data-nav-id="notes"
          >
            <div className={styles.metaHeader}>
              <span className={styles.metaSignal}>// 记录批注</span>
            </div>

            <div className={styles.notesGrid}>
              {meta.notes.map((note, index) => (
                <article key={`${meta.slug}-note-${index}`} className={styles.noteCard}>
                  <span className={styles.noteIndex}>{String(index + 1).padStart(2, '0')}</span>
                  <p className={styles.noteText}>{note}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <footer
          className={`${styles.footer} ${entered ? styles.entered : ''}`}
          ref={(element) => {
            sectionRefs.current.end = element;
          }}
          data-nav-id="end"
        >
          <div className={styles.endMarker}>
            <span className={styles.endSignal}>// 记录归档完毕</span>
          </div>
          <div className={styles.footerNav}>
            {prevPost ? (
              <a
                href={`/blog/${prevPost.slug}`}
                className={`${styles.footerNavButton} ${styles.footerNavPrev}`}
                onClick={(event) => {
                  event.preventDefault();
                  navigateTo(`/blog/${prevPost.slug}`);
                }}
                data-cursor-label="上一条"
              >
                <span className={styles.footerNavArrow}>←</span>
                <span className={styles.footerNavTitle}>{prevPost.title}</span>
              </a>
            ) : (
              <a href="/blog" className={`${styles.footerNavButton} ${styles.footerNavPrev}`} onClick={handleBack} data-cursor-label="返回">
                <span className={styles.footerNavArrow}>←</span>
                <span className={styles.footerNavTitle}>返回记录索引</span>
              </a>
            )}

            {nextPost ? (
              <a
                href={`/blog/${nextPost.slug}`}
                className={`${styles.footerNavButton} ${styles.footerNavNext}`}
                onClick={(event) => {
                  event.preventDefault();
                  navigateTo(`/blog/${nextPost.slug}`);
                }}
                data-cursor-label="下一条"
              >
                <span className={styles.footerNavTitle}>{nextPost.title}</span>
                <span className={styles.footerNavArrow}>→</span>
              </a>
            ) : (
              <a href="/blog" className={`${styles.footerNavButton} ${styles.footerNavNext}`} onClick={handleBack} data-cursor-label="返回">
                <span className={styles.footerNavTitle}>返回记录索引</span>
                <span className={styles.footerNavArrow}>→</span>
              </a>
            )}
          </div>
        </footer>
      </div>

      <nav className={`${styles.rightNav} ${isPastHeader ? styles.visible : ''}`}>
        <button className={styles.rightNavBack} onClick={handleBack} data-cursor-label="返回" aria-label="返回记录索引" />
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
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getPostSlugs();
  const paths = slugs.map((slug) => ({ params: { slug } }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  try {
    const { meta, content } = getPostBySlug(slug);
    const mdxSource = await serialize(content);
    const allPosts = getAllPosts();
    return { props: { meta, mdxSource, allPosts } };
  } catch {
    return { notFound: true };
  }
};
