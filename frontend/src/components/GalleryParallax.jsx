
import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function GalleryParallax({
  title = "College Visits",
  description = "Capturing memorable moments from our college visits that inspire collaboration and knowledge sharing.",

}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });


  // Smooth horizontal scroll animation
  const xRange = useTransform(scrollYProgress, [0, 1], ["0%", "-85%"]);
  const xSpring = useSpring(xRange, { stiffness: 100, damping: 30 });

  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch images properly
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const res = await fetch("https://ss-infotech-v2-2.onrender.com/api/gallery/gallery-img");
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data = await res.json();

        console.log("API Response:", data);

        // ✅ Normalize backend data
        const images =
          Array.isArray(data)
            ? data
            : Array.isArray(data.galleryImages)
            ? data.galleryImages
            : [];

        setGalleryImages(images);
      } catch (err) {
        console.error("Error fetching gallery:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryImages();
  }, []);

  // ✅ Color palette for categories
  const colors = {
    primary: "#3B82F6",
    secondary: "#10B981",
    accent: "#F59E0B",
    highlight: "#EF4444",
    neutral: "#6B7280",
  };

  const getCategoryColor = (category, index) => {
    const map = {


      Nature: colors.secondary,
      Forest: colors.secondary,
      Ocean: colors.primary,
      Urban: colors.neutral,
      Sunset: colors.accent,

    };
    return map[category] || [colors.primary, colors.secondary, colors.accent, colors.highlight][index % 4];
  };

  // ✅ Precompute Y-transforms (Fix Hook Order)
  const transforms = galleryImages.map((_, index) => {
    const isEven = index % 2 === 0;
    const yRange = useTransform(scrollYProgress, [0, 1], ["0%", `${isEven ? -5 : 5}%`]);
    const ySpring = useSpring(yRange, { stiffness: 100, damping: 30 });
    return { ySpring, isEven };
  });

  return (
    <section
      ref={ref}
      className="relative py-20 lg:py-28 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div

          className="text-center mb-12 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-emerald-600 to-amber-600 bg-clip-text text-transparent mb-4">
            {title}
          </h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </motion.div>


        {/* Gallery */}
        <div className="relative h-80 lg:h-[450px] overflow-hidden">
          <motion.div
            className="flex gap-4 lg:gap-6 absolute left-1/2 -translate-x-1/2"
            style={{ x: xSpring }}
          >
            {loading ? (
              <p className="text-center text-gray-500">Loading images...</p>
            ) : error ? (
              <p className="text-center text-red-500">Error: {error}</p>
            ) : galleryImages.length > 0 ? (
              galleryImages.map((image, index) => {
                const { ySpring, isEven } = transforms[index];
                const categoryColor = getCategoryColor(image.category, index);

                return (
                  <motion.div
                    key={image._id || index}
                    className="group relative block w-48 lg:w-56 h-60 lg:h-64 rounded-xl overflow-hidden transition-all duration-500 hover:z-20 shadow-lg hover:shadow-xl"
                    style={{ y: ySpring }}
                    whileHover={{
                      scale: 1.08,
                      rotate: 0,
                      transition: { type: "spring", stiffness: 150, damping: 20 },
                    }}
                    initial={{ opacity: 0, y: 60, rotate: isEven ? 2 : -2 }}
                    whileInView={{ opacity: 1, y: 0, rotate: isEven ? 2 : -2 }}
                    transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full h-2/3 overflow-hidden">
                      <motion.img
                        src={image.thumbnail}
                        alt={image.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `linear-gradient(to top, ${categoryColor}40, transparent 70%)`,
                        }}
                      />
                      <div className="absolute top-3 left-3 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span
                          className="text-xs font-semibold text-white px-2 py-1 rounded-full backdrop-blur-sm"
                          style={{ backgroundColor: `${categoryColor}CC` }}
                        >
                          {image.category}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-br from-slate-800 to-slate-900 p-3 flex items-center group-hover:bg-slate-700 transition-colors duration-300">
                      <h3 className="text-white font-semibold text-sm lg:text-base leading-tight group-hover:text-white/90 transition-colors duration-300">
                        {image.title}
                      </h3>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <p className="text-center text-gray-500">No images found</p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

