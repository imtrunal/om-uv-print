import React from "react";
import { IconBase } from "react-icons";
import { FaRegStar } from "react-icons/fa";
import { FiAlertCircle, FiArrowUpRight } from "react-icons/fi";
import { IoMdHeartEmpty } from "react-icons/io";
import { PiShoppingBagOpen } from "react-icons/pi";

function HeroSection() {
  const Rating = [
    {
      id: 1,
      title: "1000+",
      subtitle: "customers",
      icon: <IoMdHeartEmpty size={32} className="text-[#000787]" />,
    },
    {
      id: 2,
      title: "25+",
      subtitle: "Products",
      icon: <PiShoppingBagOpen size={32} className="text-[#000787]" />,
    },
    { id: 3, title: "500+", subtitle: "rating", icon: <FaRegStar size={32} className="text-[#000787]" /> },
  ];
  return (
    <>
      <div className="px-4 pt-2">
        <div className="flex flex-col gap-y-5 lg:flex-row lg:gap-x-5">
          <div className="w-full lg:w-[65%] relative">
            <div className="rounded-md">
              <img
                src="/assets/d35abd052418.webp"
                alt=""
                className="rounded-xl"
              />
              <div className="size-8 bg-white rounded-full flex items-center justify-center absolute top-5 right-5">
                <FiAlertCircle size={25} color="black" />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[35%] bg-[#efecea] rounded-xl p-[30px] flex flex-col justify-between">
            <div>
              <h4 className="text-[#1a1919] text-2xl font-medium pr-5 mb-4">
                Shop for 500+ Designer Merch and Gifts
              </h4>
              <p className="text-sm font-semibold text-[#616161] leading-[22px]">
                we are print all types of flat surface media like, Acrylic | Metal | Wood | Leather | Canvas | and we also print all media useful in corporate and retail gifts.
              </p>
            </div>
            <div className="flex items-center gap-x-1">
              <span className="text-[#000787] text-base uppercase font-semibold hover:underline hover:cursor-pointer">
                More about us
              </span>
              <FiArrowUpRight className="text-[#000787]" size={20} />
            </div>
          </div>
        </div>
      </div>
      <div className="py-10">
        <div className="flex items-center justify-between w-full px-10 lg:w-[80%] lg:mx-auto lg:px-0">
          {
            Rating.map((item, index) => {
              return (
                <div key={index} className="flex items-center gap-x-4">
                  <div>{item.icon}</div>
                  <div className="flex items-center gap-x-2">
                    <p className="text-[#000787] font-medium text-2xl">{item.title}</p>
                    <span className="text-[#1a1919] text-base font-normal">{item.subtitle}</span>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  );
}

export default HeroSection;
