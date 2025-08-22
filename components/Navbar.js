"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Sign Up", href: "/signup" },
    { name: "Login", href: "/login" },
  ];

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-rose-primary hover:text-rose-dark transition-colors duration-200"
            >
              Glamease
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isAuth = link.name === "Sign Up" || link.name === "Login";

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    ${
                      isAuth
                        ? link.name === "Sign Up"
                          ? "bg-rose-primary text-white px-4 py-2 rounded-lg hover:bg-rose-dark"
                          : "border border-rose-primary text-rose-primary px-4 py-2 rounded-lg hover:bg-rose-dark hover:text-white"
                        : "text-dark-blue font-medium text-base hover:text-rose-primary"
                    }
                    transition-colors duration-200 nav-link
                    ${
                      pathname === link.href && !isAuth
                        ? "active text-rose-primary"
                        : ""
                    }
                  `}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Hamburger Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-dark-blue hover:text-rose-primary p-2 rounded-md transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-rose-light">
          <div className="px-4 py-4 space-y-2 sm:px-6">
            {navLinks.map((link) => {
              const isAuth = link.name === "Sign Up" || link.name === "Login";

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    ${
                      isAuth
                        ? link.name === "Sign Up"
                          ? "block bg-rose-primary text-white text-center px-4 py-2 rounded-lg hover:bg-rose-dark"
                          : "block border border-rose-primary text-rose-primary text-center px-4 py-2 rounded-lg hover:bg-rose-dark hover:text-white"
                        : "block text-dark-blue font-medium text-base px-3 py-2 rounded-md hover:text-rose-primary hover:bg-white"
                    }
                    transition-colors duration-200 nav-link
                    ${
                      pathname === link.href && !isAuth
                        ? "active text-rose-primary bg-white"
                        : ""
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
