import Head from 'next/head';
import type { GetStaticProps } from 'next';
import { useTransition } from '../contexts/TransitionContext';
import SectionPageLayout from '../components/layout/SectionPageLayout';
import StoryRecordList from '../components/blog/StoryRecordList';
import { getAllPosts } from '../lib/blog';
import type { BlogPostMeta } from '../types';
import styles from '../styles/BlogView.module.scss';

interface BlogIndexPageProps {
  posts: BlogPostMeta[];
}

export default function BlogIndexPage({ posts }: BlogIndexPageProps) {
  const { navigateTo } = useTransition();
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  return (
    <>
      <Head>
        <title>故事卷宗</title>
        <meta
          name="description"
          content="整理可莉相关的角色故事、禁闭室摘录与语音式记录，作为独立的故事卷宗索引。"
        />
      </Head>
      <SectionPageLayout>
        <section className={styles.storyArchivePage}>
          <header className={styles.storyArchiveHeader}>
            <span className={styles.storyArchiveKicker}>附录卷宗 // 故事与语音索引</span>
            <h1 className={styles.storyArchiveTitle}>故事卷宗</h1>
            <p className={styles.storyArchiveSummary}>
              这里存放比基础档案更柔软的部分：角色故事、禁闭室摘录、骑士团口头记录和旁注。每一条都不是系统说明，而是帮助读者理解可莉为什么会被如此温柔地保护。
            </p>

            <div className={styles.storyArchiveMetaRow}>
              <div className={styles.storyArchiveMetaItem}>
                <span className={styles.storyArchiveMetaLabel}>已收录</span>
                <span className={styles.storyArchiveMetaValue}>{posts.length} 条故事记录</span>
              </div>
              <div className={styles.storyArchiveMetaItem}>
                <span className={styles.storyArchiveMetaLabel}>主类别</span>
                <span className={styles.storyArchiveMetaValue}>人物观察 / 禁闭室 / 骑士团</span>
              </div>
              <div className={styles.storyArchiveMetaItem}>
                <span className={styles.storyArchiveMetaLabel}>阅读建议</span>
                <span className={styles.storyArchiveMetaValue}>先读人物，再读处理记录</span>
              </div>
            </div>

            <div className={styles.storyArchiveTagRow}>
              {allTags.map((tag) => (
                <span key={tag} className={styles.storyArchiveTag}>
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className={styles.storyArchiveList}>
            <StoryRecordList posts={posts} onOpen={(slug) => navigateTo(`/blog/${slug}`)} />
          </div>

          <footer className={styles.storyArchiveFooter}>
            <span className={styles.storyArchiveFooterLabel}>骑士团旁注</span>
            <p className={styles.storyArchiveFooterText}>
              这些记录并不追求完整百科化，而更像一组有顺序的情感档案。后续补入角色语音、关系摘录和活动故事时，可以继续沿用同一结构追加。
            </p>
          </footer>
        </section>
      </SectionPageLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps<BlogIndexPageProps> = async () => {
  const posts = getAllPosts();
  return {
    props: {
      posts,
    },
  };
};
