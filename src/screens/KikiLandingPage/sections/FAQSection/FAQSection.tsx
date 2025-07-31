import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";

const FeatureCard = ({ title, description, screenImage, sideButtons, titaniumFrame, iconsRight, index }: any) => (
  <Card
    className="w-[372px] h-[599px] bg-white rounded-[20px] overflow-hidden relative border-none before:content-[''] before:absolute before:inset-0 before:p-[5px] before:rounded-[20px] before:[background:linear-gradient(180deg,rgba(21,97,201,1)_0%,rgba(26,121,251,0)_90%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none flex-shrink-0"
  >
    <CardContent className="p-0 h-full flex flex-col">
      {/* Phone mockup */}
      <div className={`relative w-[257px] h-[529px] mx-auto ${index === 0 ? "mt-[-148px]" : index === 1 ? "mt-[237px]" : "mt-[-36px]"}`}>
        <div className="relative w-[261px] h-[527px] -left-0.5">
          <img className="h-auto absolute w-[261px] left-0" alt="Side buttons" src={sideButtons} />
          <img className="h-auto absolute w-[257px] left-0.5" alt="Titanium frame" src={titaniumFrame} />
          <div className="absolute w-[252px] h-[524px] top-0 left-1 bg-[#000100] rounded-[36.43px]" />
          <div className="absolute w-[242px] h-[514px] top-[5px] left-[9px] rounded-[32.66px] overflow-hidden">
            <div className="relative h-[514px] rounded-[32.66px]">
              <div className="absolute w-[232px] h-[506px] top-0 left-0 bg-[#dae2d3] rounded-[31.41px]" />
              <div className="w-[242px] h-[514px] top-0 left-0 rounded-[32.66px] absolute overflow-hidden">
                <div className="relative h-[514px]">
                  <div className="absolute w-[232px] h-[506px] top-0 left-0 bg-[#dae2d3] rounded-[31.41px]" />
                  <img className="h-auto absolute w-[242px] left-0" alt="App screen" src={screenImage} />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute w-[70px] h-[19px] top-[13px] left-[95px]">
            <div className="relative w-[69px] h-[19px] bg-[#030303] rounded-[12.56px]">
              <div className="absolute w-3 h-3 top-1 left-[53px] bg-[#0e0b0f] rounded-[6.04px]" />
              <div className="absolute w-[7px] h-[7px] top-1.5 left-[55px] bg-[#161424] rounded-[3.36px]" />
              <div className="absolute w-1 h-1 top-2 left-[57px] bg-[#0f0f2a] rounded-[2.01px]" />
              <div className="absolute w-px h-px top-2 left-[58px] bg-[#393752] rounded-[0.67px]" />
            </div>
          </div>
          <div className="absolute w-[184px] h-3.5 top-4 left-[45px]">
            <img className="absolute w-[47px] h-2" alt="Status icons" src={iconsRight} />
            <div className="absolute w-6 h-3.5 top-0 left-0">
              <div className="absolute top-0 left-0 [font-family:'SF_Pro_Text-Semibold',Helvetica] font-normal text-[#ffffff] text-[10.7px] text-center tracking-[-0.50px] leading-[13.8px] whitespace-nowrap">9:41</div>
            </div>
          </div>
        </div>
      </div>
      {/* Card text content */}
      <div className="mt-auto mb-6 px-8">
        <h3 className="font-['Manrope',Helvetica] font-semibold text-black text-[32px] text-center tracking-[-0.64px] mb-4">{title}</h3>
        <p className="font-['Helvetica_Neue-Regular',Helvetica] font-normal text-gray-6 text-lg text-center tracking-[-0.36px]">{description}</p>
      </div>
    </CardContent>
  </Card>
);

const featureCards = [
  {
    title: "Post Your Product",
    description:
      "Snap a photo, write a quick caption, and share it with your followers — just like a regular post. It's as easy as uploading to your favorite social feed.",
    phoneImage: "/pngegg--46--4-1.png",
    screenImage: "/wallpaper--delete-.png",
    sideButtons: "/side-buttons-1.svg",
    titaniumFrame: "/titanium-frame.svg",
    iconsRight: "/icons-right.png",
  },
  {
    title: "List on the Marketplace",
    description:
      "Make your item discoverable by adding it to the public marketplace. Reach more buyers searching by category, price, or location.",
    phoneImage: null,
    screenImage: "/wallpaper--delete--1.png",
    sideButtons: "/side-buttons-3.svg",
    titaniumFrame: "/titanium-frame-1.svg",
    iconsRight: "/icons-right-1.png",
  },
  {
    title: "Chat & Sell",
    description:
      "Instantly connect with interested buyers. Negotiate, confirm, and arrange delivery — all within the app. No third-party mess.",
    phoneImage: null,
    screenImage: "/wallpaper--delete--2.png",
    sideButtons: "/side-buttons.svg",
    titaniumFrame: "/titanium-frame-2.svg",
    iconsRight: "/icons-right-2.png",
  },
];

export const FAQSection = (): JSX.Element => {
  return (
    <section className="w-full max-w-[1200px] mx-auto my-16 relative">
      <div className="relative">
        {/* Blue header section */}
        <div className="w-full h-[447px] bg-brand-6 rounded-[20px] overflow-hidden relative">
          <div className="flex justify-between items-center h-full">
            {/* Left side image */}
            <img
              className="w-64 h-[434px] object-cover"
              alt="Smartphone illustration"
              src="/pngegg--46--4-1.png"
            />
            {/* Right side content */}
            <div className="flex-1 flex flex-col items-center">
              <Badge className="bg-brand-05 text-brandmain border-[#b7dbff] px-6 py-4 rounded-[30px] font-medium text-lg tracking-[-0.36px]">
                How it works
              </Badge>
              <h2 className="mt-[60px] max-w-[682px] font-['Manrope',Helvetica] font-semibold text-neutral-1 text-[40px] text-center tracking-[-0.80px]">
                Ever sold something with just a post? Now you can.
              </h2>
              <img
                className="w-[323px] h-[345px] absolute right-0 top-0 object-cover"
                alt="Smartphone illustration"
                src="/pngegg--46--4-1.png"
              />
            </div>
          </div>
        </div>
        {/* Feature cards */}
        <div className="flex gap-6 mt-[-230px] flex-wrap justify-center">
          {featureCards.map((card, index) => (
            <FeatureCard key={`feature-card-${index}`} {...card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
