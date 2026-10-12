import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRefs = useRef([]);

  // Fetch slides from backend
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch("https://ss-infotech-v2-2.onrender.com/api/slides");
        if (!response.ok) throw new Error("Failed to fetch slides");
        const data = await response.json();
        setSlides(data.slides || []);
        videoRefs.current = data.slides.map(() => React.createRef());
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // Handle slideshow autoplay
  useEffect(() => {
    if (!isPlaying || slides.length === 0) return;

    const currentSlide = slides[current];
    const videoElement = videoRefs.current[current]?.current;
    let timer;

    if (currentSlide?.type === "video" && videoElement) {
      videoElement.currentTime = 0;
      videoElement.play().catch((error) => console.error("Video playback failed:", error));

      const onLoadedMetadata = () => {
        const videoDuration = videoElement.duration * 1000 || 5000;
        timer = setTimeout(() => {
          setCurrent((prev) => (prev + 1) % slides.length);
        }, videoDuration);
      };

      videoElement.addEventListener("loadedmetadata", onLoadedMetadata);

      return () => {
        videoElement.removeEventListener("loadedmetadata", onLoadedMetadata);
        clearTimeout(timer);
      };
    } else {
      timer = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, currentSlide?.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [current, isPlaying, slides]);

  const goToSlide = (index) => {
    setCurrent(index);
    const videoElement = videoRefs.current[index]?.current;
    if (slides[index]?.type === "video" && videoElement) {
      videoElement.currentTime = 0;
      if (isPlaying) {
        videoElement.play().catch((error) => console.error("Video playback failed:", error));
      }
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    const videoElement = videoRefs.current[current]?.current;
    if (slides[current]?.type === "video" && videoElement) {
      if (!isPlaying) {
        videoElement.play().catch((error) => console.error("Video playback failed:", error));
      } else {
        videoElement.pause();
      }
    }
  };

  if (loading) return <div className="text-center text-white py-20">Loading slides...</div>;
  if (error) return <div className="text-center text-red-400 py-20">Error: {error}</div>;
  if (slides.length === 0) return <div className="text-center text-white py-20">No slides available</div>;

  return (
    <section
      className="relative overflow-hidden bg-gray-50 py-20 lg:py-28 h-[70vh] flex items-center"
      aria-labelledby="section-title"
    >
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0  ">
        <AnimatePresence mode="wait" >
          {slides.map((slide, index) =>
            index === current ? (
              <motion.div
                key={index}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {slide.type === "image" ? (
                  <img
                    src={slide.url}
                    alt={`slide-${index}`}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                ) : (
                  <video
                    ref={videoRefs.current[index]}
                    src={slide.url}
                    autoPlay={isPlaying}
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/40"></div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>

      {/* Slideshow Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full ">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index ? "bg-blue-600 scale-125" : "bg-white/60 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>

      <button
        onClick={togglePlayPause}
        className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      {/* Main Content */}
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl text-white">

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm md:text-base uppercase tracking-[0.3em] font-semibold mb-4"
          >
            SS Infotech
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Empowering Businesses
            <span className="block text-blue-300">
              Through Technology
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed mb-8"
          >
            We provide innovative IT solutions, software development,
            digital services, training, and technology-driven solutions
            to help businesses grow and succeed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="/services"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Explore Our Services
            </a>

            <a
              href="/contact"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/40 text-white font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              Contact Us
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;