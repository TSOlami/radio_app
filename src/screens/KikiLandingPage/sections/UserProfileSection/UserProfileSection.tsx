export const UserProfileSection = (): JSX.Element => {
  // Footer navigation data
  const footerNavigation = [
    {
      title: "Quick Access",
      links: [
        { name: "How it works", href: "#" },
        { name: "Features", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Blog", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "#" },
        { name: "FAQ", href: "#" },
      ],
    },
  ];

  return (
    <footer className="w-full py-12 bg-white">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Logo and company description */}
          <div className="md:w-1/3">
            <img
              className="h-[22px] w-[50px] mb-6"
              alt="Logo"
              src="/logo.png"
            />
            <p className="text-gray-6 text-base tracking-[-0.32px] leading-7 max-w-[383px] font-['Manrope',Helvetica] font-normal">
              We&apos;re building more than a marketplace. We&apos;re creating a
              community where anyone can post, share, sell, and connect — all
              from one app. Whether you&#39;re launching your own storefront or
              just selling what you no longer need, our platform makes it
              simple, social, and secure.
            </p>
          </div>

          {/* Navigation links */}
          <div className="md:w-2/3 flex flex-wrap justify-end gap-12">
            {footerNavigation.map((section, index) => (
              <div key={index} className="flex flex-col gap-6">
                <h3 className="font-['Manrope',Helvetica] font-semibold text-black text-xl tracking-[-0.40px] leading-7">
                  {section.title}
                </h3>
                <div className="flex flex-col gap-3">
                  {section.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.href}
                      className="font-['Manrope',Helvetica] font-normal text-gray-6 text-base tracking-[-0.32px] leading-7 hover:text-brandmain transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="w-full bg-brandmain mt-12">
        <div className="container mx-auto px-4 max-w-[1440px] py-[15px]">
          <div className="flex justify-between items-center">
            <p className="font-['Manrope',Helvetica] font-medium text-[#fcfcfc] text-base tracking-[-0.32px] leading-7">
              2025 Kiki. All rights reserved.
            </p>
            <img alt="Social media links" src="/frame-1618875505.svg" />
          </div>
        </div>
      </div>
    </footer>
  );
};
