import { Button } from "../../components/ui/button";
import { CallToActionSection } from "./sections/CallToActionSection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { HeroSection } from "./sections/HeroSection";
import { ProductDisplaySection } from "./sections/ProductDisplaySection";
import { SocialFeaturesSection } from "./sections/SocialFeaturesSection";
import { Footer } from "./sections/Footer";
import { KeyAppFeaturesSection } from "./sections/KeyAppFeaturesSection";
import { Badge } from "../../components/ui/badge";

export const KikiLandingPage = (): JSX.Element => {
  return (
    <div className="bg-[#f8fbff] flex flex-row justify-center w-full">
      <div className="bg-neutral-1 overflow-hidden w-full max-w-[1440px] relative">
        {/* Top sections */}
        <div className="w-full">
          <HeroSection />
          <SocialFeaturesSection />
        </div>

        {/* FAQ Section with proper spacing */}
        <div className="pt-16">
          <HowItWorksSection />
        </div>
        
        {/* App Store Section */}
        <div className="flex flex-col items-center w-full pt-8">
          <div className="[font-family:'Manrope',Helvetica] font-medium text-gray-6 text-2xl text-center tracking-[0] leading-normal mb-6">
            <span className="text-[#1a79fb]">Available</span>
            <span className="text-[#4f5966]"> on</span>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <Badge className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-6 rounded-[37px] overflow-hidden">
              <span className="[font-family:'Manrope',Helvetica] font-medium text-white text-lg tracking-[-0.36px]">
                Play store
              </span>
              <div className="relative w-6 h-6 bg-[url(/picon_playstore.png)] bg-[100%_100%]" />
            </Badge>

            <div className="[font-family:'Manrope',Helvetica] font-medium text-gray-6 text-2xl text-center tracking-[0] leading-normal">
              or
            </div>

            <Badge className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-6 rounded-[37px] overflow-hidden">
              <span className="[font-family:'Manrope',Helvetica] font-medium text-white text-lg tracking-[-0.36px]">
                Get from Apple
              </span>
              <div className="relative w-6 h-6">
                <img
                  className="absolute w-[15px] h-[18px] top-[3px] left-1"
                  alt="Vector"
                  src="/ic_baseline-apple.png"
                />
              </div>
            </Badge>
          </div>
        </div>
        
        {/* Key App Features Badge */}
        <KeyAppFeaturesSection />
        
        <div className="py-16">
          <ProductDisplaySection />
        </div>
        <div className="py-16">
          <CallToActionSection />
        </div>
        <div className="pt-16">
          <Footer />
        </div>
      </div>
    </div>
  );
};
