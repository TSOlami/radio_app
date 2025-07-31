import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";
import { Badge } from "../../../../components/ui/badge";

export const ProductDisplaySection = (): JSX.Element => {
  // FAQ data for mapping
  const faqItems = [
    {
      question: "How is this different from other marketplaces?",
      answer:
        "Unlike traditional marketplaces, our app lets you post products like social content — with reels, likes, followers, and chat features built-in. It's where commerce meets community.",
      defaultOpen: true,
    },
    {
      question: "Do I need to be a business to sell?",
      answer:
        "No, individual sellers are welcome on our platform. You can start selling your products without needing to register as a business.",
      defaultOpen: false,
    },
    {
      question: "Can I chat with buyers or sellers before buying?",
      answer:
        "Yes, our platform includes built-in chat features that allow you to communicate with buyers or sellers before making a purchase decision.",
      defaultOpen: false,
    },
    {
      question: "How do I promote my products?",
      answer:
        "You can promote your products through our social features like reels, posts, and by building a follower base. We also offer additional promotional tools within the app.",
      defaultOpen: false,
    },
    {
      question: "How do I get verified as a seller?",
      answer:
        "Verification is available to sellers who meet certain criteria including sales history, positive reviews, and identity verification. Check the seller settings in your profile.",
      defaultOpen: false,
    },
  ];

  return (
    <section className="flex flex-col w-full max-w-[996px] items-center gap-8 mx-auto">
      <div className="flex flex-col w-full max-w-[653px] items-center gap-3">
        <Badge
          variant="outline"
          className="px-6 py-4 bg-brand-05 rounded-[30px] border-[#b7dbff] font-medium text-brandmain text-lg tracking-[-0.36px]"
        >
          Get Answers
        </Badge>

        <h2 className="font-['Manrope',Helvetica] font-semibold text-gray-6 text-[40px] text-center tracking-[-0.80px] leading-normal">
          Frequently Asked Questions
        </h2>
      </div>

      <Accordion
        type="single"
        collapsible
        defaultValue="item-0"
        className="w-full"
      >
        {faqItems.map((item, index) => (
          <AccordionItem
            key={`faq-item-${index}`}
            value={`item-${index}`}
            className={`mb-6 overflow-hidden rounded-xl ${index === 0 ? "bg-black" : "bg-neutral-1 rounded-3xl"}`}
          >
            <AccordionTrigger
              className={`flex justify-between p-6 font-['Manrope',Helvetica] font-medium text-lg tracking-[-0.36px] leading-normal ${index === 0 ? "text-[#dadada]" : "text-black"}`}
            >
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="px-8 py-4">
              <p className="font-['Manrope',Helvetica] font-normal text-black text-base tracking-[-0.32px] leading-7">
                {item.answer}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
