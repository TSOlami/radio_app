import React from "react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./navigation-menu";
import { Button } from "./button";
import { ArrowDownIcon } from "lucide-react";

const navItems = [
  { text: "Home", active: true },
  { text: "Features", active: false },
  { text: "How it works", active: false },
  { text: "FAQ", active: false },
  { text: "Contact Us", active: false },
];

export const NavBar = () => (
  <nav className="flex w-full max-w-[1200px] items-center justify-between absolute top-[30px] left-1/2 -translate-x-1/2 px-4 md:px-0 z-20">
    <img
      className="relative w-[50px] h-[22px]"
      alt="Logo"
      src="/logo.png"
    />
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
    <Button className="inline-flex items-center gap-2.5 px-[19px] py-2.5 relative bg-brandmain rounded-lg shadow-md hover:bg-[#1767d9] transition-colors">
      <span className="relative w-fit mt-[-1.00px] [font-family:'Manrope',Helvetica] font-semibold text-[#fefefe] text-sm tracking-[-0.28px] leading-[normal]">
        Download App
      </span>
      <ArrowDownIcon className="w-4 h-4 text-white" />
    </Button>
  </nav>
);

export default NavBar;