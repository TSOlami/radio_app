import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { AppDownloadSection } from "./sections/AppDownloadSection";
import { CallToActionSection } from "./sections/CallToActionSection";
import { FAQSection } from "./sections/FAQSection";
import { MarketplaceSection } from "./sections/MarketplaceSection";
import { ProductDisplaySection } from "./sections/ProductDisplaySection";
import { SocialFeaturesSection } from "./sections/SocialFeaturesSection";
import { UniqueSellingPropositionSection } from "./sections/UniqueSellingPropositionSection";
import { UserProfileSection } from "./sections/UserProfileSection";

export const KikiLandingPage = (): JSX.Element => {
  return (
    <div className="bg-[#f8fbff] flex flex-row justify-center w-full">
      <div className="bg-neutral-1 overflow-hidden w-full max-w-[1440px] relative">
        {/* Top sections */}
        <div className="w-full">
          <MarketplaceSection />
          <SocialFeaturesSection />
        </div>

        <FAQSection />
        
        {/* App Store Section */}
        <div className="flex flex-col items-center w-full mt-8">
          <div className="[font-family:'Manrope',Helvetica] font-medium text-gray-6 text-2xl text-center tracking-[0] leading-normal mb-6">
            <span className="text-[#1a79fb]">Available</span>
            <span className="text-[#4f5966]"> on</span>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <Button className="flex items-center justify-center gap-2 px-4 py-3.5 bg-brand-6 rounded-[37px] overflow-hidden">
              <span className="[font-family:'Manrope',Helvetica] font-medium text-white text-lg tracking-[-0.36px]">
                Play store
              </span>
              <div className="relative w-6 h-6 bg-[url(/vector.svg)] bg-[100%_100%]" />
            </Button>

            <div className="[font-family:'Manrope',Helvetica] font-medium text-gray-6 text-2xl text-center tracking-[0] leading-normal">
              or
            </div>

            <Button className="flex items-center justify-center gap-2 px-4 py-3.5 bg-brand-6 rounded-[37px] overflow-hidden">
              <span className="[font-family:'Manrope',Helvetica] font-medium text-white text-lg tracking-[-0.36px]">
                Get from Apple
              </span>
              <div className="relative w-6 h-6">
                <img
                  className="absolute w-[15px] h-[18px] top-[3px] left-1"
                  alt="Vector"
                  src="/vector-20.svg"
                />
              </div>
            </Button>
          </div>
        </div>
        
        {/* Key App Features Badge */}
        <div className="flex justify-center w-full mt-8 mb-8">
          <Badge className="px-6 py-4 bg-brand-05 rounded-[30px] border border-solid border-[#b7dbff]">
            <span className="[font-family:'Helvetica_Neue-Medium',Helvetica] font-medium text-brandmain text-lg tracking-[-0.36px]">
              Key App Features
            </span>
          </Badge>
        </div>

        <UniqueSellingPropositionSection />
        {/* Phone Mockup */}
        <div className="flex justify-center w-full relative mb-12">
          <div className="relative w-[524px]">
            <div className="relative">
              {/* Decorative circles */}
              <div className="absolute w-[275px] h-[275px] top-[518px] left-[433px] rounded-[137.5px] border border-solid border-[#d1e4fe]" />
              <div className="absolute w-[275px] h-[275px] top-[165px] left-0 rounded-[137.5px] border border-solid border-[#d1e4fe]" />
              <div className="absolute w-[275px] h-[275px] top-[431px] left-[381px] rounded-[137.5px] border border-solid border-[#d1e4fe]" />
              <div className="absolute w-[275px] h-[275px] top-[165px] left-[168px] rounded-[137.5px] border border-solid border-[#d1e4fe]" />
              <div className="absolute w-[275px] h-[275px] top-[431px] left-[549px] rounded-[137.5px] border border-solid border-[#d1e4fe]" />
              <div className="absolute w-[275px] h-[275px] top-[350px] left-[95px] rounded-[137.5px] border border-solid border-[#d1e4fe]" />

              {/* Phone frame */}
              <div className="relative w-[391px] h-[794px]">
                <img
                  className="absolute w-[391px] h-[630px] top-[140px] left-0"
                  alt="Side buttons"
                  src="/side-buttons-2.svg"
                />

                <img
                  className="absolute w-[385px] h-[794px] top-0 left-[3px]"
                  alt="Titanium frame"
                  src="/titanium-frame-3.svg"
                />

                <div className="w-[378px] h-[787px] top-1 left-[7px] rounded-[54.65px] absolute bg-[#000100]" />

                <div className="w-[363px] h-[772px] top-[11px] left-3.5 rounded-[48.99px] absolute overflow-hidden">
                  <div className="relative h-[772px]">
                    <div className="absolute w-[349px] h-[758px] top-0 left-0 bg-[#dae2d3] rounded-[47.11px]" />
                    <img
                      className="absolute w-[363px] h-[772px] top-0 left-0"
                      alt="Wallpaper"
                      src="/wallpaper--delete--3.png"
                    />
                  </div>
                </div>

                <div className="absolute w-[105px] h-[29px] top-[23px] left-[143px]">
                  <div className="relative w-[104px] h-[29px] bg-[#030303] rounded-[18.84px]">
                    <div className="absolute w-[18px] h-[18px] top-1.5 left-[79px] bg-[#0e0b0f] rounded-[9.06px]" />
                    <div className="absolute w-2.5 h-2.5 top-2.5 left-[83px] bg-[#161424] rounded-[5.04px]" />
                    <div className="absolute w-1.5 h-1.5 top-3 left-[85px] bg-[#0f0f2a] rounded-[3.02px]" />
                    <div className="absolute w-0.5 h-0.5 top-[13px] left-[87px] bg-[#393752] rounded-[1.01px]" />
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute w-[94px] h-[94px] top-[11px] left-[11px] bg-[#ffffff] rounded-[80.11px] overflow-hidden rotate-[-15deg] shadow-vivt">
                <img
                  className="absolute w-[100px] h-[100px] top-[-3px] left-[-3px] rotate-[15deg] object-cover"
                  alt="Ellipse"
                  src="/ellipse-1809.svg"
                />
              </div>

              <div className="absolute w-[94px] h-[94px] top-[370px] left-[420px] bg-brand-1 rounded-[80.11px] overflow-hidden rotate-[15deg] shadow-vivt">
                <div className="relative w-14 h-14 top-[19px] left-[19px] rounded-xl overflow-hidden rotate-[-30deg] shadow-[inset_1px_1px_6px_#fefefe4c] bg-[linear-gradient(136deg,rgba(21,97,201,1)_0%,rgba(26,121,251,1)_100%)]">
                  <div className="relative w-6 h-6 top-[15px] left-4">
                    <img
                      className="absolute w-[22px] h-5 top-0.5 left-px rotate-[15deg]"
                      alt="Vector"
                      src="/vector-14.svg"
                    />
                  </div>
                </div>
              </div>

              <div className="absolute w-[66px] h-[66px] top-[483px] left-[444px] bg-brand-1 rounded-[55.76px] overflow-hidden rotate-[15deg] shadow-[0px_6.96px_22.27px_#4f558812] opacity-50">
                <div className="relative w-[39px] h-[39px] top-[13px] left-[13px] rounded-[8.35px] overflow-hidden rotate-[-30deg] shadow-[inset_0.7px_0.7px_4.18px_#fefefe4c] bg-[linear-gradient(136deg,rgba(21,97,201,1)_0%,rgba(26,121,251,1)_100%)]">
                  <div className="relative w-[17px] h-[17px] top-2.5 left-[11px] overflow-hidden">
                    <img
                      className="absolute w-[17px] h-[17px] top-0 left-0 rotate-[15deg]"
                      alt="Vector"
                      src="/vector-6.svg"
                    />
                  </div>
                </div>
              </div>

              <div className="absolute w-[49px] h-[49px] top-[573px] left-[434px] bg-brand-1 rounded-[42.03px] overflow-hidden rotate-[15deg] shadow-[0px_5.25px_16.79px_#4f558812] opacity-50">
                <div className="relative w-[30px] h-[30px] top-2.5 left-2.5 rounded-[6.3px] overflow-hidden rotate-[-30deg] shadow-[inset_0.52px_0.52px_3.15px_#fefefe4c] bg-[linear-gradient(136deg,rgba(21,97,201,1)_0%,rgba(26,121,251,1)_100%)]">
                  <div className="relative w-[13px] h-[13px] top-2 left-2">
                    <img
                      className="absolute w-3 h-[11px] top-px left-px rotate-[15deg]"
                      alt="Vector"
                      src="/vector-13.svg"
                    />
                  </div>
                </div>
              </div>

              <div className="absolute w-[37px] h-[37px] top-[173px] left-9 bg-[#ffffff] rounded-[31.83px] overflow-hidden opacity-20">
                <img
                  className="absolute w-[37px] h-[37px] top-0 left-0 object-cover"
                  alt="Ellipse"
                  src="/ellipse-986.png"
                />
              </div>

              <div className="absolute w-14 h-14 top-[106px] left-0 bg-[#ffffff] rounded-[48px] opacity-40">
                <img
                  className="absolute w-14 h-14 top-0 left-0 object-cover"
                  alt="Ellipse"
                  src="/ellipse-1810.png"
                />
              </div>
            </div>
          </div>
        </div>

        {/* App sections */}
        <AppDownloadSection />
        <ProductDisplaySection />
        <CallToActionSection />
        <UserProfileSection />
      </div>
    </div>
  );
};
