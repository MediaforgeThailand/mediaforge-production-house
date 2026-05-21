import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const SLIDES = [
  {
    type: 'video',
    src: 'https://assets.mediaforge.co/videos/0519-copy-4.mp4',
    eyebrow: '/ FEATURED PROJECT',
    title: 'MOTION CRAFTED',
    copy: 'We are a full-service production house crafting films, commercials, and branded stories. Watch the reel and explore the work behind every frame.',
    cta: 'Watch Showreel'
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=2000&q=85',
    eyebrow: '/ SELECTED WORK',
    title: 'NORTHERN LIGHT',
    copy: 'A cinematic brand film shot across three countries — featuring real crew, real weather, no shortcuts.',
    cta: 'Case Study'
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=2000&q=85',
    eyebrow: '/ SELECTED WORK',
    title: 'CITY PULSE',
    copy: 'A 60-second commercial campaign for a global beverage brand — choreographed, single take.',
    cta: 'Case Study'
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=2000&q=85',
    eyebrow: '/ SELECTED WORK',
    title: 'FIELD NOTES',
    copy: 'Branded documentary series following farmers across Southeast Asia for the harvest season.',
    cta: 'Case Study'
  }
]

const HERO_SLIDE = SLIDES[0]
const CAROUSEL_SLIDES = SLIDES.slice(1)

const SCROLL_HIDDEN = 'polygon(0% 125%, 100% 100%, 100% 100%, 0% 100%)'
const SCROLL_DIAGONAL = 'polygon(0% 78%, 100% 62%, 100% 100%, 0% 100%)'
const FULL_FRAME = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

const HORIZONTAL_LEFT = 'polygon(0% 0%, -35% 0%, 0% 100%, 0% 100%)'
const HORIZONTAL_CENTER = 'polygon(-35% 0%, 135% 0%, 100% 100%, 0% 100%)'
const HORIZONTAL_RIGHT = 'polygon(135% 0%, 100% 0%, 100% 100%, 100% 100%)'

