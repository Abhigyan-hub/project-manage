
import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

export default function GalleryMagnetic({
  images: propImages = [],
  title = "Seminars",
  description = "A glimpse into our engaging seminars where experts share knowledge, inspire ideas, and encourage innovation.",
}) {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCard, setActiveCard] = useState(null);

  const colors = {
    primary: "#6366F1",
    secondary: "#8B5CF6",
    accent: "#06B6D4",
    highlight: "#10B981",

    glow: "#F59E0B",

  };

  const getCategoryColor = (category) => {
    const colorMap = {
      Nature: colors.highlight,
      Forest: colors.highlight,
      Ocean: colors.accent,
      Urban: colors.primary,
      Sunset: colors.glow,
      Winter: colors.accent,
      Desert: colors.glow,
      Aurora: colors.secondary,
      Beach: colors.accent,

      Mountains: colors.primary,

    };
    return colorMap[category] || colors.primary;
  };

  // ✅ Fetch gallery images from the backend API
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch(
          "https://ss-infotech-v2-2.onrender.com/api/seminars/magnetic-images",
          {
            method: "GET",
            credentials: "include", // Include cookies if needed
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok)
          throw new Error(`Failed to fetch gallery images: ${response.statusText}`);

        const data = await response.json();
        console.log("Fetched gallery data:", data);

        // ✅ Safely extract array
        const formattedImages = Array.isArray(data)
          ? data
          : Array.isArray(data.images)
          ? data.images
          : [];

        console.log("Formatted images:", formattedImages);
        setGalleryImages(formattedImages);
      } catch (err) {
        console.error("Error fetching images:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  // ✅ Fallback to propImages if API data not available
  const displayImages =
    Array.isArray(galleryImages) && galleryImages.length > 0
      ? galleryImages
      : propImages;

  if (loading)
    return <div className="text-center py-20">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-20 text-red-600">
        Error: {error}
      </div>
    );

  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        <motion.div

          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >

          <motion.h2
            className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent mb-6"
            animate={{ backgroundPosition: ["0%", "100%"] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}

            style={{ backgroundSize: "200% 200%" }}
          >
            {title}
          </motion.h2>
          <p className="text-xl text-amber-700/80 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </motion.div>


        {/* ✅ Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {Array.isArray(displayImages) &&
            displayImages.map((image, index) => (
              <MagneticCard
                key={image._id || image.title + index}
                image={image}
                index={index}
                isActive={activeCard === index}
                onHoverStart={() => setActiveCard(index)}
                onHoverEnd={() => setActiveCard(null)}
                categoryColor={getCategoryColor(image.category)}
              />
            ))}

        </div>
      </div>
    </section>
  );
}


function MagneticCard({
  image,
  index,
  isActive,
  onHoverStart,
  onHoverEnd,
  categoryColor,
}) {

  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const glowX = useTransform(mouseXSpring, [-0.5, 0.5], ["-20px", "20px"]);
  const glowY = useTransform(mouseYSpring, [-0.5, 0.5], ["-20px", "20px"]);
  const glowOpacity = useTransform(mouseXSpring, [-0.5, 0.5], [0.3, 0.7]);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="relative group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      initial={{ opacity: 0, y: 80, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.div
        className="relative rounded-3xl overflow-hidden border border-white/80 bg-white/80 backdrop-blur-xl p-6 shadow-2xl"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
      >

        {/* Glow Effect */}

        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            boxShadow: `0 0 40px ${categoryColor}40`,
            x: glowX,
            y: glowY,
            opacity: glowOpacity,
          }}
        />

        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden mb-4">
          <motion.img
            src={image.thumbnail}
            alt={image.title}
            className="w-full h-64 object-cover rounded-2xl"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
        </div>


        {/* Title & Description */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {image.title}
          </h3>
          <p className="text-gray-600 text-sm">
            Discover the beauty of this landscape
          </p>

        </div>
      </motion.div>
    </motion.div>
  );
}
