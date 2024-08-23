import React, { useState, useEffect } from "react";
import imgHero1 from "../../../asset/img/hero/hero-1.jpg";
import imgHero2 from "../../../asset/img/hero/hero-2.jpg";
import "./css/Slider.css";

export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      img: imgHero1,
      title: "Fall - Winter Collections 2030",
      subtitle: "Summer Collection",
      description:
        "A specialist label creating luxury essentials. Ethically crafted with an unwavering commitment to exceptional quality.",
    },
    {
      img: imgHero2,
      title: "Fall - Winter Collections 2030",
      subtitle: "Summer Collection",
      description:
        "A specialist label creating luxury essentials. Ethically crafted with an unwavering commitment to exceptional quality.",
    },
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [slides.length]);

  return (
    <section className="hero">
      <div className="hero__slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero__items set-bg ${
              index === currentSlide ? "active" : ""
            }`}
            style={{ backgroundImage: `url(${slide.img})` }}
          >
            <div className="container">
              <div className="row">
                <div className="col-xl-5 col-lg-7 col-md-8">
                  <div className="hero__text">
                    <h6>{slide.subtitle}</h6>
                    <h2>{slide.title}</h2>
                    <p>{slide.description}</p>
                    <button className="primary-btn">
                      Shop now <span className="arrow_right"></span>
                    </button>
                    <div className="hero__social">
                      <a href="https://facebook.com">
                        <i className="fa fa-facebook"></i>
                      </a>
                      <a href="https://twitter.com">
                        <i className="fa fa-twitter"></i>
                      </a>
                      <a href="https://pinterest.com">
                        <i className="fa fa-pinterest"></i>
                      </a>
                      <a href="https://instagram.com">
                        <i className="fa fa-instagram"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
