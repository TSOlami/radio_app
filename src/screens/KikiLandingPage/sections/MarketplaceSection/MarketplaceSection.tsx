import { ArrowDownIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../../../../components/ui/navigation-menu";

export const MarketplaceSection = (): JSX.Element => {
  // Navigation menu items data
  const navItems = [
    { text: "Home", active: true },
    { text: "Features", active: false },
    { text: "How it works", active: false },
    { text: "FAQ", active: false },
    { text: "Contact Us", active: false },
  ];

  return (
    <section className="relative w-full h-[1088px] rounded-[20px] overflow-hidden bg-[linear-gradient(180deg,rgba(209,228,254,0)_0%,rgba(209,228,254,1)_50%,rgba(209,228,254,0.2)_100%)]">
      <div className="relative w-full h-[1047px] mt-36">
        {/* Background elements */}
        <Card className="absolute w-[427px] h-[726px] top-0 right-[94px] rounded-3xl bg-[linear-gradient(180deg,rgba(209,228,254,1)_0%,rgba(209,228,254,0.31)_100%)] border-none" />

        <img
          className="absolute w-[574px] h-[898px] top-[46px] right-0"
          alt="Transparent iPhone mockup"
          src="/Transparent iPhone 16 Pro Desert Titanium Mockup in a female hand (Mockuuups Studio).png"
        />

        <div className="absolute w-full h-[186px] bottom-0 bg-[#f8fbff] blur-[23.65px]" />

        {/* Main content */}
        <div className="absolute w-[705px] h-[426px] top-[134px] left-[126px]">
          <div className="absolute w-[705px] h-[360px] -top-px left-0">
            <h1 className="absolute w-[705px] top-0 left-0 [font-family:'Manrope',Helvetica] font-semibold text-black text-[88px] tracking-[-1.76px] leading-[normal]">
              Discover a World Where Shopping is Social
            </h1>

            <img
              className="absolute w-[213px] h-[85px] top-[263px] left-[343px]"
              alt="Frame"
              src="/frame-1618875770.svg"
            />
          </div>

          <p className="absolute w-[523px] top-[371px] left-0 [font-family:'Manrope',Helvetica] font-medium text-gray-6 text-xl tracking-[-0.40px] leading-[normal]">
            Snap it. Share it. Sell it. Your shop and your followers — all in
            one powerful app
          </p>
        </div>

        {/* Download section */}
        <div className="flex flex-col items-start gap-3 absolute top-[643px] left-[121px]">
          <h3 className="relative self-stretch mt-[-1.00px] [font-family:'Manrope',Helvetica] font-semibold text-gray-6 text-2xl tracking-[-0.48px] leading-[normal]">
            Download App;
          </h3>

          <div className="flex items-center gap-2 relative self-stretch w-full">
            <img
              className="w-[204px] relative h-[83px]"
              alt="App Store Download"
              src="/pngegg.png"
            />

            <img
              className="w-[217px] relative h-[83px]"
              alt="Google Play Download"
              src="/pngegg--3--2.png"
            />
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="flex w-full max-w-[1200px] items-center justify-between absolute top-[30px] left-1/2 -translate-x-1/2 px-4 md:px-0">
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

        <Button className="inline-flex items-center gap-2.5 px-[19px] py-2.5 relative bg-brandmain rounded-lg">
          <span className="relative w-fit mt-[-1.00px] [font-family:'Manrope',Helvetica] font-semibold text-[#fefefe] text-sm tracking-[-0.28px] leading-[normal]">
            Download App
          </span>
          <ArrowDownIcon className="w-4 h-4 text-white" />
        </Button>
      </div>
    </section>
  );
};
