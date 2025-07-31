import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

const AppFeatureCard = ({ title, description, iconSrc, isComplex, iconSrc1, iconSrc2, isFrame, frameSrc }: any) => (
  <Card className="w-full h-[120px] rounded-[20px] overflow-hidden bg-[linear-gradient(90deg,rgba(232,242,255,1)_0%,rgba(232,242,255,0)_100%)] border-none flex-shrink-0">
    <CardContent className="p-0 relative h-full">
      {/* Icon container */}
      {isFrame ? (
        <img
          className="absolute w-[45px] h-[45px] top-[15px] left-[18px]"
          alt="Feature icon"
          src={frameSrc}
        />
      ) : (
        <div className="absolute w-[45px] h-[45px] top-[15px] left-[18px] rounded-xl overflow-hidden shadow-[inset_1px_1px_6px_#fefefe4c] bg-[linear-gradient(136deg,rgba(21,97,201,1)_0%,rgba(26,121,251,1)_100%)]">
          <div className="relative w-6 h-6 top-2.5 left-[11px]">
            {isComplex ? (
              <div className="relative h-6">
                <img className="absolute w-3 h-3 top-3 left-0" alt="Vector" src={iconSrc1} />
                <img className="absolute w-[23px] h-[22px] top-0 left-px" alt="Vector" src={iconSrc2} />
              </div>
            ) : (
              <img
                className={`absolute ${
                  title === "Reels for Products"
                    ? "w-4 h-4 top-1 left-1"
                    : title === "Smart Marketplace"
                    ? "w-[19px] h-5 top-0.5 left-[3px]"
                    : title === "Built-in Chat"
                    ? "w-[22px] h-[18px] top-[3px] left-px"
                    : "w-5 h-[17px] top-1 left-0.5" // Boost & Promote
                }`}
                alt="Vector"
                src={iconSrc}
              />
            )}
          </div>
        </div>
      )}
      {/* Title */}
      <div
        className={`absolute top-6 left-[${
          title === "Verified Sellers" ? "72px" : "75px"
        }] [font-family:'Manrope',Helvetica] font-semibold text-black text-xl tracking-[-0.40px] leading-[normal]`}
      >
        {title}
      </div>
      {/* Description */}
      <div className="absolute w-[545px] top-[66px] left-[18px] [font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-gray-6 text-[13px] tracking-[-0.26px] leading-[normal]">
        {description}
      </div>
    </CardContent>
  </Card>
);

export const AppDownloadSection = (): JSX.Element => {
  // Feature data for mapping
  const features = [
    {
      title: "Reels for Products",
      description:
        "Snap a photo, write a quick caption, and share it with your followers — just like a regular post. It's as easy as uploading to your favorite social feed.",
      iconSrc: "/vector-12.svg",
    },
    {
      title: "Smart Marketplace",
      description:
        "Buyers can explore organized categories, use filters, and discover trending items — making it easy to find (or sell) exactly what's needed.",
      iconSrc: "/vector-7.svg",
    },
    {
      title: "Built-in Chat",
      description:
        "No need to switch apps. Chat instantly with buyers or sellers, answer questions, and close the deal — all in one seamless thread.",
      iconSrc: "/vector-5.svg",
    },
    {
      title: "Followers & Likes",
      description:
        "Every post builds your brand. Gain followers, earn likes, and grow your own mini store community right inside the app.",
      isComplex: true,
      iconSrc1: "/vector-16.svg",
      iconSrc2: "/vector-3.svg",
    },
    {
      title: "Boost & Promote",
      description:
        "Get noticed faster. Promote your listings with optional boosts and appear in trending sections to attract more buyers.",
      iconSrc: "/vector-15.svg",
    },
    {
      title: "Verified Sellers",
      description:
        "Trust is built in. Verified sellers get a badge that helps buyers shop with confidence — boosting credibility and visibility.",
      isFrame: true,
      frameSrc: "/frame-1618875648.svg",
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-[612px] items-start gap-2">
      {features.map((feature, index) => (
        <AppFeatureCard key={index} {...feature} />
      ))}
    </div>
  );
};
