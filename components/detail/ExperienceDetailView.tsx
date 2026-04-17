import React, { useRef, useState } from 'react';
import styles from '../../styles/ExperienceDetailView.module.scss';
import Lightbox from '../interactive/Lightbox';

const ExperienceDetailView = ({ item }) => {
  if (!item) return null;

  const {
    title,
    duration,
    location,
    details,
    galleryImages,
    category,
    summary,
    notes,
    keywords,
  } = item;

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentLightboxImageIndex, setCurrentLightboxImageIndex] = useState(0);
  const [clickedThumbnailRect, setClickedThumbnailRect] = useState(null);
  const [currentLightboxSourceInfo, setCurrentLightboxSourceInfo] = useState(null);
  const thumbnailRefs = useRef({});

  const imagesForGallery = galleryImages || [];

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
    const nextIndex = (currentLightboxImageIndex + 1) % imagesForGallery.length;
    setClickedThumbnailRect(null);
    setCurrentLightboxImageIndex(nextIndex);
  };

  const showPrevImage = () => {
    const prevIndex = (currentLightboxImageIndex - 1 + imagesForGallery.length) % imagesForGallery.length;
    setClickedThumbnailRect(null);
    setCurrentLightboxImageIndex(prevIndex);
  };

  const getClosingRect = () => {
    if (!currentLightboxSourceInfo) return null;

    const { index: closingIndex, type: closingType } = currentLightboxSourceInfo;
    const refKey = `${closingType}_${closingIndex}`;
    const thumb = thumbnailRefs.current[refKey];

    return thumb ? thumb.getBoundingClientRect() : null;
  };

  return (
    <div className={styles.detailContainer}>
      <div className={styles.heroPanel}>
        <div className={styles.heroTopline}>
          <span className={styles.heroCode}>{duration || 'TALENT-ARCHIVE'}</span>
          {category && <span className={styles.heroCategory}>{category}</span>}
        </div>
        <h3 className={styles.detailTitle}>{title}</h3>
        {summary && <p className={styles.heroSummary}>{summary}</p>}

        <div className={styles.detailMetaGrid}>
          <div className={styles.detailMetaCard}>
            <span className={styles.metaLabel}>归档位置</span>
            <span className={styles.metaValue}>{location || '未标注'}</span>
          </div>
          <div className={styles.detailMetaCard}>
            <span className={styles.metaLabel}>记录类型</span>
            <span className={styles.metaValue}>{category || '作战条目'}</span>
          </div>
          <div className={styles.detailMetaCard}>
            <span className={styles.metaLabel}>风险提示</span>
            <span className={styles.metaValue}>需在陪同观察下阅读并执行</span>
          </div>
        </div>
      </div>

      {details && details.length > 0 && (
        <section className={styles.detailSection}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionCode}>记录段</span>
            <h4>作战观察</h4>
          </div>
          <div className={styles.detailBody}>
            {details.map((line, index) => (
              <p key={index} className={styles.detailParagraph}>
                {line}
              </p>
            ))}
          </div>
        </section>
      )}

      {notes && notes.length > 0 && (
        <section className={styles.detailSection}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionCode}>附注段</span>
            <h4>批注与执行提示</h4>
          </div>
          <div className={styles.noteList}>
            {notes.map((note) => (
              <p key={note} className={styles.noteItem}>
                {note}
              </p>
            ))}
          </div>
        </section>
      )}

      {keywords && keywords.length > 0 && (
        <section className={styles.detailSection}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionCode}>标签段</span>
            <h4>重点关键词</h4>
          </div>
          <div className={styles.keywordGrid}>
            {keywords.map((keyword) => (
              <span key={keyword} className={styles.keywordTag}>
                {keyword}
              </span>
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
              </button>
            ))}
          </div>
        </section>
      )}

      {isLightboxOpen && imagesForGallery.length > 0 && (
        <Lightbox
          image={imagesForGallery[currentLightboxImageIndex]}
          onClose={closeLightbox}
          onNext={imagesForGallery.length > 1 ? showNextImage : null}
          onPrev={imagesForGallery.length > 1 ? showPrevImage : null}
          thumbnailRect={clickedThumbnailRect}
          currentIndex={currentLightboxImageIndex}
          totalImages={imagesForGallery.length}
          getClosingRectForIndex={getClosingRect}
        />
      )}
    </div>
  );
};

export default ExperienceDetailView;
