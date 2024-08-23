import React, { useState, useEffect } from "react";
import "./css/Slider.css";

import banner1 from "../../../asset/img/banner/banner-1.jpg";
import banner2 from "../../../asset/img/slide2.jpg";
import banner3 from "../../../asset/img/slide1.jpg";
import image1 from "../../../asset/img/banner-1.png";
import image2 from "../../../asset/img/slide1.jpg";

const slides = [
  { id: 1, image: banner1, alt: "Banner 1" },
  { id: 2, image: banner2, alt: "Banner 2" },
  { id: 3, image: banner3, alt: "Banner 3" },
  { id: 4, image: image1, alt: "Image 1" },
  { id: 5, image: image2, alt: "Image 2" },
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="container">
      <div className="d-flex">
        <div className="slider mb-5">
          <div
            className="slides"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`slide ${index === currentSlide ? "active" : ""}`}
                style={{ backgroundImage: `url(${slide.image})` }}
                aria-label={slide.alt}
              ></div>
            ))}
          </div>
          <button className="nav prev" onClick={prevSlide}>
            &#10094;
          </button>
          <button className="nav next" onClick={nextSlide}>
            &#10095;
          </button>
          <div className="dots">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              ></span>
            ))}
          </div>
        </div>
        <div className="additional-images">
          <img src={image1} alt="Hình 1" className="additional-image" />
          <img src={image2} alt="Hình 2" className="additional-image" />
        </div>
      </div>
    </div>
  );
};

export default Slider;
