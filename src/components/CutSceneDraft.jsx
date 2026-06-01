import { useMemo, useState } from 'react'

const CUT_SCENE_VIDEOS = [
  {
    title: 'Air Plane Worms Eye View',
    src: '/assets/videos/cut-scenes/air-plane-worms-eye-view.mp4'
  },
  {
    title: 'Banana Boat on Pattaya Beach',
    src: '/assets/videos/cut-scenes/banana-boat-pattaya-beach.mp4'
  },
  {
    title: 'Beer Glass on Table',
    src: '/assets/videos/cut-scenes/beer-glass-table-pattaya-beach.mp4'
  },
  {
    title: 'Bullet Shot Action',
    src: '/assets/videos/cut-scenes/bullet-shot-action.mp4'
  },
  {
    title: 'End',
    src: '/assets/videos/cut-scenes/end-4s.mp4'
  },
  {
    title: 'Holding Sword',
    src: '/assets/videos/cut-scenes/holding-sword.mp4'
  },
  {
    title: 'Hotel Hallway',
    src: '/assets/videos/cut-scenes/hotel-hallway.mp4'
  },
  {
    title: 'Restaurant Bird Eye',
    src: '/assets/videos/cut-scenes/restaurant-bird-eye.mp4'
  },
  {
    title: 'Restaurant Corner',
    src: '/assets/videos/cut-scenes/restaurant-corner.mp4'
  },
  {
    title: 'Sunglasses on Pattaya Beach',
    src: '/assets/videos/cut-scenes/sunglasses-pattaya-beach.mp4'
  },
  {
    title: 'Tuk Tuk',
    src: '/assets/videos/cut-scenes/tuk-tuk.mp4'
  },
  {
    title: 'Zombie Face Close Up',
    src: '/assets/videos/cut-scenes/zombie-face-close-up.mp4'
  }
]

function RevealText({ children }) {
  return (
    <span className="reveal-mask">
      <span className="reveal-inner">{children}</span>
    </span>
  )
}

export default function CutSceneDraft() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeVideo = CUT_SCENE_VIDEOS[activeIndex]
  const total = CUT_SCENE_VIDEOS.length

  const selectedMeta = useMemo(() => ({
    count: `${String(activeIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`,
    label: activeVideo.title
  }), [activeIndex, activeVideo.title, total])

  const goTo = (direction) => {
    setActiveIndex((current) => (current + direction + total) % total)
  }

  return (
    <section className="cut-scenes is-reveal-active" id="cut-scenes" aria-labelledby="cut-scenes-title">
      <div className="cut-scenes__header">
        <p className="eyebrow"><RevealText>/ CUT SCENE DRAFT</RevealText></p>
        <h2 id="cut-scenes-title"><RevealText>BF / AF CUT SCENE</RevealText></h2>
        <p className="cut-scenes__intro">
          <RevealText>Action beats, travel cuts, and location transitions from the Bangkok-Pattaya sequence.</RevealText>
        </p>
      </div>

      <div className="cut-scenes__stage">
        <article className="cut-scenes__feature" aria-label={activeVideo.title}>
          <video
            key={activeVideo.src}
            src={activeVideo.src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <div className="cut-scenes__feature-caption">
            <span>{selectedMeta.count}</span>
            <strong>{selectedMeta.label}</strong>
          </div>
        </article>

        <div className="cut-scenes__grid" aria-label="Cut scene video list">
          {CUT_SCENE_VIDEOS.map((video, index) => (
            <button
              key={video.src}
              type="button"
              className={`cut-scenes__card${index === activeIndex ? ' is-active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Select ${video.title}`}
            >
              <video src={video.src} muted playsInline preload="metadata" />
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{video.title}</strong>
            </button>
          ))}
        </div>
      </div>

      <div className="cut-scenes__controls" aria-label="Cut scene controls">
        <button type="button" onClick={() => goTo(-1)} aria-label="Previous video">←</button>
        <span>{selectedMeta.count}</span>
        <button type="button" onClick={() => goTo(1)} aria-label="Next video">→</button>
      </div>
    </section>
  )
}
