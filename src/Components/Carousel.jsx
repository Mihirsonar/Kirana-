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

  const slides = Array.from({ length: totalSlides }, (_, index) => ({
    imageUrl: `https://picsum.photos/800/400?random=${index + 1}`,
    isActive: index === currentIndex,
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
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={prevSlide}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
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
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={nextSlide}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-900/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
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