import React, { useRef, useState } from 'react';
import styles from '../../styles/WorkDetailView.module.scss';
import Lightbox from '../interactive/Lightbox';

const WorkDetailView = ({ item }) => {
  if (!item) return null;

  const {
    title,
    description,
    summary,
    tech,
    imageUrl,
    link,
    galleryImages,
    articleContent,
    role,
    year,
    status,
    highlights,
    notes,
    dossierCode,
  } = item;

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentLightboxImageIndex, setCurrentLightboxImageIndex] = useState(0);
  const [clickedThumbnailRect, setClickedThumbnailRect] = useState(null);
  const [currentLightboxSourceInfo, setCurrentLightboxSourceInfo] = useState(null);
  const thumbnailRefs = useRef({});

  const paragraphs = articleContent
    ? articleContent.split(/\n\s*\n+/).map((paragraph) => paragraph.trim()).filter(Boolean)
    : [];
  const imagesForGallery = galleryImages || [];
  const imageStyle = imageUrl ? { backgroundImage: `url(${imageUrl})` } : {};

  const openLightbox = (index, event, sourceType = 'thumb') => {
    if (index >= 0 && index < imagesForGallery.length) {
      let rect = null;
      if (event?.currentTarget) {
        rect = event.currentTarget.getBoundingClientRect();
      } else {
        const refKey = `${sourceType}_${index}`;
        const thumb = thumbnailRefs.current[refKey];
        if (thumb) rect = thumb.getBoundingClientRect();
      }

      setClickedThumbnailRect(rect);
      setCurrentLightboxImageIndex(index);
      setCurrentLightboxSourceInfo({ index, type: sourceType });
      setIsLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setCurrentLightboxSourceInfo(null);
    setClickedThumbnailRect(null);
  };

  const showNextImage = () => {
    setClickedThumbnailRect(null);
    setCurrentLightboxImageIndex((current) => (current + 1) % imagesForGallery.length);
  };

  const showPrevImage = () => {
    setClickedThumbnailRect(null);
    setCurrentLightboxImageIndex((current) => (current - 1 + imagesForGallery.length) % imagesForGallery.length);
  };

  const getClosingRect = () => {
    if (!currentLightboxSourceInfo) return null;

    const { index: closingIndex, type: closingType } = currentLightboxSourceInfo;
    const thumb = thumbnailRefs.current[`${closingType}_${closingIndex}`];
    return thumb ? thumb.getBoundingClientRect() : null;
  };

  return (
    <div className={styles.detailContainer}>
      <div className={styles.heroPanel}>
        <div className={styles.heroTopline}>
          <span className={styles.heroCode}>{dossierCode || `KL-ARC-${year || '000'}`}</span>
          {role && <span className={styles.heroType}>{role}</span>}
          {status && <span className={styles.heroStatus}>{status.toUpperCase()}</span>}
        </div>
        <h3 className={styles.detailTitle}>{title}</h3>
        <p className={styles.heroSummary}>{summary || description}</p>

        <div className={styles.detailMetaGrid}>
          {year && (
            <div className={styles.detailMetaCard}>
              <span className={styles.metaLabel}>卷宗编号</span>
              <span className={styles.metaValue}>{year}</span>
            </div>
          )}
          {role && (
            <div className={styles.detailMetaCard}>
              <span className={styles.metaLabel}>卷宗类别</span>
              <span className={styles.metaValue}>{role}</span>
            </div>
          )}
          <div className={styles.detailMetaCard}>
            <span className={styles.metaLabel}>阅读状态</span>
            <span className={styles.metaValue}>已通过监护权限校验</span>
          </div>
        </div>
      </div>

      <div className={styles.detailContent}>
        <div className={styles.detailImageContainer}>
          <div className={styles.detailImage} style={imageStyle}>
            {!imageUrl && <span className={styles.imagePlaceholder}>暂无图像</span>}
            <div className={styles.imageScanlineOverlay}></div>
          </div>
        </div>

        <div className={styles.detailText}>
          <p className={styles.detailDescription}>{description}</p>

          {tech && tech.length > 0 && (
            <div className={styles.detailTechContainer}>
              <span className={styles.techLabel}>关键词</span>
              <div className={styles.detailTechTags}>
                {tech.map((tag) => (
                  <span key={tag} className={styles.detailTechTag}>{tag}</span>
                ))}
              </div>
            </div>
          )}

          {link && link !== '#' && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.detailLink}
            >
              查看条目
            </a>
          )}
        </div>
      </div>

      {highlights && highlights.length > 0 && (
        <section className={styles.detailSection}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionCode}>重点段</span>
            <h4>重点记录</h4>
          </div>
          <div className={styles.highlightList}>
            {highlights.map((highlight) => (
              <p key={highlight} className={styles.highlightItem}>{highlight}</p>
            ))}
          </div>
        </section>
      )}

      {paragraphs.length > 0 && (
        <section className={styles.detailSection}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionCode}>记录段</span>
            <h4>卷宗批注</h4>
          </div>
          <div className={styles.articleSection}>
            {paragraphs.map((paragraph, index) => (
              <p key={index} className={styles.articleParagraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      )}

      {notes && notes.length > 0 && (
        <section className={styles.detailSection}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionCode}>附注段</span>
            <h4>执行提示</h4>
          </div>
          <div className={styles.noteList}>
            {notes.map((note) => (
              <p key={note} className={styles.noteItem}>{note}</p>
            ))}
          </div>
        </section>
      )}

      {imagesForGallery.length > 0 && (
        <section className={styles.detailSection}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionCode}>图像段</span>
            <h4>相关图像</h4>
          </div>
          <div className={styles.thumbnailGrid}>
            {imagesForGallery.map((img, index) => (
              <button
                key={index}
                className={styles.thumbnailButton}
                onClick={(event) => openLightbox(index, event, 'thumb')}
                ref={(el) => {
                  thumbnailRefs.current[`thumb_${index}`] = el;
                }}
              >
                <img
                  src={img.src}
                  alt={img.caption || `${title} thumbnail ${index + 1}`}
                  className={styles.thumbnailImage}
                />
                {img.caption && <span className={styles.thumbnailCaption}>{img.caption}</span>}
              </button>
            ))}
          </div>
        </section>
      )}

      {isLightboxOpen && imagesForGallery.length > 0 && (
        <Lightbox
          image={imagesForGallery[currentLightboxImageIndex]}
          onClose={closeLightbox}
          onPrev={imagesForGallery.length > 1 ? showPrevImage : null}
          onNext={imagesForGallery.length > 1 ? showNextImage : null}
          thumbnailRect={clickedThumbnailRect}
          currentIndex={currentLightboxImageIndex}
          totalImages={imagesForGallery.length}
          getClosingRectForIndex={getClosingRect}
        />
      )}
    </div>
  );
};

export default WorkDetailView;
