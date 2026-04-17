import cardStyles from '../../styles/BlogPostCard.module.scss';
import type { BlogPostMeta } from '../../types';

interface StoryRecordListProps {
  posts: BlogPostMeta[];
  onOpen: (slug: string) => void;
  showRecordCodes?: boolean;
}

export default function StoryRecordList({
  posts,
  onOpen,
  showRecordCodes = true,
}: StoryRecordListProps) {
  return (
    <div className={cardStyles.storyRecordList}>
      {posts.map((post, i) => (
        <div
          key={post.slug}
          className={cardStyles.card}
          role="link"
          tabIndex={0}
          data-cursor-no-magnetic
          onClick={() => onOpen(post.slug)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onOpen(post.slug);
          }}
        >
          <div className={cardStyles.cardInner}>
            <span className={cardStyles.cardIndex}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className={cardStyles.cardContent}>
              <div className={cardStyles.cardTopline}>
                {showRecordCodes && (
                  <span className={cardStyles.cardCode}>
                    {`记录-${String(i + 1).padStart(3, '0')}`}
                  </span>
                )}
                {post.date && <span className={cardStyles.cardDate}>{post.date}</span>}
              </div>
              <div className={cardStyles.cardHeader}>
                <h4 className={cardStyles.cardTitle}>{post.title}</h4>
              </div>
              <p className={cardStyles.cardExcerpt}>{post.excerpt}</p>
              <div className={cardStyles.cardFooter}>
                {post.tags.length > 0 ? (
                  <div className={cardStyles.cardTags}>
                    {post.tags.map((tag) => (
                      <span key={tag} className={cardStyles.cardTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span />
                )}
                {post.readingTime && (
                  <span className={cardStyles.cardReadingTime}>{post.readingTime}</span>
                )}
              </div>
            </div>
            <span className={cardStyles.cardArrow}>→</span>
          </div>
        </div>
      ))}
    </div>
  );
}
