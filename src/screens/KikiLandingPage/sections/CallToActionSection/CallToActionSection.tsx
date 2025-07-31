import { Card, CardContent } from "../../../../components/ui/card";

export const CallToActionSection = (): JSX.Element => {
  return (
    <Card className="relative w-full max-w-[1201px] h-[446px] mx-auto bg-brand-6 rounded-[32px] overflow-hidden">
      {/* Right side device mockup */}
      <div className="absolute w-[604px] h-[604px] top-[-79px] right-0">
        <img
          className="absolute w-[324px] h-[410px] top-[-22px] left-[380px] opacity-30 mix-blend-luminosity object-cover"
          alt="Right Pngegg"
          src="/pngegg (46).png"
        />

        <div className="absolute w-[604px] h-[604px] top-[-10px] right-0">
          <div className="relative w-full h-full">
            <div
              className="absolute w-full h-full top-0 left-0 z-[10]"
              style={{
                WebkitMaskImage: "url('/mask.png')",
                WebkitMaskSize: 'cover',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskImage: "url('/mask.png')",
                maskSize: 'cover',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
              }}
            >
              <img
                className="absolute w-[162.8px] h-[373.08px] top-[108px] left-[220px] object-cover"
                alt="App Screenshot"
                src="/marketplacehome3.png"
              />
            </div>

            <img
              className="absolute w-full h-full top-0 left-0 z-[5] object-cover"
              alt="Device Frame"
              src="/mockup.png"
            />
          </div>
        </div>
      </div>
      
      <CardContent className="relative h-full p-0">
        <div className="absolute w-[637px] h-[379px] top-[67px] left-0">
          <img
            className="absolute w-[512px] h-[512px] top-[18px] left-[-256px] opacity-30 mix-blend-luminosity object-cover"
            alt="Left Pngegg"
            src="/pngegg (46).png"
          />

          <div className="inline-flex flex-col items-start gap-4 absolute top-0 left-[46px]">
            <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
              <p className="relative self-stretch mt-[-1.00px] font-['Manrope',Helvetica] font-normal text-[#fcfcfc] text-xl tracking-[-0.40px] leading-[normal]">
                Download our App Today!
              </p>

              <div className="inline-flex flex-col items-start gap-2 relative flex-[0_0_auto]">
                <h2 className="relative w-[591px] mt-[-1.00px] font-['Manrope',Helvetica] font-semibold text-[#fcfcfc] text-[40px] tracking-[0] leading-[normal]">
                  Turn your followers into buyers. Or find what you need with a
                  scroll
                </h2>

                <p className="relative self-stretch font-['Manrope',Helvetica] font-normal text-[#fcfcfc] text-lg tracking-[-0.36px] leading-[normal]">
                  Start Selling
                </p>
              </div>
            </div>

            <div className="inline-flex gap-2.5">
              <img
                className="relative w-[143px] h-[55px] opacity-80"
                alt="App Store"
                src="/applestore.png"
              />

              <img
                className="relative w-[143px] h-[55px] opacity-80"
                alt="Google Play"
                src="/playstore.png"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
