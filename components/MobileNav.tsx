"use client";

import { useState } from "react";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        id="nav-toggle"
        className="nav-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="site-nav"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
        <span className="sr-only">
          {isOpen ? "Close menu" : "Open menu"}
        </span>
      </button>

      <nav
        id="site-nav"
        className={`site-nav ${isOpen ? "is-open" : ""}`}
      >
        <a href="#story" onClick={closeMenu}>
          Story
        </a>

        <a href="#process" onClick={closeMenu}>
          Process
        </a>

        <a href="#bars" onClick={closeMenu}>
          Bars
        </a>

        <a href="#visit" onClick={closeMenu}>
          Visit
        </a>

        <a href="#contact" onClick={closeMenu}>
          Contact
        </a>
      </nav>
    </>
  );
}