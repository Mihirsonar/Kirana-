// import React, { useState, useEffect } from 'react';

// function Carousel() {
//   const [currentIndex, setCurrentIndex] = useState(0); // Track the current slide index
//   const totalSlides = 5; // Total number of slides

//   // Automatically change slides every 5 seconds (adjust the time as needed)
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides); // Loop through slides
//     }, 5000); // 5 seconds

//     return () => clearInterval(interval); // Clear interval on component unmount
//   }, []);

//   // Function to navigate to the next slide
//   const nextSlide = () => {
//     setCurrentIndex((currentIndex + 1) % totalSlides); // Loop to the next slide
//   };

//   // Function to navigate to the previous slide
//   const prevSlide = () => {
//     setCurrentIndex((currentIndex - 1 + totalSlides) % totalSlides); // Loop to the previous slide
//   };

//   // Function to go to a specific slide
//   const goToSlide = (index) => {
//     setCurrentIndex(index);
//   };

//   return (
//     <>
//     <div id="default-carousel" className="relative w-[92%] mx-auto " data-carousel="slide">
//       {/* Carousel wrapper */}
//       <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
//         {[1, 2, 3, 4, 5].map((_, index) => (
//           <div
//             key={index}
//             className={`duration-700 ease-in-out absolute inset-0 transition-opacity ${
//               index === currentIndex ? 'opacity-100' : 'opacity-0'
//             }`}
//             data-carousel-item
//           >
//             <img
//               src={`https://picsum.photos/800/400?random=${index + 1}`}
//               className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
//               alt={`carousel item ${index + 1}`}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Slider indicators */}
//       <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
//         {[0, 1, 2, 3, 4].map((index) => (
//           <button
//             key={index}
//             type="button"
//             className={`w-3 h-3 rounded-full ${
//               currentIndex === index ? 'bg-white' : 'bg-gray-100'
//             }`}
//             aria-current={currentIndex === index}
//             aria-label={`Slide ${index + 1}`}
//             onClick={() => goToSlide(index)}
//           />
//         ))}
//       </div>

//       {/* Slider controls */}
//       <button
//         type="button"
//         className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
//         onClick={prevSlide}
//       >
//         <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
//           <svg
//             className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
//             aria-hidden="true"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 6 10"
//           >
//             <path
//               stroke="currentColor"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M5 1 1 5l4 4"
//             />
//           </svg>
//           <span className="sr-only">Previous</span>
//         </span>
//       </button>
//       <button
//         type="button"
//         className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
//         onClick={nextSlide}
//       >
//         <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-900/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
//           <svg
//             className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
//             aria-hidden="true"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 6 10"
//           >
//             <path
//               stroke="currentColor"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="m1 9 4-4-4-4"
//             />
//           </svg>
//           <span className="sr-only">Next</span>
//         </span>
//       </button>

//     </div>
        
// </>
    
//   );
// }

// export default Carousel;

import React, { useState, useEffect, useCallback, memo } from 'react';

const Slide = memo(({ imageUrl, isActive, index }) => (
  <div
    className={`duration-700 ease-in-out absolute inset-0 transition-opacity ${
      isActive ? 'opacity-100' : 'opacity-0'
    }`}
    data-carousel-item
  >
    <img
      src={imageUrl}
      className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
      alt={`carousel item ${index + 1}`}
    />
  </div>
));

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = 5;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides]); // Add totalSlides as a dependency

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const imageUrls = [
    "data:image/jpeg;base64,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",
    "https://thumbs.dreamstime.com/b/grocery-shopping-discount-banner-paper-bag-filled-vegetables-fruits-other-products-68647200.jpg",
    "https://img.freepik.com/free-vector/grocery-store-sale-banner-template_23-2151089846.jpg",
    "https://img.freepik.com/free-vector/hand-drawn-supermarket-template_23-2150401496.jpg",
    "https://thumbs.dreamstime.com/b/grocery-shopping-discount-banner-paper-bag-filled-vegetables-fruits-other-products-68647200.jpg",

  ];
  
  const slides = imageUrls.map((imageUrl, index) => ({
    imageUrl,
    isActive: index === currentIndex, // currentIndex should be defined in your state
    index,
  }));

  return (
    <div id="default-carousel" className="relative w-[92%] mx-auto" data-carousel="slide">
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {slides.map((slide) => (
          <Slide
            key={slide.index}
            imageUrl={slide.imageUrl}
            isActive={slide.isActive}
            index={slide.index}
          />
        ))}
      </div>

      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {Array.from({ length: totalSlides }, (_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? 'bg-white' : 'bg-gray-100'
            }`}
            aria-current={currentIndex === index}
            aria-label={`Slide ${index + 1}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      <button
  type="button"
  className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group"
  onClick={prevSlide}
>
  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60">
    <svg
      className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 6 10"
    >
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
    </svg>
    <span className="sr-only">Previous</span>
  </span>
</button>

<button
  type="button"
  className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group"
  onClick={nextSlide}
>
  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-900/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60">
    <svg
      className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 6 10"
    >
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
    </svg>
    <span className="sr-only">Next</span>
  </span>
</button>

    </div>
  );
}

export default Carousel;