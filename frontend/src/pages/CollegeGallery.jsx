import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Stars, X, ChevronLeft, ChevronRight, Expand, Camera } from 'lucide-react';

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: "easeOut",
      when: "beforeChildren"
    },
  }),
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren"
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const floatingAnimation = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// API service functions
const apiService = {
  async getAlbums() {
    const response = await fetch('https://ss-infotech-v2-2.onrender.com/api/albums/album-getall');
    if (!response.ok) throw new Error('Failed to fetch albums');
    return response.json();
  },

  async getAlbumById(id) {
    const response = await fetch(`https://ss-infotech-v2-2.onrender.com/api/album/${id}`);
    if (!response.ok) throw new Error('Failed to fetch album');
    return response.json();
  },

  async createAlbum(albumData) {
    const formData = new FormData();
    Object.keys(albumData).forEach(key => {
      if (key === 'images') {
        albumData.images.forEach(image => formData.append('images', image));
      } else {
        formData.append(key, albumData[key]);
      }
    });

    const response = await fetch('https://ss-infotech-v2-2.onrender.com/api/album-post', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create album');
    return response.json();
  },

  async updateAlbum(id, albumData) {
    const formData = new FormData();
    Object.keys(albumData).forEach(key => {
      if (key === 'images') {
        albumData.images.forEach(image => formData.append('images', image));
      } else {
        formData.append(key, albumData[key]);
      }
    });

    const response = await fetch(`https://ss-infotech-v2-2.onrender.com/api/album/${id}`, {
      method: 'PATCH',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update album');
    return response.json();
  },

  async deleteAlbum(id) {
    const response = await fetch(`https://ss-infotech-v2-2.onrender.com/api/album/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete album');
    return response.json();
  }
};

// Focus trap helper for modal
const useFocusTrap = (ref, isOpen) => {
  useEffect(() => {
    if (!isOpen || !ref.current) return;
    const element = ref.current;
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    firstFocusable?.focus();

    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [ref, isOpen]);
};

const CollegeGallery = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef(null);

  // Fetch albums on component mount
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getAlbums();
        setAlbums(data);
      } catch (err) {
        console.error('Error fetching albums:', err);
        setError(err.message);
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedAlbum) {
        closeModal();
      }
    };
    if (selectedAlbum) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedAlbum]);

  // Keyboard navigation for modal (arrows)
  useEffect(() => {
    const handleKey = (e) => {
      if (!selectedAlbum) return;
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    if (selectedAlbum) {
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [selectedAlbum, currentImageIndex]);

  // Trap focus in modal
  useFocusTrap(modalRef, !!selectedAlbum);

  const openModal = (album, index = 0) => {
    setSelectedAlbum(album);
    setCurrentImageIndex(index);
  };

  const closeModal = () => {
    setSelectedAlbum(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (!selectedAlbum) return;
    setCurrentImageIndex((i) => (i + 1) % selectedAlbum.images.length);
  };

  const prevImage = () => {
    if (!selectedAlbum) return;
    setCurrentImageIndex((i) => (i - 1 + selectedAlbum.images.length) % selectedAlbum.images.length);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  // Loading state
  if (loading) {
    return (
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-purple-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-purple-400/20 rounded-full blur-xl"
          animate={{
            y: [0, 30, 0],
            x: [0, 15, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute bottom-32 right-20 w-32 h-32 bg-pink-400/30 rounded-full blur-2xl"
          animate={{
            y: [0, -40, 0],
            x: [0, -20, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <motion.div
              className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
              className="text-xl text-purple-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Loading amazing memories...
            </motion.p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-purple-100">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-2xl p-8 max-w-md mx-auto shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-purple-900 mb-3">Failed to Load Galleries</h3>
            <p className="text-purple-700 mb-6">{error}</p>
            <div className="space-y-3 text-sm text-purple-600 mb-6">
              <p>Please check:</p>
              <ul className="list-disc list-inside text-left space-y-1">
                <li>Backend server is running</li>
                <li>API endpoint: /api/album-getall</li>
                <li>Network connectivity</li>
              </ul>
            </div>
            <motion.button
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-lg shadow-purple-500/30"
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-purple-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-purple-400/20 rounded-full blur-xl"
          animate={{
            y: [0, 30, 0],
            x: [0, 15, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute bottom-32 right-20 w-32 h-32 bg-pink-400/30 rounded-full blur-2xl"
          animate={{
            y: [0, -40, 0],
            x: [0, -20, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />

        {/* Floating Stars */}
        <motion.div
          className="absolute top-1/4 left-1/5"
          variants={floatingAnimation}
          animate="animate"
        >
          <Stars className="h-6 w-6 text-purple-300" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 right-1/3"
          variants={floatingAnimation}
          animate="animate"
          style={{ animationDelay: '2s' }}
        >
          {/* <Sparkles className="h-4 w-4 text-pink-300" /> */}
        </motion.div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Hero Header */}
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={container}
          >
            <motion.div
              className="inline-flex items-center justify-center mb-6"
              variants={item}
            >
              <div className="bg-purple-400/20 backdrop-blur-sm text-purple-700 px-6 py-3 text-lg border border-purple-300/30 shadow-lg shadow-purple-500/20 rounded-full font-semibold">
                <Camera className="w-5 h-5 mr-2 inline" />
                Memory Gallery
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent"
              variants={item}
            >
              Explore Our{" "}
              <motion.span
                className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent inline-block"
                animate={{
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  backgroundSize: '200% 200%'
                }}
              >
                Memories
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl text-purple-700 max-w-3xl mx-auto leading-relaxed"
              variants={item}
            >
              Discover the vibrant moments and beautiful memories captured throughout our journey.{" "}
              <motion.span
                className="font-semibold text-purple-800"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Each picture tells a unique story.
              </motion.span>
            </motion.p>
          </motion.div>

          {/* Albums Grid */}
          <motion.div
            className="space-y-20"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {albums.map((album, index) => (
              <AlbumSection 
                key={album.id} 
                album={album} 
                onExploreMore={(imgIndex) => openModal(album, imgIndex)} 
                index={index}
              />
            ))}
          </motion.div>

          {albums.length === 0 && !loading && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold text-purple-600 mb-3">No Albums Found</h3>
              <p className="text-purple-500 max-w-md mx-auto">
                There are no gallery albums to display at the moment. Check back later for updates!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Enhanced Modal Lightbox */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={handleOverlayClick}
            ref={modalRef}
          >
            {/* Background Glow Effects */}
            <motion.div
              className="absolute -top-1/2 -left-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl"
              variants={pulseAnimation}
              animate="animate"
            />

            <motion.div
              className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-pink-500/10 rounded-full blur-3xl"
              variants={pulseAnimation}
              animate="animate"
              style={{ animationDelay: '2s' }}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden border border-white/20"
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedAlbum.title} image gallery`}
            >
              {/* Enhanced Header */}
              <div className="flex items-center justify-between p-6 border-b border-purple-200/50 bg-gradient-to-r from-purple-50 to-white/80">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Camera className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-900">{selectedAlbum.fullTitle || selectedAlbum.title}</h3>
                    <p className="text-sm text-purple-600">
                      {selectedAlbum.images?.length || 0} photos
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={closeModal}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-purple-100 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  aria-label="Close gallery modal"
                >
                  <X className="w-6 h-6 text-purple-600" />
                </motion.button>
              </div>

              {/* Enhanced Main Image Viewer */}
              <div className="p-6 overflow-auto max-h-[calc(95vh-140px)]">
                <div className="mb-8 relative bg-gradient-to-br from-purple-50 to-white rounded-2xl overflow-hidden shadow-inner border border-purple-100">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={selectedAlbum.images[currentImageIndex]}
                      alt={`${selectedAlbum.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-[60vh] sm:h-[70vh] object-contain select-none rounded-xl"
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={600}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.1}
                      onDragEnd={(e, info) => {
                        if (info.offset.x > 100) prevImage();
                        else if (info.offset.x < -100) nextImage();
                      }}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    />
                  </AnimatePresence>

                  {/* Enhanced Navigation Buttons */}
                  <motion.button
                    onClick={prevImage}
                    whileHover={{ scale: 1.1, x: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg p-4 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 z-10 border border-purple-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 text-purple-600" />
                  </motion.button>
                  <motion.button
                    onClick={nextImage}
                    whileHover={{ scale: 1.1, x: 2 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg p-4 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 z-10 border border-purple-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6 text-purple-600" />
                  </motion.button>

                  {/* Enhanced Index Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20">
                    <span className="text-purple-300">{currentImageIndex + 1}</span>
                    <span className="text-white/70"> / {selectedAlbum.images.length}</span>
                  </div>
                </div>

                {/* Enhanced Thumbnails Grid */}
                {selectedAlbum.images && selectedAlbum.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {selectedAlbum.images.map((image, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative rounded-xl overflow-hidden shadow-md transition-all duration-200 border-2 ${
                          index === currentImageIndex
                            ? 'border-purple-500 ring-2 ring-purple-200/50 bg-purple-50'
                            : 'border-transparent hover:border-purple-300 hover:shadow-lg'
                        } focus:outline-none focus:ring-2 focus:ring-purple-500 group`}
                        aria-label={`Jump to image ${index + 1}`}
                        aria-current={index === currentImageIndex ? 'true' : 'false'}
                      >
                        <img
                          src={image}
                          alt={`${selectedAlbum.title} - Thumbnail ${index + 1}`}
                          className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-200"
                          loading="lazy"
                          decoding="async"
                          width={150}
                          height={100}
                        />
                        {index === currentImageIndex && (
                          <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Enhanced AlbumSection component
const AlbumSection = ({ album, onExploreMore, index }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const timerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [itemWidth, setItemWidth] = useState(280);
  const [visibleCount, setVisibleCount] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isInteracting, setIsInteracting] = useState(false);

  const gap = 20;
  const total = album.images?.length || 0;
  const autoplayDelay = 3000;

  // Color gradients for different albums
  const colorGradients = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-teal-500 to-blue-500'
  ];
  
  const gradient = colorGradients[index % colorGradients.length];

  // Responsive measurement
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const containerW = containerRef.current.clientWidth;
      let w = 256;
      if (containerW >= 1024) w = 320;
      else if (containerW >= 768) w = 288;
      else if (containerW >= 640) w = 256;
      setItemWidth(w);
      const count = Math.max(1, Math.floor(containerW / (w + gap)));
      setVisibleCount(Math.min(count, total));
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [total]);

  // Autoplay logic
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!isHovered && !isInteracting && total > visibleCount) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((i) => (i + 1) % total);
      }, autoplayDelay);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isHovered, isInteracting, total, visibleCount, autoplayDelay]);

  // Auto-resume after interaction pause
  useEffect(() => {
    if (isInteracting) {
      const timeoutId = setTimeout(() => {
        setIsInteracting(false);
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [isInteracting]);

  const next = () => {
    setIsInteracting(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCurrentIndex((i) => (i + 1) % total);
  };

  const prev = () => {
    setIsInteracting(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCurrentIndex((i) => (i - 1 + total) % total);
  };

  const shouldCenter = total <= visibleCount;
  const maxLeadingIndex = Math.max(0, total - visibleCount);
  const leadingIndex = Math.min(currentIndex, maxLeadingIndex);
  const translateX = -(leadingIndex * (itemWidth + gap));

  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, [itemWidth, visibleCount]);

  const centerOffset = shouldCenter 
    ? (containerWidth - total * itemWidth - (total - 1) * gap) / 2 
    : 0;

  // If no images, don't render the section
  if (!album.images || album.images.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="space-y-8"
      variants={item}
      custom={index}
    >
      {/* Enhanced Header with title and controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h3 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {album.title}
          </h3>
          {album.description && (
            <p className="text-purple-600 max-w-2xl">
              {album.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <motion.button
            onClick={prev}
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Previous image in ${album.title} gallery`}
            className="px-4 sm:px-5 py-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center gap-2 border border-purple-100"
          >
            <ChevronLeft className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline text-purple-700 font-medium">Prev</span>
          </motion.button>

          <motion.button
            onClick={next}
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Next image in ${album.title} gallery`}
            className="px-4 sm:px-5 py-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center gap-2 border border-purple-100"
          >
            <span className="hidden sm:inline text-purple-700 font-medium">Next</span>
            <ChevronRight className="w-4 h-4 text-purple-600" />
          </motion.button>

          <motion.button
            onClick={() => onExploreMore(leadingIndex)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 sm:px-8 py-3 rounded-full font-semibold bg-gradient-to-r ${gradient} text-white shadow-lg hover:shadow-xl transform transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center gap-2`}
            aria-label={`Explore full ${album.title} gallery`}
          >
            <Expand className="w-4 h-4" />
            <span>Explore More</span>
          </motion.button>
        </div>
      </div>

      {/* Enhanced Scroller Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl border border-white/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="region"
        aria-label={`${album.title} image carousel`}
      >
        <motion.div
          ref={trackRef}
          className={`flex ${shouldCenter ? 'justify-center' : 'justify-start'} items-center transition-colors duration-300`}
          style={{
            gap: `${gap}px`,
            width: total > visibleCount ? `${total * (itemWidth + gap)}px` : 'auto',
            transform: shouldCenter ? `translateX(${centerOffset}px)` : undefined,
          }}
          animate={{
            x: shouldCenter ? centerOffset : translateX,
          }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            duration: 0.6,
          }}
          drag={total > visibleCount ? 'x' : false}
          dragConstraints={
            total > visibleCount
              ? { left: -(maxLeadingIndex * (itemWidth + gap)), right: 0 }
              : { left: 0, right: 0 }
          }
          dragElastic={0.1}
          onDragStart={() => setIsInteracting(true)}
          onDragEnd={(e, info) => {
            if (total <= visibleCount) return;
            const threshold = 50;
            if (info.offset.x < -threshold) {
              next();
            } else if (info.offset.x > threshold) {
              prev();
            } else {
              setCurrentIndex(leadingIndex);
            }
            setIsHovered(false);
          }}
        >
          {album.images.map((img, i) => (
            <motion.div
              key={`${album.id}-${i}`}
              className="flex-shrink-0 rounded-2xl overflow-hidden shadow-lg cursor-pointer group relative"
              style={{
                width: `${itemWidth}px`,
                height: '240px',
              }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onExploreMore(i)}
              role="button"
              tabIndex={0}
              aria-label={`View full size of image ${i + 1} from ${album.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onExploreMore(i);
                }
              }}
            >
              <img
                src={img}
                alt={`${album.title} - Image ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                decoding="async"
                width={itemWidth}
                height={240}
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Expand className="w-5 h-5 text-purple-600" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Pause indicator */}
        {(isHovered || isInteracting) && total > visibleCount && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 right-4 pointer-events-none"
          >
            <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm border border-white/20">
              Paused
            </div>
          </motion.div>
        )}
      </div>

      {/* Enhanced Image count indicator */}
      {total > 0 && (
        <motion.p
          className="text-center text-sm text-purple-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Showing {Math.min(visibleCount, total)} of {total} images • 
          <span className="text-purple-500 font-medium"> Auto-advances every {autoplayDelay / 1000}s</span>
        </motion.p>
      )}
    </motion.div>
  );
};

export default CollegeGallery;