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
      <div className="flex flex-col gap-5 lg:flex-row lg:gap-5">
        {/* Image Section */}
        <div className="w-full lg:w-[65%] relative">
          <div className="rounded-md relative">
            <img
              src="/assets/d35abd052418.webp"
              alt="Designer Merch and Gifts"
              className="rounded-xl w-full h-auto object-cover"
            />
            <div className="size-8 bg-white rounded-full flex items-center justify-center absolute top-5 right-5">
              <FiAlertCircle size={25} className="text-black" />
            </div>
          </div>
        </div>
  
        {/* Text Section */}
        <div className="w-full lg:w-[35%] bg-[#efecea] rounded-xl p-6 sm:p-[30px] flex flex-col justify-between">
          <div>
            <h4 className="text-[#1a1919] text-xl sm:text-2xl font-medium mb-3 sm:mb-4">
              Shop for 500+ Designer Merch and Gifts
            </h4>
            <p className="text-sm font-semibold text-[#616161] leading-relaxed sm:leading-[22px]">
              We print all types of flat surface media like Acrylic | Metal | Wood | Leather | Canvas | and we also print all media useful in corporate and retail gifts.
            </p>
          </div>
          <div className="flex items-center gap-1 mt-4 sm:mt-0">
            <span className="text-[#000787] text-base uppercase font-semibold hover:underline cursor-pointer">
              More about us
            </span>
            <FiArrowUpRight className="text-[#000787]" size={20} />
          </div>
        </div>
      </div>
    </div>
  
    {/* Ratings Section */}
    <div className="py-8 sm:py-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 px-4 sm:px-10 lg:w-[80%] lg:mx-auto lg:px-0">
        {Rating.map((item, index) => (
          <div key={index} className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-start">
            <div>{item.icon}</div>
            <div className="flex items-center gap-1 sm:gap-2">
              <p className="text-[#000787] font-medium text-xl sm:text-2xl">{item.title}</p>
              <span className="text-[#1a1919] text-sm sm:text-base font-normal">{item.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
  );
}

export default HeroSection;
