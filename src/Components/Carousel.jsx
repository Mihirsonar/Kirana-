import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    image:
      "https://img.freepik.com/free-vector/grocery-store-sale-banner-template_23-2151089846.jpg",
    title: "Fresh Vegetables",
    subtitle: "Up to 40% OFF",
    tag: "LIMITED DEAL",
  },
  {
    image:
      "https://img.freepik.com/free-vector/hand-drawn-supermarket-template_23-2150401496.jpg",
    title: "Daily Essentials",
    subtitle: "Delivered in 10 mins",
    tag: "FAST DELIVERY",
  },
  {
    image:
      "https://thumbs.dreamstime.com/b/grocery-shopping-discount-banner-paper-bag-filled-vegetables-fruits-other-products-68647200.jpg",
    title: "Snacks & Beverages",
    subtitle: "Buy 1 Get 1 Free",
    tag: "HOT DEAL",
  },
];

function Carousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef(null);

  const next = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (paused) return;

    timeoutRef.current = setTimeout(next, 4000);
    return () => clearTimeout(timeoutRef.current);
  }, [index, paused]);

  return (
    <div
      className="max-w-7xl mx-auto px-4 h-[220px] md:h-[420px] rounded-2xl overflow-hidden relative "
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative rounded-2xl overflow-hidden mt-1">

        {/* SLIDE */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="relative h-[220px] md:h-[420px]"
          >
            <img
              src={slides[index].image}
              className="w-full h-full object-cover"
              alt=""
            />

            {/* GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

            {/* CONTENT */}
            <div className="absolute top-1/2 left-6 md:left-12 -translate-y-1/2 text-white">

              {/* TAG */}
              <span className="bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-semibold">
                {slides[index].tag}
              </span>

              <h2 className="text-2xl md:text-5xl font-bold mt-3">
                {slides[index].title}
              </h2>

              <p className="text-lg md:text-xl mt-2 opacity-90">
                {slides[index].subtitle}
              </p>

              <button className="mt-4 px-5 py-2 bg-white text-black rounded-lg font-semibold hover:scale-105 transition">
                Shop Now →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* NAV */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md   hover:bg-white/40 transition"
        >
     
        </button>

        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 transition"
        >
 
        </button>

        {/* PROGRESS INDICATOR */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className="w-10 h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
              onClick={() => setIndex(i)}
            >
              {index === i && (
                <motion.div
                  className="h-full bg-white"
                  layoutId="progress"
                  transition={{ duration: 3.5 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Carousel;