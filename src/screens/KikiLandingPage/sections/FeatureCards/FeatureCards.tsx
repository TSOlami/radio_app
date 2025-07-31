import { Card, CardContent } from "../../../../components/ui/card";

const AppFeatureCard = ({ title, description, iconSrc }: any) => (
  <Card className="w-full h-[120px] rounded-[20px] overflow-hidden bg-[linear-gradient(90deg,rgba(232,242,255,1)_0%,rgba(232,242,255,0)_100%)] border-none flex-shrink-0">
    <CardContent className="p-0 relative h-full">
      {/* Icon container */}
      <div className="absolute w-[45px] h-[45px] top-[15px] left-[18px] rounded-xl overflow-hidden shadow-[inset_1px_1px_6px_#fefefe4c] bg-[linear-gradient(136deg,rgba(21,97,201,1)_0%,rgba(26,121,251,1)_100%)] flex items-center justify-center">
        <img
          className="w-5 h-5"
          alt="Feature icon"
          src={iconSrc}
        />
      </div>

      {/* Title */}
      <div className="absolute top-6 left-[75px] [font-family:'Manrope',Helvetica] font-semibold text-black text-xl tracking-[-0.40px] leading-[normal]">
        {title}
      </div>

      {/* Description */}
      <div className="absolute w-[545px] top-[66px] left-[18px] [font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-gray-6 text-[13px] tracking-[-0.26px] leading-[normal]">
        {description}
      </div>
    </CardContent>
  </Card>
);

export const FeatureCards = (): JSX.Element => {
  const features = [
    {
      title: "Reels for Products",
      description:
        "Snap a photo, write a quick caption, and share it with your followers — just like a regular post. It's as easy as uploading to your favorite social feed.",
      iconSrc: "/gridicons_video.png",
    },
    {
      title: "Smart Marketplace",
      description:
        "Buyers can explore organized categories, use filters, and discover trending items — making it easy to find (or sell) exactly what's needed.",
      iconSrc: "/solar_shop-bold.png",
    },
    {
      title: "Built-in Chat",
      description:
        "No need to switch apps. Chat instantly with buyers or sellers, answer questions, and close the deal — all in one seamless thread.",
      iconSrc: "/gridicons_chat.png",
    },
    {
      title: "Followers & Likes",
      description:
        "Every post builds your brand. Gain followers, earn likes, and grow your own mini store community right inside the app.",
      iconSrc: "/streamline-ultimate_shop-like-bold.png",
    },
    {
      title: "Boost & Promote",
      description:
        "Get noticed faster. Promote your listings with optional boosts and appear in trending sections to attract more buyers.",
      iconSrc: "/mdi_loudspeaker.png",
    },
    {
      title: "Verified Sellers",
      description:
        "Trust is built in. Verified sellers get a badge that helps buyers shop with confidence — boosting credibility and visibility.",
      iconSrc: "/hugeicons_store-verified-02.png",
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
