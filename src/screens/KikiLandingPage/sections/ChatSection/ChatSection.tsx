import React from "react";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Separator } from "../../../../components/ui/separator";

export const ChatSection = (): JSX.Element => {
  // Message data for easier mapping and maintenance
  const messages = [
    {
      id: 1,
      type: "sent",
      content:
        "I saw the post of the jacket you made yesterday. I love it, is that the last price?",
      timestamp: "3 March, 2025, 10:40 AM",
    },
    {
      id: 2,
      type: "received",
      content: "Hello, thanks for contacting me.",
      timestamp: "3 March, 2025, 10:41 AM",
    },
    {
      id: 3,
      type: "received",
      content: "Wish of mt post please?",
      timestamp: "3 Mar, 2025, 10:41 AM",
    },
    {
      id: 4,
      type: "sent",
      content: "This one",
      timestamp: "3 Mar, 2025, 10:42 AM",
      hasImage: true,
    },
    {
      id: 5,
      type: "received",
      content: "I haven't seen what you sent",
      timestamp: "04:32PM",
      isUnread: true,
    },
  ];

  return (
    <div className="relative w-full max-w-[375px] h-[1071px] bg-neutral-2 overflow-hidden">
      {/* Header */}
      <div className="w-full h-[122px] bg-white">
        <div className="absolute w-full h-[47px] top-0 left-0">
          <div className="absolute w-[54px] h-[21px] top-3.5 left-[25px]">
            <div className="relative h-[21px] rounded-3xl">
              <div className="w-[54px] top-px text-[#010101] text-[length:var(--default-bold-body-font-size)] tracking-[var(--default-bold-body-letter-spacing)] leading-[var(--default-bold-body-line-height)] absolute left-0 font-default-bold-body font-[number:var(--default-bold-body-font-weight)] text-center whitespace-nowrap [font-style:var(--default-bold-body-font-style)]">
                9:41
              </div>
            </div>
          </div>
          <img
            className="absolute w-[77px] h-[13px] top-[19px] right-6"
            alt="Right side"
            src="/right-side.png"
          />
        </div>

        <div className="flex items-center justify-between pt-[61px] px-6">
          <div className="flex items-center gap-1">
            <div className="flex w-12 h-11 items-center justify-center p-3 rounded-[20px]">
              <img
                className="w-6 h-6"
                alt="Arrow left"
                src="/arrow-left-2.svg"
              />
            </div>

            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarImage src="/ellipse-986-1.png" alt="User avatar" />
              </Avatar>

              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <div className="font-body-3-semibold font-[number:var(--body-3-semibold-font-weight)] text-[#030c19] text-[length:var(--body-3-semibold-font-size)] tracking-[var(--body-3-semibold-letter-spacing)] leading-[var(--body-3-semibold-line-height)] whitespace-nowrap [font-style:var(--body-3-semibold-font-style)]">
                    Oluwaseun Adekola
                  </div>
                  <img
                    className="w-[18px] h-[18px]"
                    alt="Badge check"
                    src="/badge-check-2.svg"
                  />
                </div>
                <div className="-mt-0.5 font-body-3-regular font-[number:var(--body-3-regular-font-weight)] text-[#4f5966] text-[length:var(--body-3-regular-font-size)] tracking-[var(--body-3-regular-letter-spacing)] leading-[var(--body-3-regular-line-height)] [font-style:var(--body-3-regular-font-style)]">
                  @oluuwakola
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-5 h-5">
              <img
                className="absolute w-[15px] h-[15px] top-0.5 left-0.5"
                alt="Vector"
                src="/vector-18.svg"
              />
            </div>
            <div className="relative w-5 h-5 rotate-90">
              <img
                className="absolute w-1 h-[15px] top-0.5 left-2 -rotate-90"
                alt="Vector"
                src="/vector-4.svg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Messages Section Divider */}
      <div className="flex items-center gap-1 px-4 mt-[131px]">
        <Separator className="flex-1 h-[1.5px] bg-gray-1" />
        <span className="font-body-1-regular font-[number:var(--body-1-regular-font-weight)] text-[#4f5966] text-[length:var(--body-1-regular-font-size)] text-center tracking-[var(--body-1-regular-letter-spacing)] leading-[var(--body-1-regular-line-height)] whitespace-nowrap [font-style:var(--body-1-regular-font-style)]">
          Messages
        </span>
        <Separator className="flex-1 h-[1.5px] bg-gray-1" />
      </div>

      {/* Messages */}
      <div className="px-4 mt-4 space-y-8">
        {messages.map((message) => {
          if (message.isUnread && message.id === 5) {
            return (
              <React.Fragment key={message.id}>
                {/* Unread Divider */}
                <div className="flex items-center gap-1 mt-8">
                  <Separator className="flex-1 h-[1.5px] bg-gray-1" />
                  <span className="font-body-1-regular font-[number:var(--body-1-regular-font-weight)] text-[#4f5966] text-[length:var(--body-1-regular-font-size)] text-center tracking-[var(--body-1-regular-letter-spacing)] leading-[var(--body-1-regular-line-height)] whitespace-nowrap [font-style:var(--body-1-regular-font-style)]">
                    Unread
                  </span>
                  <Separator className="flex-1 h-[1.5px] bg-gray-1" />
                </div>
                <div
                  className={`flex flex-col ${message.type === "sent" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`flex flex-col ${message.type === "sent" ? "items-end" : "items-start"} gap-1`}
                  >
                    <Card
                      className={`border-0 shadow-none ${message.type === "sent" ? "bg-[#1a79fb] rounded-[20px_20px_0px_20px]" : "bg-neutral-2 rounded-[20px_20px_20px_0px]"}`}
                    >
                      <CardContent className="p-5">
                        <p
                          className={`mt-[-1.00px] font-body-1-regular font-[number:var(--body-1-regular-font-weight)] ${message.type === "sent" ? "text-white" : "text-[#030c19]"} text-[length:var(--body-1-regular-font-size)] tracking-[var(--body-1-regular-letter-spacing)] leading-[var(--body-1-regular-line-height)] [font-style:var(--body-1-regular-font-style)]`}
                        >
                          {message.content}
                        </p>
                      </CardContent>
                    </Card>
                    <span
                      className={`font-body-3-regular font-[number:var(--body-3-regular-font-weight)] text-[#4f5966] text-[length:var(--body-3-regular-font-size)] ${message.type === "sent" ? "text-right" : ""} tracking-[var(--body-3-regular-letter-spacing)] leading-[var(--body-3-regular-line-height)] [font-style:var(--body-3-regular-font-style)]`}
                    >
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            );
          }

          return (
            <div
              key={message.id}
              className={`flex flex-col ${message.type === "sent" ? "items-end" : "items-start"}`}
            >
              <div
                className={`flex flex-col ${message.type === "sent" ? "items-end" : "items-start"} gap-1`}
              >
                <Card
                  className={`border-0 shadow-none ${message.type === "sent" ? "bg-[#1a79fb] rounded-[20px_20px_0px_20px]" : "bg-neutral-2 rounded-[20px_20px_20px_0px]"}`}
                >
                  <CardContent className="p-5">
                    {message.hasImage && (
                      <img
                        className="w-full h-[220px] object-cover mb-2"
                        alt="Rectangle"
                        src="/rectangle-22.svg"
                      />
                    )}
                    <p
                      className={`mt-[-1.00px] font-body-1-regular font-[number:var(--body-1-regular-font-weight)] ${message.type === "sent" ? "text-white" : "text-[#030c19]"} text-[length:var(--body-1-regular-font-size)] tracking-[var(--body-1-regular-letter-spacing)] leading-[var(--body-1-regular-line-height)] [font-style:var(--body-1-regular-font-style)]`}
                    >
                      {message.content}
                    </p>
                  </CardContent>
                </Card>
                <span
                  className={`font-body-3-regular font-[number:var(--body-3-regular-font-weight)] text-[#4f5966] text-[length:var(--body-3-regular-font-size)] ${message.type === "sent" ? "text-right" : ""} tracking-[var(--body-3-regular-letter-spacing)] leading-[var(--body-3-regular-line-height)] [font-style:var(--body-3-regular-font-style)]`}
                >
                  {message.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="absolute bottom-0 left-0 w-full bg-white p-4">
        <div className="flex items-center gap-4 px-4 py-[11px] bg-neutral-2 rounded-[20px]">
          <div className="flex items-center gap-2 flex-1">
            <img className="w-6 h-6" alt="Image" src="/image-1.svg" />
            <img className="w-6 h-6" alt="Search" src="/search-3.svg" />
            <img className="w-6 h-6" alt="Search" src="/search-4.svg" />
            <Input
              className="flex-1 border-0 bg-transparent shadow-none font-body-1-regular font-[number:var(--body-1-regular-font-weight)] text-gray-5 text-[length:var(--body-1-regular-font-size)] tracking-[var(--body-1-regular-letter-spacing)] leading-[var(--body-1-regular-line-height)] [font-style:var(--body-1-regular-font-style)] focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              placeholder="Type your message..."
            />
          </div>
          <img className="w-5 h-5" alt="Send" src="/send-2.svg" />
        </div>
      </div>
    </div>
  );
};
