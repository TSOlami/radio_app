import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

export const SocialFeaturesSection = (): JSX.Element => {
  const socialFeatures = [
    {
      icon: "/frame-1618875649.svg",
      text: (
        <>
          <span className="font-medium text-[#030c19]">Over </span>
          <span className="font-semibold text-[#1a79fb]">
            2000 Verified Sellers
          </span>
        </>
      ),
      customIcon: true,
    },
    {
      text: (
        <>
          <span className="font-medium text-[#030c19]">Over </span>
          <span className="font-semibold text-[#1a79fb]">100,000 </span>
          <span className="font-medium text-[#030c19]">downloads</span>
        </>
      ),
      customIcon: false,
      iconSrc: "/vector-8.svg",
    },
    {
      text: (
        <>
          <span className="font-medium text-[#030c19]">Backed by </span>
          <span className="font-semibold text-[#1a79fb]">Jumia Associates</span>
        </>
      ),
      customIcon: false,
      iconSrc: "/vector-10.svg",
    },
  ];

  return (
    <div className="flex items-center gap-6">
      {socialFeatures.map((feature, index) => (
        <Card
          key={index}
          className="w-[366px] h-[106px] bg-brand-05 rounded-[20px] overflow-hidden border border-solid border-[#d1e4fe]"
        >
          <CardContent className="p-0">
            <div className="flex items-center gap-4 pt-5 pl-[22px]">
              {feature.customIcon ? (
                <img
                  className="w-[45px] h-[45px]"
                  alt="Feature icon"
                  src={feature.icon}
                />
              ) : (
                <div className="w-[45px] h-[45px] rounded-xl overflow-hidden shadow-[inset_1px_1px_6px_#fefefe4c] bg-[linear-gradient(136deg,rgba(21,97,201,1)_0%,rgba(26,121,251,1)_100%)]">
                  <div className="relative w-6 h-6 top-2.5 left-[11px]">
                    <img
                      className={`absolute ${
                        index === 1
                          ? "w-3.5 h-[17px] top-[3px] left-[5px]"
                          : "w-[22px] h-5 top-px left-px"
                      }`}
                      alt="Vector"
                      src={feature.iconSrc}
                    />
                  </div>
                </div>
              )}

              <div className="w-[262px] mt-[-1.00px] font-['Manrope',Helvetica] font-normal text-black text-2xl text-center tracking-[0] leading-[normal]">
                {feature.text}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
