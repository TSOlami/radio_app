import React, { useState } from "react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./navigation-menu";
import { Button } from "./button";
import { ArrowDownIcon, Menu, X } from "lucide-react";

const navItems = [
  { text: "Home", active: true },
  { text: "Features", active: false },
  { text: "How it works", active: false },
  { text: "FAQ", active: false },
  { text: "Contact Us", active: false },
];

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  return (
    <nav className="flex w-full max-w-[1200px] items-center justify-between absolute top-[30px] left-1/2 -translate-x-1/2 px-4 md:px-0 z-20">
      <img
        className="relative w-[50px] h-[22px]"
        alt="Logo"
        src="/logo.png"
      />
      {/* Desktop nav */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList className="flex items-center gap-[27px]">
          {navItems.map((item, index) => (
            <NavigationMenuItem key={index}>
              <span
                className={`relative w-fit mt-[-1.00px] [font-family:'Manrope',Helvetica] ${item.active ? "font-semibold text-black" : "font-medium text-gray-6"} text-base tracking-[-0.32px] leading-[normal]`}
              >
                {item.text}
              </span>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <Button className="hidden md:inline-flex items-center gap-2.5 px-[19px] py-2.5 relative bg-brandmain rounded-lg shadow-md hover:bg-[#1767d9] transition-colors">
        <span className="relative w-fit mt-[-1.00px] [font-family:'Manrope',Helvetica] font-semibold text-[#fefefe] text-sm tracking-[-0.28px] leading-[normal]">
          Download App
        </span>
        <ArrowDownIcon className="w-4 h-4 text-white" />
      </Button>
      {/* Hamburger for mobile */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="text-gray-700 hover:text-brandmain transition-colors duration-200"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>
      {/* Mobile menu */}
      <div className={`md:hidden fixed inset-0 z-50 bg-black/40 transition-all duration-300 ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
        onClick={toggleMenu}
        style={{ pointerEvents: isMenuOpen ? 'auto' : 'none' }}
      >
        <div
          className={`absolute top-0 right-0 w-4/5 max-w-xs h-full bg-white shadow-lg p-6 flex flex-col gap-6 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-2">
            <img className="w-[50px] h-[22px]" alt="Logo" src="/logo.png" />
            <button onClick={toggleMenu} aria-label="Close menu"><X className="h-7 w-7 text-gray-700" /></button>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            {navItems.map((item, i) => (
              <a
                key={item.text}
                href={`#${item.text.toLowerCase().replace(/ /g, '-')}`}
                className="text-lg font-medium text-gray-700 hover:text-brandmain transition-colors duration-200 animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {item.text}
              </a>
            ))}
            <Button className="mt-4 w-full bg-brandmain text-white rounded-lg shadow-md hover:bg-[#1767d9] transition-colors flex items-center justify-center gap-2.5">
              <span className="font-semibold text-sm">Download App</span>
              <ArrowDownIcon className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;