import Head from 'next/head';
import SectionPageLayout from '../components/layout/SectionPageLayout';
import styles from '../styles/Home.module.scss';
import { friendLinksData } from '../data/friendLinks';

export default function FriendsPage() {
  return (
    <>
      <Head>
        <title>关系卷宗</title>
        <meta name="description" content="整理可莉的监护链、信赖对象与高影响关系人物，作为骑士团附录卷宗索引。" />
      </Head>
      <SectionPageLayout>
        <div className={styles.friendLinkSection}>
          <header className={styles.friendLinkHeader}>
            <span className={styles.friendLinkKicker}>附录卷宗 // 关系索引</span>
            <h2>关系卷宗</h2>
            <p className={styles.friendLinkSummary}>
              记录可莉的直接监护人、稳定信赖对象与高影响关系人物。这里不是泛泛的人物列表，而是骑士团在卷宗中真正会反复引用的关系链。
            </p>
            <div className={styles.friendLinkMetaRow}>
              <div className={styles.friendLinkMetaItem}>
                <span className={styles.friendLinkMetaLabel}>当前索引</span>
                <span className={styles.friendLinkMetaValue}>{friendLinksData.length} 份关系卷宗</span>
              </div>
              <div className={styles.friendLinkMetaItem}>
                <span className={styles.friendLinkMetaLabel}>判定重点</span>
                <span className={styles.friendLinkMetaValue}>监护 / 影响 / 善后</span>
              </div>
              <div className={styles.friendLinkMetaItem}>
                <span className={styles.friendLinkMetaLabel}>阅读建议</span>
                <span className={styles.friendLinkMetaValue}>先看琴，再读其余关系链</span>
              </div>
            </div>
          </header>
          <div className={styles.friendLinkGrid}>
            {friendLinksData.map((link) => (
              <article
                key={link.id}
                className={styles.friendLinkCard}
                data-cursor-no-magnetic
              >
                <div className={styles.friendLinkCardTop}>
                  <span className={styles.friendLinkCode}>{link.dossierCode}</span>
                  <span className={styles.friendLinkStatus}>{link.status}</span>
                </div>

                <div className={styles.friendLinkCardBody}>
                  <div className={styles.friendLinkAvatar}>
                    <img src={link.avatar} alt={link.name} />
                  </div>
                  <div className={styles.friendLinkInfo}>
                    <span className={styles.friendLinkRole}>{link.role}</span>
                    <h3>{link.name}</h3>
                    <p>{link.description}</p>
                  </div>
                </div>

                <div className={styles.friendLinkRelationRow}>
                  <span className={styles.friendLinkRelationLabel}>关系定位</span>
                  <span className={styles.friendLinkRelationValue}>{link.relation}</span>
                </div>

                {link.notes && link.notes.length > 0 && (
                  <div className={styles.friendLinkNotes}>
                    {link.notes.map((note) => (
                      <p key={note} className={styles.friendLinkNote}>
                        {note}
                      </p>
                    ))}
                  </div>
                )}

                {link.keywords && link.keywords.length > 0 && (
                  <div className={styles.friendLinkKeywords}>
                    {link.keywords.map((keyword) => (
                      <span key={keyword} className={styles.friendLinkKeyword}>
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </SectionPageLayout>
    </>
  );
}
