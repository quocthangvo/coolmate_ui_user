import React from "react";
import footerLogo from "../../../../asset/img/footer-logo.png";
import paymentImg from "../../../../asset/img/payment.png";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="footer ">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="footer__about">
                <div className="footer__logo">
                  <Link aria-label="Homepage">
                    <img src={footerLogo} alt="Footer Logo" />
                  </Link>
                </div>
                <p>
                  The customer is at the heart of our unique business model,
                  which includes design.
                </p>
                <Link
                  onClick={() => {
                    /* handle Link click */
                  }}
                  className="link-Link"
                  aria-label="Payment Methods"
                >
                  <img src={paymentImg} alt="Payment Methods" />
                </Link>
              </div>
            </div>
            <div className="col-lg-2 offset-lg-1 col-md-3 col-sm-6">
              <div className="footer__widget">
                <h6>Shopping</h6>
                <ul>
                  <li>
                    <Link>Clothing Store</Link>
                  </li>
                  <li>
                    <Link>Trending Shoes</Link>
                  </li>
                  <li>
                    <Link>Accessories</Link>
                  </li>
                  <li>
                    <Link>Sale</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-3 col-sm-6">
              <div className="footer__widget">
                <h6>Information</h6>
                <ul>
                  <li>
                    <Link>Contact Us</Link>
                  </li>
                  <li>
                    <Link>Payment Methods</Link>
                  </li>
                  <li>
                    <Link>Delivery</Link>
                  </li>
                  <li>
                    <Link>Return & Exchanges</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 offset-lg-1 col-md-6 col-sm-6">
              <div className="footer__widget">
                <h6>Newsletter</h6>
                <div className="footer__newslatter">
                  <p>
                    Be the first to know about new arrivals, look books, sales &
                    promos!
                  </p>
                  <form action="#">
                    <input type="email" placeholder="Your email" />
                    <Link type="submit">
                      <span className="icon_mail_alt"></span>
                    </Link>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="footer__copyright__text">
                <p>
                  Copyright © {currentYear} All rights reserved | This template
                  is made with{" "}
                  <i className="fa fa-heart-o" aria-hidden="true"></i> by{" "}
                  Coolmate
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="search-model">
        <div className="h-100 d-flex align-items-center justify-content-center">
          <div className="search-close-switch">+</div>
          <form className="search-model-form">
            <input
              type="text"
              id="search-input"
              placeholder="Search here....."
            />
          </form>
        </div>
      </div>
    </>
  );
}
