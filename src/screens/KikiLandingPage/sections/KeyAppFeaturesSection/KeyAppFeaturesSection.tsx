import { Badge } from "../../../../components/ui/badge";
import { FeatureCards } from "../FeatureCards";
import { UniqueSellingPropositionSection } from "../UniqueSellingPropositionSection";

export const KeyAppFeaturesSection = (): JSX.Element => {
    return(
        <> 
            <div className="flex justify-center w-full pt-16">
            <Badge className="px-6 py-4 bg-brand-05 rounded-[30px] border border-solid border-[#b7dbff] hover:bg-brand-05 hover:border-[#b7dbff] hover:text-inherit">
            <span className="[font-family:'Helvetica_Neue-Medium',Helvetica] font-medium text-brandmain text-lg tracking-[-0.36px]">
                Key App Features
            </span>
            </Badge>
            </div>

            {/* Unique Selling Proposition Section */}
            <UniqueSellingPropositionSection />
            {/* Phone Mockup */}
            <div className="flex flex-col lg:flex-row justify-center w-full relative py-6">
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
                    <div className="relative w-[391px] h-[794px] right-[-70px]">
                        <img
                        className="absolute w-[386px] h-[630px] top-[140px] left-[3px]"
                        alt="Side buttons"
                        src="/side-buttons.png"
                        />

                        {/* <img
                        className="absolute w-[385px] h-[587px] top-[-10140] left-[3px]"
                        alt="Titanium frame"
                        src="/titanium-frame.png"
                        /> */}

                        <div className="w-[378px] h-[787px] top-1 left-[7px] rounded-[54.65px] absolute bg-[#000100]" />

                        <div className="w-[363px] h-[772px] top-[11px] left-3.5 rounded-[48.99px] absolute overflow-hidden">
                        <div className="relative h-[772px]">
                            <div className="absolute w-[349px] h-[758px] top-0 left-0 bg-[#dae2d3] rounded-[47.11px]" />
                            <img
                            className="absolute w-[363px] h-[772px] top-0 left-0"
                            alt="Wallpaper"
                            src="/marketplacehome1.png"
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
                        className="absolute w-[100px] h-[100px] top-[-3px] left-[-3px] rotate-[-15deg] object-cover"
                        alt="Ellipse"
                        src="/image.png"
                        />
                    </div>

                    <div className="absolute w-[94px] h-[94px] top-[370px] left-[420px] bg-brand-1 rounded-[80.11px] overflow-hidden rotate-[15deg] shadow-vivt">
                        <div className="relative w-14 h-14 top-[19px] left-[19px] rounded-xl overflow-hidden rotate-[-30deg] shadow-[inset_1px_1px_6px_#fefefe4c] bg-[linear-gradient(136deg,rgba(21,97,201,1)_0%,rgba(26,121,251,1)_100%)]">
                        <div className="relative w-6 h-6 top-[15px] left-4">
                            <img
                            className="absolute w-[22px] h-5 top-0.5 left-px rotate-[15deg]"
                            alt="Vector"
                            src="/ic_round-store.png"
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
                            src="/solar_verified-check-bold.png"
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
                            src="/weui_like-filled.png"
                            />
                        </div>
                        </div>
                    </div>

                    <div className="absolute w-[37px] h-[37px] top-[173px] left-9 bg-[#ffffff] rounded-[31.83px] overflow-hidden opacity-20">
                        <img
                        className="absolute w-[37px] h-[37px] top-0 left-0 object-cover"
                        alt="Ellipse"
                        src="/image (2).jpg"
                        />
                    </div>

                    <div className="absolute w-14 h-14 top-[106px] left-0 bg-[#ffffff] rounded-[48px] overflow-hidden opacity-40">
                        <img
                        className="absolute w-14 h-14 top-0 left-0 object-cover"
                        alt="Ellipse"
                        src="/image.jpg"
                        />
                    </div>
                    </div>
                </div>
                <FeatureCards />
            </div>
        </>
    );
}