import { type RefObject } from 'react';
import styles from '../../styles/Home.module.scss';
import StoryRecordList from '../blog/StoryRecordList';
import type { BlogPostMeta } from '../../types';

interface BlogSectionProps {
  blogSectionRef: RefObject<HTMLDivElement>;
  posts: BlogPostMeta[];
  handleBlogItemClick: (slug: string) => void;
}

export default function BlogSection({
  blogSectionRef,
  posts,
  handleBlogItemClick,
}: BlogSectionProps) {
  return (
    <div ref={blogSectionRef} className={styles.contentSection}>
      <h2>故事记录</h2>
      <div className={styles.sectionLead}>
        <span className={styles.sectionCode}>卷宗-003 // 故事记录</span>
        <p className={styles.sectionSummary}>收录角色故事、语音摘录与卷宗旁注，用来补足火花骑士的情感面貌。</p>
      </div>
      <div style={{ width: '100%', marginTop: '20px' }}>
        <StoryRecordList posts={posts} onOpen={handleBlogItemClick} />
      </div>
    </div>
  );
}