function SlideMedia({ slide, mediaRef, muted, withBackdrop = false }) {
  if (slide.type === 'video') {
    return (
      <>
        {withBackdrop ? (
          <video
            className="hero__img hero__img--backdrop"
            src={slide.src}
            poster={slide.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        ) : null}
        <video
          ref={mediaRef}
          className={`hero__img${withBackdrop ? ' hero__img--foreground' : ''}`}
          src={slide.src}
          poster={slide.poster}
          autoPlay
          muted={muted}
          loop
          playsInline
          preload="auto"
        />
      </>
    )
  }

  return (
    <div
      ref={mediaRef}
      className="hero__img"
      style={{
        backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 55%), url(${slide.src})`
      }}
    />
  )
}

function RevealText({ children }) {
  return (
    <span className="reveal-mask">
      <span className="reveal-inner">{children}</span>
    </span>
  )
}

function SlideContent({ slide }) {
  return (
    <div className="hero__slide-content">
      <p className="eyebrow"><RevealText>{slide.eyebrow}</RevealText></p>
      <h1 className="hero__title"><RevealText>{slide.title}</RevealText></h1>
      <p className="hero__copy"><RevealText>{slide.copy}</RevealText></p>
      <a href="#" className="cta cta--primary">
        <span className="cta__label"><RevealText>{slide.cta}</RevealText></span>
        <span className="cta__icon" aria-hidden="true">↗</span>
      </a>
    </div>
  )
}

export default function Hero() {
  const heroRef = useRef(null)
  const carouselRef = useRef(null)
  const heroMediaRef = useRef(null)
  const carouselSlidesRef = useRef([])
  const carouselMediaRef = useRef([])
  const activeCarouselRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const carouselAutoplayReadyRef = useRef(false)
  const wheelDeltaRef = useRef(0)
  const wheelResetRef = useRef(null)
  const [activeCarousel, setActiveCarousel] = useState(0)
  const [carouselRevealed, setCarouselRevealed] = useState(false)
  const [carouselContentVisible, setCarouselContentVisible] = useState(false)
  const [muted, setMuted] = useState(true)

  const goToCarousel = useCallback((nextIndex, direction = 1) => {
    const total = CAROUSEL_SLIDES.length
    const currentIndex = activeCarouselRef.current
    const normalizedIndex = (nextIndex + total) % total

    if (
      normalizedIndex === currentIndex ||
      isAnimatingRef.current ||
      !carouselSlidesRef.current[currentIndex] ||
      !carouselSlidesRef.current[normalizedIndex]
    ) {
      return
    }

    const currentSlide = carouselSlidesRef.current[currentIndex]
    const nextSlide = carouselSlidesRef.current[normalizedIndex]
    const currentMedia = carouselMediaRef.current[currentIndex]
    const nextMedia = carouselMediaRef.current[normalizedIndex]
    const fromSide = direction >= 0 ? HORIZONTAL_RIGHT : HORIZONTAL_LEFT
    const toSide = direction >= 0 ? HORIZONTAL_LEFT : HORIZONTAL_RIGHT
    const xFrom = direction >= 0 ? '7%' : '-7%'
    const xTo = direction >= 0 ? '-7%' : '7%'

    isAnimatingRef.current = true
    setActiveCarousel(normalizedIndex)
    activeCarouselRef.current = normalizedIndex

    gsap.killTweensOf([currentSlide, nextSlide, currentMedia, nextMedia])
    gsap.set(nextSlide, { clipPath: fromSide, zIndex: 3, pointerEvents: 'auto' })
    gsap.set(currentSlide, { clipPath: HORIZONTAL_CENTER, zIndex: 2, pointerEvents: 'none' })
    gsap.set(nextMedia, { scale: 1.12, x: xFrom })

    gsap.timeline({
      defaults: { duration: 0.82, ease: 'power1.inOut' },
      onComplete: () => {
        gsap.set(currentSlide, { clipPath: toSide, zIndex: 1 })
        gsap.set(nextSlide, { clipPath: HORIZONTAL_CENTER, zIndex: 2 })
        gsap.set(currentMedia, { scale: 1.12, x: xTo })
        gsap.set(nextMedia, { scale: 1, x: 0 })
        isAnimatingRef.current = false
      }
    })
      .to(currentSlide, { clipPath: toSide }, 0)
      .to(currentMedia, { scale: 1.12, x: xTo }, 0)
      .to(nextSlide, { clipPath: HORIZONTAL_CENTER }, 0)
      .to(nextMedia, { scale: 1, x: 0 }, 0)
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const primaryContent = heroRef.current?.querySelector('.hero__slide--primary .hero__slide-content')
      const setCarouselReady = (ready) => {
        carouselAutoplayReadyRef.current = ready
        setCarouselRevealed(ready)
      }

      gsap.set(carouselRef.current, { clipPath: SCROLL_HIDDEN })
      gsap.set(heroMediaRef.current, { scale: 1 })
      gsap.set(primaryContent, { autoAlpha: 1, y: 0 })
      carouselSlidesRef.current.forEach((slide, i) => {
        gsap.set(slide, {
          clipPath: i === 0 ? HORIZONTAL_CENTER : HORIZONTAL_RIGHT,
          zIndex: i === 0 ? 2 : 1,
          pointerEvents: i === 0 ? 'auto' : 'none'
        })
      })
      carouselMediaRef.current.forEach((media, i) => {
        gsap.set(media, {
          scale: i === 0 ? 1 : 1.12,
          x: i === 0 ? 0 : '7%'
        })
      })

      gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          onUpdate: (self) => {
            const isVisible = self.progress > 0.36
            setCarouselContentVisible(isVisible)

            if (self.progress < 0.995) {
              setCarouselReady(false)
            }
          },
          onScrubComplete: (self) => {
            if (self.progress >= 0.995) {
              setCarouselReady(true)
            }
          },
          onLeave: () => {
            setCarouselContentVisible(true)
          },
          onLeaveBack: () => {
            setCarouselReady(false)
            setCarouselContentVisible(false)
          }
        }
      })
        .to({}, { duration: 0.24 })
        .to(
          primaryContent,
          { autoAlpha: 0, y: -28, ease: 'none', duration: 0.28 },
          0.1
        )
        .fromTo(
          carouselRef.current,
          { clipPath: SCROLL_HIDDEN },
          { clipPath: SCROLL_DIAGONAL, ease: 'none', duration: 0.34 }
        )
        .to(
          carouselRef.current,
          { clipPath: FULL_FRAME, ease: 'none', duration: 0.86 }
        )
        .fromTo(
          carouselMediaRef.current[0],
          { scale: 1.12 },
          { scale: 1, ease: 'none', duration: 1.2 },
          0.24
        )
        .to(
          heroMediaRef.current,
          { scale: 1.06, ease: 'none', duration: 1.2 },
          0.24
        )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (carouselAutoplayReadyRef.current) {
        goToCarousel(activeCarouselRef.current + 1, 1)
      }
    }, 10000)

    return () => window.clearInterval(interval)
  }, [goToCarousel])

  useEffect(() => {
    const handleWheel = (event) => {
      if (!carouselAutoplayReadyRef.current) return

      const direction = event.deltaY > 0 ? 1 : -1
      const isAtFirstSlide = activeCarouselRef.current === 0

      if (direction < 0 && isAtFirstSlide && !isAnimatingRef.current) {
        return
      }

      event.preventDefault()
      if (isAnimatingRef.current) return

      wheelDeltaRef.current += event.deltaY
      window.clearTimeout(wheelResetRef.current)
      wheelResetRef.current = window.setTimeout(() => {
        wheelDeltaRef.current = 0
      }, 180)

      if (Math.abs(wheelDeltaRef.current) < 90) return

      const nextDirection = wheelDeltaRef.current > 0 ? 1 : -1
      wheelDeltaRef.current = 0
      goToCarousel(activeCarouselRef.current + nextDirection, nextDirection)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.clearTimeout(wheelResetRef.current)
    }
  }, [goToCarousel])

  return (
    <section className="hero hero--split" ref={heroRef}>
      <div className="hero__stack">
        <div className="hero__slide hero__slide--primary is-reveal-active" style={{ zIndex: 1, clipPath: FULL_FRAME }}>
          <SlideMedia slide={HERO_SLIDE} mediaRef={heroMediaRef} muted={muted} />
          <SlideContent slide={HERO_SLIDE} />
          <button
            className="hero__mute-toggle"
            onClick={() => setMuted(m => !m)}
            aria-label={muted ? 'Unmute video' : 'Mute video'}
          >
            {muted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>
        </div>

        <div className={`hero__carousel${carouselContentVisible ? ' is-controls-active' : ''}${carouselRevealed ? ' is-carousel-ready' : ''}`} ref={carouselRef}>
          {CAROUSEL_SLIDES.map((slide, i) => (
            <div
              key={slide.title}
              className={`hero__slide hero__slide--carousel${carouselContentVisible && i === activeCarousel ? ' is-reveal-active' : ''}`}
              ref={(el) => (carouselSlidesRef.current[i] = el)}
              style={{
                zIndex: i === 0 ? 2 : 1,
                clipPath: i === 0 ? HORIZONTAL_CENTER : HORIZONTAL_RIGHT
              }}
            >
              <SlideMedia
                slide={slide}
                mediaRef={(el) => (carouselMediaRef.current[i] = el)}
                muted
              />
              <SlideContent slide={slide} />
            </div>
          ))}

          <div className="hero__carousel-controls" aria-label="Selected work carousel controls">
            <div className="hero__filmstrip">
              {CAROUSEL_SLIDES.map((slide, i) => (
                <button
                  key={slide.title}
                  type="button"
                  className={`hero__film-thumb control-reveal${i === activeCarousel ? ' is-active' : ''}`}
                  style={{ '--control-delay': `${0.08 + i * 0.06}s` }}
                  disabled={!carouselRevealed}
                  onClick={() => goToCarousel(i, i > activeCarouselRef.current ? 1 : -1)}
                  aria-label={`Show ${slide.title}`}
                >
                  <span
                    style={{
                      backgroundImage: `url(${slide.poster || slide.src})`
                    }}
                  />
                </button>
              ))}
            </div>
            <span className="hero__carousel-counter control-reveal" style={{ '--control-delay': '0.30s' }}>
              {String(activeCarousel + 1).padStart(2, '0')} / {String(CAROUSEL_SLIDES.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              className="hero__carousel-arrow control-reveal"
              style={{ '--control-delay': '0.38s' }}
              disabled={!carouselRevealed}
              onClick={() => goToCarousel(activeCarouselRef.current - 1, -1)}
              aria-label="Previous slide"
            >
              ‹
            </button>
            <button
              type="button"
              className="hero__carousel-arrow control-reveal"
              style={{ '--control-delay': '0.46s' }}
              disabled={!carouselRevealed}
              onClick={() => goToCarousel(activeCarouselRef.current + 1, 1)}
              aria-label="Next slide"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
